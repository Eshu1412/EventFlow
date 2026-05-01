# Folder Structure: eventflow-frontend

```
eventflow-frontend/
├── .env
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── api
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── events.js
│   ├── components
│   │   ├── BookingCard.jsx
│   │   ├── EventCard.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── PageTransition.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ThemeToggle.jsx
│   ├── context
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── TransitionContext.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── pages
│   │   ├── LandingPage.jsx
│   │   ├── admin
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   ├── ManageEvents.jsx
│   │   │   └── ManageUsers.jsx
│   │   ├── auth
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── organizer
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── ManageRegistrations.jsx
│   │   │   └── OrganizerDashboard.jsx
│   │   └── user
│   │       ├── BookingHistory.jsx
│   │       ├── EventDetail.jsx
│   │       ├── EventList.jsx
│   │       ├── UserDashboard.jsx
│   │       └── UserProfile.jsx
│   └── utils
│       └── helpers.js
└── vite.config.js
```

# Files Content

## .env

```text
# EventFlow Frontend Environment
VITE_API_URL=/api
VITE_AUTH0_DOMAIN=dev-kc01dksd6nnh0p0c.us.auth0.com
VITE_AUTH0_CLIENT_ID=3PxHoAGd1TlvWjJbVs6XeeiVnsUt5ejm
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
```

## .gitignore

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## eslint.config.js

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EventFlow — Discover & Book Unforgettable Events</title>
    <meta name="description" content="EventFlow is the premier platform to discover concerts, conferences, sports events and more. Book instantly, experience unforgettably." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## package.json

```json
{
  "name": "eventflow-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.15.0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.8.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@tailwindcss/vite": "^4.2.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "tailwindcss": "^4.2.2",
    "vite": "^8.0.4"
  }
}
```

## README.md

