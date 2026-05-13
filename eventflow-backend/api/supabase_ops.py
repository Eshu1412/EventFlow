"""
Supabase data operations layer — replaces Django ORM for non-auth tables.
Django ORM is kept ONLY for User model (SimpleJWT dependency).
"""
from .supabase_client import supabase
import logging, json, random, uuid
from datetime import datetime, timedelta, timezone as tz

logger = logging.getLogger(__name__)

# ── Events ────────────────────────────────────────────────────────────────────

def get_all_events():
    return supabase.table("events").select("*, users!events_organizer_id_fkey(name)").order("created_at", desc=True).execute().data

def get_event(pk):
    rows = supabase.table("events").select("*, users!events_organizer_id_fkey(name)").eq("id", pk).execute().data
    return rows[0] if rows else None

def create_event(data, organizer_id):
    record = {
        "title": data.get("title"),
        "description": data.get("description"),
        "category": data.get("category"),
        "location": data.get("location"),
        "date": data.get("date"),
        "total_seats": int(data.get("total_seats", 100)),
        "booked_seats": 0,
        "price": float(data.get("price", 0)),
        "image_url": data.get("image_url"),
        "organizer_id": organizer_id,
    }
    from .image_utils import compress_image_base64
    if record["image_url"] and str(record["image_url"]).startswith("data:image/"):
        record["image_url"] = compress_image_base64(record["image_url"])
    rows = supabase.table("events").insert(record).execute().data
    return rows[0] if rows else None

def update_event(pk, data):
    allowed = ["title","description","category","location","date","total_seats","price","image_url"]
    update = {k: data[k] for k in allowed if k in data}
    if "total_seats" in update: update["total_seats"] = int(update["total_seats"])
    if "price" in update: update["price"] = float(update["price"])
    if update.get("image_url","").startswith("data:image/"):
        from .image_utils import compress_image_base64
        update["image_url"] = compress_image_base64(update["image_url"])
    rows = supabase.table("events").update(update).eq("id", pk).execute().data
    return rows[0] if rows else None

def delete_event(pk):
    supabase.table("events").delete().eq("id", pk).execute()

# ── Bookings ──────────────────────────────────────────────────────────────────

def create_booking(user_id, event_id, quantity):
    row = supabase.table("bookings").insert({
        "user_id": user_id, "event_id": event_id,
        "quantity": quantity, "status": "confirmed"
    }).execute().data
    # increment booked_seats
    evt = get_event(event_id)
    if evt:
        supabase.table("events").update({"booked_seats": evt["booked_seats"] + quantity}).eq("id", event_id).execute()
    return row[0] if row else None

def get_booking(pk):
    rows = supabase.table("bookings").select("*, users!bookings_user_id_fkey(name, email), events!bookings_event_id_fkey(title, date, location, image_url, price)").eq("id", pk).execute().data
    return rows[0] if rows else None

def get_user_bookings(user_id):
    return supabase.table("bookings").select("*, events!bookings_event_id_fkey(title, date, location, image_url, price)").eq("user_id", user_id).order("booked_at", desc=True).execute().data

def get_organizer_bookings(organizer_id):
    # Get organizer's event IDs first
    evts = supabase.table("events").select("id").eq("organizer_id", organizer_id).execute().data
    if not evts:
        return []
    ids = [e["id"] for e in evts]
    return supabase.table("bookings").select("*, users!bookings_user_id_fkey(name), events!bookings_event_id_fkey(title, date, location, image_url, price)").in_("event_id", ids).execute().data

def cancel_booking(pk):
    bk = get_booking(pk)
    if not bk:
        return None
    supabase.table("bookings").update({"status": "cancelled"}).eq("id", pk).execute()
    evt = get_event(bk["event_id"])
    if evt:
        supabase.table("events").update({"booked_seats": max(0, evt["booked_seats"] - bk["quantity"])}).eq("id", bk["event_id"]).execute()
    return bk

# ── Reviews ───────────────────────────────────────────────────────────────────

def get_event_reviews(event_id):
    return supabase.table("reviews").select("*, users!reviews_user_id_fkey(name)").eq("event_id", event_id).order("created_at", desc=True).execute().data

