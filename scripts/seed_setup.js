import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres.hbnsrblknhmxdaogjjeb:CAPSLOCKoff21%23123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const query = `
    INSERT INTO mb_setup_config (
      id, school_name, campus_location, city, state, franchise_brand,
      lead_academics_name, lead_academics_title, lead_academics_phone, lead_academics_email,
      lead_business_name, lead_business_title, lead_business_phone, lead_business_email,
      launch_date, target_enrollment, total_budget_allocated, signing_fee_paid,
      is_setup_completed, setup_step
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
    ) ON CONFLICT (id) DO UPDATE SET
      school_name = EXCLUDED.school_name,
      updated_at = NOW();
  `;

  const values = [
    'default-school-config',
    'Maple Bear Canadian School',
    'Subhash Nagar',
    'Kota',
    'Rajasthan',
    'Maple Bear Global',
    'Academic Director',
    'Co-Founder & Academic Director',
    '',
    '',
    'Managing Director',
    'Co-Founder & Managing Director',
    '',
    '',
    '2026-11-15',
    50,
    4500000,
    1500000,
    true,
    4
  ];

  await pool.query(query, values);
  const res = await pool.query('SELECT id, school_name, campus_location, is_setup_completed FROM mb_setup_config;');
  console.log('SETUP SEED SUCCESS:', res.rows);
  await pool.end();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
