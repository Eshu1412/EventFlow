# -*- coding: utf-8 -*-
"""
EventFlow -- Full Data Seed Script
===================================
Creates all 9 test users + 12 events + realistic bookings (engagement).

Run from inside eventflow-backend/ with venv active:
    uv run python seed_data.py

Idempotent -- safe to re-run. Skips existing users/events/bookings.
"""
import os
import sys
import django
from datetime import datetime, timedelta

# Force UTF-8 output on Windows consoles
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eventflow_backend.settings")
django.setup()

from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.db.models import Count, Q
from api.models import User, Event, Booking

SEP = "=" * 60

# ---------------------------------------------------------------
# STEP 1 -- USERS
# ---------------------------------------------------------------

USERS = [
    # Regular Users
    {"name": "Alice Johnson",  "email": "alice@eventflow.test",  "password": "Alice@1234",  "role": "user"},
    {"name": "Bob Sharma",     "email": "bob@eventflow.test",    "password": "Bob@1234",    "role": "user"},
    {"name": "Clara Mendes",   "email": "clara@eventflow.test",  "password": "Clara@1234",  "role": "user"},
    # Organizers
    {"name": "Dev Patel",      "email": "dev@eventflow.test",    "password": "Dev@1234",    "role": "organizer"},
    {"name": "Eva Chen",       "email": "eva@eventflow.test",    "password": "Eva@1234",    "role": "organizer"},
    {"name": "Felix Ramos",    "email": "felix@eventflow.test",  "password": "Felix@1234",  "role": "organizer"},
    # Admins
    {"name": "Grace Kim",      "email": "grace@eventflow.test",  "password": "Grace@1234",  "role": "admin"},
    {"name": "Hiro Tanaka",    "email": "hiro@eventflow.test",   "password": "Hiro@1234",   "role": "admin"},
    {"name": "Tushar Maurya",  "email": "tushar@eventflow.test", "password": "Tushar@1234", "role": "admin"},
]

print("\n" + SEP)
print("  EventFlow Seed Script -- Starting...")
print(SEP)

print("\n[1/3] Seeding Users...")
created_users, skipped_users = [], []
for u in USERS:
    if User.objects.filter(email=u["email"]).exists():
        skipped_users.append(u["name"])
        continue
    User.objects.create(
        username=u["email"],
        email=u["email"],
        name=u["name"],
        password=make_password(u["password"]),
        role=u["role"],
        is_staff=(u["role"] == "admin"),
        is_superuser=(u["role"] == "admin"),
    )
    created_users.append(u["name"])

print(f"   Created  : {created_users or 'none (all exist)'}")
print(f"   Skipped  : {skipped_users or 'none'}")

# ---------------------------------------------------------------
# STEP 2 -- EVENTS (12 events across 3 organizers)
# ---------------------------------------------------------------

now = timezone.now()

def dt(days_offset, hour=18, minute=0):
    """Return timezone-aware datetime offset by days from now."""
    base = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    return base + timedelta(days=days_offset)

# Fetch organizers
dev   = User.objects.get(email="dev@eventflow.test")
eva   = User.objects.get(email="eva@eventflow.test")
felix = User.objects.get(email="felix@eventflow.test")