def create_review(user_id, event_id, rating, comment):
    rows = supabase.table("reviews").insert({
        "user_id": user_id, "event_id": event_id,
        "rating": int(rating), "comment": comment
    }).execute().data
    return rows[0] if rows else None

# ── Password Reset Tokens ────────────────────────────────────────────────────

def create_reset_token(user_id):
    token = str(uuid.uuid4())
    supabase.table("password_reset_tokens").delete().eq("user_id", user_id).eq("used", False).execute()
    rows = supabase.table("password_reset_tokens").insert({
        "user_id": user_id, "token": token, "used": False
    }).execute().data
    return rows[0] if rows else None

def get_reset_token(token_str):
    rows = supabase.table("password_reset_tokens").select("*").eq("token", token_str).execute().data
    return rows[0] if rows else None

def get_latest_unused_reset_token(user_id):
    rows = supabase.table("password_reset_tokens").select("*").eq("user_id", user_id).eq("used", False).order("created_at", desc=True).limit(1).execute().data
    return rows[0] if rows else None

def mark_token_used(token_id):
    supabase.table("password_reset_tokens").update({"used": True}).eq("id", token_id).execute()

# ── Email OTP ─────────────────────────────────────────────────────────────────

def generate_otp(email):
    email = email.lower()
    supabase.table("email_otps").delete().eq("email", email).execute()
    code = str(random.randint(100000, 999999))
    rows = supabase.table("email_otps").insert({
        "email": email, "otp": code, "verified": False, "attempts": 0
    }).execute().data
    return rows[0] if rows else None

def get_latest_otp(email):
    rows = supabase.table("email_otps").select("*").eq("email", email.lower()).order("created_at", desc=True).limit(1).execute().data
    return rows[0] if rows else None

def update_otp(otp_id, updates):
    supabase.table("email_otps").update(updates).eq("id", otp_id).execute()

def delete_otp(otp_id):
    supabase.table("email_otps").delete().eq("id", otp_id).execute()

def delete_otps_for_email(email):
    supabase.table("email_otps").delete().eq("email", email.lower()).execute()

# ── Admin helpers ─────────────────────────────────────────────────────────────

def get_all_bookings():
    return supabase.table("bookings").select("*, users!bookings_user_id_fkey(name), events!bookings_event_id_fkey(title, date, location, image_url, price)").execute().data

def count_table(table):
    rows = supabase.table(table).select("id", count="exact").execute()
    return rows.count if rows.count is not None else len(rows.data)

# ── Format helpers ────────────────────────────────────────────────────────────

def format_event(evt):
    """Convert Supabase event row to API response format."""
    if not evt:
        return None
    org_name = ""
    if isinstance(evt.get("users"), dict):
        org_name = evt["users"].get("name", "")
    ts = evt.get("total_seats", 0)
    bs = evt.get("booked_seats", 0)
    return {
        "id": evt["id"], "title": evt["title"],
        "description": evt.get("description"), "category": evt.get("category"),
        "location": evt.get("location"), "date": evt.get("date"),
        "total_seats": ts, "booked_seats": bs,
        "available_seats": ts - bs, "price": evt.get("price", 0),
        "image_url": evt.get("image_url"),
        "organizer_id": evt.get("organizer_id"),
        "organizer_name": org_name,
    }

def format_booking(bk):
    """Convert Supabase booking row to API response format."""
    if not bk:
        return None
    evt = bk.get("events", {}) or {}
    usr = bk.get("users", {}) or {}
    return {
        "id": bk["id"], "user_id": bk["user_id"], "event_id": bk["event_id"],
        "status": bk.get("status"), "booked_at": bk.get("booked_at"),
        "quantity": bk.get("quantity", 1),
        "user_name": usr.get("name", ""),
        "event_title": evt.get("title", ""),
        "event_date": evt.get("date"),
        "event_location": evt.get("location"),
        "event_image": evt.get("image_url"),
        "event_price": evt.get("price", 0),
    }

def format_review(rv):
    if not rv:
        return None
    usr = rv.get("users", {}) or {}
    return {
        "id": rv["id"], "user_id": rv["user_id"], "event_id": rv["event_id"],
        "rating": rv.get("rating", 5), "comment": rv.get("comment"),
        "created_at": rv.get("created_at"), "user_name": usr.get("name", ""),
    }
