import os
import json
import time
from typing import Optional, List, Dict, Any

import chromadb
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from google import genai
from google.genai import types


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# SPATIAL GRAPH
# ============================================================

SPATIAL_GRAPH: Dict[str, Dict[str, Any]] = {

    "cs_department": {
        "name": "Computer Science Department",
        "block": "Block 3",
        "floor": "5th Floor",
        "room": "3509",
        "route_nodes": [
            "KIOSK_ENTRANCE",
            "BLOCK_3_ELEVATOR",
            "FLOOR_5_HALL",
            "ROOM_3509",
        ],
    },

    "accounts_office": {
        "name": "Accounts Office",
        "block": "Academic Block (Block 1)",
        "floor": "1st Floor",
        "route_nodes": [
            "KIOSK_ENTRANCE",
            "ACADEMIC_BLOCK_LOBBY",
            "FLOOR_1_CORRIDOR",
            "ACCOUNTS_OFFICE_B1",
        ],
    },

    "exam_cell": {
        "name": "Examination Cell",
        "block": "Main Academic Block",
        "floor": "Ground Floor",
        "route_nodes": [
            "KIOSK_ENTRANCE",
            "MAIN_BLOCK_LOBBY",
            "GROUND_FLOOR_HALL",
            "EXAM_CELL",
        ],
    },
}


# ============================================================
# PYDANTIC RESPONSE SCHEMA
# ============================================================

class KioskResponse(BaseModel):

    speech_text: str = Field(
        description=(
            "Direct, natural spoken answer under 3 sentences "
            "for TTS playback. No markdown or bullets."
        )
    )

    destination_id: Optional[str] = Field(
        default=None,
        description=(
            "One of ['cs_department', 'accounts_office', "
            "'exam_cell'] or None if no location visit is needed."
        ),
    )

    route_nodes: List[str] = Field(
        default_factory=list,
        description=(
            "Array of route navigation nodes, populated "
            "automatically."
        ),
    )

    fallback: bool = Field(
        default=False,
        description=(
            "True if query could not be answered safely "
            "from context, otherwise False."
        ),
    )


# ============================================================
# RAG ENGINE
# ============================================================

