from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from rag_engine import RAGEngine, KioskResponse


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="CampusVoice AI RAG Backend",
    description="RAG backend for SJEC AI Campus Assistant",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# INITIALIZE RAG ENGINE
# ============================================================

try:
    rag_engine = RAGEngine()
    print("✅ RAG Engine initialized successfully")
except Exception as e:
    rag_engine = None
    print("❌ Failed to initialize RAG Engine:")
    print(e)


# ============================================================
# REQUEST MODEL
# ============================================================

class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        description="Question asked by the visitor"
    )


# ============================================================
# ROOT / HEALTH CHECK
# ============================================================

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "SJEC CampusVoice AI",
        "rag": "ready" if rag_engine else "error"
    }


# ============================================================
# RAG QUERY ENDPOINT
# ============================================================

@app.post("/api/chat", response_model=KioskResponse)
def query_campus_voice(request: QueryRequest):

    # Check empty query
    if not request.query or not request.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty"
        )

    # Check RAG engine
    if rag_engine is None:
        raise HTTPException(
            status_code=500,
            detail="RAG Engine is not initialized"
        )

    user_query = request.query.strip()

    print("\n========================================")
    print("USER QUERY:")
    print(user_query)
    print("========================================")

    try:

        # ====================================================
        # THIS IS THE IMPORTANT LINE
        # ====================================================

        result = rag_engine.query(user_query)

        # ====================================================
        # RESULT FROM RAG ENGINE
        # ====================================================

        print("RAG RESPONSE:")
        print(result)

        return result

    except Exception as e:

        print("❌ RAG ERROR:")
        print(e)

        raise HTTPException(
            status_code=500,
            detail=f"RAG engine error: {str(e)}"
        )


# ============================================================
# TEST ENDPOINT
# ============================================================

@app.post("/api/chat")
def test_backend():

    return {
        "message": "CampusVoice backend is running",
        "rag_engine": "ready" if rag_engine else "not ready"
    }


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )