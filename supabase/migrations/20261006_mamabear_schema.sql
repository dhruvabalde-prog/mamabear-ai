-- MamaBear AI - Maple Bear Canadian Preschool Subhash Nagar, Kota
-- Supabase Schema for MamaBear AI

CREATE TABLE IF NOT EXISTS mb_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  founder_role TEXT,
  is_automation BOOLEAN DEFAULT false,
  is_one_off BOOLEAN DEFAULT false,
  description TEXT,
  estimated_days INTEGER DEFAULT 1,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  assigned_to TEXT,
  phase_day INTEGER DEFAULT 1,
  tags TEXT[],
  department TEXT,
  canadian_spec TEXT,
  kota_spec TEXT,
  kid_compatibility TEXT,
  execution_plan JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mb_parent_inquiries (
  id TEXT PRIMARY KEY,
  parent_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  child_name TEXT,
  child_age TEXT,
  grade TEXT,
  locality TEXT,
  parent_background TEXT,
  status TEXT DEFAULT 'New Inquiry',
  tour_date TEXT,
  notes TEXT,
  date_logged TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mb_facility_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT,
  progress INTEGER DEFAULT 0,
  target_date TEXT,
  canadian_specs TEXT,
  toddler_safety_rating INTEGER DEFAULT 5,
  budget_allocated NUMERIC DEFAULT 0,
  budget_spent NUMERIC DEFAULT 0,
  lead TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mb_voice_nudges (
  id TEXT PRIMARY KEY,
  from_name TEXT,
  to_name TEXT,
  message TEXT,
  timestamp TEXT,
  tag TEXT,
  duration TEXT,
  audio_played BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mb_chat_messages (
  id TEXT PRIMARY KEY,
  sender TEXT,
  sender_role TEXT,
  avatar TEXT,
  text TEXT,
  timestamp TEXT,
  channel TEXT,
  is_audio BOOLEAN DEFAULT false,
  duration TEXT,
  whatsapp_recipient_phone TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mb_staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  status TEXT,
  police_verified BOOLEAN DEFAULT false,
  first_aid_certified BOOLEAN DEFAULT false,
  salary NUMERIC DEFAULT 0,
  assigned_class TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mb_expenses (
  id TEXT PRIMARY KEY,
  category TEXT,
  item TEXT,
  amount NUMERIC DEFAULT 0,
  paid_date TEXT,
  status TEXT,
  vendor TEXT,
  authorized_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and add public read/write policies for MamaBear app
ALTER TABLE mb_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_parent_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_facility_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_voice_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_expenses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_tasks') THEN
    CREATE POLICY "Allow public read mb_tasks" ON mb_tasks FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_tasks') THEN
    CREATE POLICY "Allow public write mb_tasks" ON mb_tasks FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_parent_inquiries') THEN
    CREATE POLICY "Allow public read mb_parent_inquiries" ON mb_parent_inquiries FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_parent_inquiries') THEN
    CREATE POLICY "Allow public write mb_parent_inquiries" ON mb_parent_inquiries FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_facility_zones') THEN
    CREATE POLICY "Allow public read mb_facility_zones" ON mb_facility_zones FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_facility_zones') THEN
    CREATE POLICY "Allow public write mb_facility_zones" ON mb_facility_zones FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_voice_nudges') THEN
    CREATE POLICY "Allow public read mb_voice_nudges" ON mb_voice_nudges FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_voice_nudges') THEN
    CREATE POLICY "Allow public write mb_voice_nudges" ON mb_voice_nudges FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read mb_chat_messages') THEN
    CREATE POLICY "Allow public read mb_chat_messages" ON mb_chat_messages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public write mb_chat_messages') THEN
    CREATE POLICY "Allow public write mb_chat_messages" ON mb_chat_messages FOR ALL USING (true);
  END IF;

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
END $$;