```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

## vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

## src\App.css

```css
/* App.css — cleared of Vite template boilerplate */
```

## src\App.jsx

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";

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
import ManageBookings      from "./pages/admin/ManageBookings";
import UserProfile         from "./pages/user/UserProfile";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* PageTransition must be inside BrowserRouter to access useLocation */}
          <PageTransition>
            <Routes>
              {/* Public */}
              <Route path="/"           element={<LandingPage />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/events"     element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />

              {/* User (role: user) */}
              <Route element={<ProtectedRoute roles={["user"]} />}>
                <Route path="/dashboard"   element={<UserDashboard />} />
                <Route path="/my-bookings" element={<BookingHistory />} />
                <Route path="/profile"     element={<UserProfile />} />
              </Route>

              {/* Organizer */}
              <Route element={<ProtectedRoute roles={["organizer"]} />}>
                <Route path="/organizer"               element={<OrganizerDashboard />} />
                <Route path="/organizer/create"        element={<CreateEvent />} />
                <Route path="/organizer/registrations" element={<ManageRegistrations />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route path="/admin"          element={<AdminPanel />} />
                <Route path="/admin/users"    element={<ManageUsers />} />
                <Route path="/admin/events"   element={<ManageEvents />} />
                <Route path="/admin/bookings" element={<ManageBookings />} />
              </Route>
            </Routes>
          </PageTransition>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

## src\index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
@import "tailwindcss";

/* ═══════════════════════════════════════════════════════
   DESIGN SYSTEM TOKENS
   Aesthetic: Dark Editorial Luxury
   Display: Bebas Neue  |  Body: DM Sans  |  Mono: DM Mono
═══════════════════════════════════════════════════════ */

:root {
  /* ── Dark defaults ── */
  --ink:        #0c0d0f;
  --ink-2:      #141518;
  --ink-3:      #1c1e24;
  --ink-4:      #272932;
  --surface:    #f5f3ee;
  --surface-2:  #eceae4;
  --gold:       #b8924e;
  --gold-light: #d4ab6a;
  --coral:      #e8614a;
  --coral-dim:  #c44433;
  --white:      #ffffff;
  --fg:         #ffffff;
  --fg-sub:     rgba(255,255,255,0.72);
  --muted:      rgba(255,255,255,0.45);
  --muted-dark: rgba(12,13,15,0.5);
  --border:         rgba(255,255,255,0.08);
  --border-gold:    rgba(200,169,110,0.25);
  --card-bg:        #1c1e24;
  --card-border:    rgba(255,255,255,0.08);
  --input-bg:       rgba(255,255,255,0.05);
  --input-border:   rgba(255,255,255,0.08);
  --sidebar-bg:     #0c0d0f;
  --sidebar-border: rgba(255,255,255,0.08);
  --body-bg:        #0c0d0f;
  --page-bg:        #141518;
  --perf-bg:        #0c0d0f;
  --ticker-bg:      #b8924e;
  --ticker-fg:      #0c0d0f;
  --how-step-bg:    #1c1e24;

  /* Typography */
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'DM Mono', monospace;

  /* Spacing */
  --navbar-h: 68px;
  --r-sm: 6px;
  --r-md: 12px;
  --r-lg: 20px;
  --r-xl: 32px;
  --r-full: 999px;

  /* Shadows */
  --shadow-sm:   0 2px 8px rgba(0,0,0,0.10);
  --shadow-md:   0 8px 32px rgba(0,0,0,0.18);
  --shadow-lg:   0 20px 60px rgba(0,0,0,0.28);
  --shadow-gold: 0 0 40px rgba(184,146,78,0.18);
  --shadow-coral:0 0 40px rgba(232,97,74,0.22);

  /* Transitions */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ══════════════════════════════════════════════════════
   LIGHT MODE — Warm Editorial Print
   Parchment paper meets luxury magazine
══════════════════════════════════════════════════════ */
[data-theme="light"] {
  --ink:        #faf8f3;
  --ink-2:      #f2ede4;
  --ink-3:      #e8e2d8;
  --ink-4:      #ddd6c8;
  --surface:    #0c0d0f;
  --surface-2:  #1c1e24;
  --gold:       #966a1e;
  --gold-light: #b8843a;
  --coral:      #c94430;
  --coral-dim:  #a33222;
  --white:      #0c0d0f;
  --fg:         #18191e;
  --fg-sub:     rgba(24,25,30,0.72);
  --muted:      rgba(24,25,30,0.5);
  --muted-dark: rgba(250,248,243,0.5);
  --border:         rgba(24,25,30,0.1);
  --border-gold:    rgba(150,106,30,0.3);
  --card-bg:        #ffffff;
  --card-border:    rgba(24,25,30,0.1);
  --input-bg:       rgba(24,25,30,0.04);
  --input-border:   rgba(24,25,30,0.14);
  --sidebar-bg:     #f2ede4;
  --sidebar-border: rgba(24,25,30,0.12);
  --body-bg:        #faf8f3;
  --page-bg:        #f2ede4;
  --perf-bg:        #e8e2d8;
  --ticker-bg:      #18191e;
  --ticker-fg:      #faf8f3;
  --how-step-bg:    #ffffff;

  --shadow-sm:   0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:   0 8px 32px rgba(0,0,0,0.1),  0 2px 8px rgba(0,0,0,0.06);
  --shadow-lg:   0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
  --shadow-gold: 0 0 40px rgba(150,106,30,0.14);
  --shadow-coral:0 0 40px rgba(201,68,48,0.16);
}

/* Global theme transition — smooth swap on theme change only */
/* Applied specifically to properties that change with theme, not layout/transform */
*:not([style*="transition"]), *::before, *::after {
  transition:
    background-color 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    border-color     0.28s cubic-bezier(0.16, 1, 0.3, 1),
    color            0.22s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow       0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
/* Exempt elements that must not animate */
img, video, canvas, svg, .no-transition,
[class*="hero-photo"],
.ticker-track,
body::before {
  transition: none !important;
}

/* ── RESET & BASE ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--body-bg);
  color: var(--fg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Grain overlay on body */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.022;
  pointer-events: none;
  z-index: 9999;
  transition: none;
}

img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
button { font-family: var(--font-body); cursor: pointer; border: none; background: none; }
input, select, textarea { font-family: var(--font-body); }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); letter-spacing: 0.02em; color: var(--fg); }

main { padding-top: var(--navbar-h); }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--ink-2); }
::-webkit-scrollbar-thumb { background: var(--ink-4); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--gold); }

/* ═══════════════════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════════════════ */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulseGold {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes borderPulse {
  0%, 100% { border-color: rgba(200,169,110,0.25); }
  50%       { border-color: rgba(200,169,110,0.55); }
}

/* Page enter — used by PageTransition.jsx */
@keyframes ef-page-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* ═══════════════════════════════════════════════════════
   TAILWIND @theme
═══════════════════════════════════════════════════════ */

@theme {
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'DM Mono', monospace;
  --color-ink:    #0c0d0f;
  --color-gold:   #c8a96e;
  --color-coral:  #e8614a;
  --color-surface:#f5f3ee;
}

/* ═══════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: var(--r-sm);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
  transition: all 0.2s var(--ease-out);
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: var(--gold);
  color: var(--body-bg);
}
.btn-primary:hover {
  background: var(--gold-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-gold);
}

.btn-coral {
  background: var(--coral);
  color: #fff;
}
.btn-coral:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-coral);
  opacity: 0.9;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-gold);
  color: var(--gold);
}
.btn-outline:hover {
  background: rgba(150,106,30,0.08);
  border-color: var(--gold);
}

.btn-ghost {
  background: transparent;
  color: var(--muted);
}
.btn-ghost:hover {
  color: var(--fg);
  background: var(--border);
}

.btn-surface {
  background: var(--card-bg);
  color: var(--fg);
  border: 1px solid var(--border);
}
.btn-surface:hover {
  background: var(--ink-3);
}

.btn-dark {
  background: var(--ink-3);
  color: var(--fg);
  border: 1px solid var(--border);
}
.btn-dark:hover {
  background: var(--ink-4);
}

.btn-sm { padding: 7px 14px; font-size: 0.8rem; }
.btn-lg { padding: 14px 30px; font-size: 0.95rem; }
.btn-full { width: 100%; }

/* ═══════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════ */

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: var(--navbar-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  background: color-mix(in srgb, var(--body-bg) 88%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.navbar-brand {
  font-family: var(--font-display);
  font-size: 1.7rem;
  letter-spacing: 0.06em;
  color: var(--fg);
  display: flex;
  align-items: center;
  gap: 2px;
}
.navbar-brand em {
  font-style: normal;
  color: var(--gold);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav-link {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--gold);
  transition: width 0.25s var(--ease-out);
}
.nav-link:hover { color: var(--fg); }
.nav-link:hover::after { width: 100%; }

/* ═══════════════════════════════════════════════════════
   TICKER / MARQUEE
═══════════════════════════════════════════════════════ */

.ticker-wrap {
  background: var(--ticker-bg);
  overflow: hidden;
  height: 36px;
  display: flex;
  align-items: center;
}
.ticker-track {
  display: flex;
  animation: ticker 40s linear infinite;
  white-space: nowrap;
  width: max-content;
}
.ticker-item {
  font-family: var(--font-display);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  color: var(--ticker-fg);
  padding: 0 2rem;
}
.ticker-dot {
  color: var(--ticker-fg);
  opacity: 0.4;
}

/* ═══════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════ */

.hero {
  min-height: 92vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
  background: var(--body-bg);
}

.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 7rem 4rem 5rem 5vw;
  position: relative;
  z-index: 2;
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.6s ease both;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 8vw, 7.5rem);
  line-height: 0.92;
  letter-spacing: 0.02em;
  color: var(--fg);
  margin-bottom: 2rem;
  animation: fadeUp 0.7s var(--ease-out) 0.1s both;
}
.hero-title .line-gold {
  color: var(--gold);
  display: block;
}
.hero-title .line-outline {
  display: block;
  color: transparent;
  -webkit-text-stroke: 2px var(--border-gold);
}

.hero-sub {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--muted);
  max-width: 400px;
  margin-bottom: 2.5rem;
  font-weight: 400;
  animation: fadeUp 0.7s var(--ease-out) 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  animation: fadeUp 0.7s var(--ease-out) 0.3s both;
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  animation: fadeUp 0.7s var(--ease-out) 0.4s both;
}
.hero-stat-number {
  font-family: var(--font-display);
  font-size: 1.8rem;
  color: var(--fg);
  display: block;
  letter-spacing: 0.04em;
}
.hero-stat-label {
  font-size: 0.73rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.hero-right {
  position: relative;
  overflow: hidden;
}
.hero-right::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--body-bg) 0%, transparent 30%);
  z-index: 1;
  pointer-events: none;
}
.hero-photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  height: 100%;
  opacity: 0;
  animation: fadeIn 1s ease 0.3s both;
}
.hero-photo-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Search bar */
.hero-search {
  display: flex;
  gap: 0;
  background: var(--input-bg);
  border: 1px solid var(--border-gold);
  border-radius: var(--r-sm);
  overflow: hidden;
  animation: fadeUp 0.7s var(--ease-out) 0.35s both;
  margin-bottom: 1.25rem;
}
.hero-search:focus-within {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(150,106,30,0.12);
}
.hero-search input,
.hero-search select {
  flex: 1;
  padding: 13px 16px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--fg);
  font-size: 0.875rem;
  font-family: var(--font-body);
}
.hero-search input::placeholder { color: var(--muted); }
.hero-search select option { background: var(--ink-3); color: var(--fg); }
.hero-search .divider {
  width: 1px;
  background: var(--border);
  align-self: stretch;
  margin: 8px 0;
}
.hero-search button {
  padding: 0 20px;
  background: var(--gold);
  color: var(--body-bg);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-search button:hover { background: var(--gold-light); }

/* ═══════════════════════════════════════════════════════
   CATEGORY SECTION
═══════════════════════════════════════════════════════ */

.section {
  padding: 6rem 5vw;
}
.section-sm { padding: 4rem 5vw; }

.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  color: var(--fg);
  margin-bottom: 0.5rem;
}

.section-sub {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 400;
  margin-bottom: 3rem;
  max-width: 520px;
}

/* Category chips */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1rem;
}

.category-chip {
  position: relative;
  padding: 1.75rem 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--r-md);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  overflow: hidden;
}
.category-chip::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--chip-color, var(--gold));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}
.category-chip:hover {
  border-color: var(--chip-color, var(--gold));
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  background: var(--ink-3);
}
.category-chip:hover::before { transform: scaleX(1); }

.category-chip .chip-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--r-sm);
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--chip-color, var(--gold));
}
.category-chip:hover .chip-icon {
  background: rgba(var(--chip-rgb, 200,169,110), 0.15);
}

.category-chip .chip-label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  color: var(--fg);
}
.category-chip .chip-count {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--muted);
  letter-spacing: 0.1em;
}

/* ═══════════════════════════════════════════════════════
   EVENT CARD (Ticket Style)
═══════════════════════════════════════════════════════ */

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1.25rem;
}

.event-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--r-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s var(--ease-out);
  display: flex;
  flex-direction: column;
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-gold);
}

.event-card-img {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.event-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out);
}
.event-card:hover .event-card-img img { transform: scale(1.06); }

.event-card-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(12,13,15,0.8) 0%, transparent 60%);
}

.event-card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--r-full);
  backdrop-filter: blur(8px);
}

.badge-music    { background: rgba(124,58,237,0.85); color: #fff; }
.badge-tech     { background: rgba(30,64,175,0.85);  color: #fff; }
.badge-sports   { background: rgba(6,95,70,0.85);    color: #fff; }
.badge-food     { background: rgba(180,83,9,0.85);   color: #fff; }
.badge-art      { background: rgba(220,38,38,0.85);  color: #fff; }
.badge-business { background: rgba(71,85,105,0.85);  color: #fff; }

/* Ticket perforation */
.event-card-perf {
  height: 28px;
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 -1px;
}
.event-card-perf::before,
.event-card-perf::after {
  content: '';
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--perf-bg);
  position: absolute;
  top: 50%; transform: translateY(-50%);
  border: 1px solid var(--border);
}
.event-card-perf::before { left: -8px; }
.event-card-perf::after  { right: -8px; }
.event-card-perf-line {
  flex: 1;
  border-top: 1.5px dashed var(--border);
  margin: 0 12px;
}

.event-card-body {
  padding: 0 1.25rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.02em;
  color: var(--fg);
  line-height: 1.15;
  margin-bottom: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1.25rem;
  flex: 1;
}
.event-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--muted);
}
.event-meta-row svg { color: var(--gold); flex-shrink: 0; }

.event-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px dashed var(--border);
  gap: 1rem;
}

.event-price {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.04em;
  color: var(--gold);
}
.event-price-free {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: #4ade80;
  text-transform: uppercase;
  background: rgba(74,222,128,0.12);
  padding: 3px 10px;
  border-radius: var(--r-full);
  border: 1px solid rgba(74,222,128,0.2);
}

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════ */

.how-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2px;
}

.how-step {
  padding: 2.5rem;
  background: var(--how-step-bg);
  border: 1px solid var(--border);
  position: relative;
}
.how-step:hover { background: var(--ink-3); }

.how-step-num {
  font-family: var(--font-display);
  font-size: 5rem;
  letter-spacing: -0.02em;
  color: var(--border);
  line-height: 1;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.how-step-icon {
  width: 52px; height: 52px;
  border-radius: var(--r-sm);
  background: rgba(150,106,30,0.1);
  border: 1px solid var(--border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  margin-bottom: 1.5rem;
}

.how-step-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--fg);
  margin-bottom: 0.6rem;
  letter-spacing: 0.03em;
}

.how-step-desc {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.7;
}

/* ═══════════════════════════════════════════════════════
   NEWSLETTER / CTA BAND
═══════════════════════════════════════════════════════ */

.cta-band {
  background: var(--card-bg);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 5rem 5vw;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 4rem;
  flex-wrap: wrap;
}
.cta-band::before {
  content: 'EVENTFLOW';
  position: absolute;
  font-family: var(--font-display);
  font-size: 14rem;
  letter-spacing: 0.02em;
  color: var(--border);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  white-space: nowrap;
}

.cta-band-text { flex: 1; min-width: 260px; }
.cta-band-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: 0.02em;
  color: var(--white);
  margin-bottom: 0.5rem;
}
.cta-band-sub {
  font-size: 0.875rem;
  color: var(--muted);
}

.cta-form {
  display: flex;
  gap: 0;
  flex: 1;
  max-width: 440px;
  min-width: 280px;
  background: var(--input-bg);
  border: 1px solid var(--border-gold);
  border-radius: var(--r-sm);
  overflow: hidden;
}
.cta-form:focus-within {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(150,106,30,0.1);
}
.cta-form input {
  flex: 1;
  padding: 13px 16px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--fg);
  font-size: 0.875rem;
}
.cta-form input::placeholder { color: var(--muted); }
.cta-form button {
  padding: 0 20px;
  background: var(--gold);
  color: var(--body-bg);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.cta-form button:hover { background: var(--gold-light); }

/* ═══════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════ */

.footer {
  background: var(--ink);
  padding: 3rem 5vw;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-brand {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.06em;
  color: var(--fg);
}
.footer-brand em { font-style: normal; color: var(--gold); }

.footer-copy {
  font-size: 0.78rem;
  color: var(--muted);
  font-family: var(--font-mono);
}
.footer-links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.78rem;
  color: var(--muted);
}
.footer-links a:hover { color: var(--gold); }

/* ═══════════════════════════════════════════════════════
   AUTH PAGES
═══════════════════════════════════════════════════════ */

.auth-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.auth-visual {
  background: var(--ink-3);
  border-right: 1px solid var(--border);
  padding: 4rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}
.auth-visual::before {
  content: '';
  position: absolute;
  top: -100px; right: -100px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(150,106,30,0.14) 0%, transparent 70%);
  pointer-events: none;
}
.auth-visual-brand {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.06em;
  color: var(--fg);
}
.auth-visual-brand em { font-style: normal; color: var(--gold); }

.auth-visual-headline {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 5rem);
  line-height: 0.92;
  letter-spacing: 0.02em;
  color: var(--fg);
}
.auth-visual-headline em {
  font-style: normal;
  color: var(--gold);
  display: block;
}

.auth-visual-body {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.7;
  max-width: 340px;
  margin-top: 1.25rem;
}

.auth-stats {
  display: flex;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}
.auth-stat-num {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--gold);
  display: block;
}
.auth-stat-lbl {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.auth-form-panel {
  background: var(--page-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 5rem;
}

.auth-form-title {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.03em;
  color: var(--fg);
  margin-bottom: 0.4rem;
}
.auth-form-sub {
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 2rem;
}
.auth-form-sub a { color: var(--gold); font-weight: 500; }
.auth-form-sub a:hover { opacity: 0.8; }

/* Form elements */
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}
.form-control {
  width: 100%;
  padding: 12px 16px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--r-sm);
  color: var(--fg);
  font-size: 0.9rem;
  outline: none;
}
.form-control::placeholder { color: var(--muted); }
.form-control:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(150,106,30,0.12);
  background: var(--card-bg);
}
.form-control option { background: var(--ink-3); color: var(--fg); }
select.form-control { cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23966a1e' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 2.5rem;
}

.form-stack { display: flex; flex-direction: column; gap: 1.1rem; }

.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--r-sm);
  font-size: 0.85rem;
  font-weight: 500;
}
.alert-error {
  background: rgba(232,97,74,0.1);
  border: 1px solid rgba(232,97,74,0.3);
  color: #f87171;
}
.alert-success {
  background: rgba(74,222,128,0.1);
  border: 1px solid rgba(74,222,128,0.3);
  color: #4ade80;
}

.divider-text {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--muted);
  font-size: 0.78rem;
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  margin: 1.5rem 0;
}
.divider-text::before,
.divider-text::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD / SIDEBAR LAYOUT
═══════════════════════════════════════════════════════ */

.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--page-bg);
}

.sidebar {
  width: 240px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  inset-y: 0;
  left: 0;
  z-index: 100;
}

.sidebar-logo {
  padding: 1.5rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.sidebar-logo-text {
  font-family: var(--font-display);
  font-size: 1.7rem;
  letter-spacing: 0.06em;
  color: var(--white);
  display: flex;
  align-items: center;
  gap: 2px;
}
.sidebar-logo-text em { font-style: normal; color: var(--gold); }

.sidebar-nav {
  flex: 1;
  padding: 1.25rem 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 10px 14px;
  border-radius: var(--r-sm);
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  transition: all 0.2s;
}
.sidebar-nav-link:hover {
  color: var(--white);
  background: rgba(255,255,255,0.06);
}
.sidebar-nav-link.active {
  background: rgba(200,169,110,0.12);
  color: var(--gold);
  border: 1px solid rgba(200,169,110,0.2);
}
.sidebar-nav-section {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.2);
  padding: 8px 14px 4px;
  margin-top: 8px;
}

.sidebar-user {
  padding: 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.875rem;
}
.sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--coral));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--ink);
  flex-shrink: 0;
}
.sidebar-user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--white);
  line-height: 1.2;
}
.sidebar-user-role {
  font-size: 0.7rem;
  color: var(--muted);
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 2.5rem;
  min-height: 100vh;
}

/* Page header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}
.page-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  letter-spacing: 0.03em;
  color: var(--white);
  line-height: 1;
}
.page-subtitle {
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 0.4rem;
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.stat-card {
  background: var(--ink-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}
.stat-card:hover { border-color: var(--border-gold); }
.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--stat-accent, var(--gold));
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.75rem;
}
.stat-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  letter-spacing: 0.03em;
  color: var(--white);
  line-height: 1;
  margin-bottom: 0.4rem;
}
.stat-sub {
  font-size: 0.75rem;
  color: var(--muted);
  font-family: var(--font-mono);
}

/* Tables */
.table-wrap { width: 100%; overflow-x: auto; }
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th {
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
  text-align: left;
  background: var(--ink);
}
.data-table td {
  padding: 13px 14px;
  font-size: 0.845rem;
  color: rgba(255,255,255,0.72);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.15s;
}
.data-table tr:hover td { background: rgba(255,255,255,0.03); }

/* Booking card sticky */
.booking-sticky {
  background: var(--ink-3);
  border: 1px solid var(--border-gold);
  border-radius: var(--r-lg);
  padding: 1.75rem;
  position: sticky;
  top: calc(var(--navbar-h) + 1.5rem);
  animation: borderPulse 3s ease infinite;
}
.ticket-counter {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  overflow: hidden;
}
.ticket-btn {
  padding: 8px 14px;
  background: rgba(255,255,255,0.05);
  color: var(--white);
  font-size: 1.1rem;
  font-weight: 600;
  transition: background 0.15s;
}
.ticket-btn:hover { background: rgba(255,255,255,0.1); }
.ticket-count {
  flex: 1;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  color: var(--white);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  padding: 8px;
}

/* Filter sidebar (event list) */
.filter-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--navbar-h) + 1.5rem);
  max-height: calc(100vh - var(--navbar-h) - 3rem);
  overflow-y: auto;
}
.filter-card {
  background: var(--ink-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 1.25rem;
}
.filter-title {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.875rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--border);
}
.checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  padding: 0.3rem 0;
  transition: color 0.15s;
}
.checkbox-row:hover { color: var(--white); }
.checkbox-row input { accent-color: var(--gold); width: 14px; height: 14px; }

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.page-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--muted);
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover { border-color: var(--border-gold); color: var(--gold); }
.page-btn.active { background: var(--gold); border-color: var(--gold); color: var(--ink); }

/* ═══════════════════════════════════════════════════════
   MISC UTILITIES
═══════════════════════════════════════════════════════ */

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: rotateSlow 0.7s linear infinite;
  display: inline-block;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--r-full);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
}
.tag-gold   { background: rgba(200,169,110,0.12); color: var(--gold); border: 1px solid rgba(200,169,110,0.25); }
.tag-coral  { background: rgba(232,97,74,0.12);   color: #f87171;     border: 1px solid rgba(232,97,74,0.25); }
.tag-green  { background: rgba(74,222,128,0.12);  color: #4ade80;     border: 1px solid rgba(74,222,128,0.2); }
.tag-muted  { background: rgba(255,255,255,0.06); color: var(--muted);border: 1px solid var(--border); }

/* Responsive breakpoints */
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; }
  .hero-right { display: none; }
  .hero-left { padding: 6rem 5vw 4rem; }
  .auth-layout { grid-template-columns: 1fr; }
  .auth-visual { display: none; }
  .auth-form-panel { padding: 3rem 2rem; }
  .sidebar { transform: translateX(-100%); }
  .main-content { margin-left: 0; }
}

/* ═══════════════════════════════════════════════════════
   MISSING UTILITY CLASSES
   Bridge between design tokens and component usage
═══════════════════════════════════════════════════════ */

/* Color aliases */
:root {
  --color-primary:       var(--gold);
  --color-primary-light: var(--gold-light);
  --color-accent:        var(--coral);
  --color-text:          var(--fg);
  --color-text-muted:    var(--muted);
  --color-border:        var(--border);
  --color-surface:       var(--ink-3);
  --color-bg:            var(--body-bg);
  --radius-sm:           var(--r-sm);
  --radius-md:           var(--r-md);
  --radius-lg:           var(--r-lg);
}

/* Card */
.card {
  background: var(--ink-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.card-body { padding: 1.5rem; }

/* Page content wrapper */
.page-content { flex: 1; }

/* Grid utilities */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

/* Filter section */
.filter-section {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}
.filter-section:last-child { border-bottom: none; }

/* Table */
table { width: 100%; border-collapse: collapse; }
thead tr { background: var(--ink); }
th {
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
  text-align: left;
}
td {
  padding: 12px 14px;
  font-size: 0.845rem;
  color: var(--fg-sub);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.15s;
}
tr:hover td { background: rgba(255,255,255,0.02); }

/* Table actions cell */
.table-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--r-full);
  font-size: 0.68rem;
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  white-space: nowrap;
}
.badge-blue   { background: rgba(59,130,246,0.15); color: #93c5fd; border: 1px solid rgba(59,130,246,0.25); }
.badge-green  { background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
.badge-amber  { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
.badge-red    { background: rgba(248,113,113,0.12);color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
.badge-purple { background: rgba(167,139,250,0.12);color: #a78bfa; border: 1px solid rgba(167,139,250,0.2); }
.badge-gray   { background: rgba(148,163,184,0.1); color: #94a3b8; border: 1px solid rgba(148,163,184,0.15); }

/* Alert warning */
.alert-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--r-sm);
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.2);
  color: #fbbf24;
}

/* Stat card color variants (for admin/organizer dashboards) */
.stat-card.blue   { --stat-accent: #60a5fa; }
.stat-card.green  { --stat-accent: #4ade80; }
.stat-card.amber  { --stat-accent: #fbbf24; }
.stat-card.red    { --stat-accent: #f87171; }
.stat-card.purple { --stat-accent: #a78bfa; }

/* Booking card sticky (EventDetail) */
.booking-card-sticky {
  background: var(--ink-3);
  border: 1px solid var(--border-gold);
  border-radius: var(--r-lg);
  padding: 1.75rem;
  position: sticky;
  top: calc(var(--navbar-h) + 1.5rem);
  animation: borderPulse 3s ease infinite;
}

/* Event meta item row */
.event-meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--muted);
}
.event-meta-item svg { color: var(--gold); flex-shrink: 0; }

/* Multi-step form */
.steps-bar {
  display: flex;
  align-items: flex-start;
  gap: 0;
}
.step-item {
  display: flex;
  align-items: center;
  flex: 1;
}
.step-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}
.step-circle {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  border: 2px solid var(--border);
  color: var(--muted);
  background: var(--ink-3);
  transition: all 0.2s;
}
.step-circle.active { border-color: var(--gold); color: var(--gold); background: rgba(200,169,110,0.1); }
.step-circle.done   { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,0.1); }
.step-label { font-size: 0.7rem; font-family: var(--font-mono); letter-spacing: 0.08em; color: var(--muted); text-transform: uppercase; }
.step-label.active { color: var(--gold); }
.step-label.done   { color: #4ade80; }
.step-connector {
  flex: 1;
  height: 2px;
  background: var(--border);
  margin: 0 0.25rem;
  margin-bottom: 1.2rem;
  transition: background 0.3s;
}
.step-connector.done { background: #4ade80; }

/* Upload zone */
.upload-zone {
  border: 2px dashed var(--border-gold);
  border-radius: var(--r-md);
  padding: 2.5rem;
  text-align: center;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(200,169,110,0.03);
}
.upload-zone:hover { border-color: var(--gold); background: rgba(200,169,110,0.07); color: var(--fg); }
.upload-icon {
  width: 52px; height: 52px;
  border-radius: var(--r-md);
  background: rgba(200,169,110,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  margin: 0 auto 1rem;
}

/* BookingCard component */
.booking-card {
  background: var(--ink-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}
.booking-card:hover { border-color: var(--border-gold); }

/* btn-accent = coral CTA */
.btn-accent {
  background: var(--coral);
  color: #fff;
}
.btn-accent:hover {
  background: var(--coral-dim);
  transform: translateY(-1px);
  box-shadow: var(--shadow-coral);
}

/* sidebar logo (when just text node, not em) */
.sidebar-logo span { color: var(--gold); }

/* color-* aliases for legacy class names */
.color-primary { color: var(--gold); }
.color-accent   { color: var(--coral); }

/* btn-danger */
.btn-danger {
  background: rgba(248,113,113,0.12);
  color: #f87171;
  border: 1px solid rgba(248,113,113,0.25);
}
.btn-danger:hover {
  background: rgba(248,113,113,0.22);
  color: #fca5a5;
}

```

