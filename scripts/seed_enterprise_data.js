import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://postgres.hbnsrblknhmxdaogjjeb:CAPSLOCKoff21%23123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  console.log('Seeding enterprise data into Supabase...');

  // 1. Seed Academic Programs (4 core programs)
  const existingPrograms = await pool.query('SELECT count(*) FROM mb_academic_programs');
  if (parseInt(existingPrograms.rows[0].count) === 0) {
    console.log('Seeding mb_academic_programs...');
    const programs = [
      {
        id: 'prog-toddler',
        slug: 'toddler',
        name: 'Toddler Explorer',
        age_bracket: '12 - 24 Months',
        icon: 'Baby',
        description: 'Sensory-rich bilingual immersion with child-led exploratory stations and gross-motor development.',
        learning_centers: JSON.stringify([
          'Sensory & Water Table',
          'Soft Block Construction',
          'Bilingual Story Corner',
          'Miniature Washroom Readiness'
        ]),
        weekly_themes: JSON.stringify([
          { week: 1, title: 'Gentle Separation & Primary Attachments' },
          { week: 2, title: 'Sensory Textures: Kota Wool & Wet Sand' },
          { week: 3, title: 'Sound Discovery: Maple Rhythm Shakers' },
          { week: 4, title: 'Color Splashes & Finger Painting' }
        ])
      },
      {
        id: 'prog-nursery',
        slug: 'nursery',
        name: 'Nursery Discovery',
        age_bracket: '2 - 3 Years',
        icon: 'Sparkles',
        description: 'Canadian early literacy and numeracy through hands-on role play and natural curiosity cultivation.',
        learning_centers: JSON.stringify([
          'Bilingual Phonetics Reading Nook',
          'Canadian Dramatic Play & Puppet Theater',
          'Math Manipulatives & Pegboards',
          'Indoor Sand & Water Exploratory Lab'
        ]),
        weekly_themes: JSON.stringify([
          { week: 1, title: 'All About Me & My Classroom Family' },
          { week: 2, title: 'Colors of Nature & Falling Maple Leaves' },
          { week: 3, title: 'Shapes in our Kota Environment' },
          { week: 4, title: 'Friendly Animals & Farm Life' }
        ])
      },
      {
        id: 'prog-junior-kg',
        slug: 'junior-kg',
        name: 'Junior Kindergarten',
        age_bracket: '3 - 4 Years',
        icon: 'BookOpen',
        description: 'Structured phonemic awareness, emergent numeracy, and creative problem-solving projects.',
        learning_centers: JSON.stringify([
          'Alphabet Sound Bins & Writing Center',
          'Scientific Inquiry & Magnifying Bench',
          'Loose Parts Wooden Engineering Zone',
          'Mindful Calm Corner & Music Pod'
        ]),
        weekly_themes: JSON.stringify([
          { week: 1, title: 'Community Helpers in Kota' },
          { week: 2, title: 'Weather Wonders & Chambal Seasons' },
          { week: 3, title: 'Seeds, Sprouts & Green Shoots' },
          { week: 4, title: 'Story Weaving & Character Roles' }
        ])
      },
      {
        id: 'prog-senior-kg',
        slug: 'senior-kg',
        name: 'Senior Kindergarten',
        age_bracket: '4 - 5 Years',
        icon: 'Award',
        description: 'Primary school readiness with advanced bilingual reading, early arithmetic, and inquiry science.',
        learning_centers: JSON.stringify([
          'Young Writers & Illustrators Studio',
          'STEM Construction & Balance Scales',
          'Global Geography & Cultural Maps',
          'Digital Wonder & Audio Listening Station'
        ]),
        weekly_themes: JSON.stringify([
          { week: 1, title: 'Space, Stars & Night Skies' },
          { week: 2, title: 'Chambal River Ecosystem & Wildlife' },
          { week: 3, title: 'Inventions, Simple Machines & Wheels' },
          { week: 4, title: 'Graduation Milestones & Future Dreams' }
        ])
      }
    ];

    for (const p of programs) {
      await pool.query(
        `INSERT INTO mb_academic_programs (id, slug, name, age_bracket, icon, description, learning_centers, weekly_themes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.slug, p.name, p.age_bracket, p.icon, p.description, p.learning_centers, p.weekly_themes]
      );
    }
  }

  // 2. Seed Local Vendors
  const existingVendors = await pool.query('SELECT count(*) FROM mb_local_vendors');
  if (parseInt(existingVendors.rows[0].count) === 0) {
    console.log('Seeding mb_local_vendors...');
    const vendors = [
      {
        id: 'vnd-1',
        name: 'Hadoti Stone Crafts & Flooring',
        service_category: 'Kota Matte Stone Flooring',
        area: 'Indraprastha Industrial Area, Kota',
        phone: '+91 98290 11223',
        contact_person: 'Suresh Gujjar (Master Mason)',
        status: 'Advance Paid'
      },
      {
        id: 'vnd-2',
        name: 'Gumanpura Thermal & HVAC Solutions',
        service_category: 'Central Heat-Shield AC & Ventilation',
        area: 'Gumanpura Market, Kota',
        phone: '+91 94145 77881',
        contact_person: 'Mahesh Agarwal',
        status: 'Quotation Approved'
      },
      {
        id: 'vnd-3',
        name: 'SafeGlass & Architectural Fittings',
        service_category: 'Finger-Safe Acoustic Glass Partitions',
        area: 'Vigyan Nagar Road, Kota',
        phone: '+91 94141 88992',
        contact_person: 'Dharmendra Soni',
        status: 'On Site'
      },
      {
        id: 'vnd-4',
        name: 'Rajasthan KidSafe Play Equipment',
        service_category: 'Canadian Spec Soft Wood & Foam Structures',
        area: 'Transport Nagar, Kota',
        phone: '+91 98292 44331',
        contact_person: 'Balwant Singh',
        status: 'Delivered'
      }
    ];

    for (const v of vendors) {
      await pool.query(
        `INSERT INTO mb_local_vendors (id, name, service_category, area, phone, contact_person, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [v.id, v.name, v.service_category, v.area, v.phone, v.contact_person, v.status]
      );
    }
  }

  // 3. Seed Quality Reviews
  const existingReviews = await pool.query('SELECT count(*) FROM mb_quality_reviews');
  if (parseInt(existingReviews.rows[0].count) === 0) {
    console.log('Seeding mb_quality_reviews...');
    const reviews = [
      {
        id: 'rev-1',
        item_tested: 'Zone 1 Kota Matte Stone Traction & Slip Resistance',
        tester: 'Dr. Priya Sharma & Baby Aarav',
        rating: 5,
        verdict: 'Approved for Campus',
        comment: 'Tested with barefoot walking and soapy water droplet test. Matte finish delivers 0% slip risk even during high toddler activity.'
      },
      {
        id: 'rev-2',
        item_tested: 'Canadian Birchwood Low-Slung Toy Cubbies & Radius Edges',
        tester: 'Ananya Dave & Myra',
        rating: 5,
        verdict: 'Approved for Campus',
        comment: 'All 90-degree corners replaced with 15mm rounded radius profile. Height accessible at 42cm for independent child cleanup.'
      },
      {
        id: 'rev-3',
        item_tested: 'Acoustic Door Pinch Guards & Soft-Close Dampers',
        tester: 'Campus Safety Audit Lead',
        rating: 4,
        verdict: 'Modifications Required',
        comment: 'Main entrance hinge cover installed successfully. Need secondary guard on Nursery washroom swinging door before occupancy.'
      }
    ];

    for (const r of reviews) {
      await pool.query(
        `INSERT INTO mb_quality_reviews (id, item_tested, tester, rating, verdict, comment)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [r.id, r.item_tested, r.tester, r.rating, r.verdict, r.comment]
      );
    }
  }

  // 4. Seed Daily Handoff
  const existingHandoff = await pool.query('SELECT count(*) FROM mb_daily_handoffs');
  if (parseInt(existingHandoff.rows[0].count) === 0) {
    console.log('Seeding mb_daily_handoffs...');
    await pool.query(
      `INSERT INTO mb_daily_handoffs (id, date, afternoon_pickup_lead, status_note)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [
        'handoff-today',
        new Date().toISOString().split('T')[0],
        'Ananya',
        'Morning parent tours managed by Priya. Ananya on afternoon Allen faculty consultations and toddler pickup duty.'
      ]
    );
  }

  console.log('Database enterprise tables successfully verified and seeded!');
  await pool.end();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
