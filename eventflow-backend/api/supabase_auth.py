"""
Custom JWT authentication using PyJWT + Supabase users table.
Replaces SimpleJWT — no Django User model dependency.
"""
import jwt
import logging
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from .supabase_client import supabase

logger = logging.getLogger(__name__)

JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_LIFETIME = timedelta(hours=24)
REFRESH_TOKEN_LIFETIME = timedelta(days=7)


# ── Lightweight user object for request.user ──────────────────────────────────

class SupabaseUser:
    """Mimics Django User interface so DRF permissions/views work unchanged."""

    def __init__(self, data: dict):
        self.id = data.get("id")
        self.pk = self.id
        self.name = data.get("name", "")
        self.email = data.get("email", "")
        self.username = data.get("username", "")
        self.role = data.get("role", "user")
        self.password = data.get("password", "")
        self.is_active = data.get("is_active", True)
        self.is_staff = data.get("is_staff", False)
        self.is_superuser = data.get("is_superuser", False)
        self.date_joined = data.get("date_joined", "")
        self.last_login = data.get("last_login")
        self.is_authenticated = True

    def __str__(self):
        return self.email

    def save(self, update_fields=None):
        """Persist changes back to Supabase."""
        updates = {}
        if update_fields:
            for f in update_fields:
                updates[f] = getattr(self, f)
        else:
            updates = {
                "name": self.name,
                "email": self.email,
                "password": self.password,
                "role": self.role,
                "is_active": self.is_active,
            }
        supabase.table("users").update(updates).eq("id", self.id).execute()


# ── Token generation ──────────────────────────────────────────────────────────

def generate_access_token(user_data: dict) -> str:
    payload = {
        "user_id": user_data["id"],
        "email": user_data["email"],
        "role": user_data.get("role", "user"),
        "exp": datetime.now(timezone.utc) + ACCESS_TOKEN_LIFETIME,
        "iat": datetime.now(timezone.utc),
        "token_type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def generate_refresh_token(user_data: dict) -> str:
    payload = {
        "user_id": user_data["id"],
        "exp": datetime.now(timezone.utc) + REFRESH_TOKEN_LIFETIME,
        "iat": datetime.now(timezone.utc),
        "token_type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# ── DRF Authentication class ─────────────────────────────────────────────────

class SupabaseJWTAuthentication(BaseAuthentication):
    """
    DRF authentication backend.
    Reads 'Authorization: Bearer <token>', validates with PyJWT,
    looks up user from Supabase users table.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None  # Let other auth backends try

        token = auth_header[7:]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token.")

        if payload.get("token_type") != "access":
            raise exceptions.AuthenticationFailed("Invalid token type.")

        user_id = payload.get("user_id")
        if not user_id:
            raise exceptions.AuthenticationFailed("Invalid token payload.")

        # Fetch user from Supabase
        rows = supabase.table("users").select("*").eq("id", user_id).execute().data
        if not rows:
            raise exceptions.AuthenticationFailed("User not found.")

        user = SupabaseUser(rows[0])
        if not user.is_active:
            raise exceptions.AuthenticationFailed("User is deactivated.")

        return (user, token)


# ── User CRUD helpers ─────────────────────────────────────────────────────────

def get_user_by_email(email: str):
    rows = supabase.table("users").select("*").ilike("email", email).execute().data
    return rows[0] if rows else None


def get_user_by_id(user_id: int):
    rows = supabase.table("users").select("*").eq("id", user_id).execute().data
    return rows[0] if rows else None


def create_user(email, name, password_hash, role="user"):
    rows = supabase.table("users").insert({
        "email": email,
        "username": email,
        "name": name,
        "password": password_hash,
        "role": role,
        "is_active": True,
        "is_staff": False,
        "is_superuser": False,
    }).execute().data
    return rows[0] if rows else None


def user_exists(email: str) -> bool:
    rows = supabase.table("users").select("id").ilike("email", email).execute().data
    return len(rows) > 0


def get_all_users():
    return supabase.table("users").select("*").execute().data


def delete_user(user_id: int):
    supabase.table("users").delete().eq("id", user_id).execute()


def update_user(user_id: int, updates: dict):
    supabase.table("users").update(updates).eq("id", user_id).execute()


def count_users():
    result = supabase.table("users").select("id", count="exact").execute()
    return result.count if result.count is not None else len(result.data)


def format_user(u):
    """Format user dict for API response."""
    if isinstance(u, SupabaseUser):
        return {"id": u.id, "name": u.name, "email": u.email, "role": u.role, "date_joined": u.date_joined}
    return {"id": u["id"], "name": u.get("name",""), "email": u["email"], "role": u.get("role","user"), "date_joined": u.get("date_joined","")}
