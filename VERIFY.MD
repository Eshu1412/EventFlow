# EventFlow – Module Verification & Wireframe Checklist
**Assignment Document Cross-Reference | Tushar Maurya**
**Last Updated: 2026-04-29 (Final Audit + Bug Fixes Applied)**

---

## Verification Method

Each module from the assignment PDF is listed below. For each:
- ✅ = Covered in Frontend + Backend guides
- ⚠️ = Partially covered — updated spec added below
- ❌ = Missing — new spec added below

---

## MODULE 1 — User Module

**Assignment requires:**
- Registration ✅
- Login ✅
- Dashboard ✅
- Browse Events ✅
- Event Booking ✅ ← **BUG FIX APPLIED: `handleBook` now navigates to `/login` instead of calling `login()` with no args**
- View Booking History ✅
- Profile ✅ ← **IMPLEMENTED: `src/pages/user/UserProfile.jsx`**

### ✅ User Profile Page — VERIFIED COMPLETE

**Frontend:** `src/pages/user/UserProfile.jsx`
- Route `/profile` registered in `App.jsx` under `ProtectedRoute roles={["user"]}`
- Calls `getProfile()` (GET `/api/auth/profile/`) on mount
- Calls `updateProfile()` (PUT `/api/auth/profile/`) on form submit
- Displays: avatar initials, name, email (disabled), role badge, member-since year
- Edit mode: name + optional new password fields, Save Changes button
- Falls back gracefully to `useAuth()` context data if API call fails

**Backend:** `api/views.py` → `profile()` view
```python
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    elif request.method == 'PUT':
        data = request.data
        if 'name' in data:
            user.name = data['name']
        if 'password' in data:
            user.password = make_password(data['password'])
        user.save()
        return Response(UserSerializer(user).data)
```

**URL:** `api/urls.py` → `path('auth/profile/', views.profile, name='profile')`

**Serializer fix (2026-04-25):**
```python
# api/serializers.py — UserSerializer includes date_joined
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'date_joined']
```
> `date_joined` was added so UserProfile.jsx "Member since YYYY" works correctly.

### ✅ Event Detail — BUG FIXES APPLIED (2026-04-29)

**Bugs fixed in `src/pages/user/EventDetail.jsx`:**
1. `handleBook` was calling `login()` with no arguments — **fixed to `navigate("/login")`**
2. `event.venue` was used everywhere but backend returns `event.location` — **fixed to `event.location || event.venue` (fallback for mock data)**
3. `event.available_tickets` was from mock; backend property is `available_seats` — **fixed to `event.available_seats ?? event.available_tickets ?? "—"`**
4. Organizer display now uses `event.organizer_name` (from `EventSerializer`) with fallback

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────┐
│  NAVBAR                                             │
├─────────────────────────────────────────────────────┤
│  [Hero Image Banner with gradient overlay]          │
│  [← Back]  [Music Badge]                           │
│  Neon Beats Music Festival 2025                     │
├───────────────────────────┬─────────────────────────┤
│  [Organizer Avatar] Name  │  Book Tickets Card      │
│                           │  📅 Date  🕐 Time       │
│  [Description│Schedule│   │  📍 Location            │
│   Location] Tabs          │  🎫 N seats left        │
│                           │  Quantity: [- 1 +]      │
│  Description text...      │  Total: $89.00          │
│                           │  [Book Now]             │
│  Reviews section          │  [♡ Wishlist]           │
└───────────────────────────┴─────────────────────────┘
```

---

## MODULE 2 — Admin Module

**Assignment requires:**
- Login ✅
- Manage Users ✅ ← **BUG FIX APPLIED: `changeRole` now calls `PUT /api/admin/users/<id>/` (was incorrectly calling `/api/auth/profile/` which updated admin's own profile)**
- Create and Manage Events ✅
- View Bookings ✅ ← **IMPLEMENTED: `src/pages/admin/ManageBookings.jsx`**
- Manage System Data ✅ — covered by stats endpoint

### ✅ Admin Manage Users — BUG FIX (2026-04-29)

**Bug fixed:** `ManageUsers.jsx` `changeRole()` was calling `PUT /api/auth/profile/` — this updates the **currently logged-in admin's own profile**, not the target user's role. This has been corrected to call `PUT /api/admin/users/<id>/`.

**New backend endpoint `admin_manage_user`:**
```python
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_manage_user(request, pk):
    """Admin: update user role/name OR delete a user by ID."""
    user = User.objects.get(pk=pk)
    if request.method == 'DELETE':
        user.delete()
        return Response({'message': 'User deleted'})
    elif request.method == 'PUT':
        if 'role' in request.data:
            user.role = request.data['role']
        if 'name' in request.data:
            user.name = request.data['name']
        user.save()
        return Response(UserSerializer(user).data)
