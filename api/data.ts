import type { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:CAPSLOCKoff21%23123@db.hbnsrblknhmxdaogjjeb.supabase.co:5432/postgres';
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000
    });
  }
  return pool;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const client = getPool();

  try {
    if (req.method === 'GET') {
      const { type } = req.query;

      if (type === 'tasks') {
        const result = await client.query('SELECT * FROM mb_tasks ORDER BY phase_day ASC, id ASC LIMIT 500;');
        const formatted = result.rows.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          founderRole: r.founder_role,
          isAutomation: r.is_automation,
          isOneOff: r.is_one_off,
          description: r.description,
          estimatedDays: r.estimated_days,
          priority: r.priority,
          status: r.status,
          assignedTo: r.assigned_to,
          phaseDay: r.phase_day,
          tags: r.tags || [],
          department: r.department,
          canadianSpec: r.canadian_spec,
          kotaSpec: r.kota_spec,
          kidCompatibility: r.kid_compatibility,
          executionPlan: r.execution_plan
        }));
        return res.status(200).json({ success: true, tasks: formatted });
      }

      if (type === 'inquiries') {
        const result = await client.query('SELECT * FROM mb_parent_inquiries ORDER BY created_at DESC;');
        const formatted = result.rows.map(r => ({
          id: r.id,
          parentName: r.parent_name,
          phone: r.phone,
          email: r.email,
          childName: r.child_name,
          childAge: r.child_age,
          grade: r.grade,
          locality: r.locality,
          parentBackground: r.parent_background,
          status: r.status,
          tourDate: r.tour_date,
          notes: r.notes,
          dateLogged: r.date_logged
        }));
        return res.status(200).json({ success: true, inquiries: formatted });
      }

      if (type === 'facility') {
        const result = await client.query('SELECT * FROM mb_facility_zones ORDER BY id ASC;');
        const formatted = result.rows.map(r => ({
          id: r.id,
          name: r.name,
          status: r.status,
          progress: r.progress,
          targetDate: r.target_date,
          canadianSpecs: r.canadian_specs,
          toddlerSafetyRating: r.toddler_safety_rating,
          budgetAllocated: Number(r.budget_allocated || 0),
          budgetSpent: Number(r.budget_spent || 0),
          lead: r.lead
        }));
        return res.status(200).json({ success: true, facilityZones: formatted });
      }

      if (type === 'nudges') {
        const result = await client.query('SELECT * FROM mb_voice_nudges ORDER BY created_at DESC LIMIT 50;');
        const formatted = result.rows.map(r => ({
          id: r.id,
          from: r.from_name,
          to: r.to_name,
          message: r.message,
          timestamp: r.timestamp,
          tag: r.tag,
          duration: r.duration,
          audioPlayed: r.audio_played
        }));
        return res.status(200).json({ success: true, nudges: formatted });
      }

      // Default: return all initial datasets together
      const [tasksRes, inqRes, zonesRes, nudgesRes] = await Promise.all([
        client.query('SELECT * FROM mb_tasks ORDER BY phase_day ASC, id ASC LIMIT 500;'),
        client.query('SELECT * FROM mb_parent_inquiries ORDER BY created_at DESC;'),
        client.query('SELECT * FROM mb_facility_zones ORDER BY id ASC;'),
        client.query('SELECT * FROM mb_voice_nudges ORDER BY created_at DESC LIMIT 50;')
      ]);

      return res.status(200).json({
        success: true,
        tasks: tasksRes.rows.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          founderRole: r.founder_role,
          isAutomation: r.is_automation,
          isOneOff: r.is_one_off,
          description: r.description,
          estimatedDays: r.estimated_days,
          priority: r.priority,
          status: r.status,
          assignedTo: r.assigned_to,
          phaseDay: r.phase_day,
          tags: r.tags || [],
          department: r.department,
          canadianSpec: r.canadian_spec,
          kotaSpec: r.kota_spec,
          kidCompatibility: r.kid_compatibility,
          executionPlan: r.execution_plan
        })),
        inquiries: inqRes.rows.map(r => ({
          id: r.id,
          parentName: r.parent_name,
          phone: r.phone,
          email: r.email,
          childName: r.child_name,
          childAge: r.child_age,
          grade: r.grade,
          locality: r.locality,
          parentBackground: r.parent_background,
          status: r.status,
          tourDate: r.tour_date,
          notes: r.notes,
          dateLogged: r.date_logged
        })),
        facilityZones: zonesRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          status: r.status,
          progress: r.progress,
          targetDate: r.target_date,
          canadianSpecs: r.canadian_specs,
          toddlerSafetyRating: r.toddler_safety_rating,
          budgetAllocated: Number(r.budget_allocated || 0),
          budgetSpent: Number(r.budget_spent || 0),
          lead: r.lead
        })),
        nudges: nudgesRes.rows.map(r => ({
          id: r.id,
          from: r.from_name,
          to: r.to_name,
          message: r.message,
          timestamp: r.timestamp,
          tag: r.tag,
          duration: r.duration,
          audioPlayed: r.audio_played
        }))
      });
    }

    if (req.method === 'POST') {
      const { action, payload } = req.body || {};

      if (action === 'update-task') {
        const { id, status, executionPlan } = payload;
        await client.query(`
          UPDATE mb_tasks 
          SET status = COALESCE($1, status),
              execution_plan = COALESCE($2, execution_plan),
              updated_at = NOW()
          WHERE id = $3;
        `, [status, executionPlan ? JSON.stringify(executionPlan) : null, id]);
        return res.status(200).json({ success: true, message: 'Task updated in Supabase' });
      }

      if (action === 'add-inquiry') {
        const inq = payload;
        await client.query(`
          INSERT INTO mb_parent_inquiries (
            id, parent_name, phone, email, child_name, child_age, 
            grade, locality, parent_background, status, tour_date, notes, date_logged
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `, [
          inq.id || `inq-${Date.now()}`,
          inq.parentName,
          inq.phone,
          inq.email,
          inq.childName,
          inq.childAge,
          inq.grade,
          inq.locality,
          inq.parentBackground,
          inq.status || 'New Inquiry',
          inq.tourDate || null,
          inq.notes || '',
          inq.dateLogged || new Date().toISOString().split('T')[0]
        ]);
        return res.status(200).json({ success: true, message: 'Parent inquiry saved to Supabase' });
      }

      if (action === 'update-inquiry-status') {
        const { id, status, notes } = payload;
        await client.query(`
          UPDATE mb_parent_inquiries 
          SET status = COALESCE($1, status),
              notes = COALESCE($2, notes),
              updated_at = NOW()
          WHERE id = $3;
        `, [status, notes, id]);
        return res.status(200).json({ success: true, message: 'Inquiry updated' });
      }

      if (action === 'update-zone-progress') {
        const { id, progress, status } = payload;
        await client.query(`
          UPDATE mb_facility_zones
          SET progress = COALESCE($1, progress),
              status = COALESCE($2, status),
              updated_at = NOW()
          WHERE id = $3;
        `, [progress, status, id]);
        return res.status(200).json({ success: true, message: 'Facility zone updated' });
      }

      if (action === 'add-nudge') {
        const n = payload;
        await client.query(`
          INSERT INTO mb_voice_nudges (
            id, from_name, to_name, message, timestamp, tag, duration, audio_played
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `, [
          n.id || `nudge-${Date.now()}`,
          n.from,
          n.to,
          n.message,
          n.timestamp || 'Just now',
          n.tag || 'Urgent',
          n.duration || '0:15',
          n.audioPlayed || false
        ]);
        return res.status(200).json({ success: true, message: 'Nudge recorded' });
      }

      return res.status(400).json({ error: 'Unknown action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Supabase DB handler error:', error);
    return res.status(500).json({ error: error.message || 'Database error' });
  }
}
