import { CoFounder, VoiceNudge, ParentInquiry, FacilityZone, StaffMember, ExpenseItem, SetupConfig } from '../types';

export const DEFAULT_SETUP_CONFIG: SetupConfig = {
  schoolName: 'Maple Bear Canadian School',
  campusLocation: 'Subhash Nagar',
  city: 'Kota',
  state: 'Rajasthan',
  franchiseBrand: 'Maple Bear Global',
  leadAcademicsName: 'Academic Director',
  leadAcademicsTitle: 'Co-Founder & Academic Director',
  leadAcademicsPhone: '',
  leadAcademicsEmail: '',
  leadAcademicsChildName: 'Child',
  leadAcademicsChildAge: '3 yrs',
  leadBusinessName: 'Managing Director',
  leadBusinessTitle: 'Co-Founder & Managing Director',
  leadBusinessPhone: '',
  leadBusinessEmail: '',
  leadBusinessChildName: 'Child',
  leadBusinessChildAge: '3 yrs',
  launchDate: '2026-11-15',
  targetEnrollment: 50,
  totalBudgetAllocated: 4500000,
  signingFeePaid: 1500000,
  isSetupCompleted: false,
  setupStep: 1
};

export function getCoFounders(config?: SetupConfig | null): Record<string, CoFounder> {
  const c = config || DEFAULT_SETUP_CONFIG;
  return {
    academics: {
      id: 'academics',
      name: c.leadAcademicsName || 'Academic Director',
      title: c.leadAcademicsTitle || 'Co-Founder & Academic Director',
      age: 32,
      childName: c.leadAcademicsChildName || 'Child',
      childAge: c.leadAcademicsChildAge || '3 yrs',
      avatarColor: 'bg-rose-500',
      role: 'academics',
      phone: c.leadAcademicsPhone || '',
      email: c.leadAcademicsEmail || '',
      currentStatus: 'Classroom curriculum & sensory setup',
      statusIcon: '🎨'
    },
    business: {
      id: 'business',
      name: c.leadBusinessName || 'Managing Director',
      title: c.leadBusinessTitle || 'Co-Founder & Managing Director',
      age: 33,
      childName: c.leadBusinessChildName || 'Child',
      childAge: c.leadBusinessChildAge || '3 yrs',
      avatarColor: 'bg-indigo-600',
      role: 'business',
      phone: c.leadBusinessPhone || '',
      email: c.leadBusinessEmail || '',
      currentStatus: 'Facility inspections & admissions launch',
      statusIcon: '🏛️'
    }
  };
}

export const CO_FOUNDERS: Record<string, CoFounder> = getCoFounders();


export const INITIAL_NUDGES: VoiceNudge[] = [
  {
    id: 'nudge-1',
    from: 'Ananya (Business)',
    to: 'Priya (Academics)',
    message: 'Kota stone in Toddler Explorer Room has been mirror-polished with child-safe matte edges. Looks stunning!',
    timestamp: '10:15 AM',
    tag: 'Site Visit',
    duration: '0:14'
  },
  {
    id: 'nudge-2',
    from: 'Priya (Academics)',
    to: 'Ananya (Business)',
    message: 'Aarav and Myra loved the Canadian wooden block station today! Toddler test passed with 5 stars 🌟',
    timestamp: '11:40 AM',
    tag: 'Toddler',
    duration: '0:22'
  },
  {
    id: 'nudge-3',
    from: 'Ananya (Business)',
    to: 'Priya (Academics)',
    message: 'Chief pediatric doctor from New Medical College hospital booked a campus tour for her 3yo twin boys this Friday!',
    timestamp: '1:10 PM',
    tag: 'Parent',
    duration: '0:18'
  },
  {
    id: 'nudge-4',
    from: 'Priya (Academics)',
    to: 'Ananya (Business)',
    message: 'Teacher candidate Sunita gave a fabulous demo storytelling session. Recommending we issue offer letter today.',
    timestamp: '3:05 PM',
    tag: 'Franchise',
    duration: '0:26'
  }
];

