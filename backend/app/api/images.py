from fastapi import APIRouter, UploadFile, File, HTTPException
import cv2
from cv2 import dnn_superres
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import io, asyncio, uuid, os
from app.db import supabase

router = APIRouter()

BUCKET = "imagenes"
MAX_SIZE = (1920, 1080) # Aumentamos el tamaño máximo para web
QUALITY = 88

# Inicializar Super Resolución
sr = dnn_superres.DnnSuperResImpl_create()
model_path = "ESPCN_x4.pb"

if os.path.exists(model_path):
    sr.readModel(model_path)
    sr.setModel("espcn", 4)
    HAS_AI = True
else:
    HAS_AI = False

def _process_and_upload(file_bytes: bytes, filename: str) -> str:
    # 1. IA Upscaling
    if HAS_AI:
        try:
            nparr = np.frombuffer(file_bytes, np.uint8)
            img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            img_cv = sr.upsample(img_cv)
            img = Image.fromarray(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
        except Exception:
            img = Image.open(io.BytesIO(file_bytes))
    else:
        img = Image.open(io.BytesIO(file_bytes))
    
    # 2. Convertir a RGB
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    # 3. Mejoras visuales
    img = ImageEnhance.Contrast(img).enhance(1.1)
    img = ImageEnhance.Color(img).enhance(1.1)
    img = ImageEnhance.Sharpness(img).enhance(1.2)
    img = img.filter(ImageFilter.DETAIL)
    
    # 4. Redimensionar a tamaño final web
    img.thumbnail(MAX_SIZE, Image.LANCZOS)
    
    # 5. Guardar como WebP optimizado
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
