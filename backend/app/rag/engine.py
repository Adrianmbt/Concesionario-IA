from langchain_ollama import OllamaLLM
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from app.rag.vectorstore import get_vectorstore
import os

_sessions: dict = {}

def get_chain(session_id: str):
    if session_id not in _sessions:
        llm = OllamaLLM(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            model=os.getenv("OLLAMA_MODEL", "llama3")
        )
        vectorstore = get_vectorstore()
        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
            memory=memory,
        )
        _sessions[session_id] = chain
    return _sessions[session_id]

async def get_rag_response(session_id: str, message: str) -> str:
    chain = get_chain(session_id)
    result = chain.invoke({"question": message})
    return result["answer"]
