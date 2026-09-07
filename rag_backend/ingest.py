import os
import chromadb
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

def load_context_from_file(file_path: str = "data.txt") -> list[str]:
    """Load non-empty lines from the given data text file."""
    abs_path = os.path.join(os.path.dirname(__file__), file_path) if not os.path.isabs(file_path) else file_path
    if not os.path.exists(abs_path):
        raise FileNotFoundError(f"Data context file not found at: {abs_path}")
    with open(abs_path, "r", encoding="utf-8") as f:
        chunks = [line.strip() for line in f if line.strip()]
    return chunks

def ingest_documents(data_file: str = "data.txt"):
    """Clear and re-populate the persistent ChromaDB collection with embedded institutional chunks loaded from data.txt."""
    chunks = load_context_from_file(data_file)
    print(f"Loaded {len(chunks)} context chunks from '{data_file}'.")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY environment variable is not set. Ensure it is configured before running.")
    
    # Initialize Google GenAI client
    client = genai.Client(api_key=api_key) if api_key else genai.Client()

    # Initialize persistent ChromaDB storage
    chroma_path = os.path.join(os.path.dirname(__file__), "chroma_db")
    chroma_client = chromadb.PersistentClient(path=chroma_path)

    # Safely reset collection if it exists
    collection_name = "campus_circulars"
    existing_collections = [c.name for c in chroma_client.list_collections()]
    if collection_name in existing_collections:
        chroma_client.delete_collection(name=collection_name)
        print(f"Cleared existing collection: '{collection_name}'")

    collection = chroma_client.create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"}
    )

    documents = []
    embeddings = []
    ids = []

    print("Generating embeddings with text-embedding-004 / gemini-embedding-001...")
    for idx, text in enumerate(chunks):
        try:
            response = client.models.embed_content(
                model="text-embedding-004",
                contents=text,
            )
        except Exception:
            response = client.models.embed_content(
                model="gemini-embedding-001",
                contents=text,
            )
        embedding = response.embeddings[0].values
        
        documents.append(text)
        embeddings.append(embedding)
        ids.append(f"chunk_{idx}")
        print(f" Embedded Chunk {idx+1}/{len(chunks)}")

    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=ids
    )

    print(f"Successfully ingested {len(chunks)} chunks into persistent ChromaDB collection '{collection_name}'.")


if __name__ == "__main__":
    ingest_documents()
