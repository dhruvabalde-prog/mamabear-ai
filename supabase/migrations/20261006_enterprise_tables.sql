-- Migration: Complete Enterprise Operational Tables for MamaBear AI
-- Includes: mb_staff, mb_expenses, mb_academic_programs, mb_local_vendors, mb_quality_reviews, mb_daily_handoffs

-- 1. Staff Directory
CREATE TABLE IF NOT EXISTS mb_staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Shortlisted',
  police_verified BOOLEAN DEFAULT false,
  first_aid_certified BOOLEAN DEFAULT false,
  salary NUMERIC NOT NULL DEFAULT 0,
  assigned_class TEXT,
  contact TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Expense Ledger
CREATE TABLE IF NOT EXISTS mb_expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  paid_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  vendor TEXT,
  authorized_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Academic Programs & Thematic Units
CREATE TABLE IF NOT EXISTS mb_academic_programs (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age_bracket TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  learning_centers JSONB NOT NULL DEFAULT '[]'::jsonb,
  weekly_themes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Local Vendors Directory
CREATE TABLE IF NOT EXISTS mb_local_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  area TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Lead',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quality Inspections & Child Safety Lab
CREATE TABLE IF NOT EXISTS mb_quality_reviews (
  id TEXT PRIMARY KEY,
  item_tested TEXT NOT NULL,
  tester TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  verdict TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Daily Co-Founder Handoff
CREATE TABLE IF NOT EXISTS mb_daily_handoffs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  afternoon_pickup_lead TEXT NOT NULL,
  status_note TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mb_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_local_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_quality_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_daily_handoffs ENABLE ROW LEVEL SECURITY;

-- Add open public policies for seamless API operations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_staff') THEN
    CREATE POLICY "Allow public read mb_staff" ON mb_staff FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_staff') THEN
    CREATE POLICY "Allow public write mb_staff" ON mb_staff FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_expenses') THEN
    CREATE POLICY "Allow public read mb_expenses" ON mb_expenses FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_expenses') THEN
    CREATE POLICY "Allow public write mb_expenses" ON mb_expenses FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_academic_programs') THEN
    CREATE POLICY "Allow public read mb_academic_programs" ON mb_academic_programs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_academic_programs') THEN
    CREATE POLICY "Allow public write mb_academic_programs" ON mb_academic_programs FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_local_vendors') THEN
    CREATE POLICY "Allow public read mb_local_vendors" ON mb_local_vendors FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_local_vendors') THEN
    CREATE POLICY "Allow public write mb_local_vendors" ON mb_local_vendors FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_quality_reviews') THEN
    CREATE POLICY "Allow public read mb_quality_reviews" ON mb_quality_reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_quality_reviews') THEN
    CREATE POLICY "Allow public write mb_quality_reviews" ON mb_quality_reviews FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_daily_handoffs') THEN
    CREATE POLICY "Allow public read mb_daily_handoffs" ON mb_daily_handoffs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_daily_handoffs') THEN
    CREATE POLICY "Allow public write mb_daily_handoffs" ON mb_daily_handoffs FOR ALL USING (true);
  END IF;
END $$;
