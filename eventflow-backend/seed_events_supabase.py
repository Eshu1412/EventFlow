"""
Seed events into Supabase using the Supabase Python SDK.

Usage:
    cd eventflow-backend
    python seed_events_supabase.py
"""
import os, random
from pathlib import Path
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(Path(__file__).resolve().parent / ".env")
sb = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])

ORGANIZER_EMAIL = "mauryatushar115.dev@gmail.com"

# Look up organizer
rows = sb.table("users").select("id").eq("email", ORGANIZER_EMAIL).execute().data
if not rows:
    print(f"❌ User {ORGANIZER_EMAIL} not found in Supabase!")
    exit(1)
organizer_id = rows[0]["id"]

categories = ['Tech', 'Music', 'Sports', 'Food', 'Art', 'Business']
locations = ['Mumbai, India', 'Delhi, India', 'Bengaluru, India', 'Hyderabad, India',
             'Chennai, India', 'Kolkata, India', 'Pune, India', 'Ahmedabad, India']
adjectives = ['Global', 'Annual', 'Ultimate', 'Advanced', 'Interactive', 'Next-Gen']
nouns = ['Summit', 'Festival', 'Workshop', 'Conference', 'Masterclass', 'Expo']

images = {
    'Tech': 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800',
    'Music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800',
    'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    'Food': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    'Art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    'Business': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
}

events = []
for i in range(35):
    cat = random.choice(categories)
    title = f"{random.choice(adjectives)} {cat} {random.choice(nouns)} 2026 - Edition {random.randint(1,100)}"
    dt = datetime.now(timezone.utc) + timedelta(days=random.randint(1, 60))
    events.append({
        "title": title,
        "description": f"Join us for the {title}, a premier event for enthusiasts and professionals.",
        "category": cat,
        "location": random.choice(locations),
        "date": dt.isoformat(),
        "total_seats": random.choice([50, 100, 200, 500, 1000]),
        "booked_seats": 0,
        "price": round(random.uniform(0, 5000), 2) if random.random() > 0.2 else 0.0,
        "image_url": images.get(cat, images['Tech']),
        "organizer_id": organizer_id,
    })

result = sb.table("events").insert(events).execute()
print(f"✅ Created {len(result.data)} events for {ORGANIZER_EMAIL}")
