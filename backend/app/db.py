import os
from dotenv import load_dotenv

load_dotenv()

_supabase = None

def get_supabase():
    global _supabase
    if _supabase is None:
        from supabase import create_client
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_ANON_KEY"]
        _supabase = create_client(url, key)
    return _supabase

# Para compatibilidad con imports existentes
class _SupabaseProxy:
    def __getattr__(self, name):
        return getattr(get_supabase(), name)

supabase = _SupabaseProxy()
