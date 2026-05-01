# EventFlow – Frontend Development Guide
**Internship: Full Stack Python Developer | CountryEdu Private Limited**
**Assigned To: Tushar Maurya**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React (Vite) |
| Styling | Tailwind CSS + custom CSS variables |
| Prototyping | Google Stitch (via Antigravity MCP) |
| Icons | Lucide React |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| State | React Context API + useState/useReducer |
| Auth Tokens | JWT stored in `localStorage` |

---

## 1. Project Scaffold

```bash
# Create project
npm create vite@latest eventflow-frontend -- --template react
cd eventflow-frontend
npm install

# Install dependencies
npm install react-router-dom axios tailwindcss lucide-react
npx tailwindcss init
```

### Folder Structure

```
eventflow-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/               # Axios instances & API calls
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── bookings.js
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── EventCard.jsx
│   │   ├── BookingCard.jsx
│   │   ├── Modal.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── user/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── EventList.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   └── BookingHistory.jsx
│   │   ├── organizer/
│   │   │   ├── OrganizerDashboard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   └── ManageRegistrations.jsx
│   │   └── admin/
│   │       ├── AdminPanel.jsx
│   │       ├── ManageUsers.jsx
│   │       └── ManageEvents.jsx
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── tailwind.config.js
└── package.json
```

---

## 2. Google Stitch via Antigravity MCP — Prototyping Workflow

> **Google Stitch** is used to rapidly generate UI wireframes and component designs that you then implement in React.

### Steps to Use Stitch with Antigravity MCP

```
1. Open Antigravity (Claude desktop or MCP-enabled IDE)
2. In the MCP panel → connect Google Stitch server
3. For each page, prompt Stitch:
   "Design a [Page Name] screen for an event management app called EventFlow.
    Include: [list UI elements from module spec below]
    Style: modern, clean, card-based layout, blue/white palette"
4. Export the Stitch output as React component scaffold or screenshot
5. Implement the exported scaffold in your /pages directory
6. Replace placeholder data with real Axios API calls
```

### Pages to Prototype in Stitch (in order)

| Priority | Page | Key Elements to Include in Stitch Prompt |
|----------|------|------------------------------------------|
| 1 | Login / Register | Form fields, role selector (User/Organizer/Admin), submit button, validation errors |
| 2 | Landing Page | Hero section, event search bar, featured events grid, CTA buttons |
| 3 | Event List | Filter sidebar (category, date, location), event cards grid, pagination |
| 4 | Event Detail | Event banner, date/time/venue, ticket counter, "Book Now" button, description |
| 5 | User Dashboard | Stats cards (bookings count), upcoming events, booking history table |
| 6 | Organizer Dashboard | "Create Event" CTA, my events table, registrations count per event |
| 7 | Create Event Form | Multi-step form: Basic Info → Date/Venue → Tickets → Review |
| 8 | Admin Panel | Users table, events table, system stats, action buttons |

---

## 3. Authentication Context

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 4. Axios API Layer

```js
// src/api/auth.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const registerUser = (data) => axios.post(`${BASE}/auth/register`, data);
export const loginUser    = (data) => axios.post(`${BASE}/auth/login`, data);
```

```js
// src/api/events.js
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getAllEvents    = ()       => axios.get(`${BASE}/events`);
export const getEventById   = (id)     => axios.get(`${BASE}/events/${id}`);
export const createEvent    = (data)   => axios.post(`${BASE}/events`, data, authHeaders());
export const updateEvent    = (id, d)  => axios.put(`${BASE}/events/${id}`, d, authHeaders());
export const deleteEvent    = (id)     => axios.delete(`${BASE}/events/${id}`, authHeaders());
```

```js
// src/api/bookings.js
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const bookEvent      = (eventId) => axios.post(`${BASE}/bookings`, { event_id: eventId }, authHeaders());
export const getMyBookings  = ()        => axios.get(`${BASE}/bookings/me`, authHeaders());
export const cancelBooking  = (id)      => axios.delete(`${BASE}/bookings/${id}`, authHeaders());
```

---

## 5. Routing Setup

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage         from "./pages/LandingPage";
import Login               from "./pages/auth/Login";
import Register            from "./pages/auth/Register";
import EventList           from "./pages/user/EventList";
import EventDetail         from "./pages/user/EventDetail";
import UserDashboard       from "./pages/user/UserDashboard";
import BookingHistory      from "./pages/user/BookingHistory";
import OrganizerDashboard  from "./pages/organizer/OrganizerDashboard";
import CreateEvent         from "./pages/organizer/CreateEvent";
import ManageRegistrations from "./pages/organizer/ManageRegistrations";
import AdminPanel          from "./pages/admin/AdminPanel";
import ManageUsers         from "./pages/admin/ManageUsers";
import ManageEvents        from "./pages/admin/ManageEvents";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"           element={<LandingPage />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/events"     element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />

          {/* User (role: user) */}
          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route path="/dashboard"       element={<UserDashboard />} />
            <Route path="/my-bookings"     element={<BookingHistory />} />
          </Route>

          {/* Organizer */}
          <Route element={<ProtectedRoute roles={["organizer"]} />}>
            <Route path="/organizer"             element={<OrganizerDashboard />} />
            <Route path="/organizer/create"      element={<CreateEvent />} />
            <Route path="/organizer/registrations" element={<ManageRegistrations />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin"               element={<AdminPanel />} />
            <Route path="/admin/users"         element={<ManageUsers />} />
            <Route path="/admin/events"        element={<ManageEvents />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 6. ProtectedRoute Component

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <Outlet />;
}
```

---

## 7. Environment Variables

```env
# .env
VITE_API_URL=http://localhost:5000/api
```

---

## 8. Design System (Tailwind Config + CSS Variables)

```js
// tailwind.config.js
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:  "#1E40AF",   // deep blue
          accent:   "#F59E0B",   // amber
          surface:  "#F8FAFC",
          dark:     "#0F172A",
        }
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      }
    }
  }
}
```

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #1E40AF;
  --color-accent:  #F59E0B;
  --color-surface: #F8FAFC;
  --color-dark:    #0F172A;
}
```

---

## 9. Git Commit Convention (GitHub Activity)

```
feat: add event booking component
fix:  correct auth token expiry handling
ui:   redesign event card with hover animation
api:  integrate booking cancel endpoint
docs: add README setup instructions
```

Commit **at least once per day** across the 14-day timeline.

---

## 10. Deployment (Frontend)

**Option: Vercel (recommended)**
```bash
npm run build
# Push to GitHub, connect repo to vercel.com
# Set environment variable VITE_API_URL=<your_backend_url>
```

**Option: Netlify**
```bash
npm run build
# Drag & drop /dist folder to netlify.com/drop
```

---

## Checklist — Frontend Modules

- [ ] Landing page with hero + event search
- [ ] Register / Login with role selection
- [ ] JWT stored and sent in headers
- [ ] Event listing with filters
- [ ] Event detail + booking button
- [ ] User dashboard (stats + history)
- [ ] Booking history table with cancel option
- [ ] Organizer dashboard + create event form
- [ ] Manage registrations table (organizer)
- [ ] Admin panel: users table + events table
- [ ] Protected routes working per role
- [ ] Responsive on mobile (Tailwind breakpoints)
- [ ] Stitch wireframes exported for all 8 pages