EVENTS = [
    # -- Dev Patel's Events (Tech/Business) -----------------------------------
    {
        "title":       "TechConf Global Summit 2025",
        "description": (
            "The premier developer conference of the year. Featuring keynotes from "
            "Google, Microsoft, and OpenAI engineers. 3 stages of talks covering AI, "
            "Cloud Architecture, and Web3. Hands-on workshops, hackathon zone, and "
            "a networking dinner. Past attendees include 5,000+ engineers from 40 countries."
        ),
        "category":    "Tech",
        "location":    "Moscone Center, San Francisco, CA",
        "date":        dt(+30, 9, 0),
        "total_seats": 500,
        "price":       0.0,
        "image_url":   "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        "organizer":   dev,
    },
    {
        "title":       "AI & Future of Work Summit",
        "description": (
            "Explore how AI is reshaping industries. Panels with industry leaders, "
            "live demos of cutting-edge AI tools, and a startup pitch competition "
            "with Rs.10 lakh in prizes. Topics: LLMs, automation, ethics in AI, "
            "and upskilling strategies for the AI era."
        ),
        "category":    "Tech",
        "location":    "Javits Center, New York, NY",
        "date":        dt(+45, 10, 0),
        "total_seats": 300,
        "price":       1499.0,
        "image_url":   "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        "organizer":   dev,
    },
    {
        "title":       "Startup Pitch Night -- Season 6",
        "description": (
            "Six startups. Five judges. One grand prize. Watch India's boldest founders "
            "pitch live to a panel of veteran VCs and angel investors. Free entry -- "
            "network with 200+ founders, investors, and tech enthusiasts. Drinks and "
            "snacks provided. Season 5 winner raised Rs.2.5 crore post-event."
        ),
        "category":    "Business",
        "location":    "91springboard, Koramangala, Bengaluru",
        "date":        dt(+15, 19, 0),
        "total_seats": 150,
        "price":       0.0,
        "image_url":   "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
        "organizer":   dev,
    },
    {
        "title":       "Blockchain Bootcamp -- 2 Days Intensive",
        "description": (
            "From zero to DeFi in two days. This hands-on bootcamp covers blockchain "
            "fundamentals, Solidity smart contracts, NFT minting, and DeFi protocols. "
            "Laptop required. Certificate of completion provided. Limited to 40 seats "
            "for an immersive learning experience."
        ),
        "category":    "Tech",
        "location":    "WeWork Galaxy, MG Road, Bengaluru",
        "date":        dt(+60, 9, 30),
        "total_seats": 40,
        "price":       2999.0,
        "image_url":   "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80",
        "organizer":   dev,
    },

    # -- Eva Chen's Events (Music/Art) ----------------------------------------
    {
        "title":       "Neon Beats Music Festival 2025",
        "description": (
            "The ultimate outdoor music experience. Three stages, 18 artists, 12 hours "
            "of non-stop music spanning electronic, indie, hip-hop, and pop. Featuring "
            "international headliner ODESZA, India's Nucleya, and 16 more acts. "
            "Food trucks, art installations, and a silent disco tent."
        ),
        "category":    "Music",
        "location":    "Jawaharlal Nehru Stadium Grounds, New Delhi",
        "date":        dt(+20, 16, 0),
        "total_seats": 2000,
        "price":       1999.0,
        "image_url":   "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
        "organizer":   eva,
    },
    {
        "title":       "Jazz Under The Stars",
        "description": (
            "An intimate evening of live jazz in the open air. The Rohan Mathews Quartet "
            "performs classics and originals in a candlelit garden setting. Includes "
            "a curated 3-course dinner, two complimentary drinks, and a jazz souvenir. "
            "Table seating only -- strictly 80 tickets available."
        ),
        "category":    "Music",
        "location":    "Olive Bar & Kitchen, Mehrauli, New Delhi",
        "date":        dt(+10, 20, 0),
        "total_seats": 80,
        "price":       3500.0,
        "image_url":   "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
        "organizer":   eva,
    },
    {
        "title":       "Digital Art Expo 2025",
        "description": (
            "Step into the future of creativity. 30+ digital artists showcase immersive "
            "installations, generative art, and AI-assisted works. Live minting station "
            "where you can own the art you love as an NFT. Artist talks every hour. "
            "VR gallery experience included with entry. Open 10 AM to 9 PM."
        ),
        "category":    "Art",
        "location":    "National Gallery of Modern Art, Mumbai",
        "date":        dt(+25, 10, 0),
        "total_seats": 400,
        "price":       599.0,
        "image_url":   "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
        "organizer":   eva,
    },

    # -- Felix Ramos's Events (Sports/Food) -----------------------------------
    {
        "title":       "Urban Half Marathon -- Mumbai Edition",
        "description": (
            "Run 21.1 km through the heart of Mumbai. The route passes iconic landmarks: "
            "Gateway of India, Marine Drive, Bandra-Worli Sea Link, and Juhu Beach. "
            "Chip-timed race, finisher medal, official race tee, and a hydration pack. "
            "Age categories: 18-30, 31-45, 46+. All fitness levels welcome."
        ),
        "category":    "Sports",
        "location":    "Gateway of India, Mumbai",
        "date":        dt(+35, 5, 30),
        "total_seats": 1000,
        "price":       799.0,
        "image_url":   "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
        "organizer":   felix,
    },
    {
        "title":       "World Street Food Festival",
        "description": (
            "70+ food stalls representing cuisines from 25 countries under one roof. "
            "Live cooking demos by celebrity chefs, a hot-sauce competition, kids "
            "cooking zone, and the Great Indian Curry Cook-Off. Entry includes a "
            "Rs.200 food voucher redeemable at any stall. Pet-friendly event."
        ),
        "category":    "Food",
        "location":    "Phoenix Palladium Courtyard, Mumbai",
        "date":        dt(+8, 11, 0),
        "total_seats": 3000,
        "price":       299.0,
        "image_url":   "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
        "organizer":   felix,
    },
    {
        "title":       "Yoga & Wellness Weekend Retreat",
        "description": (
            "Disconnect to reconnect. A two-day immersive wellness retreat covering "
            "morning yoga, breathwork, sound healing, and guided meditation. Sattvic "
            "meals included. Expert instructors from Rishikesh lead all sessions. "
            "Accommodation available at partner resort (book separately). "
            "Bring your own mat."
        ),
        "category":    "Sports",
        "location":    "Atmantan Wellness Centre, Pune",
        "date":        dt(+50, 6, 0),
        "total_seats": 60,
        "price":       4500.0,
        "image_url":   "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        "organizer":   felix,
    },
    {
        "title":       "City Cycling Challenge 2025",
        "description": (
            "A 50 km social cycling event on traffic-free roads. Starting at India Gate "
            "at 6 AM, the route covers Lodhi Gardens, IIT Delhi, Qutub Minar, and back. "
            "All bicycle types welcome. Support vehicles every 10 km. Finisher tee, "
            "medal, and breakfast at the finish line. Helmet mandatory."
        ),
        "category":    "Sports",
        "location":    "India Gate, New Delhi",
        "date":        dt(+12, 6, 0),
        "total_seats": 500,
        "price":       399.0,
        "image_url":   "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=80",
        "organizer":   felix,
    },
    {
        "title":       "Stand-Up Comedy Night -- Open Mic",
        "description": (
            "Laugh until it hurts. 8 comedians take the stage in a 90-minute open mic "
            "special. Featuring fresh faces and seasoned performers from the Mumbai "
            "comedy circuit. Two drink tokens included with entry. 18+ only. "
            "Recorded for online release -- consent required at venue."
        ),
        "category":    "Art",
        "location":    "The Comedy Store, Lower Parel, Mumbai",
        "date":        dt(+5, 21, 0),
        "total_seats": 120,
        "price":       499.0,
        "image_url":   "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
        "organizer":   felix,
    },
]