```

**URL:** `path('admin/users/<int:pk>/', views.admin_manage_user, name='admin_manage_user')`

### ✅ Admin View All Bookings — VERIFIED COMPLETE

**Frontend:** `src/pages/admin/ManageBookings.jsx`
- Route `/admin/bookings` registered in `App.jsx` under `ProtectedRoute roles={["admin"]}`
- Calls `GET /api/admin/bookings/` with Bearer token auth header
- Shows table: #, User Name, Event Title, Status (badge), Booked At
- Search filter by user name or event title
- Export CSV button (client-side, downloads all booking rows)
- Falls back to MOCK data only if backend unreachable

**UI Wireframe:**
```
┌──────────────────────────────────────────────────────────┐
│  ADMIN PANEL > Bookings                                  │
├──────────────────────────────────────────────────────────┤
│  [Search by user or event...]         [Export CSV]       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ #  │ User Name    │ Event Title   │ Status │Date  │   │
│  │ 1  │ Tushar M.    │ Tech Summit   │ ✅     │Apr14 │   │
│  │ 2  │ Riya Singh   │ Art Expo      │ ❌     │Apr12 │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## MODULE 3 — Organizer Module

**Assignment requires:**
- Login ✅
- Create Events ✅ — `src/pages/organizer/CreateEvent.jsx`
- Manage Event Details ✅ — Edit/Delete in `OrganizerDashboard.jsx`
- View Registrations ✅ ← **BUG FIX APPLIED: `ManageRegistrations.jsx` now calls `/api/organizer/bookings/` instead of `/api/admin/bookings/` (which was IsAdmin-only, causing 403 + MOCK fallback for organizers)**

### ✅ ManageRegistrations — BUG FIX (2026-04-29)

**Bug fixed:** `ManageRegistrations.jsx` was calling `GET /api/admin/bookings/` which has `IsAdmin` permission class — organizers received 403 and always fell back to MOCK data. 

**New backend endpoint:**
```python
# api/views.py
@api_view(['GET'])
@permission_classes([IsOrganizerOrAdmin])
def organizer_bookings(request):
    """Returns bookings for events owned by the requesting organizer."""
    bookings = Booking.objects.filter(event__organizer=request.user)
    return Response(BookingSerializer(bookings, many=True).data)
```

**URL:** `path('organizer/bookings/', views.organizer_bookings, name='organizer_bookings')`

**Wireframe for Organizer Dashboard:**
```
┌─────────────────────────────────────────────────────────┐
│  ORGANIZER DASHBOARD                                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ My Events│ │Total Reg │ │Capacity% │ │ Upcoming │  │
│  │    12    │ │   340    │ │   67%    │ │    5     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                              [+ Create New Event]       │
│  MY EVENTS TABLE                                        │
│  ┌────────────────────────────────────────────────┐    │
│  │ Event      │ Date   │ Loc   │Booked/Tot│Status│ ✏️ │    │
│  │ Tech Conf  │ 20 Apr │Chicago│ 127/200  │Active│ ✏️ │    │
│  │ Music Night│ 25 Apr │NYC   │ 80/80    │Active│ ✏️ │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## MODULE 4 — Authentication Module

**Assignment requires:**
- User Registration ✅ — `src/pages/auth/Register.jsx` → `POST /api/auth/register/`
- Login ✅ — `src/pages/auth/Login.jsx` → `POST /api/auth/login/`
- Logout ✅ — Sidebar logout button in all dashboards + `AuthContext.logout()`
- Role-Based Access Control ✅ — `ProtectedRoute.jsx` + `IsAdmin`/`IsOrganizerOrAdmin` permissions

**Auth flow:**
1. Login → JWT token stored in `localStorage` + `axios.defaults.headers.common["Authorization"]`
2. On reload → `AuthContext` restores token and validates with `GET /api/auth/profile/`
3. Logout → clears token from localStorage + axios defaults + React state

**Wireframe for Login/Register:**
```
┌──────────────────────────────────────┐
│  🎟️  EventFlow                       │
│                                      │
│  [● User]  [○ Organizer]  [○ Admin] │  ← Role tabs
│                                      │
│  Email ________________________      │
│  Password ______________________     │
│                                      │
│        [Login →]                     │
│                                      │
│  Don't have an account? Register     │
└──────────────────────────────────────┘
```

---

## MODULE 5 — Database Module

**Assignment requires:**
- Store Users ✅ — `api/models.py` → `User(AbstractUser)` with `role`, `name`
- Store Events ✅ — `Event` model with `title, description, category, location, date, total_seats, booked_seats, price, image_url, organizer(FK)`
- Store Bookings ✅ — `Booking` model with `user(FK), event(FK), status, booked_at`
- Related Data ✅ — Foreign keys + `select_related` via DRF serializer source fields

**ER Diagram:**
```
┌──────────┐       ┌──────────┐       ┌──────────┐
│  Users   │       │  Events  │       │ Bookings │
├──────────┤       ├──────────┤       ├──────────┤
│ id  (PK) │──┐    │ id  (PK) │──┐    │ id  (PK) │
│ name     │  │    │ title    │  │    │ user_id  │──► Users.id
│ email    │  │    │ desc     │  │    │ event_id │──► Events.id
│ password │  └───►│organizer_│  └───►│ status   │
│ role     │       │  _id(FK) │       │booked_at │
│date_join │       │ date     │       └──────────┘
└──────────┘       │ location │
                   │total_seats│
                   │booked_seats│
                   │ price    │
                   └──────────┘