export const INITIAL_INQUIRIES: ParentInquiry[] = [
  {
    id: 'inq-101',
    parentName: 'Dr. Radhika & Dr. Amit Mehta',
    phone: '+91 94141 23456',
    email: 'radhika.mehta@nmch-kota.in',
    childName: 'Kabir & Vivaan (Twins)',
    childAge: '3 yrs',
    grade: 'Nursery',
    locality: 'Mahaveer Nagar',
    parentBackground: 'Doctor (Medical College/Private)',
    status: 'Tour Booked',
    tourDate: '2026-09-28T10:00:00',
    notes: 'Father is HOD Cardiology, Mother Pediatrician. Looking for high hygiene, non-crowded teacher ratio, and Canadian sensory play.',
    dateLogged: '2026-09-25'
  },
  {
    id: 'inq-102',
    parentName: 'Er. Rajesh Khandelwal',
    phone: '+91 98292 98765',
    email: 'rajesh.k@allen-kota.ac.in',
    childName: 'Anvi Khandelwal',
    childAge: '2.5 yrs',
    grade: 'Toddler',
    locality: 'Talwandi',
    parentBackground: 'Allen Faculty',
    status: 'Tour Done',
    tourDate: '2026-09-24T16:30:00',
    notes: 'Senior Physics Faculty at Allen. Extremely impressed by anti-finger-trap doors and Canadian bilingual immersion. Requested fee structure.',
    dateLogged: '2026-09-23'
  },
  {
    id: 'inq-103',
    parentName: 'Sneha & Vikram Singhal',
    phone: '+91 97851 11223',
    email: 'singhal.vikram@gmail.com',
    childName: 'Reyansh Singhal',
    childAge: '3.5 yrs',
    grade: 'Junior KG',
    locality: 'Subhash Nagar',
    parentBackground: 'Businessman/Trader',
    status: 'Enrolled',
    notes: 'Neighbors in Subhash Nagar. Enrolled under Early Bird Founder scheme. Paid Term 1 advance fee.',
    dateLogged: '2026-09-22'
  },
  {
    id: 'inq-104',
    parentName: 'Prof. Neha Saxena',
    phone: '+91 99280 44556',
    email: 'neha.saxena@resonance.in',
    childName: 'Ira Saxena',
    childAge: '2 yrs',
    grade: 'Toddler',
    locality: 'Vigyan Nagar',
    parentBackground: 'Resonance/Motion Faculty',
    status: 'New Inquiry',
    notes: 'Chemistry faculty at Resonance. Inquired about afternoon Daycare option till 5:30 PM due to coaching lecture shifts.',
    dateLogged: '2026-09-25'
  },
  {
    id: 'inq-105',
    parentName: 'Dr. Pankaj Sharma',
    phone: '+91 94140 77889',
    email: 'pankaj.ortho@kota.org',
    childName: 'Devansh Sharma',
    childAge: '4 yrs',
    grade: 'Junior KG',
    locality: 'Aerodrome',
    parentBackground: 'Doctor (Medical College/Private)',
    status: 'Form Submitted',
    notes: 'Senior Orthopedic Surgeon. Wants child to build physical literacy and balance. Visited outdoor play turf.',
    dateLogged: '2026-09-24'
  }
];