print("\n[2/3] Seeding Events...")
created_events, skipped_events = [], []
event_objs = {}

for e in EVENTS:
    if Event.objects.filter(title=e["title"]).exists():
        skipped_events.append(e["title"])
        event_objs[e["title"]] = Event.objects.get(title=e["title"])
        continue
    ev = Event.objects.create(**e)
    event_objs[e["title"]] = ev
    created_events.append(e["title"])
    print(f"   + {e['title']} [{e['category']}]")

if skipped_events:
    print(f"   Skipped  : {len(skipped_events)} already exist")
print(f"   Total    : {len(created_events)} created, {len(skipped_events)} skipped")

# ---------------------------------------------------------------
# STEP 3 -- BOOKINGS  (realistic engagement)
# ---------------------------------------------------------------

alice  = User.objects.get(email="alice@eventflow.test")
bob    = User.objects.get(email="bob@eventflow.test")
clara  = User.objects.get(email="clara@eventflow.test")
grace  = User.objects.get(email="grace@eventflow.test")
tushar = User.objects.get(email="tushar@eventflow.test")

def ev(title):
    return event_objs.get(title)

# (user, event_title, status)
BOOKINGS = [
    # -- Alice Johnson: tech + music + comedy fan ---------------------------
    (alice, "TechConf Global Summit 2025",          "confirmed"),
    (alice, "AI & Future of Work Summit",           "confirmed"),
    (alice, "Neon Beats Music Festival 2025",       "confirmed"),
    (alice, "Jazz Under The Stars",                 "confirmed"),
    (alice, "Stand-Up Comedy Night -- Open Mic",    "confirmed"),
    (alice, "World Street Food Festival",           "confirmed"),
    (alice, "Blockchain Bootcamp -- 2 Days Intensive", "cancelled"),  # too pricey

    # -- Bob Sharma: sports + food + biz -----------------------------------
    (bob,   "Urban Half Marathon -- Mumbai Edition","confirmed"),
    (bob,   "City Cycling Challenge 2025",          "confirmed"),
    (bob,   "World Street Food Festival",           "confirmed"),
    (bob,   "Yoga & Wellness Weekend Retreat",      "confirmed"),
    (bob,   "Startup Pitch Night -- Season 6",      "confirmed"),
    (bob,   "TechConf Global Summit 2025",          "confirmed"),
    (bob,   "Neon Beats Music Festival 2025",       "cancelled"),   # schedule conflict

    # -- Clara Mendes: art + wellness + music ------------------------------
    (clara, "Digital Art Expo 2025",                "confirmed"),
    (clara, "Jazz Under The Stars",                 "confirmed"),
    (clara, "Yoga & Wellness Weekend Retreat",      "confirmed"),
    (clara, "Stand-Up Comedy Night -- Open Mic",    "confirmed"),
    (clara, "Neon Beats Music Festival 2025",       "confirmed"),
    (clara, "World Street Food Festival",           "confirmed"),
    (clara, "City Cycling Challenge 2025",          "cancelled"),   # injury

    # -- Grace Kim: admin attending diverse events -------------------------
    (grace, "TechConf Global Summit 2025",          "confirmed"),
    (grace, "AI & Future of Work Summit",           "confirmed"),
    (grace, "Digital Art Expo 2025",                "confirmed"),
    (grace, "Stand-Up Comedy Night -- Open Mic",    "confirmed"),

    # -- Tushar Maurya: admin testing all categories -----------------------
    (tushar, "TechConf Global Summit 2025",         "confirmed"),
    (tushar, "Neon Beats Music Festival 2025",      "confirmed"),
    (tushar, "Urban Half Marathon -- Mumbai Edition","confirmed"),
    (tushar, "World Street Food Festival",          "confirmed"),
    (tushar, "Startup Pitch Night -- Season 6",     "confirmed"),
    (tushar, "Digital Art Expo 2025",               "confirmed"),
]