class RAGEngine:

    def __init__(self, chroma_dir: Optional[str] = None):

        # ----------------------------------------------------
        # ChromaDB location
        # ----------------------------------------------------

        if chroma_dir is None:
            chroma_dir = os.path.join(
                os.path.dirname(__file__),
                "chroma_db",
            )

        # ----------------------------------------------------
        # Gemini API
        # ----------------------------------------------------

        self.api_key = os.getenv("GEMINI_API_KEY")

        if self.api_key:
            self.genai_client = genai.Client(
                api_key=self.api_key
            )
        else:
            self.genai_client = genai.Client()

        # ----------------------------------------------------
        # ChromaDB
        # ----------------------------------------------------

        self.chroma_client = chromadb.PersistentClient(
            path=chroma_dir
        )

        self.collection_name = "campus_circulars"

        print("✅ RAG Engine initialized")
        print(f"📁 ChromaDB: {chroma_dir}")
        print(f"📚 Collection: {self.collection_name}")


    # ========================================================
    # GET CHROMADB COLLECTION
    # ========================================================

    def get_collection(self):

        try:

            collection = self.chroma_client.get_collection(
                name=self.collection_name
            )

            return collection

        except Exception as e:

            raise RuntimeError(
                f"ChromaDB collection "
                f"'{self.collection_name}' not found. "
                f"Please run ingest.py first."
            ) from e


    # ========================================================
    # QUERY RAG
    # ========================================================

    def query(self, user_query: str) -> KioskResponse:

        """
        Process user query through:

        1. Gemini embedding
        2. ChromaDB similarity search
        3. Confidence safety gate
        4. Gemini grounded generation
        5. Destination mapping
        6. Route generation
        """

        # ----------------------------------------------------
        # Validate query
        # ----------------------------------------------------

        user_query = user_query.strip()

        if not user_query:

            return KioskResponse(
                speech_text="Please tell me what you would like to know.",
                destination_id=None,
                route_nodes=[],
                fallback=True,
            )


        print("\n========================================")
        print("🔎 RAG QUERY")
        print(user_query)
        print("========================================")


        # ====================================================
        # 1. CREATE QUERY EMBEDDING
        # ====================================================

        try:

            embed_response = self.genai_client.models.embed_content(
                model="text-embedding-004",
                contents=user_query,
            )

        except Exception as first_error:

            print(
                "⚠️ text-embedding-004 failed. "
                "Trying gemini-embedding-001..."
            )

            try:

                embed_response = self.genai_client.models.embed_content(
                    model="gemini-embedding-001",
                    contents=user_query,
                )

            except Exception as second_error:

                raise RuntimeError(
                    "Failed to create query embedding. "
                    f"First error: {first_error}. "
                    f"Second error: {second_error}"
                )

        query_vector = embed_response.embeddings[0].values


        # ====================================================
        # 2. SEARCH CHROMADB
        # ====================================================

        collection = self.get_collection()

        results = collection.query(
            query_embeddings=[query_vector],
            n_results=2,
        )

        documents = results.get(
            "documents",
            [[]],
        )[0]

        distances = results.get(
            "distances",
            [[]],
        )[0]


        print("📚 Documents found:", len(documents))
        print("📏 Distances:", distances)


        # ====================================================
        # 3. CONFIDENCE / SAFETY GATE
        # ====================================================

        # Cosine distance > 0.28 means insufficient confidence

        if not distances or distances[0] > 0.28:

            print("⚠️ RAG confidence too low")

            return KioskResponse(
                speech_text=(
                    "I cannot confirm that information "
                    "from official notices. Please visit "
                    "Administrative Counter 1."
                ),
                destination_id=None,
                route_nodes=[],
                fallback=True,
            )


        # ====================================================
        # 4. BUILD VERIFIED CONTEXT
        # ====================================================

        context_text = "\n".join(
            [
                f"- {document}"
                for document in documents
            ]
        )


        print("\n📖 VERIFIED CONTEXT:")
        print(context_text)


        # ====================================================
        # 5. GEMINI SYSTEM INSTRUCTION
        # ====================================================

        system_instruction = (

            "You are CampusVoice AI, an authoritative, "
            "warm human voice receptionist at a college kiosk. "

            "Your task is to answer visitor questions using "
            "ONLY the provided verified context.\n\n"

            "STRICT RULES:\n"

            "1. Answer strictly using ONLY the provided "
            "verified context. Do not assume or extrapolate.\n"

            "2. Keep speech_text concise, under 3 "
            "conversational sentences, and easy to pronounce "
            "for TTS. Never use markdown, asterisks, bullets, "
            "or complex formatting.\n"

            "3. Multilingual Support: Support Kannada, Hindi, "
            "and English queries seamlessly. If the visitor "
            "query is in Kannada, Hindi, or English, formulate "
            "speech_text naturally in that respective language "
            "using clear, polite phrasing, while keeping "
            "institutional names, room numbers, and block names "
            "phonetically clear and intact.\n"

            "4. Map destination_id to exactly one of "
            "['cs_department', 'accounts_office', 'exam_cell'] "
            "if a location or department visit is required. "
            "Otherwise set destination_id to null.\n"

            "5. Do not invent custom destination keys outside "
            "the allowed list.\n"

            "6. If the verified context does not contain enough "
            "information to answer the question, provide a "
            "safe response rather than guessing."
        )


        # ====================================================
        # 6. USER PROMPT
        # ====================================================

        user_prompt = (

            "[VERIFIED CONTEXT]\n"

            f"{context_text}\n"

            "[/VERIFIED CONTEXT]\n\n"

            f"VISITOR QUERY: {user_query}"
        )


        # ====================================================
        # 7. STRUCTURED GEMINI RESPONSE
        # ====================================================

        config = types.GenerateContentConfig(

            system_instruction=system_instruction,

            temperature=0.0,

            response_mime_type="application/json",

            response_schema=KioskResponse,
        )


        # ====================================================
        # 8. GEMINI MODEL FALLBACK
        # ====================================================

        model_candidates = [

            "gemini-3.6-flash",

            "gemini-flash-latest",

            "gemini-3.1-flash-lite",

        ]


        response = None
        last_exception = None


        for model in model_candidates:

            print(f"🤖 Trying Gemini model: {model}")

            for attempt in range(3):

                try:

                    response = (
                        self.genai_client
                        .models
                        .generate_content(
                            model=model,
                            contents=user_prompt,
                            config=config,
                        )
                    )

                    if response:

                        print(
                            f"✅ Gemini response received "
                            f"from {model}"
                        )

                        break

                except Exception as e:

                    last_exception = e

                    print(
                        f"⚠️ Attempt {attempt + 1} failed "
                        f"for {model}: {e}"
                    )

                    time.sleep(0.6)


            if response:

                break


        # ====================================================
        # 9. CHECK GEMINI RESPONSE
        # ====================================================

        if not response:

            raise RuntimeError(
                "Failed to generate response across "
                f"candidate models: {last_exception}"
            )


        # ====================================================
        # 10. EXTRACT STRUCTURED RESPONSE
        # ====================================================

        kiosk_resp: KioskResponse


        if (
            hasattr(response, "parsed")
            and isinstance(
                response.parsed,
                KioskResponse
            )
        ):

            kiosk_resp = response.parsed


        elif (
            hasattr(response, "parsed")
            and isinstance(
                response.parsed,
                dict
            )
        ):

            kiosk_resp = KioskResponse(
                **response.parsed
            )


        else:

            raw_text = response.text

            parsed_json = json.loads(
                raw_text
            )

            kiosk_resp = KioskResponse(
                **parsed_json
            )


        # ====================================================
        # 11. VALIDATE DESTINATION
        # ====================================================

        allowed_destinations = [
            "cs_department",
            "accounts_office",
            "exam_cell",
        ]


        if (
            kiosk_resp.destination_id
            and kiosk_resp.destination_id
            in SPATIAL_GRAPH
        ):

            # ------------------------------------------------
            # Automatically generate route
            # ------------------------------------------------

            kiosk_resp.route_nodes = (
                SPATIAL_GRAPH[
                    kiosk_resp.destination_id
                ]["route_nodes"]
            )

        else:

            kiosk_resp.route_nodes = []

            if (
                kiosk_resp.destination_id
                not in allowed_destinations
                and kiosk_resp.destination_id is not None
            ):

                kiosk_resp.destination_id = None


        # ====================================================
        # 12. PRINT FINAL RESPONSE
        # ====================================================

        print("\n========================================")
        print("✅ FINAL RAG RESPONSE")
        print("========================================")

        print(
            "Speech:",
            kiosk_resp.speech_text
        )

        print(
            "Destination:",
            kiosk_resp.destination_id
        )

        print(
            "Route:",
            kiosk_resp.route_nodes
        )

        print(
            "Fallback:",
            kiosk_resp.fallback
        )

        print("========================================\n")


        return kiosk_resp