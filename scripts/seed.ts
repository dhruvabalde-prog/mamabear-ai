import pg from 'pg';
import { ALL_TASKS } from '../src/data/tasksLibrary.js';
import { 
  INITIAL_NUDGES, 
  INITIAL_INQUIRIES, 
  INITIAL_FACILITY_ZONES, 
  INITIAL_STAFF, 
  INITIAL_EXPENSES 
} from '../src/data/initialData.js';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:CAPSLOCKoff21%23123@db.hbnsrblknhmxdaogjjeb.supabase.co:5432/postgres';

const { Client } = pg;

async function seed() {
  console.log('Connecting to Supabase PostgreSQL for seeding...');
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  console.log(`Seeding ${ALL_TASKS.length} tasks...`);
  for (const t of ALL_TASKS) {
    await client.query(`
      INSERT INTO mb_tasks (
        id, title, category, founder_role, is_automation, is_one_off, 
        description, estimated_days, priority, status, assigned_to, 
        phase_day, tags, department, canadian_spec, kota_spec, 
        kid_compatibility, execution_plan
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        status = EXCLUDED.status,
        execution_plan = EXCLUDED.execution_plan,
        updated_at = NOW();
    `, [
      t.id,
      t.title,
      t.category,
      t.founderRole,
      t.isAutomation || false,
      t.isOneOff || false,
      t.description,
      t.estimatedDays || 1,
      t.priority,
      t.status,
      t.assignedTo,
      t.phaseDay || 1,
      t.tags || [],
      t.department,
      t.canadianSpec || null,
      t.kotaSpec || null,
      t.kidCompatibility || null,
      JSON.stringify(t.executionPlan || null)
    ]);
  }
  console.log('Tasks seeded successfully.');

  console.log(`Seeding ${INITIAL_INQUIRIES.length} parent inquiries...`);
  for (const inq of INITIAL_INQUIRIES) {
    await client.query(`
      INSERT INTO mb_parent_inquiries (
        id, parent_name, phone, email, child_name, child_age, 
        grade, locality, parent_background, status, tour_date, notes, date_logged
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        updated_at = NOW();
    `, [
      inq.id,
      inq.parentName,
      inq.phone,
      inq.email,
      inq.childName,
      inq.childAge,
      inq.grade,
      inq.locality,
      inq.parentBackground,
      inq.status,
      inq.tourDate || null,
      inq.notes,
      inq.dateLogged
    ]);
  }

  console.log(`Seeding ${INITIAL_FACILITY_ZONES.length} facility zones...`);
  for (const z of INITIAL_FACILITY_ZONES) {
    await client.query(`
      INSERT INTO mb_facility_zones (
        id, name, status, progress, target_date, canadian_specs, 
        toddler_safety_rating, budget_allocated, budget_spent, lead
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        progress = EXCLUDED.progress,
        updated_at = NOW();
    `, [
      z.id,
      z.name,
      z.status,
      z.progress,
      z.targetDate,
      z.canadianSpecs,
      z.toddlerSafetyRating,
      z.budgetAllocated,
      z.budgetSpent,
      z.lead
    ]);
  }

  console.log(`Seeding ${INITIAL_NUDGES.length} voice nudges...`);
  for (const n of INITIAL_NUDGES) {
    await client.query(`
      INSERT INTO mb_voice_nudges (
        id, from_name, to_name, message, timestamp, tag, duration, audio_played
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING;
    `, [
      n.id,
      n.from,
      n.to,
      n.message,
      n.timestamp,
      n.tag,
      n.duration || '0:15',
      n.audioPlayed || false
    ]);
  }

  if (INITIAL_STAFF && INITIAL_STAFF.length) {
    console.log(`Seeding ${INITIAL_STAFF.length} staff members...`);
    for (const s of INITIAL_STAFF) {
      await client.query(`
        INSERT INTO mb_staff (
          id, name, role, status, police_verified, first_aid_certified, 
          salary, assigned_class, contact
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          updated_at = NOW();
      `, [
        s.id,
        s.name,
        s.role,
        s.status,
        s.policeVerified || false,
        s.firstAidCertified || false,
        s.salary || 0,
        s.assignedClass || null,
        s.contact
      ]);
    }
  }

  if (INITIAL_EXPENSES && INITIAL_EXPENSES.length) {
    console.log(`Seeding ${INITIAL_EXPENSES.length} expenses...`);
    for (const e of INITIAL_EXPENSES) {
      await client.query(`
        INSERT INTO mb_expenses (
          id, category, item, amount, paid_date, status, vendor, authorized_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          updated_at = NOW();
      `, [
        e.id,
        e.category,
        e.item,
        e.amount || 0,
        e.paidDate,
        e.status,
        e.vendor,
        e.authorizedBy
      ]);
    }
  }

  const taskCount = await client.query('SELECT COUNT(*) FROM mb_tasks;');
  const inqCount = await client.query('SELECT COUNT(*) FROM mb_parent_inquiries;');
  const zoneCount = await client.query('SELECT COUNT(*) FROM mb_facility_zones;');
  const nudgeCount = await client.query('SELECT COUNT(*) FROM mb_voice_nudges;');

  console.log('Seeding verification:');
  console.log(`- Tasks: ${taskCount.rows[0].count}`);
  console.log(`- Inquiries: ${inqCount.rows[0].count}`);
  console.log(`- Facility Zones: ${zoneCount.rows[0].count}`);
  console.log(`- Nudges: ${nudgeCount.rows[0].count}`);

  await client.end();
  console.log('Seed completed successfully!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
