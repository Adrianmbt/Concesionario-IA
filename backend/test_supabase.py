import os
from dotenv import load_dotenv
load_dotenv()

print("Conectando a Supabase...")
from supabase import create_client
client = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_ANON_KEY"])
print("Cliente creado. Haciendo query...")
res = client.table("vehiculos").select("*").limit(1).execute()
print("Resultado:", res.data)
