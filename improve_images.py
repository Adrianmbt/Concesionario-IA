import cv2
from cv2 import dnn_superres
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
import io
import os

# Inicializar Super Resolución
sr = dnn_superres.DnnSuperResImpl_create()
model_path = "ESPCN_x4.pb"

if os.path.exists(model_path):
    sr.readModel(model_path)
    sr.setModel("espcn", 4) # x4 upscaling
else:
    print(f"Advertencia: No se encontró el modelo {model_path}. Se usará redimensionado estándar.")

def ai_upscale_and_enhance(image_bytes: bytes) -> bytes:
    """
    Mejora la calidad de una imagen usando IA (Upscaling) y filtros de Pillow.
    """
    # 1. Convertir bytes a imagen de OpenCV (BGR)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 2. IA Upscaling (si el modelo está cargado)
    if os.path.exists(model_path):
        try:
            # Upscale 4x
            img_cv = sr.upsample(img_cv)
        except Exception as e:
            print(f"Error en Upscaling: {e}")
    
    # 3. Convertir de BGR (OpenCV) a RGB (Pillow)
    img_pillow = Image.fromarray(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
    
    # 4. Aplicar mejoras visuales
    img_pillow = ImageEnhance.Contrast(img_pillow).enhance(1.1)
    img_pillow = ImageEnhance.Color(img_pillow).enhance(1.1)
    img_pillow = ImageEnhance.Sharpness(img_pillow).enhance(1.2)
    img_pillow = img_pillow.filter(ImageFilter.DETAIL)
    
    # 5. Redimensionar a un tamaño manejable para web si es demasiado grande
    # (x4 de una imagen normal puede ser gigante)
    max_web_size = (1920, 1080)
    img_pillow.thumbnail(max_web_size, Image.LANCZOS)
    
    # 6. Guardar como WebP
    buf = io.BytesIO()
    img_pillow.save(buf, format="WEBP", quality=85, method=6)
    return buf.getvalue()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Uso: python improve_images.py <ruta_imagen>")
        sys.exit(1)

    input_path = sys.argv[1]
    with open(input_path, "rb") as f:
        data = f.read()
    
    print("Procesando con IA (esto puede tardar unos segundos)...")
    result = ai_upscale_and_enhance(data)
    
    output_path = "ai_enhanced_" + os.path.basename(input_path).split('.')[0] + ".webp"
    with open(output_path, "wb") as f:
        f.write(result)
    
    print(f"¡Listo! Imagen guardada en: {output_path}")
