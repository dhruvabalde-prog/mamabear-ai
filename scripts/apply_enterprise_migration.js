import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://postgres.hbnsrblknhmxdaogjjeb:CAPSLOCKoff21%23123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261006_enterprise_tables.sql'), 'utf8');
  console.log('Applying migration...');
  await pool.query(sql);
  console.log('Migration applied successfully.');
  
  // Verify table creation
  const res = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'mb_%'
    ORDER BY table_name;
  `);
  console.log('Active Supabase mb_* tables:');
  console.log(res.rows.map(r => r.table_name));
  await pool.end();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
