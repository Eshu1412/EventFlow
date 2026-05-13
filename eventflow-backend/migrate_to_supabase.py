"""
migrate_to_supabase.py
─────────────────────
Transfers ALL data from Railway PostgreSQL → Supabase tables.

Usage:
    cd eventflow-backend
    python migrate_to_supabase.py

Prerequisites:
    1. Run supabase_schema.sql in the Supabase SQL Editor first.
    2. Ensure .env has both DATABASE_URL (Railway) and SUPABASE_URL/SUPABASE_KEY.
    3. pip install psycopg2-binary supabase python-dotenv
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
from supabase import create_client

# ── Load env ──────────────────────────────────────────────────────────────────
load_dotenv(Path(__file__).resolve().parent / ".env")

DATABASE_URL  = os.environ.get("DATABASE_URL")
SUPABASE_URL  = os.environ.get("SUPABASE_URL")
SUPABASE_KEY  = os.environ.get("SUPABASE_KEY")

if not DATABASE_URL:
    print("❌ DATABASE_URL not set. Cannot connect to Railway.")
    sys.exit(1)
if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ SUPABASE_URL / SUPABASE_KEY not set.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_all(conn, query):
    """Run a SELECT and return a list of dicts."""
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(query)
        return cur.fetchall()


def iso(dt):
    """Convert datetime to ISO string or None."""
    return dt.isoformat() if dt else None


def migrate_users(conn):
    print("\n📦 Migrating users...")
    rows = fetch_all(conn, "SELECT * FROM api_user ORDER BY id")
    print(f"   Found {len(rows)} users in Railway.")

    for row in rows:
        record = {
            "id":           row["id"],
            "name":         row.get("name", "") or "",
            "email":        row["email"],
            "username":     row["username"],
            "password":     row["password"],
            "role":         row.get("role", "user"),
            "is_active":    row.get("is_active", True),
            "is_staff":     row.get("is_staff", False),
            "is_superuser": row.get("is_superuser", False),
            "date_joined":  iso(row.get("date_joined")),
            "last_login":   iso(row.get("last_login")),
        }
        try:
            sb.table("users").upsert(record, on_conflict="id").execute()
            print(f"   ✅ User {row['email']}")
        except Exception as e:
            print(f"   ❌ User {row['email']}: {e}")

    # Reset sequence
    max_id = max((r["id"] for r in rows), default=0)
    if max_id:
        try:
            sb.rpc("setval_users_id", {"val": max_id}).execute()
        except:
            print(f"   ⚠️  Could not reset users id sequence to {max_id}. "
                  f"Run manually: SELECT setval('users_id_seq', {max_id});")


def migrate_events(conn):
    print("\n📦 Migrating events...")
    rows = fetch_all(conn, "SELECT * FROM api_event ORDER BY id")
    print(f"   Found {len(rows)} events in Railway.")

    for row in rows:
        record = {
            "id":           row["id"],
            "title":        row["title"],
            "description":  row.get("description"),
            "category":     row.get("category"),
            "location":     row.get("location"),
            "date":         iso(row["date"]),
            "total_seats":  row.get("total_seats", 100),
            "booked_seats": row.get("booked_seats", 0),
            "price":        row.get("price", 0.0),
            "image_url":    row.get("image_url"),
            "organizer_id": row["organizer_id"],
            "created_at":   iso(row.get("created_at")),
        }
        try:
            sb.table("events").upsert(record, on_conflict="id").execute()
            print(f"   ✅ Event #{row['id']}: {row['title'][:40]}")
        except Exception as e:
            print(f"   ❌ Event #{row['id']}: {e}")


def migrate_bookings(conn):
    print("\n📦 Migrating bookings...")
    rows = fetch_all(conn, "SELECT * FROM api_booking ORDER BY id")
    print(f"   Found {len(rows)} bookings in Railway.")

    for row in rows:
        record = {
            "id":        row["id"],
            "user_id":   row["user_id"],
            "event_id":  row["event_id"],
            "quantity":  row.get("quantity", 1),
            "status":    row.get("status", "confirmed"),
            "booked_at": iso(row.get("booked_at")),
        }
        try:
            sb.table("bookings").upsert(record, on_conflict="id").execute()
            print(f"   ✅ Booking #{row['id']}")
        except Exception as e:
            print(f"   ❌ Booking #{row['id']}: {e}")


def migrate_reviews(conn):
    print("\n📦 Migrating reviews...")
    rows = fetch_all(conn, "SELECT * FROM api_review ORDER BY id")
    print(f"   Found {len(rows)} reviews in Railway.")

    for row in rows:
        record = {
            "id":         row["id"],
            "user_id":    row["user_id"],
            "event_id":   row["event_id"],
            "rating":     row.get("rating", 5),
            "comment":    row.get("comment"),
            "created_at": iso(row.get("created_at")),
        }
        try:
            sb.table("reviews").upsert(record, on_conflict="id").execute()
            print(f"   ✅ Review #{row['id']}")
        except Exception as e:
            print(f"   ❌ Review #{row['id']}: {e}")


def migrate_password_reset_tokens(conn):
    print("\n📦 Migrating password reset tokens...")
    rows = fetch_all(conn, "SELECT * FROM api_passwordresettoken ORDER BY id")
    print(f"   Found {len(rows)} tokens in Railway.")

    for row in rows:
        record = {
            "id":         row["id"],
            "user_id":    row["user_id"],
            "token":      str(row["token"]),
            "created_at": iso(row.get("created_at")),
            "used":       row.get("used", False),
        }
        try:
            sb.table("password_reset_tokens").upsert(record, on_conflict="id").execute()
            print(f"   ✅ Token #{row['id']}")
        except Exception as e:
            print(f"   ❌ Token #{row['id']}: {e}")


def migrate_email_otps(conn):
    print("\n📦 Migrating email OTPs...")
    rows = fetch_all(conn, "SELECT * FROM api_emailotp ORDER BY id")
    print(f"   Found {len(rows)} OTPs in Railway.")

    for row in rows:
        record = {
            "id":           row["id"],
            "email":        row["email"],
            "otp":          row["otp"],
            "created_at":   iso(row.get("created_at")),
            "verified":     row.get("verified", False),
            "attempts":     row.get("attempts", 0),
            "pending_data": row.get("pending_data"),
        }
        try:
            sb.table("email_otps").upsert(record, on_conflict="id").execute()
            print(f"   ✅ OTP #{row['id']} ({row['email']})")
        except Exception as e:
            print(f"   ❌ OTP #{row['id']}: {e}")


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  EventFlow: Railway → Supabase Data Migration")
    print("=" * 60)
    print(f"\n  Railway DB:  {DATABASE_URL[:50]}...")
    print(f"  Supabase:    {SUPABASE_URL}")

    conn = psycopg2.connect(DATABASE_URL)
    try:
        # Order matters — users first (foreign key dependencies)
        migrate_users(conn)
        migrate_events(conn)
        migrate_bookings(conn)
        migrate_reviews(conn)
        migrate_password_reset_tokens(conn)
        migrate_email_otps(conn)
    finally:
        conn.close()

    print("\n" + "=" * 60)
    print("  ✅ Migration complete!")
    print("=" * 60)
    print("\n⚠️  IMPORTANT: Reset ID sequences in Supabase SQL Editor:")
    print("    SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));")
    print("    SELECT setval('events_id_seq', (SELECT COALESCE(MAX(id), 1) FROM events));")
    print("    SELECT setval('bookings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM bookings));")
    print("    SELECT setval('reviews_id_seq', (SELECT COALESCE(MAX(id), 1) FROM reviews));")
    print("    SELECT setval('password_reset_tokens_id_seq', (SELECT COALESCE(MAX(id), 1) FROM password_reset_tokens));")
    print("    SELECT setval('email_otps_id_seq', (SELECT COALESCE(MAX(id), 1) FROM email_otps));")


if __name__ == "__main__":
    main()
