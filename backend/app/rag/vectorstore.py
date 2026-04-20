from langchain_community.vectorstores import SupabaseVectorStore
from langchain_community.embeddings import OllamaEmbeddings
from app.db import supabase
import os

def get_vectorstore():
    embeddings = OllamaEmbeddings(
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        model=os.getenv("OLLAMA_MODEL", "llama3")
    )
    return SupabaseVectorStore(
        client=supabase,
        embedding=embeddings,
        table_name="vehicle_embeddings",
        query_name="match_vehicles",
    )
