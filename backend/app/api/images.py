from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io, asyncio, uuid, os
from app.db import supabase

router = APIRouter()

BUCKET = "imagenes"
MAX_SIZE = (1200, 900)
QUALITY = 82

def _process_and_upload(file_bytes: bytes, filename: str) -> str:
    img = Image.open(io.BytesIO(file_bytes))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.thumbnail(MAX_SIZE, Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="WEBP", quality=QUALITY, method=6)
    buf.seek(0)
    webp_name = f"{uuid.uuid4().hex}.webp"
    supabase.storage.from_(BUCKET).upload(
        webp_name,
        buf.read(),
        {"content-type": "image/webp"}
    )
    public_url = supabase.storage.from_(BUCKET).get_public_url(webp_name)
    return public_url

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes")
    contents = await file.read()
    url = await asyncio.to_thread(_process_and_upload, contents, file.filename)
    return {"url": url}
