-- Migration: Add Setup Config and Dynamic Operational Tables
CREATE TABLE IF NOT EXISTS mb_setup_config (
  id TEXT PRIMARY KEY,
  school_name TEXT NOT NULL,
  campus_location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  franchise_brand TEXT NOT NULL,
  lead_academics_name TEXT NOT NULL,
  lead_academics_title TEXT NOT NULL,
  lead_academics_phone TEXT,
  lead_academics_email TEXT,
  lead_business_name TEXT NOT NULL,
  lead_business_title TEXT NOT NULL,
  lead_business_phone TEXT,
  lead_business_email TEXT,
  launch_date TEXT,
  target_enrollment INTEGER DEFAULT 50,
  total_budget_allocated NUMERIC DEFAULT 4500000,
  signing_fee_paid NUMERIC DEFAULT 1500000,
  is_setup_completed BOOLEAN DEFAULT false,
  setup_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mb_setup_config ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_setup_config') THEN
    CREATE POLICY "Allow public read mb_setup_config" ON mb_setup_config FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_setup_config') THEN
    CREATE POLICY "Allow public write mb_setup_config" ON mb_setup_config FOR ALL USING (true);
  END IF;
END $$;
