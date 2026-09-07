import os
import json
from typing import Optional, List, Dict, Any
import chromadb
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# --- SPATIAL GRAPH ---
SPATIAL_GRAPH: Dict[str, Dict[str, Any]] = {
    "cs_department": {
        "name": "Computer Science Department",
        "block": "Block 3",
        "floor": "5th Floor",
        "room": "3509",
        "route_nodes": ["KIOSK_ENTRANCE", "BLOCK_3_ELEVATOR", "FLOOR_5_HALL", "ROOM_3509"],
    },
    "accounts_office": {
        "name": "Accounts Office",
        "block": "Academic Block (Block 1)",
        "floor": "1st Floor",
        "route_nodes": ["KIOSK_ENTRANCE", "ACADEMIC_BLOCK_LOBBY", "FLOOR_1_CORRIDOR", "ACCOUNTS_OFFICE_B1"],
    },
    "exam_cell": {
        "name": "Examination Cell",
        "block": "Main Academic Block",
        "floor": "Ground Floor",
        "route_nodes": ["KIOSK_ENTRANCE", "MAIN_BLOCK_LOBBY", "GROUND_FLOOR_HALL", "EXAM_CELL"],
    },
}

# --- PYDANTIC SCHEMA ---
class KioskResponse(BaseModel):
    speech_text: str = Field(description="Direct, natural spoken answer under 3 sentences for TTS playback. No markdown or bullets.")
    destination_id: Optional[str] = Field(default=None, description="One of ['cs_department', 'accounts_office', 'exam_cell'] or None if no location visit is needed.")
    route_nodes: List[str] = Field(default_factory=list, description="Array of route navigation nodes, populated automatically.")
    fallback: bool = Field(default=False, description="True if query could not be answered safely from context, otherwise False.")

class RAGEngine:
    def __init__(self, chroma_dir: Optional[str] = None):
        if chroma_dir is None:
            chroma_dir = os.path.join(os.path.dirname(__file__), "chroma_db")
        
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.genai_client = genai.Client(api_key=self.api_key) if self.api_key else genai.Client()
        self.chroma_client = chromadb.PersistentClient(path=chroma_dir)
        self.collection_name = "campus_circulars"

    def get_collection(self):
        try:
            return self.chroma_client.get_collection(name=self.collection_name)
        except Exception as e:
            raise RuntimeError(f"ChromaDB collection '{self.collection_name}' not found. Please run ingest.py first.") from e

    def query(self, user_query: str) -> KioskResponse:
        """Process user query through vector similarity safety gate and Gemini grounded generation."""
        # 1. Embed user query using text-embedding-004 (with fallback to gemini-embedding-001)
        try:
            embed_response = self.genai_client.models.embed_content(
                model="text-embedding-004",
                contents=user_query,
            )
        except Exception:
            embed_response = self.genai_client.models.embed_content(
                model="gemini-embedding-001",
                contents=user_query,
            )
        query_vector = embed_response.embeddings[0].values

        # 2. Query top-2 nearest chunks from ChromaDB
        collection = self.get_collection()
        results = collection.query(
            query_embeddings=[query_vector],
            n_results=2
        )

        documents = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]

        # 3. Confidence Safety Gate Check (Anti-Hallucination)
        # Cosine distance > 0.28 => Similarity < 0.72
        if not distances or distances[0] > 0.28:
            return KioskResponse(
                speech_text="I cannot confirm that information from official notices. Please visit Administrative Counter 1.",
                destination_id=None,
                route_nodes=[],
                fallback=True
            )

        context_text = "\n".join([f"- {doc}" for doc in documents])

        # 4. System prompt enforcing strict context grounding & TTS formatting
        system_instruction = (
            "You are CampusVoice AI, an authoritative, warm human voice receptionist at a college kiosk. "
            "Your task is to answer visitor questions using ONLY the provided verified context.\n\n"
            "STRICT RULES:\n"
            "1. Answer strictly using ONLY the provided verified context. Do not assume or extrapolate.\n"
            "2. Keep speech_text concise (under 3 conversational sentences), easy to pronounce for TTS. Never use markdown, asterisks, bullet points, or complex formatting.\n"
            "3. Multilingual Support: Support Kannada, Hindi, and English queries seamlessly. If the visitor query is in Kannada, Hindi, or English, formulate speech_text naturally in that respective language using clear, polite phrasing, while keeping institutional names, room numbers, and block names (e.g. Block B, Room B-204) phonetically clear and intact.\n"
            "4. Map destination_id to exactly one of ['cs_department', 'accounts_office', 'exam_cell'] if a location or department visit is required, otherwise set destination_id to null.\n"
            "5. Do not invent custom destination keys outside the allowed list."
        )

        user_prompt = (
            f"[VERIFIED CONTEXT]\n{context_text}\n[/VERIFIED CONTEXT]\n\n"
            f"VISITOR QUERY: {user_query}"
        )

        # 5. Grounded Inference with Structured Schema (tries active models)
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.0,
            response_mime_type="application/json",
            response_schema=KioskResponse,
        )

        model_candidates = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"]
        response = None
        last_exception = None

        for model in model_candidates:
            for attempt in range(3):
                try:
                    response = self.genai_client.models.generate_content(
                        model=model,
                        contents=user_prompt,
                        config=config,
                    )
                    if response:
                        break
                except Exception as e:
                    last_exception = e
                    import time
                    time.sleep(0.6)
            if response:
                break

        if not response:
            raise RuntimeError(f"Failed to generate response across candidate models: {last_exception}")

        # Extract parsed response
        kiosk_resp: KioskResponse
        if hasattr(response, "parsed") and isinstance(response.parsed, KioskResponse):
            kiosk_resp = response.parsed
        elif hasattr(response, "parsed") and isinstance(response.parsed, dict):
            kiosk_resp = KioskResponse(**response.parsed)
        else:
            raw_text = response.text
            parsed_json = json.loads(raw_text)
            kiosk_resp = KioskResponse(**parsed_json)

        # 6. Auto-populate route_nodes based on destination_id lookup in Spatial Graph
        if kiosk_resp.destination_id and kiosk_resp.destination_id in SPATIAL_GRAPH:
            kiosk_resp.route_nodes = SPATIAL_GRAPH[kiosk_resp.destination_id]["route_nodes"]
        else:
            kiosk_resp.route_nodes = []
            if kiosk_resp.destination_id not in [None, "cs_department", "accounts_office", "exam_cell"]:
                kiosk_resp.destination_id = None

        return kiosk_resp
