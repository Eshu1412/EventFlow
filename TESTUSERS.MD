# EventFlow — Test User Credentials
**Tushar Maurya | EventFlow Project**
*All 9 accounts are pre-seeded into the local SQLite database.*

---

## Role: USER (3 accounts)

| # | Full Name | Email | Password | Role |
|---|-----------|-------|----------|------|
| 1 | Alice Johnson | alice@eventflow.test | Alice@1234 | user |
| 2 | Bob Sharma | bob@eventflow.test | Bob@1234 | user |
| 3 | Clara Mendes | clara@eventflow.test | Clara@1234 | user |

**User capabilities:**
- Browse all events
- Book events / cancel bookings
- View booking history
- Edit profile (name + password)

---

## Role: ORGANIZER (3 accounts)

| # | Full Name | Email | Password | Role |
|---|-----------|-------|----------|------|
| 4 | Dev Patel | dev@eventflow.test | Dev@1234 | organizer |
| 5 | Eva Chen | eva@eventflow.test | Eva@1234 | organizer |
| 6 | Felix Ramos | felix@eventflow.test | Felix@1234 | organizer |

**Organizer capabilities:**
- Create, edit, delete own events
- View registrations for own events
- All user capabilities

---

## Role: ADMIN (3 accounts)

| # | Full Name | Email | Password | Role |
|---|-----------|-------|----------|------|
| 7 | Grace Kim | grace@eventflow.test | Grace@1234 | admin |
| 8 | Hiro Tanaka | hiro@eventflow.test | Hiro@1234 | admin |
| 9 | Tushar Maurya | tushar@eventflow.test | Tushar@1234 | admin |

**Admin capabilities:**
- Manage all users (view / delete)
- Manage all events (view / delete)
- View all bookings (search + export CSV)
- View platform stats (total users, events, bookings)

---

## Quick Login Guide

1. Start backend: `cd eventflow-backend && .\venv\Scripts\activate && python manage.py runserver`
2. Start frontend: `cd eventflow-frontend && npm run dev`
3. Open browser: [http://localhost:5173](http://localhost:5173)
4. Click **Login** → select the matching role tab → enter email + password

> **Note:** Admin accounts also have `is_staff = True` and `is_superuser = True`,
> so they can access the Django Admin panel at [http://localhost:8000/admin](http://localhost:8000/admin).

---

## How Users Were Created

Seeded via `eventflow-backend/create_test_users.py` using Django ORM directly:

```bash
# From inside eventflow-backend/ with venv active:
python create_test_users.py
```

The script is idempotent — re-running it skips already-existing emails.

---

*Last seeded: 2026-04-25*
