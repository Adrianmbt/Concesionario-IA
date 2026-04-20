from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import inventory, chat, leads, images, sellers

app = FastAPI(title="Concesionario API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(images.router, prefix="/api/images", tags=["images"])
app.include_router(sellers.router, prefix="/api/sellers", tags=["sellers"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Concesionario API running"}

@app.get("/ping")
def ping():
    return {"pong": True}
