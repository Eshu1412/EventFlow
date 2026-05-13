-- =====================================================================
-- Supabase Table Definitions for EventFlow
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =====================================================================

-- 1. USERS TABLE
-- (Separate from Supabase Auth — this stores application-level user data)
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL DEFAULT '',
    email           VARCHAR(254) NOT NULL UNIQUE,
    username        VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(128) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'user'
                        CHECK (role IN ('user', 'organizer', 'admin')),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_staff        BOOLEAN NOT NULL DEFAULT FALSE,
    is_superuser    BOOLEAN NOT NULL DEFAULT FALSE,
    date_joined     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login      TIMESTAMPTZ
);

-- Index for fast email lookups (login, check-email)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    category        VARCHAR(50),
    location        VARCHAR(200),
    date            TIMESTAMPTZ NOT NULL,
    total_seats     INTEGER NOT NULL DEFAULT 100,
    booked_seats    INTEGER NOT NULL DEFAULT 0,
    price           DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    image_url       TEXT,
    organizer_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events (organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id        BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    quantity        INTEGER NOT NULL DEFAULT 1,
    status          VARCHAR(20) NOT NULL DEFAULT 'confirmed'
                        CHECK (status IN ('confirmed', 'cancelled')),
    booked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings (event_id);

-- 4. PASSWORD RESET TOKENS TABLE
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    used            BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_user ON password_reset_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens (token);

-- 5. EMAIL OTP TABLE
CREATE TABLE IF NOT EXISTS email_otps (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(254) NOT NULL,
    otp             VARCHAR(6) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    attempts        INTEGER NOT NULL DEFAULT 0,
    pending_data    TEXT
);

CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps (LOWER(email));

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id        BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    rating          INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_event ON reviews (event_id);

-- =====================================================================
-- Enable Row Level Security (RLS) — required for Supabase
-- Using permissive policies since auth is handled by Django JWT
-- =====================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow the service_role (backend) full access to all tables
-- The anon/public key has limited access; service_role bypasses RLS
-- Since we use the publishable key, we need permissive policies:

CREATE POLICY "Allow all for anon" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON password_reset_tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON email_otps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON reviews FOR ALL USING (true) WITH CHECK (true);
