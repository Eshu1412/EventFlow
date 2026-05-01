"""
Run with:  python create_test_users.py
(Must be executed from inside the eventflow-backend directory
 with the virtual-environment active, so Django settings load.)
"""
import os
import sys
import django

# ── bootstrap Django ────────────────────────────────────────────────────────
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eventflow_backend.settings")
django.setup()

from django.contrib.auth.hashers import make_password
from api.models import User

# ── test-user definitions ───────────────────────────────────────────────────
TEST_USERS = [
    # ── Regular Users ──────────────────────────────────────────────────────
    {"name": "Alice Johnson",   "email": "alice@eventflow.test",   "password": "Alice@1234",   "role": "user"},
    {"name": "Bob Sharma",      "email": "bob@eventflow.test",     "password": "Bob@1234",     "role": "user"},
    {"name": "Clara Mendes",    "email": "clara@eventflow.test",   "password": "Clara@1234",   "role": "user"},
    # ── Organizers ─────────────────────────────────────────────────────────
    {"name": "Dev Patel",       "email": "dev@eventflow.test",     "password": "Dev@1234",     "role": "organizer"},
    {"name": "Eva Chen",        "email": "eva@eventflow.test",     "password": "Eva@1234",     "role": "organizer"},
    {"name": "Felix Ramos",     "email": "felix@eventflow.test",   "password": "Felix@1234",   "role": "organizer"},
    # ── Admins ─────────────────────────────────────────────────────────────
    {"name": "Grace Kim",       "email": "grace@eventflow.test",   "password": "Grace@1234",   "role": "admin"},
    {"name": "Hiro Tanaka",     "email": "hiro@eventflow.test",    "password": "Hiro@1234",    "role": "admin"},
    {"name": "Tushar Maurya",   "email": "tushar@eventflow.test",  "password": "Tushar@1234",  "role": "admin"},
]

created, skipped = [], []

for u in TEST_USERS:
    if User.objects.filter(email=u["email"]).exists():
        skipped.append(u["email"])
        continue
    User.objects.create(
        username=u["email"],          # Django requires unique username
        email=u["email"],
        name=u["name"],
        password=make_password(u["password"]),
        role=u["role"],
        is_staff=(u["role"] == "admin"),
        is_superuser=(u["role"] == "admin"),
    )
    created.append(u["email"])

print(f"\n[OK]     Created : {len(created)} user(s): {created}")
print(f"[SKIP]  Skipped : {len(skipped)} already exist: {skipped}")
print("\nDone - all test users are ready.\n")
