-- Nabhindu Technologies – contact inquiries
-- Works on any PostgreSQL 13+ database, including Supabase.
-- Run with: npm run db:setup   (or paste into the Supabase SQL editor)

CREATE TABLE IF NOT EXISTS inquiries (
  id            BIGSERIAL PRIMARY KEY,
  reference     TEXT        NOT NULL UNIQUE,
  full_name     TEXT        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email         TEXT        NOT NULL CHECK (char_length(email) <= 254),
  phone         TEXT        NOT NULL CHECK (char_length(phone) <= 20),
  company       TEXT        CHECK (company IS NULL OR char_length(company) <= 120),
  service       TEXT        NOT NULL,
  budget        TEXT,
  message       TEXT        NOT NULL CHECK (char_length(message) BETWEEN 20 AND 5000),
  status        TEXT        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed', 'spam')),
  email_sent    BOOLEAN     NOT NULL DEFAULT FALSE,
  email_error   TEXT,
  ip_hash       TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_ip_hash_created_idx ON inquiries (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status);

-- Supabase: block public (anon) access; the website writes with the server-side connection string only.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Free consultation call bookings
CREATE TABLE IF NOT EXISTS consultations (
  id            BIGSERIAL PRIMARY KEY,
  reference     TEXT        NOT NULL UNIQUE,
  full_name     TEXT        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  phone         TEXT        NOT NULL CHECK (char_length(phone) <= 20),
  email         TEXT        CHECK (email IS NULL OR char_length(email) <= 254),
  call_date     DATE        NOT NULL,
  call_slot     TEXT        NOT NULL,
  mode          TEXT        NOT NULL,
  topic         TEXT        CHECK (topic IS NULL OR char_length(topic) <= 1000),
  status        TEXT        NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'done', 'cancelled', 'spam')),
  email_sent    BOOLEAN     NOT NULL DEFAULT FALSE,
  email_error   TEXT,
  ip_hash       TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One active booking per slot (cancelled ones free the slot again)
CREATE UNIQUE INDEX IF NOT EXISTS consultations_slot_uniq ON consultations (call_date, call_slot) WHERE status IN ('requested', 'confirmed');
CREATE INDEX IF NOT EXISTS consultations_date_idx ON consultations (call_date);
CREATE INDEX IF NOT EXISTS consultations_ip_hash_created_idx ON consultations (ip_hash, created_at DESC);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'ALTER TABLE consultations ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Admin dashboard: private notes on each record (safe to re-run on existing databases)
ALTER TABLE inquiries     ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS notes TEXT;

-- Careers: internship / job applications from /careers
CREATE TABLE IF NOT EXISTS job_applications (
  id            BIGSERIAL PRIMARY KEY,
  reference     TEXT        NOT NULL UNIQUE,
  full_name     TEXT        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email         TEXT        NOT NULL CHECK (char_length(email) <= 254),
  phone         TEXT        NOT NULL CHECK (char_length(phone) <= 20),
  role          TEXT        NOT NULL,
  college       TEXT        CHECK (college IS NULL OR char_length(college) <= 150),
  resume_url    TEXT        NOT NULL CHECK (char_length(resume_url) <= 500),
  portfolio_url TEXT        CHECK (portfolio_url IS NULL OR char_length(portfolio_url) <= 500),
  message       TEXT        NOT NULL CHECK (char_length(message) BETWEEN 30 AND 3000),
  status        TEXT        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'shortlisted', 'interview', 'hired', 'rejected', 'spam')),
  notes         TEXT,
  email_sent    BOOLEAN     NOT NULL DEFAULT FALSE,
  email_error   TEXT,
  ip_hash       TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_applications_created_at_idx ON job_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS job_applications_ip_hash_created_idx ON job_applications (ip_hash, created_at DESC);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;