## src\main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## src\api\auth.js

```js
// src/api/auth.js
// Auth header is set globally by AuthContext via axios.defaults.headers.
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "/api";

export const registerUser  = (data) => axios.post(`${BASE}/auth/register/`, data);
export const loginUser     = (data) => axios.post(`${BASE}/auth/login/`,    data);
export const getProfile    = ()     => axios.get(`${BASE}/auth/profile/`);
export const updateProfile = (data) => axios.put(`${BASE}/auth/profile/`,   data);
```

## src\api\bookings.js

```js
// src/api/bookings.js
// Auth header is set globally by AuthContext via axios.defaults.headers.
// These functions rely on that; no local-storage lookup needed.
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "/api";

export const bookEvent     = (eventId) => axios.post(`${BASE}/bookings/`,     { event_id: eventId });
export const getMyBookings = ()         => axios.get(`${BASE}/bookings/me/`);
export const cancelBooking = (id)       => axios.delete(`${BASE}/bookings/${id}/`);
```

## src\api\events.js

```js
// src/api/events.js
// Auth header is set globally by AuthContext via axios.defaults.headers.
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "/api";

export const getAllEvents  = ()         => axios.get(`${BASE}/events/`);
export const getEventById  = (id)       => axios.get(`${BASE}/events/${id}/`);
export const createEvent   = (data)     => axios.post(`${BASE}/events/`, data);
export const updateEvent   = (id, data) => axios.put(`${BASE}/events/${id}/`, data);
export const deleteEvent   = (id)       => axios.delete(`${BASE}/events/${id}/`);
```

## src\components\BookingCard.jsx

```jsx
// src/components/BookingCard.jsx
import { formatDate } from "../utils/helpers";
import { Calendar, MapPin, Ticket, X } from "lucide-react";
import { statusColor } from "../utils/helpers";

export default function BookingCard({ booking, onCancel }) {
  return (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <div className="card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: ".5rem", fontSize: "1rem" }}>
            {booking.event?.title || booking.event_title || "Event"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <span className="event-meta-item">
              <Calendar size={13} />
              {formatDate(booking.event?.date || booking.date)}
            </span>
            {(booking.event?.venue || booking.venue) && (
              <span className="event-meta-item">
                <MapPin size={13} />
                {booking.event?.venue || booking.venue}
              </span>
            )}
            <span className="event-meta-item">
              <Ticket size={13} />
              {booking.tickets || 1} ticket{(booking.tickets || 1) > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".75rem" }}>
          <span className={`badge ${statusColor(booking.status)}`}>
            {booking.status || "Confirmed"}
          </span>
          {booking.status !== "cancelled" && onCancel && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onCancel(booking._id || booking.id)}
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

## src\components\EventCard.jsx

```jsx
// src/components/EventCard.jsx
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { formatDate, formatPrice } from "../utils/helpers";

const BADGE_CLASS = {
  Music: "badge-music", Tech: "badge-tech", Sports: "badge-sports",
  Food: "badge-food", Art: "badge-art", Business: "badge-business",
};

const PLACEHOLDER_IMGS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80",
  "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=600&q=80",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80",
];

export default function EventCard({ event, index = 0 }) {
  const img = event.image_url || PLACEHOLDER_IMGS[index % PLACEHOLDER_IMGS.length];
  const badgeCls = BADGE_CLASS[event.category] || "badge-tech";
  const isFree = !event.price || event.price === 0;

  return (
    <div className="event-card">
      {/* Photo */}
      <div className="event-card-img">
        <img src={img} alt={event.title} loading="lazy" />
        <div className="event-card-img-overlay" />
        {event.category && (
          <span className={`event-card-badge ${badgeCls}`}>
            {event.category}
          </span>
        )}
      </div>

      {/* Ticket perforation */}
      <div className="event-card-perf">
        <div className="event-card-perf-line" />
      </div>

      {/* Body */}
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <div className="event-meta">
          <span className="event-meta-row">
            <Calendar size={12} />
            {formatDate(event.date)}
          </span>
          {(event.venue || event.location) && (
            <span className="event-meta-row">
              <MapPin size={12} />
              {event.venue || event.location}
            </span>
          )}
        </div>

        <div className="event-card-footer">
          {isFree
            ? <span className="event-price-free">Free Entry</span>
            : <span className="event-price">{formatPrice(event.price)}</span>
          }
          <Link
            to={`/events/${event._id || event.id}`}
            className="btn btn-primary btn-sm"
            style={{ fontSize: "0.75rem", padding: "6px 14px" }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## src\components\Modal.jsx

```jsx
// src/components/Modal.jsx
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ title, children, onClose, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const widths = { sm: "420px", md: "560px", lg: "720px", xl: "900px" };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: widths[size], maxHeight: "90vh", overflow: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)"
        }}>
          <h3 style={{ fontSize: "1.1rem" }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: ".4rem" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}
```

## src\components\Navbar.jsx

```jsx
// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const dashboardLink = () => {
    if (!user) return null;
    return { user: "/dashboard", organizer: "/organizer", admin: "/admin" }[user.role] || "/";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Event<em>Flow</em>
      </Link>

      <div className="nav-links">
        <Link to="/events" className="nav-link">Events</Link>
        <Link to="/#categories" className="nav-link">Categories</Link>
        <Link to="/#about" className="nav-link">About</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ThemeToggle />

        {user ? (
          <>
            <Link to={dashboardLink()} className="btn btn-ghost btn-sm">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

## src\components\PageTransition.jsx

```jsx
// src/components/PageTransition.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Smooth page transitions using opacity cross-dissolve only.
 *
 * IMPORTANT: Do NOT use transform or filter on the wrapper div —
 * they create a new CSS stacking context which breaks fixed-positioned
 * children (e.g. the Navbar with position: fixed; top: 0).
 * Opacity alone is the only safe property that doesn't cause this issue.
 *
 * Sequence:
 *  0ms      → fade out starts (80ms)
 *  80ms     → content swaps + fade in starts (300ms)
 *  100ms    → gold progress bar sweeps (completes at ~400ms total)
 *  380ms    → bar fades out
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);
  const [progress, setProgress] = useState(0);
  const prevKey = useRef(location.key);
  const prevPath = useRef(location.pathname);
  const timers = useRef([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => {
    if (location.key === prevKey.current) return;
    
    prevKey.current = location.key;
    prevPath.current = location.pathname;

    clear();

    // 1. Fade out + start progress bar
    setOpacity(0);
    setProgress(20);

    after(() => {
      // 2. Swap content while invisible
      setDisplayChildren(children);
      setProgress(65);

      // 3. Fade in
      setOpacity(1);

      after(() => setProgress(100), 50);

      // 4. Hide progress bar
      after(() => setProgress(0), 420);
    }, 90);

    return clear;
  }, [location.key, children, location.pathname]);

  // Keep displayChildren current when idle
  useEffect(() => {
    if (opacity === 1) setDisplayChildren(children);
  }, [children, opacity]);

  return (
    <>
      {/* Gold progress bar — fixed to viewport, no stacking context issues */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: progress === 0 ? "0%" : `${progress}%`,
          background: "linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)",
          boxShadow: progress > 0 ? "0 0 8px 1px rgba(184,146,78,0.5)" : "none",
          zIndex: 99999,
          opacity: progress === 0 ? 0 : 1,
          borderRadius: "0 2px 2px 0",
          pointerEvents: "none",
          transition:
            progress === 0
              ? "opacity 0.25s ease, width 0.1s ease"
              : progress === 100
              ? "width 0.15s ease"
              : "width 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s ease",
        }}
      />

      {/* Page content — opacity only, NO transform/filter (would break fixed navbar) */}
      <div
        style={{
          opacity,
          transition: opacity === 0
            ? "opacity 0.08s ease"
            : "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {displayChildren}
      </div>
    </>
  );
}
```

## src\components\ProtectedRoute.jsx

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
```

## src\components\ThemeToggle.jsx

```jsx
// src/components/ThemeToggle.jsx
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * Floating or inline theme toggle button.
 * Pass `fixed` to position it as a floating corner button.
 */
export default function ThemeToggle({ fixed = false, style = {} }) {
  const { isDark, toggle } = useTheme();

  const baseStyle = {
    width: 38,
    height: 38,
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "var(--card-bg)",
    color: "var(--muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    zIndex: 200,
    ...(fixed ? {
      position: "fixed",
      top: "1.25rem",
      right: "1.25rem",
    } : {}),
    ...style,
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-gold)";
        e.currentTarget.style.color = "var(--gold)";
        e.currentTarget.style.background = "var(--ink-3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--muted)";
        e.currentTarget.style.background = "var(--card-bg)";
      }}
    >
      {isDark
        ? <Sun size={16} strokeWidth={1.8} />
        : <Moon size={16} strokeWidth={1.8} />
      }
    </button>
  );
}
```

## src\context\AuthContext.jsx

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
      axios.get("/api/auth/profile/")
        .then(r => { setUser(r.data); })
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const isAuthenticated = !!user;

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)",
      color: "var(--muted)", fontFamily: "var(--font-display)",
      letterSpacing: "0.1em", fontSize: "0.85rem",
    }}>
      LOADING…
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## src\context\ThemeContext.jsx

