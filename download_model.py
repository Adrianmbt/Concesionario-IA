import httpx
import os

def download_model(url, filename):
    if os.path.exists(filename):
        print(f"El modelo {filename} ya existe.")
        return
    
    print(f"Descargando modelo desde {url}...")
    with httpx.stream("GET", url, follow_redirects=True) as response:
        with open(filename, "wb") as f:
            for chunk in response.iter_bytes():
                f.write(chunk)
    print("Descarga completada.")

if __name__ == "__main__":
    # Modelo ESPCN (Efficient Sub-Pixel Convolutional Neural Network)
    # Es ligero y rápido para CPU
    model_url = "https://github.com/fannymonori/TF-ESPCN/raw/master/export/ESPCN_x4.pb"
    download_model(model_url, "ESPCN_x4.pb")
