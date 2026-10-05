import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:CAPSLOCKoff21%23123@db.hbnsrblknhmxdaogjjeb.supabase.co:5432/postgres';

const { Client } = pg;

async function migrate() {
  console.log('Connecting to Supabase PostgreSQL at db.hbnsrblknhmxdaogjjeb.supabase.co...');
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL successfully.');

  const sqlPath = path.join(__dirname, '../supabase/migrations/20261006_mamabear_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Applying MamaBear AI schema...');
  await client.query(sql);
  console.log('MamaBear AI schema applied successfully.');

  // Check counts
  const resTasks = await client.query('SELECT COUNT(*) FROM mb_tasks;');
  console.log('Current mb_tasks count:', resTasks.rows[0].count);

  await client.end();
  console.log('Migration finished.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