print("\n[3/3] Seeding Bookings...")
created_bookings, skipped_bookings = 0, 0

for (user, event_title, status) in BOOKINGS:
    event_obj = ev(event_title)
    if event_obj is None:
        print(f"   WARNING: Event not found: {event_title}")
        continue
    if Booking.objects.filter(user=user, event=event_obj).exists():
        skipped_bookings += 1
        continue
    Booking.objects.create(user=user, event=event_obj, status=status)
    if status == "confirmed":
        event_obj.booked_seats = event_obj.booked_seats + 1
        event_obj.save(update_fields=["booked_seats"])
    created_bookings += 1
    print(f"   + {user.name} -> {event_title} [{status}]")

print(f"\n   Total: {created_bookings} created, {skipped_bookings} skipped")

# ---------------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------------
print("\n" + SEP)
print("  SEED COMPLETE -- EventFlow Database State")
print(SEP)
print(f"  Users    : {User.objects.count()} total")
print(f"  Events   : {Event.objects.count()} total")
total_b    = Booking.objects.count()
confirmed  = Booking.objects.filter(status='confirmed').count()
cancelled  = Booking.objects.filter(status='cancelled').count()
print(f"  Bookings : {total_b} total ({confirmed} confirmed, {cancelled} cancelled)")

print("\n  Top 5 events by confirmed bookings:")
top = (Event.objects
       .annotate(b=Count('bookings', filter=Q(bookings__status='confirmed')))
       .order_by('-b')[:5])
for e in top:
    pct = round(e.b / e.total_seats * 100) if e.total_seats else 0
    print(f"    [{e.b:2d} bookings / {e.total_seats} seats | {pct}% full] {e.title}")

print("\n  Bookings per attendee:")
for u in User.objects.filter(role__in=['user','admin']).order_by('name'):
    conf = Booking.objects.filter(user=u, status='confirmed').count()
    canc = Booking.objects.filter(user=u, status='cancelled').count()
    if conf + canc > 0:
        print(f"    {u.name:<18} ({u.role:<9}) : {conf} confirmed, {canc} cancelled")

print("\n  Quick Login:")
print("    alice@eventflow.test  / Alice@1234  (user)")
print("    bob@eventflow.test    / Bob@1234    (user)")
print("    clara@eventflow.test  / Clara@1234  (user)")
print("    dev@eventflow.test    / Dev@1234    (organizer)")
print("    eva@eventflow.test    / Eva@1234    (organizer)")
print("    felix@eventflow.test  / Felix@1234  (organizer)")
print("    tushar@eventflow.test / Tushar@1234 (admin)")
print(SEP + "\n")