```jsx
// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Respect saved preference, then system preference
    const saved = localStorage.getItem("ef-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ef-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

## src\context\TransitionContext.jsx

```jsx
// src/context/TransitionContext.jsx
import { createContext, useContext, useRef, useState } from "react";

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const [transitioning, setTransitioning] = useState(false);
  const resolveRef = useRef(null);

  /**
   * Call this before navigating. Returns a promise that resolves
   * when the curtain is fully closed (safe to swap the page).
   */
  const startTransition = () => {
    setTransitioning(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  /** Called by the overlay once the curtain finishes closing */
  const onCurtainClosed = () => {
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  };

  const endTransition = () => setTransitioning(false);

  return (
    <TransitionContext.Provider
      value={{ transitioning, startTransition, onCurtainClosed, endTransition }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
```

## src\pages\LandingPage.jsx

```jsx
// src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { Search, Music, Laptop, Trophy, Utensils, Palette, Briefcase, ChevronRight, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const MOCK_EVENTS = [
  { id: "1", title: "Neon Beats Music Festival 2025", category: "Music", date: "2025-07-12", venue: "Madison Square Garden, NYC", price: 89 },
  { id: "2", title: "TechConf Global Summit", category: "Tech", date: "2025-08-03", venue: "Moscone Center, SF", price: 0 },
  { id: "3", title: "Urban Marathon Championship", category: "Sports", date: "2025-06-22", venue: "Central Park, NYC", price: 45 },
  { id: "4", title: "World Street Food Festival", category: "Food", date: "2025-07-19", venue: "Brooklyn Bridge Park", price: 25 },
  { id: "5", title: "Digital Art Expo 2025", category: "Art", date: "2025-09-05", venue: "MoMA, NYC", price: 35 },
  { id: "6", title: "Startup Pitch Competition", category: "Business", date: "2025-08-15", venue: "WeWork HQ, Chicago", price: 0 },
];

const CATEGORIES = [
  { label: "Music",    icon: Music,    color: "#a855f7", rgb: "168,85,247",  count: "2.4K" },
  { label: "Tech",     icon: Laptop,   color: "#60a5fa", rgb: "96,165,250",  count: "1.8K" },
  { label: "Sports",   icon: Trophy,   color: "#34d399", rgb: "52,211,153",  count: "950" },
  { label: "Food",     icon: Utensils, color: "#fb923c", rgb: "251,146,60",  count: "730" },
  { label: "Art",      icon: Palette,  color: "#f87171", rgb: "248,113,113", count: "480" },
  { label: "Business", icon: Briefcase,color: "#94a3b8", rgb: "148,163,184", count: "1.1K" },
];

const HERO_PHOTOS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=700&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=700&q=80",
];

const TICKER_ITEMS = [
  "MUSIC FESTIVALS", "TECH CONFERENCES", "SPORTS EVENTS", "FOOD FESTS",
  "ART EXHIBITIONS", "BUSINESS SUMMITS", "COMEDY NIGHTS", "LIVE THEATRE",
  "STARTUP PITCHES", "MARATHON RACES",
];

const HOW_STEPS = [
  { icon: Search,     num: "01", title: "Discover",  desc: "Browse thousands of events near you. Filter by category, date, or location." },
  { icon: ChevronRight, num: "02", title: "Book",    desc: "Secure your spot in seconds. Easy checkout with multiple payment options." },
  { icon: Music,      num: "03", title: "Experience",desc: "Join the crowd and create unforgettable memories at every event." },
];

export default function LandingPage() {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events?city=${city}&category=${category}`);
  };

  // Build ticker content (duplicated for seamless loop)
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
    <span className="ticker-item" key={i}>
      {item} <span className="ticker-dot">✦</span>
    </span>
  ));

  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero" style={{ marginTop: "var(--navbar-h)" }}>
        {/* Left: editorial content */}
        <div className="hero-left">
          <p className="hero-eyebrow">✦ Trusted by 500,000+ event-goers</p>

          <h1 className="hero-title">
            YOUR NEXT<br />
            <span className="line-gold">GREAT</span>
            <span className="line-outline">EVENT</span>
          </h1>

          <p className="hero-sub">
            Concerts, conferences, marathons & more — discover and book
            the world's best experiences in one place.
          </p>

          {/* Search form */}
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              placeholder="City or venue…"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <div className="divider" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
            <button type="submit">
              <Search size={15} /> Search
            </button>
          </form>

          {/* CTA buttons */}
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-lg">
              Browse Events
            </Link>
            <Link to="/register" className="btn btn-surface btn-lg">
              Host an Event
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[["10K+","Events"], ["500K+","Tickets Sold"], ["98%","Satisfaction"]].map(([n, l]) => (
              <div key={l}>
                <span className="hero-stat-number">{n}</span>
                <span className="hero-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo collage */}
        <div className="hero-right">
          <div className="hero-photo-grid">
            {HERO_PHOTOS.map((src, i) => (
              <img key={i} src={src} alt="" loading={i < 2 ? "eager" : "lazy"} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {tickerContent}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="section" id="categories">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <p className="section-eyebrow">Browse by Type</p>
          <h2 className="section-title">FIND WHAT<br />EXCITES YOU</h2>
          <p className="section-sub">Six categories, thousands of experiences — from underground jazz to global tech summits.</p>

          <div className="category-grid">
            {CATEGORIES.map(({ label, icon: Icon, color, rgb, count }) => (
              <Link
                key={label}
                to={`/events?category=${label}`}
                className="category-chip"
                style={{ "--chip-color": color, "--chip-rgb": rgb }}
              >
                <div className="chip-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="chip-label">{label}</div>
                  <div className="chip-count">{count} events</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="section" style={{ paddingTop: "2rem", background: "var(--ink-2)" }} id="events">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p className="section-eyebrow">Hand-picked for you</p>
              <h2 className="section-title">FEATURED<br />EVENTS</h2>
            </div>
            <Link to="/events" className="btn btn-outline" style={{ alignSelf: "flex-end" }}>
              View All <ChevronRight size={15} />
            </Link>
          </div>
          <div className="events-grid">
            {MOCK_EVENTS.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="about">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <p className="section-eyebrow">Simple Process</p>
          <h2 className="section-title" style={{ marginBottom: "3rem" }}>HOW IT<br />WORKS</h2>
          <div className="how-grid">
            {HOW_STEPS.map(({ icon: Icon, num, title, desc }) => (
              <div className="how-step" key={title}>
                <span className="how-step-num">{num}</span>
                <div className="how-step-icon"><Icon size={22} /></div>
                <div className="how-step-title">{title}</div>
                <p className="how-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <div className="cta-band">
        <div className="cta-band-text">
          <h2 className="cta-band-title">NEVER MISS<br />AN EVENT</h2>
          <p className="cta-band-sub">Weekly picks, exclusive offers, zero spam.</p>
        </div>
        <form
          className="cta-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input type="email" placeholder="your@email.com" />
          <button type="submit">
            <Mail size={14} style={{ marginRight: 6 }} />
            Subscribe
          </button>
        </form>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">Event<em>Flow</em></div>
        <p className="footer-copy">© 2025 EventFlow · CountryEdu Private Limited</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
```

## src\pages\admin\AdminPanel.jsx

```jsx
// src/pages/admin/AdminPanel.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Users, Calendar, BarChart, Settings, LogOut,
  Ticket, ArrowUpRight, RefreshCw,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";

const ROLE_TAG   = { user:"tag-muted", organizer:"tag-gold", admin:"tag-coral" };
const STATUS_TAG = { active:"tag-green", ended:"tag-muted", draft:"tag-gold" };
const getStatus  = (date) => (new Date(date) > new Date() ? "active" : "ended");

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get("/api/admin/stats/").catch(() => ({ data: null })),
      axios.get("/api/admin/users/").catch(() => ({ data: [] })),
      axios.get("/api/admin/events/").catch(() => ({ data: [] })),
    ]).then(([s, u, e]) => {
      setStats(s.data);
      setUsers((u.data || []).slice(0, 5));
      setEvents((e.data || []).slice(0, 5));
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try { await axios.delete(`/api/admin/users/${id}/`); setUsers(p => p.filter(u => u.id !== id)); }
    catch { alert("Could not delete user."); }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Permanently delete this event?")) return;
    try { await axios.delete(`/api/events/${id}/`); setEvents(p => p.filter(e => e.id !== id)); }
    catch { alert("Could not delete event."); }
  };

  const nav = [
    { to:"/admin",          icon:LayoutDashboard, label:"Dashboard",     active:true },
    { to:"/admin/users",    icon:Users,           label:"Manage Users"   },
    { to:"/admin/events",   icon:Calendar,        label:"Manage Events"  },
    { to:"/admin/bookings", icon:Ticket,          label:"Bookings"       },
    { to:"#",               icon:BarChart,        label:"Reports"        },
    { to:"#",               icon:Settings,        label:"Settings"       },
  ];

  const statCards = [
    { label:"Total Users",    value: stats?.total_users    ?? "—", sub:"Registered accounts", accent:"#60a5fa" },
    { label:"Total Events",   value: stats?.total_events   ?? "—", sub:"All time",            accent:"#34d399" },
    { label:"Total Bookings", value: stats?.total_bookings ?? "—", sub:"All time",            accent:"#c8a96e" },
    { label:"Active Events",  value: events.filter(e => getStatus(e.date) === "active").length, sub:"Currently running", accent:"#a78bfa" },
  ];

  const row = { padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const box = { background:"var(--ink-3)", border:"1px solid var(--border)", borderRadius:"var(--r-md)", marginBottom:"2rem", overflow:"hidden" };

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Admin</span>
          {nav.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active?"active":""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"#dc2626" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}><LogOut size={14} /></button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">ADMIN CONTROL PANEL</h1>
            <p className="page-subtitle">{new Date().toLocaleString()}</p>
          </div>
          <div style={{ display:"flex", gap:".75rem" }}>
            <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
              <RefreshCw size={13} /> Refresh
            </button>
            <Link to="/admin/users"  className="btn btn-outline btn-sm"><Users size={13} /> Users</Link>
            <Link to="/admin/events" className="btn btn-primary btn-sm"><Calendar size={13} /> Events</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statCards.map(({ label, value, sub, accent }) => (
            <div className="stat-card" key={label} style={{ "--stat-accent": accent }}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{loading ? "—" : value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div style={box}>
          <div style={row}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.05rem", letterSpacing:"0.04em", color:"var(--white)" }}>RECENT USERS</h3>
            <Link to="/admin/users" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem" }}>Manage All <ArrowUpRight size={13} /></Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan="4" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                  : users.length === 0
                    ? <tr><td colSpan="4" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>No users found.</td></tr>
                    : users.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight:600, color:"var(--white)" }}>{u.name || "—"}</td>
                        <td style={{ color:"var(--muted)", fontSize:".82rem" }}>{u.email}</td>
                        <td><span className={`tag ${ROLE_TAG[u.role]||"tag-muted"}`}>{u.role}</span></td>
                        <td>
                          <div style={{ display:"flex", gap:".4rem" }}>
                            <button className="btn btn-ghost btn-sm" style={{ fontSize:".78rem" }}>Edit</button>
                            <button className="btn btn-ghost btn-sm" style={{ fontSize:".78rem", color:"#f87171" }} onClick={() => deleteUser(u.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Events table */}
        <div style={box}>
          <div style={row}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.05rem", letterSpacing:"0.04em", color:"var(--white)" }}>RECENT EVENTS</h3>
            <Link to="/admin/events" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem" }}>Manage All <ArrowUpRight size={13} /></Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Booked</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan="6" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                  : events.length === 0
                    ? <tr><td colSpan="6" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>No events found.</td></tr>
                    : events.map(ev => {
                      const st = getStatus(ev.date);
                      return (
                        <tr key={ev.id}>
                          <td style={{ fontWeight:600, color:"var(--white)" }}>{ev.title}</td>
                          <td style={{ fontSize:".82rem" }}>{formatDate(ev.date)}</td>
                          <td style={{ color:"var(--muted)", fontSize:".82rem" }}>{ev.location || "—"}</td>
                          <td><strong>{ev.booked_seats ?? 0}</strong><span style={{ color:"var(--muted)" }}> / {ev.total_seats}</span></td>
                          <td><span className={`tag ${STATUS_TAG[st]||"tag-muted"}`}>{st}</span></td>
                          <td>
                            <div style={{ display:"flex", gap:".4rem" }}>
                              <Link to={`/events/${ev.id}`} className="btn btn-ghost btn-sm" style={{ fontSize:".78rem" }}>View</Link>
                              <button className="btn btn-ghost btn-sm" style={{ fontSize:".78rem", color:"#f87171" }} onClick={() => deleteEvent(ev.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## src\pages\admin\ManageBookings.jsx

```jsx
// src/pages/admin/ManageBookings.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, Calendar, BarChart, Settings, LogOut,
         Search, Download, Ticket } from "lucide-react";
import axios from "axios";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

const MOCK = [
  { id: 1, user_name: "Alex Chen",  event_title: "TechConf Summit",       status: "confirmed", booked_at: "2025-04-08T10:00:00Z" },
  { id: 2, user_name: "Priya Shah", event_title: "Neon Beats Festival",   status: "confirmed", booked_at: "2025-04-09T14:30:00Z" },
  { id: 3, user_name: "Marcus J.",  event_title: "Urban Marathon",         status: "cancelled", booked_at: "2025-04-07T09:15:00Z" },
  { id: 4, user_name: "Sarah K.",   event_title: "Digital Art Expo 2025", status: "confirmed", booked_at: "2025-04-10T16:00:00Z" },
];

export default function ManageBookings() {
  const { user, logout } = useAuth();
  const name = user?.name || "Admin";

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    axios.get("/api/admin/bookings/", authHeaders())
      .then(r => setBookings(r.data))
      .catch(() => setBookings(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b =>
    (b.user_name  || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.event_title || "").toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      ["ID", "User Name", "Event Title", "Status", "Booked At"],
      ...bookings.map(b => [
        b.id,
        `"${b.user_name}"`,
        `"${b.event_title}"`,
        b.status,
        `"${new Date(b.booked_at).toLocaleDateString()}"`,
      ]),
    ];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "eventflow_bookings.csv";
    a.click();
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          {[
            { to: "/admin",          icon: LayoutDashboard, label: "Dashboard" },
            { to: "/admin/users",    icon: Users,            label: "Manage Users" },
            { to: "/admin/events",   icon: Calendar,         label: "Manage Events" },
            { to: "/admin/bookings", icon: Ticket,           label: "Manage Bookings", active: true },
            { to: "#",               icon: BarChart,         label: "Reports" },
            { to: "#",               icon: Settings,         label: "Settings" },
          ].map(({ to, icon: Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={17} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: "#dc2626" }}>{name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: ".83rem", fontWeight: 600 }}>{name}</div>
            <span className="badge badge-red" style={{ fontSize: ".65rem" }}>Admin</span>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Bookings</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} booking${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        <div className="page-content">
          {/* Search */}
          <div style={{ position: "relative", maxWidth: 360, marginBottom: "1.5rem" }}>
            <Search size={15} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            <input
              className="form-control"
              placeholder="Search by user or event…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Event Title</th>
                    <th>Status</th>
                    <th>Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Loading…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-text-muted)" }}>
                        <Ticket size={32} style={{ marginBottom: ".75rem", opacity: .3, display: "block", margin: "0 auto .75rem" }} />
                        No bookings matching &ldquo;{search}&rdquo;
                      </td>
                    </tr>
                  ) : filtered.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: "var(--color-text-muted)", fontSize: ".82rem" }}>#{b.id}</td>
                      <td style={{ fontWeight: 600 }}>{b.user_name}</td>
                      <td>{b.event_title}</td>
                      <td>
                        <span className={`badge ${b.status === "confirmed" ? "badge-green" : "badge-red"}`}>
                          {b.status === "confirmed" ? "✅ Confirmed" : "❌ Cancelled"}
                        </span>
                      </td>
                      <td style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>
                        {new Date(b.booked_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## src\pages\admin\ManageEvents.jsx

```jsx
// src/pages/admin/ManageEvents.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Users, Calendar, BarChart, Ticket,
  Settings, LogOut, Search, Download, Eye, Trash2,
} from "lucide-react";
import { formatDate, statusColor } from "../../utils/helpers";

const STATUS_TAG = { active:"tag-green", ended:"tag-muted", draft:"tag-gold" };
const getStatus  = (date) => (new Date(date) > new Date() ? "active" : "ended");

const MOCK = [
  { id:1, title:"DevConf 2025",            organizer_id:1, date:"2025-09-10", location:"Chicago",  booked_seats:127, total_seats:200 },
  { id:2, title:"Neon Beats Music Festival", organizer_id:2, date:"2025-07-12", location:"NYC",     booked_seats:980, total_seats:1500 },
  { id:3, title:"Old Tech Summit",           organizer_id:1, date:"2024-11-05", location:"Online",  booked_seats:43,  total_seats:100 },
];

export default function ManageEvents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    axios.get("/api/admin/events/")
      .then(r => { setEvents(r.data); setLoading(false); })
      .catch(() => { setEvents(MOCK); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this event?")) return;
    try {
      await axios.delete(`/api/events/${id}/`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { alert("Could not delete event."); }
  };

  const exportCSV = () => {
    const rows = [["ID","Title","Date","Location","Booked","Total"],
      ...events.map(e => [e.id, `"${e.title}"`, e.date, `"${e.location||""}"`, e.booked_seats||0, e.total_seats])];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = encodeURI(csv);
    a.download = "eventflow_events.csv"; a.click();
  };

  const filtered = events.filter(e =>
    (e.title    || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const nav = [
    { to:"/admin",          icon:LayoutDashboard, label:"Dashboard"    },
    { to:"/admin/users",    icon:Users,           label:"Manage Users"  },
    { to:"/admin/events",   icon:Calendar,        label:"Manage Events", active:true },
    { to:"/admin/bookings", icon:Ticket,          label:"Bookings"      },
    { to:"#",               icon:BarChart,        label:"Reports"       },
    { to:"#",               icon:Settings,        label:"Settings"      },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Admin</span>
          {nav.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active?"active":""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"#dc2626" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">MANAGE EVENTS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} event${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Search */}
        <div style={{ position:"relative", maxWidth:380, marginBottom:"1.5rem" }}>
          <Search size={14} style={{ position:"absolute", left:".85rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted)" }} />
          <input
            className="form-control" placeholder="Search by title or location…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:"2.25rem" }}
          />
        </div>

        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", overflow:"hidden"
        }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Date</th><th>Location</th><th>Booked / Total</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>Loading events…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>No events found.</td></tr>
                ) : filtered.map(ev => {
                  const st = getStatus(ev.date);
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{ev.title}</td>
                      <td style={{ fontSize:".82rem" }}>{formatDate(ev.date)}</td>
                      <td style={{ color:"var(--muted)", fontSize:".82rem" }}>{ev.location || "—"}</td>
                      <td>
                        <strong>{ev.booked_seats ?? 0}</strong>
                        <span style={{ color:"var(--muted)" }}> / {ev.total_seats}</span>
                      </td>
                      <td><span className={`tag ${STATUS_TAG[st] || "tag-muted"}`}>{st}</span></td>
                      <td>
                        <div style={{ display:"flex", gap:".4rem" }}>
                          <Link to={`/events/${ev.id}`} className="btn btn-ghost btn-sm" title="View" style={{ padding:"5px 8px" }}>
                            <Eye size={13} />
                          </Link>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Delete"
                            style={{ padding:"5px 8px", color:"#f87171" }}
                            onClick={() => handleDelete(ev.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## src\pages\admin\ManageUsers.jsx

```jsx
// src/pages/admin/ManageUsers.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Users, Calendar, BarChart, Ticket,
  Settings, LogOut, Search, Download, Shield, Trash2,
} from "lucide-react";
import { formatDate, roleColor } from "../../utils/helpers";

const ROLE_TAG = { user:"tag-muted", organizer:"tag-gold", admin:"tag-coral" };

const MOCK = [
  { id:1, name:"Alex Chen",   email:"alex@ex.com",   role:"user",      joined:"2025-04-08" },
  { id:2, name:"Priya Shah",  email:"priya@ex.com",  role:"organizer", joined:"2025-04-07" },
  { id:3, name:"Marcus J.",   email:"marcus@ex.com", role:"user",      joined:"2025-04-06" },
  { id:4, name:"Sarah K.",    email:"sarah@ex.com",  role:"user",      joined:"2025-03-20" },
  { id:5, name:"Admin User",  email:"admin@ef.com",  role:"admin",     joined:"2025-01-01" },
];

export default function ManageUsers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    axios.get("/api/admin/users/")
      .then(r => { setUsers(r.data); setLoading(false); })
      .catch(() => { setUsers(MOCK); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await axios.delete(`/api/admin/users/${id}/`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert("Could not delete user."); }
  };

  const changeRole = async (id, newRole) => {
    try {
      const res = await axios.put(`/api/auth/profile/`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch { alert("Could not change role."); }
  };

  const exportCSV = () => {
    const rows = [["ID","Name","Email","Role"],
      ...users.map(u => [u.id, `"${u.name}"`, u.email, u.role])];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = encodeURI(csv);
    a.download = "eventflow_users.csv"; a.click();
  };

  const filtered = users.filter(u =>
    (u.name  || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const nav = [
    { to:"/admin",          icon:LayoutDashboard, label:"Dashboard"     },
    { to:"/admin/users",    icon:Users,           label:"Manage Users",  active:true },
    { to:"/admin/events",   icon:Calendar,        label:"Manage Events"  },
    { to:"/admin/bookings", icon:Ticket,          label:"Bookings"       },
    { to:"#",               icon:BarChart,        label:"Reports"        },
    { to:"#",               icon:Settings,        label:"Settings"       },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Admin</span>
          {nav.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active?"active":""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"#dc2626" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">MANAGE USERS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} user${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Search */}
        <div style={{ position:"relative", maxWidth:380, marginBottom:"1.5rem" }}>
          <Search size={14} style={{ position:"absolute", left:".85rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted)" }} />
          <input
            className="form-control" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:"2.25rem" }}
          />
        </div>

        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", overflow:"hidden"
        }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>Loading users…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>No users found matching "{search}"</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight:600, color:"var(--white)" }}>{u.name || "—"}</td>
                    <td style={{ color:"var(--muted)", fontSize:".82rem" }}>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                        style={{
                          background:"var(--ink-4)", border:"1px solid var(--border)",
                          borderRadius:"var(--r-xs)", color:"var(--text)", fontSize:".78rem",
                          padding:"3px 8px", cursor:"pointer"
                        }}
                      >
                        <option value="user">user</option>
                        <option value="organizer">organizer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ fontSize:".82rem", color:"var(--muted)" }}>
                      {u.joined ? formatDate(u.joined) : "—"}
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:".4rem" }}>
                        <button className="btn btn-ghost btn-sm" title="Change Role" style={{ fontSize:".78rem" }}>
                          <Shield size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          title="Delete User"
                          style={{ fontSize:".78rem", color:"#f87171" }}
                          onClick={() => handleDelete(u.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## src\pages\auth\Login.jsx

```jsx
// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { motion } from "framer-motion";

const ROLE_REDIRECT = { user: "/dashboard", organizer: "/organizer", admin: "/admin" };

export default function Login() {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const justRegistered = location.state?.registered;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user, data.token);
      const dest = ROLE_REDIRECT[data.user?.role] || "/dashboard";
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const slideIn = {
    hidden:  { opacity: 0, x: 30, filter: "blur(4px)" },
    visible: {
      opacity: 1, x: 0, filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, when: "beforeChildren" },
    },
  };
  const item = {
    hidden:  { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="auth-layout" style={{ paddingTop: 0 }}>
      <ThemeToggle fixed />

      {/* Visual panel */}
      <div className="auth-visual">
        <Link to="/" className="auth-visual-brand">Event<em>Flow</em></Link>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>
          <h2 className="auth-visual-headline">
            Discover.<br />Book.<br /><em>Experience.</em>
          </h2>
          <p className="auth-visual-body">
            Join 500,000+ event-goers who trust EventFlow to find and book
            the best experiences around the world.
          </p>
        </motion.div>

        <motion.div className="auth-stats"
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ duration:0.6, delay:0.15, ease:[0.22,1,0.36,1] }}>
          {[["10K+","Events"],["500K+","Users"],["98%","Satisfaction"]].map(([n,l]) => (
            <div key={l}>
              <span className="auth-stat-num">{n}</span>
              <span className="auth-stat-lbl">{l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Form panel */}
      <motion.div className="auth-form-panel" variants={slideIn} initial="hidden" animate="visible">
        <div style={{ maxWidth:400, width:"100%", margin:"0 auto" }}>
          <motion.h2 variants={item} className="auth-form-title">WELCOME BACK</motion.h2>
          <motion.p variants={item} className="auth-form-sub">
            No account?{" "}<Link to="/register">Create one free</Link>
          </motion.p>

          {justRegistered && (
            <motion.div variants={item} className="alert alert-success" style={{ marginBottom:"1.25rem" }}>
              <CheckCircle size={15} /> Account created! Sign in to continue.
            </motion.div>
          )}

          {error && (
            <motion.div variants={item} className="alert alert-error" style={{ marginBottom:"1.25rem" }}>
              <AlertCircle size={15} /> {error}
            </motion.div>
          )}

          <motion.form variants={item} onSubmit={submit} className="form-stack">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                name="email" type="email" className="form-control"
                placeholder="you@example.com"
                value={form.email} onChange={handle} required autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:"relative" }}>
                <input
                  name="password" type={showPw ? "text" : "password"}
                  className="form-control" placeholder="••••••••"
                  value={form.password} onChange={handle} required
                  style={{ paddingRight:"3rem" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position:"absolute", right:"1rem", top:"50%",
                  transform:"translateY(-50%)", color:"var(--muted)"
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <label style={{ display:"flex", alignItems:"center", gap:".5rem", fontSize:".8rem", color:"var(--muted)", cursor:"pointer" }}>
                <input type="checkbox" style={{ accentColor:"var(--gold)" }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize:".8rem", color:"var(--gold)" }}>Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading
                ? <><span className="loading-spinner" /> Signing in…</>
                : <><ArrowRight size={16} /> Sign In</>
              }
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
```

## src\pages\auth\Register.jsx

```jsx
// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser, loginUser } from "../../api/auth";
import { Eye, EyeOff, ArrowRight, AlertCircle, Users, Calendar, Shield } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { motion } from "framer-motion";

const ROLE_OPTIONS = [
  { value: "user",      Icon: Users,    label: "User",      desc: "Browse & book events" },
  { value: "organizer", Icon: Calendar, label: "Organizer", desc: "Create & manage events" },
  { value: "admin",     Icon: Shield,   label: "Admin",     desc: "Manage platform" },
];

export default function Register() {
  const [form, setForm]     = useState({ name: "", email: "", password: "", role: "user" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
  const { login } = useAuth();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      const { data } = await loginUser({ email: form.email, password: form.password });
      login(data.user, data.token);
      
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "organizer") navigate("/organizer");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const slideIn = {
    hidden: { opacity: 0, x: 30, filter: "blur(4px)" },
    visible: { 
      opacity: 1, x: 0, filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, when: "beforeChildren" }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="auth-layout" style={{ paddingTop: 0 }}>
      {/* Floating theme toggle */}
      <ThemeToggle fixed />
      {/* Visual panel */}
      <div className="auth-visual">
        <Link to="/" className="auth-visual-brand">Event<em>Flow</em></Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="auth-visual-headline">
            Start Your<br /><em>Journey</em><br />Today.
          </h2>
          <p className="auth-visual-body">
            Create an account to book events, manage registrations,
            or list your own experiences on the world's premier event platform.
          </p>
        </motion.div>

        {/* Role features */}
        <motion.div 
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {ROLE_OPTIONS.map(({ value, Icon, label, desc }) => (
            <div
              key={value}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                background: form.role === value ? "rgba(200,169,110,0.1)" : "transparent",
                border: `1px solid ${form.role === value ? "rgba(200,169,110,0.3)" : "var(--border)"}`,
                borderRadius: "var(--r-sm)", padding: "0.875rem 1rem",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "6px",
                background: "rgba(200,169,110,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--gold)", flexShrink: 0,
              }}>
                <Icon size={16} />
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--white)" }}>{label}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Form panel */}
      <motion.div 
        className="auth-form-panel"
        variants={slideIn}
        initial="hidden"
        animate="visible"
      >
        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
          <motion.h2 variants={item} className="auth-form-title">CREATE ACCOUNT</motion.h2>
          <motion.p variants={item} className="auth-form-sub">
            Already have one?{" "}
            <Link to="/login">Sign in</Link>
          </motion.p>

          {error && (
            <motion.div variants={item} className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
              <AlertCircle size={15} /> {error}
            </motion.div>
          )}

          <motion.form variants={item} onSubmit={submit} className="form-stack">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name" type="text" className="form-control"
                placeholder="Your full name"
                value={form.name} onChange={handle} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email" type="email" className="form-control"
                placeholder="you@example.com"
                value={form.email} onChange={handle} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  name="password" type={showPw ? "text" : "password"}
                  className="form-control" placeholder="Min. 8 characters"
                  value={form.password} onChange={handle} required minLength={8}
                  style={{ paddingRight: "3rem" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "1rem", top: "50%",
                    transform: "translateY(-50%)", color: "var(--muted)" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select name="role" className="form-control" value={form.role} onChange={handle}>
                <option value="user">User — Attend events</option>
                <option value="organizer">Organizer — Host events</option>
                <option value="admin">Admin — Manage platform</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading
                ? <><span className="loading-spinner" /> Creating account…</>
                : <><ArrowRight size={16} /> Create Account</>
              }
            </button>

            <p style={{ fontSize: ".75rem", color: "var(--muted)", textAlign: "center", marginTop: "1rem" }}>
              By creating an account, you agree to our{" "}
              <a href="#" style={{ color: "var(--gold)" }}>Terms of Service</a> and{" "}
              <a href="#" style={{ color: "var(--gold)" }}>Privacy Policy</a>.
            </p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
```

## src\pages\organizer\CreateEvent.jsx

```jsx
// src/pages/organizer/CreateEvent.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createEvent } from "../../api/events";
import { LayoutDashboard, Plus, Users, BarChart2, Settings, LogOut,
         Upload, Check, ArrowRight, ArrowLeft, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Music","Tech","Sports","Food","Art","Business","Conference","Workshop","Other"];
const STEPS = ["Basic Info","Date & Venue","Tickets","Review & Publish"];

export default function CreateEvent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:"", category:"", description:"", tags:"",
    date:"", time:"", venue:"", city:"", address:"",
    price:"", total_tickets:"", ticket_name:"General Admission",
  });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const name = user?.name || "Organizer";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title:       form.title,
        description: form.description,
        category:    form.category,
        location:    form.venue ? `${form.venue}, ${form.city}` : form.city,
        date:        `${form.date}T${form.time || "18:00"}:00`,
        price:       Number(form.price) || 0,
        total_seats: Number(form.total_tickets) || 100,
        image_url:   form.image_url || null,
      };
      await createEvent(payload);
      navigate("/organizer");
    } catch {
      alert("Error creating event. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <Link to="/organizer" className="sidebar-nav-link"><LayoutDashboard size={17} /> Dashboard</Link>
          <Link to="/organizer/create" className="sidebar-nav-link active"><Plus size={17} /> Create Event</Link>
          <Link to="/organizer/registrations" className="sidebar-nav-link"><Users size={17} /> Registrations</Link>
          <Link to="#" className="sidebar-nav-link"><BarChart2 size={17} /> Analytics</Link>
          <Link to="#" className="sidebar-nav-link"><Settings size={17} /> Settings</Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"var(--color-accent)" }}>{name[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontSize:".83rem", fontWeight:600 }}>{name}</div>
            <span className="badge badge-amber" style={{ fontSize:".65rem" }}>Organizer</span>
          </div>
          <button onClick={logout} style={{ background:"none", border:"none", cursor:"pointer", color:"#475569" }}><LogOut size={15} /></button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Create New Event</h1>
            <p className="page-subtitle">Fill in the details to publish your event</p>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color:"var(--color-text-muted)" }}>Save Draft</button>
        </div>

        <div className="page-content">
          {/* Step progress */}
          <div className="steps-bar" style={{ marginBottom:"2.5rem" }}>
            {STEPS.map((label, i) => (
              <div key={label} className="step-item">
                <div className="step-col">
                  <div className={`step-circle ${i<step?"done":i===step?"active":"pending"}`}>
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <div className={`step-label ${i<step?"done":i===step?"active":"pending"}`}>{label}</div>
                </div>
                {i < STEPS.length-1 && <div className={`step-connector ${i<step?"done":""}`} style={{ margin:"0 .5rem", marginBottom:"1.2rem" }} />}
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:"2rem", alignItems:"flex-start", flexWrap:"wrap" }}>
            {/* Form */}
            <div className="card card-body" style={{ flex:1, minWidth:300 }}>
              {step === 0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                  <h3 style={{ marginBottom:".25rem" }}>Basic Information</h3>
                  <div className="form-group">
                    <label className="form-label">Event Title *</label>
                    <input name="title" className="form-control" placeholder="e.g. Annual Tech Conference 2025"
                      value={form.title} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select name="category" className="form-control" value={form.category} onChange={handle}>
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea name="description" className="form-control" rows={5}
                      placeholder="Describe your event in detail — agenda, speakers, what to expect…"
                      value={form.description} onChange={handle} style={{ resize:"vertical" }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Banner Image</label>
                    <div className="upload-zone">
                      <div className="upload-icon"><Upload size={32} /></div>
                      <p style={{ fontWeight:600, marginBottom:".3rem" }}>Drop image here or click to upload</p>
                      <p style={{ fontSize:".8rem", color:"var(--color-text-muted)" }}>PNG, JPG, WEBP up to 5MB. Recommended: 1200×630px</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags <span style={{ color:"var(--color-text-muted)", fontWeight:400 }}>(comma-separated)</span></label>
                    <input name="tags" className="form-control" placeholder="music, festival, live, outdoor"
                      value={form.tags} onChange={handle} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                  <h3>Date & Venue</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Date *</label>
                      <input name="date" type="date" className="form-control" value={form.date} onChange={handle} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time *</label>
                      <input name="time" type="time" className="form-control" value={form.time} onChange={handle} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Venue Name *</label>
                    <input name="venue" className="form-control" placeholder="e.g. Javits Convention Center"
                      value={form.venue} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" className="form-control" placeholder="e.g. New York City"
                      value={form.city} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address</label>
                    <input name="address" className="form-control" placeholder="Street address, zip code"
                      value={form.address} onChange={handle} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                  <h3>Ticket Settings</h3>
                  <div className="form-group">
                    <label className="form-label">Ticket Name</label>
                    <input name="ticket_name" className="form-control" value={form.ticket_name} onChange={handle} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Price (USD) <span style={{ fontWeight:400, color:"var(--color-text-muted)" }}>— 0 for free</span></label>
                      <input name="price" type="number" min="0" className="form-control" placeholder="0.00"
                        value={form.price} onChange={handle} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Total Tickets Available</label>
                      <input name="total_tickets" type="number" min="1" className="form-control" placeholder="100"
                        value={form.total_tickets} onChange={handle} />
                    </div>
                  </div>
                  <div className="alert alert-warning">
                    💡 Set price to <strong>0</strong> for a free event. Tickets will be distributed on first-come, first-served basis.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ marginBottom:"1.5rem" }}>Review & Publish</h3>
                  {[
                    { label:"Title", value:form.title || "—" },
                    { label:"Category", value:form.category || "—" },
                    { label:"Date", value:form.date ? `${form.date} at ${form.time}` : "—" },
                    { label:"Venue", value:form.venue ? `${form.venue}, ${form.city}` : "—" },
                    { label:"Price", value:form.price ? `$${form.price}` : "Free" },
                    { label:"Tickets", value:form.total_tickets || "100" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display:"flex", gap:"1rem", padding:".65rem 0", borderBottom:"1px solid var(--color-border)" }}>
                      <span style={{ width:110, color:"var(--color-text-muted)", fontSize:".85rem", flexShrink:0 }}>{label}</span>
                      <span style={{ fontWeight:600, fontSize:".9rem" }}>{value}</span>
                    </div>
                  ))}
                  {form.description && (
                    <div style={{ marginTop:"1rem" }}>
                      <div style={{ color:"var(--color-text-muted)", fontSize:".85rem", marginBottom:".4rem" }}>Description</div>
                      <p style={{ fontSize:".875rem", lineHeight:1.7 }}>{form.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"2rem", paddingTop:"1.25rem", borderTop:"1px solid var(--color-border)" }}>
                <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0}>
                  <ArrowLeft size={15} /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button className="btn btn-primary" onClick={() => setStep(s => s+1)}>
                    Next Step <ArrowRight size={15} />
                  </button>
                ) : (
                  <button className="btn btn-accent btn-lg" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Publishing…" : "🚀 Publish Event"}
                  </button>
                )}
              </div>
            </div>

            {/* Preview card */}
            <div style={{ width:260, flexShrink:0 }}>
              <p style={{ fontSize:".8rem", color:"var(--color-text-muted)", marginBottom:".75rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>
                <Eye size={13} style={{ display:"inline", marginRight:".35rem" }} /> Live Preview
              </p>
              <div className="card">
                <div style={{ height:130, background:"linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {form.category && <span className="badge badge-amber">{form.category}</span>}
                </div>
                <div style={{ padding:"1rem" }}>
                  <div style={{ fontWeight:700, fontSize:".9rem", marginBottom:".5rem" }}>{form.title || "Event Title"}</div>
                  <div style={{ fontSize:".78rem", color:"var(--color-text-muted)", marginBottom:".3rem" }}>📅 {form.date || "Date TBA"}</div>
                  <div style={{ fontSize:".78rem", color:"var(--color-text-muted)" }}>📍 {form.venue || "Venue TBA"}</div>
                  <div style={{ marginTop:".75rem", fontWeight:700, color:"var(--color-primary)", fontSize:".9rem" }}>
                    {form.price ? `$${form.price}` : "Free"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## src\pages\organizer\ManageRegistrations.jsx

```jsx
// src/pages/organizer/ManageRegistrations.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Plus, Users, BarChart2,
  Settings, LogOut, Download, Search, CheckCircle, XCircle, Clock,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";

const STATUS_TAG  = { confirmed:"tag-green", pending:"tag-gold", cancelled:"tag-coral" };
const STATUS_ICON = { confirmed:CheckCircle, pending:Clock, cancelled:XCircle };

const MOCK = [
  { id:1, user_name:"Alex Chen",  user_id:1, event_title:"DevConf 2025",       booked_at:"2025-04-08T10:00:00Z", status:"confirmed" },
  { id:2, user_name:"Priya Shah", user_id:2, event_title:"UX Design Workshop", booked_at:"2025-04-09T14:30:00Z", status:"confirmed" },
  { id:3, user_name:"Marcus J.",  user_id:3, event_title:"DevConf 2025",       booked_at:"2025-04-10T09:15:00Z", status:"pending"   },
  { id:4, user_name:"Sarah K.",   user_id:4, event_title:"Open Source Summit", booked_at:"2025-04-06T11:00:00Z", status:"cancelled"  },
];

export default function ManageRegistrations() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Organizer";

  const [regs,    setRegs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    // Use admin bookings endpoint — organizers see all bookings for their events
    // (backend could filter by organizer, but for now we use admin endpoint as fallback)
    axios.get("/api/admin/bookings/")
      .then(r => {
        const mine = user?.id
          ? r.data  // ideally filter by organizer_id if backend supports it
          : r.data;
        setRegs(mine);
        setLoading(false);
      })
      .catch(() => { setRegs(MOCK); setLoading(false); });
  }, [user?.id]);

  const filtered = regs.filter(r => {
    const matchSearch =
      (r.user_name   || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.event_title || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const exportCSV = () => {
    const rows = [["ID","User","Event","Status","Booked At"],
      ...regs.map(r => [r.id, `"${r.user_name}"`, `"${r.event_title}"`, r.status, new Date(r.booked_at).toLocaleDateString()])];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = encodeURI(csv);
    a.download = "registrations.csv"; a.click();
  };

  const counts = {
    all:       regs.length,
    confirmed: regs.filter(r => r.status === "confirmed").length,
    pending:   regs.filter(r => r.status === "pending").length,
    cancelled: regs.filter(r => r.status === "cancelled").length,
  };

  const nav = [
    { to:"/organizer",               icon:LayoutDashboard, label:"Dashboard"      },
    { to:"/organizer/create",        icon:Plus,            label:"Create Event"   },
    { to:"/organizer/registrations", icon:Users,           label:"Registrations", active:true },
    { to:"#",                        icon:BarChart2,       label:"Analytics"      },
    { to:"#",                        icon:Settings,        label:"Settings"       },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Organizer</span>
          {nav.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active?"active":""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"var(--coral)" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Organizer</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">REGISTRATIONS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} registration${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Filter tabs + search row */}
        <div style={{ display:"flex", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", gap:".4rem" }}>
            {["all","confirmed","pending","cancelled"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter===f?"btn-primary":"btn-ghost"}`}
                style={{ textTransform:"capitalize" }}
              >
                {f} <span style={{ opacity:.6, marginLeft:".3rem", fontSize:".78em" }}>({counts[f]})</span>
              </button>
            ))}
          </div>
          <div style={{ position:"relative", maxWidth:300, flex:1 }}>
            <Search size={14} style={{ position:"absolute", left:".85rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted)" }} />
            <input
              className="form-control" placeholder="Search by name or event…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft:"2.25rem" }}
            />
          </div>
        </div>

        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", overflow:"hidden"
        }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Attendee</th><th>Event</th><th>Booked At</th><th>Status</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>Loading registrations…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign:"center", padding:"3rem" }}>
                      <Users size={28} style={{ opacity:.25, display:"block", margin:"0 auto .75rem" }} />
                      <span style={{ color:"var(--muted)", fontSize:".85rem" }}>
                        {search ? `No results for "${search}"` : `No ${filter === "all" ? "" : filter + " "}registrations.`}
                      </span>
                    </td>
                  </tr>
                ) : filtered.map(r => {
                  const Icon = STATUS_ICON[r.status] || Clock;
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{r.user_name || "—"}</td>
                      <td style={{ color:"var(--muted)" }}>{r.event_title || "—"}</td>
                      <td style={{ fontSize:".82rem", color:"var(--muted)" }}>
                        {r.booked_at ? new Date(r.booked_at).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "—"}
                      </td>
                      <td>
                        <span className={`tag ${STATUS_TAG[r.status] || "tag-muted"}`} style={{ display:"inline-flex", alignItems:"center", gap:".35rem" }}>
                          <Icon size={11} /> {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## src\pages\organizer\OrganizerDashboard.jsx

```jsx
// src/pages/organizer/OrganizerDashboard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Calendar, Plus, Users, BarChart2,
  Settings, LogOut, Edit, Trash2, Eye, ArrowUpRight,
} from "lucide-react";
import { formatDate, formatPrice } from "../../utils/helpers";

const MOCK_EVENTS = [
  { id:"e1", title:"DevConf 2025",        date:"2025-09-10", location:"Hyatt, Chicago", booked_seats:127, total_seats:200, status:"active" },
  { id:"e2", title:"UX Design Workshop",  date:"2025-07-18", location:"WeWork, NYC",    booked_seats:45,  total_seats:60,  status:"active" },
  { id:"e3", title:"Open Source Summit",  date:"2025-06-30", location:"Online",         booked_seats:322, total_seats:500, status:"ended"  },
  { id:"e4", title:"Blockchain Bootcamp", date:"2025-10-22", location:"SF Hub",         booked_seats:0,   total_seats:80,  status:"draft"  },
];

const STATUS_CLASS = { active:"tag-green", draft:"tag-gold", ended:"tag-muted" };

function getEventStatus(date) {
  const d = new Date(date);
  const now = new Date();
  if (d > now) return "active";
  return "ended";
}

export default function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Organizer";

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/events/")
      .then(r => {
        // Filter to only this organizer's events
        const mine = user?.id
          ? r.data.filter(e => e.organizer_id === user.id)
          : r.data;
        setEvents(mine.length ? mine : r.data.slice(0, 10)); // fallback: show all if organizer_id unknown
        setLoading(false);
      })
      .catch(() => { setEvents(MOCK_EVENTS); setLoading(false); });
  }, [user?.id]);

  const totalSeats   = events.reduce((s, e) => s + (e.total_seats  || 0), 0);
  const totalBooked  = events.reduce((s, e) => s + (e.booked_seats || 0), 0);
  const activeEvents = events.filter(e => new Date(e.date) > new Date()).length;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/events/${id}/`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { alert("Could not delete event. You may not have permission."); }
  };

  const doLogout = () => { logout(); navigate("/"); };

  const navLinks = [
    { to:"/organizer",               icon:LayoutDashboard, label:"Dashboard",     active:true },
    { to:"/organizer/create",        icon:Plus,            label:"Create Event"  },
    { to:"/organizer/registrations", icon:Users,           label:"Registrations" },
    { to:"#",                        icon:BarChart2,       label:"Analytics"     },
    { to:"#",                        icon:Settings,        label:"Settings"      },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Organizer</span>
          {navLinks.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"var(--coral)" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Organizer</div>
          </div>
          <button onClick={doLogout} style={{ color:"var(--muted)" }}><LogOut size={14} /></button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">ORGANIZER DASHBOARD</h1>
            <p className="page-subtitle">Manage your events and track registrations</p>
          </div>
          <Link to="/organizer/create" className="btn btn-primary">
            <Plus size={15} /> Create Event
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label:"My Events",          value: loading ? "—" : events.length, sub:`${activeEvents} upcoming`,   accent:"#60a5fa" },
            { label:"Total Registrations",value: loading ? "—" : totalBooked,   sub:"Across all events",          accent:"#c8a96e" },
            { label:"Capacity Used",      value: loading ? "—" : (totalSeats ? `${Math.round(totalBooked/totalSeats*100)}%` : "—"), sub:"Average fill rate", accent:"#34d399" },
            { label:"Upcoming",           value: loading ? "—" : activeEvents,  sub:"Events still to run",        accent:"#a78bfa" },
          ].map(({ label, value, sub, accent }) => (
            <div className="stat-card" key={label} style={{ "--stat-accent": accent }}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", marginBottom:"2rem", overflow:"hidden"
        }}>
          <div style={{
            padding:"1.25rem 1.5rem", borderBottom:"1px solid var(--border)",
            display:"flex", justifyContent:"space-between", alignItems:"center"
          }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.05rem", letterSpacing:"0.04em", color:"var(--white)" }}>
              MY EVENTS
            </h3>
            <Link to="/organizer/create" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem" }}>
              <Plus size={13} /> Add New
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th><th>Date</th><th>Location</th>
                  <th>Booked / Total</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign:"center", padding:"3rem" }}>
                      <Calendar size={28} style={{ opacity:.3, display:"block", margin:"0 auto .75rem" }} />
                      <span style={{ color:"var(--muted)", fontSize:".85rem" }}>No events yet. </span>
                      <Link to="/organizer/create" style={{ color:"var(--gold)", fontSize:".85rem" }}>Create your first →</Link>
                    </td>
                  </tr>
                ) : events.map(ev => {
                  const status = getEventStatus(ev.date);
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{ev.title}</td>
                      <td>{formatDate(ev.date)}</td>
                      <td style={{ color:"var(--muted)" }}>{ev.location || ev.venue || "—"}</td>
                      <td>
                        <span style={{ fontWeight:600 }}>{ev.booked_seats ?? 0}</span>
                        <span style={{ color:"var(--muted)" }}> / {ev.total_seats ?? "—"}</span>
                      </td>
                      <td>
                        <span className={`tag ${STATUS_CLASS[status] || "tag-muted"}`}>{status}</span>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:".4rem" }}>
                          <Link to={`/events/${ev.id}`} className="btn btn-ghost btn-sm" title="View" style={{ padding:"5px 8px" }}>
                            <Eye size={13} />
                          </Link>
                          <button className="btn btn-ghost btn-sm" title="Edit" style={{ padding:"5px 8px" }}>
                            <Edit size={13} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Delete"
                            onClick={() => handleDelete(ev.id)}
                            style={{ padding:"5px 8px", color:"#f87171" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          <Link to="/organizer/create" className="btn btn-primary" style={{ flex:"1 1 200px", justifyContent:"center" }}>
            <Plus size={15} /> Create New Event
          </Link>
          <Link to="/organizer/registrations" className="btn btn-outline" style={{ flex:"1 1 200px", justifyContent:"center" }}>
            <Users size={15} /> View Registrations <ArrowUpRight size={13} />
          </Link>
        </div>
      </main>
    </div>
  );
}
```

## src\pages\user\BookingHistory.jsx

```jsx
// src/pages/user/BookingHistory.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Calendar, BookOpen, User, LogOut,
  Ticket, MapPin, Clock, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";

const MOCK = [
  { id:"b1", event_id:1, event_title:"Neon Beats Festival", event_date:"2025-07-12", event_location:"MSG, NYC",       status:"confirmed" },
  { id:"b2", event_id:2, event_title:"TechConf Summit",      event_date:"2025-08-03", event_location:"Moscone, SF",   status:"pending"   },
  { id:"b3", event_id:3, event_title:"Urban Marathon",        event_date:"2025-06-22", event_location:"Central Park", status:"confirmed" },
  { id:"b4", event_id:4, event_title:"Art Expo 2025",         event_date:"2025-09-05", event_location:"MoMA, NYC",    status:"cancelled" },
];

const STATUS_TAG  = { confirmed:"tag-green", pending:"tag-gold", cancelled:"tag-coral" };
const STATUS_ICON = { confirmed:CheckCircle, pending:Clock, cancelled:XCircle };

export default function BookingHistory() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "User";

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    axios.get("/api/bookings/me/")
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => { setBookings(MOCK); setLoading(false); });
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.delete(`/api/bookings/${id}/`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status:"cancelled" } : b));
    } catch {
      alert("Could not cancel. Please try again.");
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all:       bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    pending:   bookings.filter(b => b.status === "pending").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  const navItems = [
    { to:"/dashboard",   icon:LayoutDashboard, label:"Dashboard"    },
    { to:"/events",      icon:Calendar,         label:"Browse Events"},
    { to:"/my-bookings", icon:BookOpen,          label:"My Bookings", active:true },
    { to:"/profile",     icon:User,              label:"Profile"     },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Main</span>
          {navItems.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">User</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">MY BOOKINGS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Link to="/events" className="btn btn-primary">
            <Calendar size={15} /> Browse Events
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:".5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
          {["all", "confirmed", "pending", "cancelled"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
              style={{ textTransform:"capitalize" }}
            >
              {f} <span style={{ opacity:.6, marginLeft:".3rem", fontSize:".78em" }}>({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {loading ? (
          <div style={{
            background:"var(--ink-3)", border:"1px solid var(--border)",
            borderRadius:"var(--r-md)", padding:"3rem", textAlign:"center", color:"var(--muted)"
          }}>
            <Clock size={28} style={{ opacity:.3, display:"block", margin:"0 auto .75rem" }} />
            Loading your bookings…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background:"var(--ink-3)", border:"1px solid var(--border)",
            borderRadius:"var(--r-md)", padding:"3rem", textAlign:"center"
          }}>
            <Ticket size={36} style={{ opacity:.25, display:"block", margin:"0 auto 1rem", color:"var(--gold)" }} />
            <p style={{ color:"var(--muted)", marginBottom:"1rem", fontSize:".9rem" }}>
              {filter === "all" ? "You have no bookings yet." : `No ${filter} bookings.`}
            </p>
            <Link to="/events" className="btn btn-primary btn-sm">Browse Events</Link>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {filtered.map(b => {
              const Icon = STATUS_ICON[b.status] || AlertCircle;
              const isPast = new Date(b.event_date) < new Date();
              return (
                <div
                  key={b.id}
                  style={{
                    background:"var(--ink-3)", border:"1px solid var(--border)",
                    borderRadius:"var(--r-md)", padding:"1.25rem 1.5rem",
                    display:"flex", alignItems:"center", gap:"1.25rem",
                    transition:"border-color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  {/* Icon circle */}
                  <div style={{
                    width:44, height:44, borderRadius:"50%",
                    background:"rgba(200,169,110,0.1)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"var(--gold)", flexShrink:0,
                  }}>
                    <Ticket size={18} />
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, color:"var(--white)", marginBottom:".35rem", fontSize:".95rem" }}>
                      {b.event_title}
                    </div>
                    <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                      {b.event_date && (
                        <span style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"var(--muted)" }}>
                          <Calendar size={11} /> {formatDate(b.event_date)}
                        </span>
                      )}
                      {b.event_location && (
                        <span style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"var(--muted)" }}>
                          <MapPin size={11} /> {b.event_location}
                        </span>
                      )}
                      {b.booked_at && (
                        <span style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"var(--muted)" }}>
                          <Clock size={11} /> Booked {new Date(b.booked_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`tag ${STATUS_TAG[b.status] || "tag-muted"}`} style={{ display:"inline-flex", alignItems:"center", gap:".3rem", flexShrink:0 }}>
                    <Icon size={11} /> {b.status}
                  </span>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:".5rem", flexShrink:0 }}>
                    <Link
                      to={`/events/${b.event_id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize:".75rem", padding:"5px 12px" }}
                    >
                      View
                    </Link>
                    {b.status !== "cancelled" && !isPast && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleCancel(b.id)}
                        style={{ fontSize:".75rem", padding:"5px 12px", color:"#f87171" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
```

## src\pages\user\EventDetail.jsx

```jsx
// src/pages/user/EventDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getEventById } from "../../api/events";
import { bookEvent } from "../../api/bookings";
import { Calendar, MapPin, Clock, Ticket, Heart, Share2, ChevronLeft, Minus, Plus, Star } from "lucide-react";
import { formatDate, formatTime, formatPrice } from "../../utils/helpers";

const MOCK_EVENT = {
  id: "1", title: "Neon Beats Music Festival 2025", category: "Music",
  date: "2025-07-12T18:00:00", venue: "Madison Square Garden, NYC",
  price: 89, description: "Experience the ultimate music festival featuring world-class artists across 3 stages. Neon Beats 2025 brings together the best in electronic, indie, and pop music for an unforgettable night under the stars. Doors open at 4 PM, headliners from 8 PM. Food vendors, art installations, and VIP lounge available.",
  organizer: "LiveNation Events", available_tickets: 342, tags: ["Music", "Festival", "Live", "NYC"],
  image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
};

export default function EventDetail() {
  const { id } = useParams();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    getEventById(id).then(r => setEvent(r.data)).catch(() => setEvent(MOCK_EVENT));
  }, [id]);

  const handleBook = async () => {
    if (!user) { login(); return; }
    setLoading(true);
    try {
      await bookEvent(id);
      setBooked(true);
    } catch {
      alert("Could not complete booking. Please try again.");
    } finally { setLoading(false); }
  };

  if (!event) return (
    <div>
      <Navbar />
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading event…</div>
    </div>
  );

  const total = (event.price || 0) * qty;

  return (
    <div>
      <Navbar />

      {/* Hero Banner */}
      <div style={{ position: "relative", height: 380, overflow: "hidden" }}>
        <img src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"}
          alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,.9) 0%, rgba(15,23,42,.3) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: "2rem", left: "2rem", right: "2rem" }}>
          <button className="btn btn-ghost btn-sm" style={{ color: "rgba(255,255,255,.8)", marginBottom: "1rem" }}
            onClick={() => navigate(-1)}>
            <ChevronLeft size={16} /> Back to Events
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" }}>
            {event.category && <span className="badge badge-amber">{event.category}</span>}
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: "#fff", fontWeight: 800 }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2rem", display: "flex", gap: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Organizer */}
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "2rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: ".9rem" }}>
              {(event.organizer || "O")[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{event.organizer || "Event Organizer"}</div>
              <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)" }}>Organizer</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "2px solid var(--color-border)", marginBottom: "1.5rem", display: "flex", gap: 0 }}>
            {["description", "schedule", "location"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: ".75rem 1.25rem", border: "none", background: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: ".875rem", textTransform: "capitalize",
                  borderBottom: `2px solid ${tab===t ? "var(--color-primary)" : "transparent"}`,
                  color: tab===t ? "var(--color-primary)" : "var(--color-text-muted)",
                  marginBottom: -2, transition: "all .2s" }}>
                {t}
              </button>
            ))}
          </div>

          {tab === "description" && (
            <div style={{ lineHeight: 1.8, color: "var(--color-text)", fontSize: ".925rem" }}>
              <p>{event.description}</p>
              {event.tags?.length > 0 && (
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                  {event.tags.map(tag => <span key={tag} className="badge badge-blue">{tag}</span>)}
                </div>
              )}
            </div>
          )}
          {tab === "schedule" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { time: "4:00 PM", title: "Doors Open", desc: "Gates and vendor area open" },
                { time: "6:00 PM", title: "Opening Acts", desc: "Local emerging artists" },
                { time: "8:00 PM", title: "Headliner Performance", desc: "Main stage showtime" },
                { time: "11:30 PM", title: "After-party", desc: "VIP lounge and networking" },
              ].map(({ time, title, desc }) => (
                <div key={time} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 70, flexShrink: 0, fontWeight: 700, fontSize: ".82rem", color: "var(--color-primary)", paddingTop: ".2rem" }}>{time}</div>
                  <div style={{ flex: 1, paddingLeft: "1rem", borderLeft: "2px solid var(--color-border)" }}>
                    <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{title}</div>
                    <div style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "location" && (
            <div>
              <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "#e2e8f0", height: 240,
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: ".875rem" }}>
                📍 {event.venue}
              </div>
              <p style={{ marginTop: "1rem", color: "var(--color-text-muted)", fontSize: ".875rem" }}>
                <MapPin size={14} style={{ display: "inline", marginRight: ".35rem" }} />
                {event.venue}
              </p>
            </div>
          )}

          {/* Reviews */}
          <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>Reviews</h3>
            {[{ name: "Alex M.", stars: 5, text: "Absolutely incredible event! Perfect organization." },
              { name: "Priya S.", stars: 4, text: "Great lineup, venue could use more food stalls." }].map(r => (
              <div key={r.name} style={{ padding: "1rem 0", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".4rem" }}>
                  <span style={{ fontWeight: 600, fontSize: ".875rem" }}>{r.name}</span>
                  <span style={{ color: "#f59e0b", fontSize: ".85rem" }}>{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</span>
                </div>
                <p style={{ fontSize: ".85rem", color: "var(--color-text-muted)" }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Booking Card */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <div className="booking-card-sticky">
            <h3 style={{ marginBottom: "1.25rem", fontSize: "1.15rem" }}>Book Tickets</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "1.5rem" }}>
              <div className="event-meta-item"><Calendar size={15} /> {formatDate(event.date)}</div>
              <div className="event-meta-item"><Clock size={15} /> {formatTime(event.date)}</div>
              <div className="event-meta-item"><MapPin size={15} /> {event.venue}</div>
              <div className="event-meta-item"><Ticket size={15} /> {event.available_tickets || "—"} tickets left</div>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Quantity</span>
                <div className="ticket-counter">
                  <button className="ticket-btn" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span className="ticket-count">{qty}</span>
                  <button className="ticket-btn" onClick={() => setQty(q => Math.min(10, q+1))}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--color-text-muted)", fontSize: ".875rem" }}>
                  {formatPrice(event.price)} × {qty}
                </span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--color-primary)" }}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {booked ? (
              <div className="alert alert-success">✅ Booking confirmed! Check your dashboard.</div>
            ) : (
              <>
                <button className="btn btn-accent btn-full btn-lg" onClick={handleBook} disabled={loading}>
                  <Ticket size={17} /> {loading ? "Processing…" : "Book Now"}
                </button>
                <button className="btn btn-outline btn-full" style={{ marginTop: ".75rem" }}>
                  <Heart size={15} /> Add to Wishlist
                </button>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.25rem" }}>
              <button className="btn btn-ghost btn-sm"><Share2 size={14} /> Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## src\pages\user\EventList.jsx

```jsx
// src/pages/user/EventList.jsx
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import { getAllEvents } from "../../api/events";
import { SlidersHorizontal, Search, X } from "lucide-react";

const CATEGORIES = ["Music", "Tech", "Sports", "Food", "Art", "Business"];

const MOCK = [
  { id:"1", title:"Neon Beats Music Festival", category:"Music", date:"2025-07-12", venue:"Madison Square Garden", price:89 },
  { id:"2", title:"TechConf Global Summit", category:"Tech", date:"2025-08-03", venue:"Moscone Center, SF", price:0 },
  { id:"3", title:"Urban Marathon Championship", category:"Sports", date:"2025-06-22", venue:"Central Park, NYC", price:45 },
  { id:"4", title:"World Street Food Festival", category:"Food", date:"2025-07-19", venue:"Brooklyn Bridge Park", price:25 },
  { id:"5", title:"Digital Art Expo 2025", category:"Art", date:"2025-09-05", venue:"MoMA, NYC", price:35 },
  { id:"6", title:"Startup Pitch Competition", category:"Business", date:"2025-08-15", venue:"WeWork HQ, Chicago", price:0 },
  { id:"7", title:"Jazz Under The Stars", category:"Music", date:"2025-07-28", venue:"Millennium Park, Chicago", price:55 },
  { id:"8", title:"AI & Future of Work Summit", category:"Tech", date:"2025-09-12", venue:"Javits Center, NYC", price:120 },
  { id:"9", title:"City Half Marathon", category:"Sports", date:"2025-10-05", venue:"Downtown Boston", price:30 },
];

export default function EventList() {
  const [events, setEvents] = useState(MOCK);
  const [cats, setCats] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    getAllEvents().then(r => setEvents(r.data)).catch(() => setEvents(MOCK));
  }, []);

  const toggleCat = (c) => setCats(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c]);

  const filtered = events
    .filter(e => cats.length === 0 || cats.includes(e.category))
    .filter(e => e.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "price" ? (a.price||0)-(b.price||0) : new Date(a.date)-new Date(b.date));

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {/* Filter Sidebar */}
        <aside className="card filter-sidebar" style={{ padding: 0 }}>
          <div className="filter-section">
            <div className="filter-title">Search</div>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              <input className="form-control" placeholder="Event name…" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: "2.25rem" }} />
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-title">Category</div>
            {CATEGORIES.map(c => (
              <label key={c} className="checkbox-row">
                <input type="checkbox" checked={cats.includes(c)} onChange={() => { toggleCat(c); setPage(1); }} />
                {c}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <div className="filter-title">Sort By</div>
            <select className="form-control" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="date">Date (earliest)</option>
              <option value="price">Price (lowest)</option>
            </select>
          </div>

          <div className="filter-section">
            {cats.length > 0 && (
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--color-primary)" }} onClick={() => setCats([])}>
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".75rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", marginBottom: ".2rem" }}>All Events</h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: ".85rem" }}>
                Showing {paginated.length} of {filtered.length} events
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <SlidersHorizontal size={15} color="var(--color-text-muted)" />
              <select className="form-control" style={{ width: "auto", padding: ".45rem .9rem" }}
                value={sort} onChange={e => setSort(e.target.value)}>
                <option value="date">Sort: Date</option>
                <option value="price">Sort: Price</option>
              </select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
              <SlidersHorizontal size={42} style={{ marginBottom: "1rem", opacity: .4 }} />
              <p>No events match your filters.</p>
            </div>
          ) : (
            <div className="grid-3">{paginated.map((ev, i) => <EventCard key={ev.id || ev._id} event={ev} index={i} />)}</div>
          )}

          {pages > 1 && (
            <div className="pagination" style={{ marginTop: "2.5rem" }}>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} className={`page-btn ${page === i+1 ? "active" : ""}`} onClick={() => setPage(i+1)}>
                  {i+1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## src\pages\user\UserDashboard.jsx

```jsx
// src/pages/user/UserDashboard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Calendar, BookOpen, User, LogOut,
         Ticket, ArrowUpRight, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const MOCK_BOOKINGS = [
  { id:"b1", event_title:"Neon Beats Festival",  event_date:"2025-07-12", event_location:"MSG, NYC",       status:"confirmed" },
  { id:"b2", event_title:"TechConf Summit",       event_date:"2025-08-03", event_location:"Moscone, SF",   status:"pending"   },
  { id:"b3", event_title:"Urban Marathon",        event_date:"2025-06-22", event_location:"Central Park",  status:"confirmed" },
  { id:"b4", event_title:"Art Expo 2025",         event_date:"2025-09-05", event_location:"MoMA, NYC",     status:"cancelled" },
];

const STATUS_TAG  = { confirmed:"tag-green", pending:"tag-gold", cancelled:"tag-coral" };
const STATUS_ICON = { confirmed: CheckCircle, pending: Clock, cancelled: XCircle };

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "User";

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    axios.get("/api/bookings/me/")
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => { setBookings(MOCK_BOOKINGS); setLoading(false); });
  }, []);

  const now = new Date();
  const upcoming  = bookings.filter(b => b.status !== "cancelled" && new Date(b.event_date) > now).length;
  const attended  = bookings.filter(b => b.status === "confirmed"  && new Date(b.event_date) < now).length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  const stats = [
    { label:"Total Bookings", value: bookings.length, sub:"+1 this month",  accent:"#c8a96e" },
    { label:"Upcoming",       value: upcoming,         sub:"Next events",    accent:"#60a5fa" },
    { label:"Attended",       value: attended,         sub:"All time",       accent:"#34d399" },
    { label:"Cancelled",      value: cancelled,        sub:"This year",      accent:"#f87171" },
  ];

  const doLogout = () => { logout(); navigate("/"); };

  const navItems = [
    { to:"/dashboard",   icon:LayoutDashboard, label:"Dashboard",    active:true },
    { to:"/events",      icon:Calendar,         label:"Browse Events" },
    { to:"/my-bookings", icon:BookOpen,          label:"My Bookings" },
    { to:"/profile",     icon:User,              label:"Profile" },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Main</span>
          {navItems.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">User</div>
          </div>
          <button onClick={doLogout} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="main-content">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">WELCOME BACK, {name.toUpperCase()}</h1>
            <p className="page-subtitle">
              {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>
          <Link to="/events" className="btn btn-primary">
            <Calendar size={15} /> Browse Events
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map(({ label, value, sub, accent }) => (
            <div className="stat-card" key={label} style={{ "--stat-accent": accent }}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{loading ? "—" : value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Recent Bookings table */}
        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", marginBottom:"2rem", overflow:"hidden"
        }}>
          <div style={{
            padding:"1.25rem 1.5rem", borderBottom:"1px solid var(--border)",
            display:"flex", justifyContent:"space-between", alignItems:"center"
          }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", letterSpacing:"0.04em", color:"var(--white)" }}>
              RECENT BOOKINGS
            </h3>
            <Link to="/my-bookings" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem" }}>
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th><th>Date</th><th>Location</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign:"center", padding:"2rem" }}>
                      <Ticket size={28} style={{ opacity:.3, display:"block", margin:"0 auto .75rem" }} />
                      <span style={{ color:"var(--muted)", fontSize:".85rem" }}>No bookings yet.</span>
                    </td>
                  </tr>
                ) : bookings.slice(0, 5).map((b) => {
                  const Icon = STATUS_ICON[b.status] || Clock;
                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{b.event_title}</td>
                      <td>{b.event_date ? formatDate(b.event_date) : "—"}</td>
                      <td style={{ color:"var(--muted)" }}>{b.event_location || "—"}</td>
                      <td>
                        <span className={`tag ${STATUS_TAG[b.status] || "tag-muted"}`} style={{ display:"inline-flex", alignItems:"center", gap:".3rem" }}>
                          <Icon size={10} /> {b.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/events/${b.event_id}`} className="btn btn-ghost btn-sm" style={{ fontSize:".75rem", padding:"5px 10px" }}>
                          <Ticket size={12} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming events mini cards */}
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", letterSpacing:"0.04em", color:"var(--white)", marginBottom:"1.25rem" }}>
          UPCOMING EVENTS
        </h3>
        {loading ? (
          <p style={{ color:"var(--muted)", fontSize:".85rem" }}>Loading…</p>
        ) : (
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            {bookings
              .filter(b => b.status !== "cancelled" && new Date(b.event_date) > now)
              .slice(0, 3)
              .map((b) => (
                <div key={b.id} style={{
                  flex:"1 1 220px",
                  background:"var(--ink-3)", border:"1px solid var(--border)",
                  borderRadius:"var(--r-md)", padding:"1.25rem",
                  transition:"border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div style={{ fontWeight:600, marginBottom:".5rem", fontSize:".9rem", color:"var(--white)" }}>
                    {b.event_title}
                  </div>
                  <div className="event-meta-row" style={{ marginBottom:".3rem" }}>
                    <Calendar size={11} /> {b.event_date ? formatDate(b.event_date) : "—"}
                  </div>
                  {b.event_location && (
                    <div className="event-meta-row">
                      <MapPin size={11} /> {b.event_location}
                    </div>
                  )}
                </div>
              ))}
            {bookings.filter(b => b.status !== "cancelled" && new Date(b.event_date) > now).length === 0 && (
              <p style={{ color:"var(--muted)", fontSize:".85rem" }}>No upcoming events. <Link to="/events" style={{ color:"var(--gold)" }}>Browse now →</Link></p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
```

## src\pages\user\UserProfile.jsx

```jsx
// src/pages/user/UserProfile.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../api/auth";
import { LayoutDashboard, Calendar, BookOpen, User, LogOut,
         Mail, Shield, Edit2, Check, X, AlertCircle, CheckCircle } from "lucide-react";

export default function UserProfile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "User";

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [isEditing, setIsEditing]     = useState(false);
  const [formData, setFormData]       = useState({ name: "", password: "" });
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [saving, setSaving]           = useState(false);

  const doLogout = () => { logout(); navigate("/"); };

  const navItems = [
    { to: "/dashboard",   icon: LayoutDashboard, label: "Dashboard" },
    { to: "/events",      icon: Calendar,         label: "Browse Events" },
    { to: "/my-bookings", icon: BookOpen,          label: "My Bookings" },
    { to: "/profile",     icon: User,              label: "Profile", active: true },
  ];

  useEffect(() => {
    getProfile()
      .then(r => {
        setProfileData(r.data);
        setFormData({ name: r.data.name, password: "" });
      })
      .catch(() => {
        // Fall back to auth context data
        if (user) {
          setProfileData(user);
          setFormData({ name: user.name, password: "" });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSaving(true);
    try {
      const payload = { name: formData.name };
      if (formData.password) payload.password = formData.password;
      const res = await updateProfile(payload);
      setProfileData(res.data);
      login(res.data, localStorage.getItem("token"));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setFormData(prev => ({ ...prev, password: "" }));
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="app-layout" style={{ paddingTop: 0 }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
      </aside>
      <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)" }}>Loading profile…</p>
      </main>
    </div>
  );

  const initials = (profileData?.name || name)[0]?.toUpperCase() || "U";

  return (
    <div className="app-layout" style={{ paddingTop: 0 }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">Event<em>Flow</em></div>
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Main</span>
          {navItems.map(({ to, icon: Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">User</div>
          </div>
          <button onClick={doLogout} style={{ color: "var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">MY PROFILE</h1>
            <p className="page-subtitle">View and update your account details</p>
          </div>
        </div>

        <div className="page-content">
          {/* Success / Error alerts */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <CheckCircle size={15} /> {success}
              </span>
              <button onClick={() => setSuccess("")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
                <X size={14} />
              </button>
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Avatar card */}
            <div className="card card-body" style={{ textAlign: "center" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: "var(--color-primary)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem", fontWeight: 800, margin: "0 auto 1.25rem",
                fontFamily: "var(--font-display)",
              }}>
                {initials}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: ".35rem", color: "var(--color-text)" }}>
                {profileData?.name}
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <span className="badge badge-blue" style={{ textTransform: "capitalize" }}>
                  <Shield size={11} style={{ display: "inline", marginRight: ".3rem" }} />
                  {profileData?.role || "user"}
                </span>
              </div>
              <div style={{ fontSize: ".8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem", marginBottom: ".5rem" }}>
                <Mail size={13} /> {profileData?.email}
              </div>
              <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)" }}>
                Member since {new Date(profileData?.date_joined || Date.now()).getFullYear()}
              </div>
            </div>

            {/* Edit form */}
            <div className="card card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.05rem" }}>Account Details</h3>
                {!isEditing ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}>
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--color-text-muted)" }}
                    onClick={() => { setIsEditing(false); setFormData({ name: profileData.name, password: "" }); setError(""); }}>
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdate} className="form-stack">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text" className="form-control"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing} required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email" className="form-control"
                    value={profileData?.email || ""}
                    disabled
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                  <p style={{ fontSize: ".75rem", color: "var(--color-text-muted)", marginTop: ".3rem" }}>
                    Email cannot be changed.
                  </p>
                </div>

                {isEditing && (
                  <div className="form-group">
                    <label className="form-label">
                      New Password <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>(leave blank to keep current)</span>
                    </label>
                    <input
                      type="password" className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      minLength={formData.password ? 8 : undefined}
                    />
                  </div>
                )}

                {isEditing && (
                  <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: ".5rem" }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <Check size={15} /> {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## src\utils\helpers.js

```js
// src/utils/helpers.js

export const formatDate = (dateStr) => {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric"
  });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit"
  });
};

export const formatPrice = (price) => {
  if (!price || price === 0) return "Free";
  return `$${Number(price).toFixed(2)}`;
};

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n) + "…" : str;

export const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

export const roleColor = (role) => ({
  user: "badge-blue", organizer: "badge-purple", admin: "badge-red"
}[role] || "badge-gray");

export const statusColor = (status) => ({
  confirmed: "badge-green", pending: "badge-amber", cancelled: "badge-red",
  active: "badge-green", draft: "badge-amber", ended: "badge-gray"
}[status?.toLowerCase()] || "badge-gray");
```

