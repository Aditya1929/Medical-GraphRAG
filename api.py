from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.backend.rag_engine import RagEngine  # Fixed import
from contextlib import asynccontextmanager
import os

# Global RAG engine
rag_engine = None

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global rag_engine
    print("🔄 Loading RAG engine...")
    
    # Fixed path - use forward slashes or raw string
    chunks_file = "app/data/chunks_with_embeddings.json"
    # OR: chunks_file = r"data\chunks_with_embeddings.json"
    # OR: chunks_file = "data\\chunks_with_embeddings.json"
    
    if not os.path.exists(chunks_file):
        print(f"❌ ERROR: {chunks_file} not found!")
        print(f"Current directory: {os.getcwd()}")
        print(f"Looking for: {os.path.abspath(chunks_file)}")
        # List what files ARE in data folder
        if os.path.exists("data"):
            print("Files in data folder:")
            for f in os.listdir("data"):
                print(f"  - {f}")
    else:
        rag_engine = RagEngine(chunks_file)
        print("✅ RAG engine loaded successfully!")
    
    yield  # This is CRITICAL - separates startup from shutdown
    
    # Shutdown (runs when server stops)
    print("🔄 Shutting down...")

# CRITICAL: Pass lifespan to FastAPI
app = FastAPI(title="Medical RAG API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

class QueryResponse(BaseModel):
    question: str
    answer: str
    sources: list
    num_sources: int

# Main endpoint
@app.post('/api/query', response_model=QueryResponse)
async def query(request: QueryRequest):
    if rag_engine is None:
        raise HTTPException(
            status_code=500,
            detail="RAG engine not initialized"
        )
    
    if not request.question or len(request.question.strip()) == 0:
        raise HTTPException(
            status_code=400,  # Changed to 400 (bad request)
            detail="Question cannot be empty"
        )
    
    try:
        result = rag_engine.query(
            question=request.question,
            top_k=request.top_k
        )
        return QueryResponse(**result)
    
    except Exception as e:
        print(f"❌ Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))