export const INITIAL_FACILITY_ZONES: FacilityZone[] = [
  {
    id: 'zone-1',
    name: 'Canadian Welcome Lobby & Reception',
    status: 'Furnished',
    progress: 90,
    targetDate: 'Day 12',
    canadianSpecs: 'Maple Bear branded acrylic signage, child-height counter, coffee lounge for parents',
    toddlerSafetyRating: 5,
    budgetAllocated: 250000,
    budgetSpent: 235000,
    lead: 'Ananya'
  },
  {
    id: 'zone-2',
    name: 'Toddler Explorer Room (1.5 - 2.5 yrs)',
    status: 'Ready for Kids',
    progress: 100,
    targetDate: 'Day 18',
    canadianSpecs: 'Rounded birchwood tables, sensory discovery wall, EVA foam cushioned floor',
    toddlerSafetyRating: 5,
    budgetAllocated: 380000,
    budgetSpent: 365000,
    lead: 'Priya'
  },
  {
    id: 'zone-3',
    name: 'Nursery Canadian Nest (2.5 - 3.5 yrs)',
    status: 'Canadian Painting',
    progress: 75,
    targetDate: 'Day 26',
    canadianSpecs: 'Low-VOC non-toxic red & cream palette, magnetic word walls, reading teepee',
    toddlerSafetyRating: 4,
    budgetAllocated: 340000,
    budgetSpent: 260000,
    lead: 'Priya'
  },
  {
    id: 'zone-4',
    name: 'Kindergarten Discovery Hub (Jr & Sr KG)',
    status: 'Kota Stone Polishing',
    progress: 60,
    targetDate: 'Day 34',
    canadianSpecs: 'Science exploration tables, math manipulatives, dual-height collaborative benches',
    toddlerSafetyRating: 4,
    budgetAllocated: 420000,
    budgetSpent: 270000,
    lead: 'Ananya'
  },
  {
    id: 'zone-5',
    name: 'Outdoor Shaded Play Lawn & Splash Pool',
    status: 'Demolition',
    progress: 45,
    targetDate: 'Day 42',
    canadianSpecs: '40mm high-density rubber turf, UV tensile heat canopies, Canadian swing sets',
    toddlerSafetyRating: 3,
    budgetAllocated: 550000,
    budgetSpent: 240000,
    lead: 'Ananya'
  },
  {
    id: 'zone-6',
    name: 'Quiet Rest Suite & Pediatric Isolation Lounge',
    status: 'Furnished',
    progress: 85,
    targetDate: 'Day 22',
    canadianSpecs: 'Individual memory foam nap cots, air purifier, dimmable circadian warm lighting',
    toddlerSafetyRating: 5,
    budgetAllocated: 180000,
    budgetSpent: 165000,
    lead: 'Priya'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Sunita Rathore, M.A., B.Ed',
    role: 'Lead Educator',
    status: 'Canadian Certified',
    policeVerified: true,
    firstAidCertified: true,
    salary: 32000,
    assignedClass: 'Nursery (Canadian Nest)',
    contact: '+91 94142 88990'
  },
  {
    id: 'staff-2',
    name: 'Meenakshi Jain, NTT',
    role: 'Early Years Teacher',
    status: 'Active',
    policeVerified: true,
    firstAidCertified: true,
    salary: 26000,
    assignedClass: 'Toddler Explorer Room',
    contact: '+91 98293 44551'
  },
  {
    id: 'staff-3',
    name: 'Kavita Dave, M.Sc ECE',
    role: 'Center Head',
    status: 'Canadian Certified',
    policeVerified: true,
    firstAidCertified: true,
    salary: 45000,
    assignedClass: 'All Sections / Admin',
    contact: '+91 99281 66772'
  },
  {
    id: 'staff-4',
    name: 'Kamla Bai',
    role: 'Caregiver / Didi',
    status: 'Active',
    policeVerified: true,
    firstAidCertified: true,
    salary: 14000,
    assignedClass: 'Toddler Care & Washrooms',
    contact: '+91 97850 33445'
  },
  {
    id: 'staff-5',
    name: 'Ram Singh Gurjar',
    role: 'Security Officer',
    status: 'Active',
    policeVerified: true,
    firstAidCertified: false,
    salary: 16000,
    assignedClass: 'Main Security Gate',
    contact: '+91 96102 55667'
  },
  {
    id: 'staff-6',
    name: 'Mukesh Choudhary',
    role: 'Bus Driver',
    status: 'Active',
    policeVerified: true,
    firstAidCertified: true,
    salary: 18000,
    assignedClass: 'Van Route 1 (Talwandi - Subhash Nagar)',
    contact: '+91 94145 77881'
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    category: 'Franchise Signing & Royalty',
    item: 'Maple Bear Master Franchise Signing Fee (Paid Today!)',
    amount: 1500000,
    paidDate: '2026-09-25',
    status: 'Paid',
    vendor: 'Maple Bear South Asia Education Pvt Ltd',
    authorizedBy: 'Joint'
  },
  {
    id: 'exp-2',
    category: 'Civil & Kota Stone',
    item: 'Subhash Nagar 9-year Lease Stamp Duty & Security Deposit',
    amount: 600000,
    paidDate: '2026-09-24',
    status: 'Paid',
    vendor: 'Subhash Nagar Landlord (B.L. Gupta)',
    authorizedBy: 'Ananya'
  },
  {
    id: 'exp-3',
    category: 'Civil & Kota Stone',
    item: 'Civil Renovation Advance & Premium Kota Stone Mirror Polishing',
    amount: 350000,
    paidDate: '2026-09-25',
    status: 'Advance Done',
    vendor: 'Hadoti Constructions & Kota Stone Crafts',
    authorizedBy: 'Ananya'
  },
  {
    id: 'exp-4',
    category: 'Canadian Play Equipment',
    item: 'Canadian Early Childhood Birch Wood Furniture & Sensory Kits',
    amount: 480000,
    paidDate: '2026-09-23',
    status: 'Scheduled',
    vendor: 'Maple Bear Authorized Equipment India',
    authorizedBy: 'Priya'
  },
  {
    id: 'exp-5',
    category: 'HVAC & Kota Heat-Shield',
    item: '6 Inverter Air Conditioners & High-CFM Desert Coolers',
    amount: 285000,
    paidDate: '2026-09-25',
    status: 'Scheduled',
    vendor: 'Gumanpura Electronics Hub Kota',
    authorizedBy: 'Ananya'
  },
  {
    id: 'exp-6',
    category: 'Marketing & Signage',
    item: 'Canadian Maple Leaf Acrylic 3D Lit Facade Signboard & Brochures',
    amount: 140000,
    paidDate: '2026-09-24',
    status: 'Advance Done',
    vendor: 'Kota City Signs & Print Media',
    authorizedBy: 'Joint'
  }
];

export const TODDLER_REVIEWS = [
  {
    id: 'tr-1',
    tester: 'Aarav (Priya\'s 3yo)',
    item: 'Canadian Birch Wood Unit Blocks',
    rating: 5,
    comment: 'Stacked 6 blocks high without falling! Rounded corners feel gentle on tiny hands.',
    verdict: 'Approved for Toddler Explorer Room'
  },
  {
    id: 'tr-2',
    tester: 'Myra (Ananya\'s 3yo)',
    item: 'Indoor Sensory Sand Table',
    rating: 5,
    comment: 'Played for 35 minutes non-stop. Low height (48cm) is perfect for standing without leaning.',
    verdict: 'Approved for Nursery Canadian Nest'
  },
  {
    id: 'tr-3',
    tester: 'Aarav & Myra',
    item: 'Toddler Nap Memory Foam Cot',
    rating: 4.8,
    comment: 'Fell asleep in 8 minutes with the soft lullaby speaker. Mattress doesn\'t heat up in Kota weather.',
    verdict: 'Approved for Quiet Rest Suite'
  }
];
