"""
Supabase client singleton for EventFlow.

Initializes once and reuses the connection across all requests.
Import this client in views: `from .supabase_client import supabase`
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env from the backend root
from pathlib import Path
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)

SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "SUPABASE_URL and SUPABASE_KEY must be set in the environment. "
        "Check your .env file."
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
