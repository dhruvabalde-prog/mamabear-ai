import type { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.hbnsrblknhmxdaogjjeb:CAPSLOCKoff21%23123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
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

      if (type === 'setup') {
        const result = await client.query('SELECT * FROM mb_setup_config ORDER BY created_at DESC LIMIT 1;');
        if (result.rows.length === 0) {
          return res.status(200).json({ success: true, setupConfig: null });
        }
        const r = result.rows[0];
        return res.status(200).json({
          success: true,
          setupConfig: {
            id: r.id,
            schoolName: r.school_name,
            campusLocation: r.campus_location,
            city: r.city,
            state: r.state,
            franchiseBrand: r.franchise_brand,
            leadAcademicsName: r.lead_academics_name,
            leadAcademicsTitle: r.lead_academics_title,
            leadAcademicsPhone: r.lead_academics_phone,
            leadAcademicsEmail: r.lead_academics_email,
            leadBusinessName: r.lead_business_name,
            leadBusinessTitle: r.lead_business_title,
            leadBusinessPhone: r.lead_business_phone,
            leadBusinessEmail: r.lead_business_email,
            launchDate: r.launch_date,
            targetEnrollment: Number(r.target_enrollment || 50),
            totalBudgetAllocated: Number(r.total_budget_allocated || 4500000),
            signingFeePaid: Number(r.signing_fee_paid || 1500000),
            isSetupCompleted: Boolean(r.is_setup_completed),
            setupStep: Number(r.setup_step || 1)
          }
        });
      }

      if (type === 'staff') {
        const result = await client.query('SELECT * FROM mb_staff ORDER BY name ASC;');
        return res.status(200).json({
          success: true,
          staff: result.rows.map(r => ({
            id: r.id,
            name: r.name,
            role: r.role,
            status: r.status,
            policeVerified: Boolean(r.police_verified),
            firstAidCertified: Boolean(r.first_aid_certified),
            salary: Number(r.salary || 0),
            assignedClass: r.assigned_class,
            contact: r.contact
          }))
        });
      }

      if (type === 'expenses') {
        const result = await client.query('SELECT * FROM mb_expenses ORDER BY paid_date DESC, created_at DESC;');
        return res.status(200).json({
          success: true,
          expenses: result.rows.map(r => ({
            id: r.id,
            category: r.category,
            item: r.item,
            amount: Number(r.amount || 0),
            paidDate: r.paid_date,
            status: r.status,
            vendor: r.vendor,
            authorizedBy: r.authorized_by
          }))
        });
      }

      if (type === 'curriculum') {
        const result = await client.query('SELECT * FROM mb_academic_programs ORDER BY slug ASC;');
        return res.status(200).json({
          success: true,
          academicPrograms: result.rows.map(r => ({
            id: r.id,
            slug: r.slug,
            name: r.name,
            ageBracket: r.age_bracket,
            icon: r.icon,
            description: r.description,
            learningCenters: r.learning_centers || [],
            weeklyThemes: r.weekly_themes || []
          }))
        });
      }

      if (type === 'vendors') {
        const result = await client.query('SELECT * FROM mb_local_vendors ORDER BY name ASC;');
        return res.status(200).json({
          success: true,
          vendors: result.rows.map(r => ({
            id: r.id,
            name: r.name,
            serviceCategory: r.service_category,
            area: r.area,
            phone: r.phone,
            contactPerson: r.contact_person,
            status: r.status
          }))
        });
      }

      if (type === 'reviews') {
        const result = await client.query('SELECT * FROM mb_quality_reviews ORDER BY created_at DESC LIMIT 50;');
        return res.status(200).json({
          success: true,
          reviews: result.rows.map(r => ({
            id: r.id,
            itemTested: r.item_tested,
            tester: r.tester,
            rating: Number(r.rating || 5),
            verdict: r.verdict,
            comment: r.comment,
            createdAt: r.created_at
          }))
        });
      }

      if (type === 'handoff') {
        const result = await client.query('SELECT * FROM mb_daily_handoffs ORDER BY date DESC LIMIT 1;');
        const r = result.rows[0] || null;
        return res.status(200).json({
          success: true,
          handoff: r ? {
            id: r.id,
            date: r.date,
            afternoonPickupLead: r.afternoon_pickup_lead,
            statusNote: r.status_note
          } : null
        });
      }

      // Default: return all initial datasets together
      const [
        tasksRes, inqRes, zonesRes, nudgesRes, setupRes,
        staffRes, expensesRes, curriculumRes, vendorsRes, reviewsRes, handoffRes
      ] = await Promise.all([
        client.query('SELECT * FROM mb_tasks ORDER BY phase_day ASC, id ASC LIMIT 500;'),
        client.query('SELECT * FROM mb_parent_inquiries ORDER BY created_at DESC;'),
        client.query('SELECT * FROM mb_facility_zones ORDER BY id ASC;'),
        client.query('SELECT * FROM mb_voice_nudges ORDER BY created_at DESC LIMIT 50;'),
        client.query('SELECT * FROM mb_setup_config ORDER BY created_at DESC LIMIT 1;'),
        client.query('SELECT * FROM mb_staff ORDER BY name ASC;'),
        client.query('SELECT * FROM mb_expenses ORDER BY paid_date DESC, created_at DESC;'),
        client.query('SELECT * FROM mb_academic_programs ORDER BY slug ASC;'),
        client.query('SELECT * FROM mb_local_vendors ORDER BY name ASC;'),
        client.query('SELECT * FROM mb_quality_reviews ORDER BY created_at DESC LIMIT 50;'),
        client.query('SELECT * FROM mb_daily_handoffs ORDER BY date DESC LIMIT 1;')
      ]);

      const setupRow = setupRes.rows[0] || null;
      const formattedSetup = setupRow ? {
        id: setupRow.id,
        schoolName: setupRow.school_name,
        campusLocation: setupRow.campus_location,
        city: setupRow.city,
        state: setupRow.state,
        franchiseBrand: setupRow.franchise_brand,
        leadAcademicsName: setupRow.lead_academics_name,
        leadAcademicsTitle: setupRow.lead_academics_title,
        leadAcademicsPhone: setupRow.lead_academics_phone,
        leadAcademicsEmail: setupRow.lead_academics_email,
        leadBusinessName: setupRow.lead_business_name,
        leadBusinessTitle: setupRow.lead_business_title,
        leadBusinessPhone: setupRow.lead_business_phone,
        leadBusinessEmail: setupRow.lead_business_email,
        launchDate: setupRow.launch_date,
        targetEnrollment: Number(setupRow.target_enrollment || 50),
        totalBudgetAllocated: Number(setupRow.total_budget_allocated || 4500000),
        signingFeePaid: Number(setupRow.signing_fee_paid || 1500000),
        isSetupCompleted: Boolean(setupRow.is_setup_completed),
        setupStep: Number(setupRow.setup_step || 1)
      } : null;

      const handoffRow = handoffRes.rows[0] || null;

      return res.status(200).json({
        success: true,
        setupConfig: formattedSetup,
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
        })),
        staff: staffRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          role: r.role,
          status: r.status,
          policeVerified: Boolean(r.police_verified),
          firstAidCertified: Boolean(r.first_aid_certified),
          salary: Number(r.salary || 0),
          assignedClass: r.assigned_class,
          contact: r.contact
        })),
        expenses: expensesRes.rows.map(r => ({
          id: r.id,
          category: r.category,
          item: r.item,
          amount: Number(r.amount || 0),
          paidDate: r.paid_date,
          status: r.status,
          vendor: r.vendor,
          authorizedBy: r.authorized_by
        })),
        academicPrograms: curriculumRes.rows.map(r => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          ageBracket: r.age_bracket,
          icon: r.icon,
          description: r.description,
          learningCenters: r.learning_centers || [],
          weeklyThemes: r.weekly_themes || []
        })),
        vendors: vendorsRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          serviceCategory: r.service_category,
          area: r.area,
          phone: r.phone,
          contactPerson: r.contact_person,
          status: r.status
        })),
        reviews: reviewsRes.rows.map(r => ({
          id: r.id,
          itemTested: r.item_tested,
          tester: r.tester,
          rating: Number(r.rating || 5),
          verdict: r.verdict,
          comment: r.comment,
          createdAt: r.created_at
        })),
        handoff: handoffRow ? {
          id: handoffRow.id,
          date: handoffRow.date,
          afternoonPickupLead: handoffRow.afternoon_pickup_lead,
          statusNote: handoffRow.status_note
        } : null
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

      if (action === 'save-setup') {
        const s = payload;
        const setupId = s.id || 'default-school-config';
        await client.query(`
          INSERT INTO mb_setup_config (
            id, school_name, campus_location, city, state, franchise_brand,
            lead_academics_name, lead_academics_title, lead_academics_phone, lead_academics_email,
            lead_business_name, lead_business_title, lead_business_phone, lead_business_email,
            launch_date, target_enrollment, total_budget_allocated, signing_fee_paid,
            is_setup_completed, setup_step, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW()
          ) ON CONFLICT (id) DO UPDATE SET
            school_name = EXCLUDED.school_name,
            campus_location = EXCLUDED.campus_location,
            city = EXCLUDED.city,
            state = EXCLUDED.state,
            franchise_brand = EXCLUDED.franchise_brand,
            lead_academics_name = EXCLUDED.lead_academics_name,
            lead_academics_title = EXCLUDED.lead_academics_title,
            lead_academics_phone = EXCLUDED.lead_academics_phone,
            lead_academics_email = EXCLUDED.lead_academics_email,
            lead_business_name = EXCLUDED.lead_business_name,
            lead_business_title = EXCLUDED.lead_business_title,
            lead_business_phone = EXCLUDED.lead_business_phone,
            lead_business_email = EXCLUDED.lead_business_email,
            launch_date = EXCLUDED.launch_date,
            target_enrollment = EXCLUDED.target_enrollment,
            total_budget_allocated = EXCLUDED.total_budget_allocated,
            signing_fee_paid = EXCLUDED.signing_fee_paid,
            is_setup_completed = EXCLUDED.is_setup_completed,
            setup_step = EXCLUDED.setup_step,
            updated_at = NOW();
        `, [
          setupId,
          s.schoolName || '',
          s.campusLocation || '',
          s.city || '',
          s.state || '',
          s.franchiseBrand || '',
          s.leadAcademicsName || '',
          s.leadAcademicsTitle || 'Academic Director',
          s.leadAcademicsPhone || '',
          s.leadAcademicsEmail || '',
          s.leadBusinessName || '',
          s.leadBusinessTitle || 'Managing Director',
          s.leadBusinessPhone || '',
          s.leadBusinessEmail || '',
          s.launchDate || '',
          s.targetEnrollment || 50,
          s.totalBudgetAllocated || 4500000,
          s.signingFeePaid || 1500000,
          s.isSetupCompleted !== undefined ? s.isSetupCompleted : true,
          s.setupStep || 4
        ]);
        return res.status(200).json({ success: true, message: 'School setup configuration saved to Supabase' });
      }

      if (action === 'add-staff') {
        const m = payload;
        await client.query(`
          INSERT INTO mb_staff (id, name, role, status, police_verified, first_aid_certified, salary, assigned_class, contact)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            status = EXCLUDED.status,
            police_verified = EXCLUDED.police_verified,
            first_aid_certified = EXCLUDED.first_aid_certified,
            salary = EXCLUDED.salary,
            assigned_class = EXCLUDED.assigned_class,
            contact = EXCLUDED.contact,
            updated_at = NOW();
        `, [
          m.id || `staff-${Date.now()}`,
          m.name,
          m.role,
          m.status || 'Shortlisted',
          Boolean(m.policeVerified),
          Boolean(m.firstAidCertified),
          Number(m.salary || 0),
          m.assignedClass || null,
          m.contact
        ]);
        return res.status(200).json({ success: true, message: 'Staff member saved to Supabase' });
      }

      if (action === 'update-staff-verification') {
        const { id, policeVerified, firstAidCertified } = payload;
        await client.query(`
          UPDATE mb_staff 
          SET police_verified = COALESCE($1, police_verified),
              first_aid_certified = COALESCE($2, first_aid_certified),
              updated_at = NOW()
          WHERE id = $3;
        `, [policeVerified, firstAidCertified, id]);
        return res.status(200).json({ success: true, message: 'Staff verification updated' });
      }

      if (action === 'add-expense') {
        const exp = payload;
        await client.query(`
          INSERT INTO mb_expenses (id, category, item, amount, paid_date, status, vendor, authorized_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `, [
          exp.id || `exp-${Date.now()}`,
          exp.category,
          exp.item,
          Number(exp.amount),
          exp.paidDate || new Date().toISOString().split('T')[0],
          exp.status || 'Paid',
          exp.vendor || '',
          exp.authorizedBy || 'Joint'
        ]);
        return res.status(200).json({ success: true, message: 'Expense saved to Supabase' });
      }

      if (action === 'save-curriculum') {
        const p = payload;
        await client.query(`
          INSERT INTO mb_academic_programs (id, slug, name, age_bracket, icon, description, learning_centers, weekly_themes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            age_bracket = EXCLUDED.age_bracket,
            icon = EXCLUDED.icon,
            description = EXCLUDED.description,
            learning_centers = EXCLUDED.learning_centers,
            weekly_themes = EXCLUDED.weekly_themes,
            updated_at = NOW();
        `, [
          p.id || `prog-${p.slug}`,
          p.slug,
          p.name,
          p.ageBracket,
          p.icon,
          p.description,
          JSON.stringify(p.learningCenters || []),
          JSON.stringify(p.weeklyThemes || [])
        ]);
        return res.status(200).json({ success: true, message: 'Curriculum unit saved' });
      }

      if (action === 'add-vendor') {
        const v = payload;
        await client.query(`
          INSERT INTO mb_local_vendors (id, name, service_category, area, phone, contact_person, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [
          v.id || `vend-${Date.now()}`,
          v.name,
          v.serviceCategory,
          v.area,
          v.phone,
          v.contactPerson,
          v.status || 'Lead'
        ]);
        return res.status(200).json({ success: true, message: 'Vendor saved' });
      }

      if (action === 'add-review') {
        const r = payload;
        await client.query(`
          INSERT INTO mb_quality_reviews (id, item_tested, tester, rating, verdict, comment)
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [
          r.id || `rev-${Date.now()}`,
          r.itemTested,
          r.tester,
          Number(r.rating || 5),
          r.verdict || 'Approved for Campus',
          r.comment || ''
        ]);
        return res.status(200).json({ success: true, message: 'Quality review recorded' });
      }

      if (action === 'update-handoff') {
        const h = payload;
        await client.query(`
          INSERT INTO mb_daily_handoffs (id, date, afternoon_pickup_lead, status_note)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE SET
            afternoon_pickup_lead = EXCLUDED.afternoon_pickup_lead,
            status_note = EXCLUDED.status_note,
            updated_at = NOW();
        `, [
          h.id || `handoff-${h.date || new Date().toISOString().split('T')[0]}`,
          h.date || new Date().toISOString().split('T')[0],
          h.afternoonPickupLead,
          h.statusNote || null
        ]);
        return res.status(200).json({ success: true, message: 'Daily pickup handoff saved' });
      }

      return res.status(400).json({ error: 'Unknown action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Supabase DB handler error:', error);
    return res.status(500).json({ error: error.message || 'Database error' });
  }
}