```

---

## MODULE 6 — API Module

**Assignment requires:**
- Create and manage RESTful APIs for users ✅
- Create and manage RESTful APIs for events ✅
- Create and manage RESTful APIs for bookings ✅

**All 17 endpoints — `api/urls.py`:**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | Public |
| POST | `/api/auth/login/` | Login + get JWT token | Public |
| GET/PUT | `/api/auth/profile/` | Get / update own profile | JWT |
| GET | `/api/events/` | List all events | Public |
| POST | `/api/events/` | Create event | Organizer/Admin |
| GET | `/api/events/<id>/` | Get single event | Public |
| PUT | `/api/events/<id>/` | Update event | Owner/Admin |
| DELETE | `/api/events/<id>/` | Delete event | Owner/Admin |
| POST | `/api/bookings/` | Book an event | User JWT |
| GET | `/api/bookings/me/` | Get my bookings | User JWT |
| DELETE | `/api/bookings/<id>/` | Cancel a booking | Owner JWT |
| GET | `/api/admin/users/` | List all users | Admin |
| PUT/DELETE | `/api/admin/users/<id>/` | Update/Delete user | Admin |
| GET | `/api/admin/events/` | List all events (admin) | Admin |
| GET | `/api/admin/bookings/` | List all bookings | Admin |
| GET | `/api/admin/stats/` | Platform stats | Admin |
| GET | `/api/organizer/bookings/` | Organizer's event bookings | Organizer/Admin |

**Status: Fully Covered ✅** (17 endpoints total)

---

## MODULE 7 — Frontend Module

**Assignment requires:**
- UI Development ✅
- User Interaction ✅

**All pages implemented:**

| Route | File | Role |
|-------|------|------|
| `/` | `LandingPage.jsx` | Public |
| `/login` | `auth/Login.jsx` | Public |
| `/register` | `auth/Register.jsx` | Public |
| `/events` | `user/EventList.jsx` | Public |
| `/events/:id` | `user/EventDetail.jsx` | Public |
| `/dashboard` | `user/UserDashboard.jsx` | User |
| `/my-bookings` | `user/BookingHistory.jsx` | User |
| `/profile` | `user/UserProfile.jsx` | User |
| `/organizer` | `organizer/OrganizerDashboard.jsx` | Organizer |
| `/organizer/create` | `organizer/CreateEvent.jsx` | Organizer |
| `/organizer/registrations` | `organizer/ManageRegistrations.jsx` | Organizer |
| `/admin` | `admin/AdminPanel.jsx` | Admin |
| `/admin/users` | `admin/ManageUsers.jsx` | Admin |
| `/admin/events` | `admin/ManageEvents.jsx` | Admin |
| `/admin/bookings` | `admin/ManageBookings.jsx` | Admin |

**Wireframe for Event Listing Page:**
```
┌─────────────────────────────────────────────────┐
│  NAVBAR  [EventFlow Logo]    [Login] [Register]  │
├──────────┬──────────────────────────────────────┤
│ FILTERS  │  EVENTS GRID                         │
│          │                                      │
│ Search   │  ┌──────┐ ┌──────┐ ┌──────┐        │
│ [.......]│  │IMG   │ │IMG   │ │IMG   │        │
│          │  │Title │ │Title │ │Title │        │
│ Category │  │Date  │ │Date  │ │Date  │        │
│ [Music✓] │  │Free  │ │$89   │ │$45   │        │
│ [Tech  ] │  │[Book]│ │[Book]│ │[Book]│        │
│ [Sports] │  └──────┘ └──────┘ └──────┘        │
│          │                                      │
│ Sort:    │  ◄ 1  2  3 ►                         │
│ [Date ▼] │                                      │
└──────────┴──────────────────────────────────────┘
```

---

## FINAL VERIFICATION SUMMARY

| Module | Assignment Requirement | Status |
|--------|----------------------|--------|
| User Module | Registration, Login, Dashboard, Browse, Book, History, **Profile** | ✅ All complete |
| Admin Module | Login, Users, Events, **View Bookings**, System Data | ✅ All complete |
| Organizer Module | Login, Create, Manage, View Registrations | ✅ Fully complete |
| Authentication | Register, Login, Logout, RBAC | ✅ Fully complete |
| Database | Users, Events, Bookings, Relations | ✅ Fully complete |
| API | REST APIs for all entities | ✅ 17 endpoints |
| Frontend | UI + Interactions | ✅ 15 pages |

---

## BUG FIXES APPLIED (Audit: 2026-04-29)

| File | Bug | Fix Applied |
|------|-----|-------------|
| `src/pages/user/EventDetail.jsx` | `handleBook` called `login()` with no args when user not logged in | Changed to `navigate("/login")` |
| `src/pages/user/EventDetail.jsx` | `event.venue` used but backend returns `event.location` | Changed to `event.location \|\| event.venue` throughout |
| `src/pages/user/EventDetail.jsx` | `event.available_tickets` doesn't exist on backend — it's `available_seats` | Changed to `event.available_seats ?? event.available_tickets ?? "—"` |
| `src/pages/user/EventDetail.jsx` | Organizer displayed as `event.organizer` (integer FK id) | Changed to `event.organizer_name \|\| event.organizer` |
| `src/pages/admin/ManageUsers.jsx` | `changeRole()` called `PUT /api/auth/profile/` updating **admin's own** profile | Fixed to call `PUT /api/admin/users/<id>/` |
| `src/pages/organizer/ManageRegistrations.jsx` | Called `GET /api/admin/bookings/` (IsAdmin only) → 403 → fell back to MOCK | Fixed to call `GET /api/organizer/bookings/` |
| `api/views.py` `events_list` | Missing `@permission_classes` — default DRF auth would block anonymous GET | Added `@permission_classes([AllowAny])` |
| `api/views.py` `event_detail` | No authentication check before PUT/DELETE — unauthenticated users could attempt writes | Added explicit `request.user.is_authenticated` check |
| `api/views.py` | No admin endpoint to update another user's role | Added `admin_manage_user` (PUT/DELETE at `admin/users/<pk>/`) |
| `api/views.py` | No organizer-scoped bookings endpoint | Added `organizer_bookings` at `organizer/bookings/` |

---

## SERIALIZER ENHANCEMENTS (2026-04-29)

| Serializer | Field Added | Purpose |
|------------|-------------|---------|
| `EventSerializer` | `organizer_name` (CharField, read_only) | EventDetail shows organizer's name not ID |
| `BookingSerializer` | `event_price` (FloatField, read_only) | Booking history can display ticket price |

---

## FIXES APPLIED (Audit: 2026-04-25)

| File | Fix | Reason |
|------|-----|--------|
| `api/serializers.py` | Added `date_joined` to `UserSerializer.fields` | `UserProfile.jsx` displays "Member since YYYY" using `profileData.date_joined` |

**Everything else was already complete and correctly wired.**

---

## DELIVERABLES CHECKLIST (from assignment)

| Deliverable | Guide Reference |
|-------------|----------------|
| Source code on GitHub | Both guides → Git sections |
| Live deployed project | Frontend → Vercel, Backend → Render |
| Project report | This verification doc serves as base |
| Documentation PDF | Convert these 3 .md files to PDF |
| Presentation PPT | Use Stitch wireframes above as slides |
| Live demo presentation | Walk through each module's wireframe |
| Research paper | Topic: "Smart Event Management with REST APIs" |

---

## FILE NAMING (per submission guidelines)

```
Tushar_Maurya_EventFlow_Project/
├── Tushar_Maurya_EventFlow_Frontend/      (GitHub repo)
├── Tushar_Maurya_EventFlow_Backend/       (GitHub repo)
├── Tushar_Maurya_EventFlow_Documentation.pdf
├── Tushar_Maurya_EventFlow_Presentation.pptx
└── Tushar_Maurya_EventFlow_ResearchPaper.pdf
```

---

## HOW TO RUN LOCALLY

### Backend
```bash
cd eventflow-backend
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver      # runs on http://localhost:8000
```

### Frontend
```bash
cd eventflow-frontend
npm install
npm run dev                     # runs on http://localhost:5173
                                # proxies /api → localhost:8000
```

### Test Users (see TESTUSERS.MD)
- **Admin:** admin@eventflow.com / Admin@123
- **Organizer:** organizer@eventflow.com / Org@12345
- **User:** user@eventflow.com / User@12345