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


export const INITIAL_NUDGES: VoiceNudge[] = [];

export const INITIAL_INQUIRIES: ParentInquiry[] = [];

export const INITIAL_FACILITY_ZONES: FacilityZone[] = [
  {
    id: 'zone-1',
    name: 'Canadian Welcome Lobby & Reception',
    status: 'Planning',
    progress: 0,
    targetDate: 'Day 12',
    canadianSpecs: 'Maple Bear branded acrylic signage, child-height counter, coffee lounge for parents',
    toddlerSafetyRating: 5,
    budgetAllocated: 250000,
    budgetSpent: 0,
    lead: 'Managing Director'
  },
  {
    id: 'zone-2',
    name: 'Toddler Explorer Room (1.5 - 2.5 yrs)',
    status: 'Planning',
    progress: 0,
    targetDate: 'Day 18',
    canadianSpecs: 'Rounded birchwood tables, sensory discovery wall, EVA foam cushioned floor',
    toddlerSafetyRating: 5,
    budgetAllocated: 380000,
    budgetSpent: 0,
    lead: 'Academic Director'
  },
  {
    id: 'zone-3',
    name: 'Nursery Canadian Nest (2.5 - 3.5 yrs)',
    status: 'Planning',
    progress: 0,
    targetDate: 'Day 26',
    canadianSpecs: 'Low-VOC non-toxic red & cream palette, magnetic word walls, reading teepee',
    toddlerSafetyRating: 5,
    budgetAllocated: 340000,
    budgetSpent: 0,
    lead: 'Academic Director'
  },
  {
    id: 'zone-4',
    name: 'Kindergarten Discovery Hub (Jr & Sr KG)',
    status: 'Planning',
    progress: 0,
    targetDate: 'Day 34',
    canadianSpecs: 'Science exploration tables, math manipulatives, dual-height collaborative benches',
    toddlerSafetyRating: 5,
    budgetAllocated: 420000,
    budgetSpent: 0,
    lead: 'Managing Director'
  },
  {
    id: 'zone-5',
    name: 'Outdoor Shaded Play Lawn & Splash Pool',
    status: 'Planning',
    progress: 0,
    targetDate: 'Day 42',
    canadianSpecs: '40mm high-density rubber turf, UV tensile heat canopies, Canadian swing sets',
    toddlerSafetyRating: 5,
    budgetAllocated: 550000,
    budgetSpent: 0,
    lead: 'Managing Director'
  },
  {
    id: 'zone-6',
    name: 'Quiet Rest Suite & Pediatric Isolation Lounge',
    status: 'Planning',
    progress: 0,
    targetDate: 'Day 22',
    canadianSpecs: 'Individual memory foam nap cots, air purifier, dimmable circadian warm lighting',
    toddlerSafetyRating: 5,
    budgetAllocated: 180000,
    budgetSpent: 0,
    lead: 'Academic Director'
  }
];

export const INITIAL_STAFF: StaffMember[] = [];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    category: 'Franchise Signing & Royalty',
    item: 'Maple Bear Master Franchise Signing Fee',
    amount: 1500000,
    paidDate: '2026-09-25',
    status: 'Paid',
    vendor: 'Maple Bear South Asia Education Pvt Ltd',
    authorizedBy: 'Joint'
  },
  {
    id: 'exp-2',
    category: 'Civil & Kota Stone',
    item: 'Subhash Nagar Campus Lease Stamp Duty & Security Deposit',
    amount: 600000,
    paidDate: '2026-09-24',
    status: 'Paid',
    vendor: 'Property Lessor',
    authorizedBy: 'Managing Director'
  },
  {
    id: 'exp-3',
    category: 'Civil & Kota Stone',
    item: 'Civil Renovation Advance & Safety Floor Polishing',
    amount: 350000,
    paidDate: '2026-09-25',
    status: 'Advance Done',
    vendor: 'Kota Civil & Stone Works',
    authorizedBy: 'Managing Director'
  },
  {
    id: 'exp-4',
    category: 'Canadian Play Equipment',
    item: 'Canadian Early Childhood Birch Wood Furniture & Sensory Kits',
    amount: 480000,
    paidDate: '2026-09-23',
    status: 'Scheduled',
    vendor: 'Maple Bear Authorized Equipment India',
    authorizedBy: 'Academic Director'
  },
  {
    id: 'exp-5',
    category: 'HVAC & Kota Heat-Shield',
    item: '6 Inverter Air Conditioners & High-CFM Desert Coolers',
    amount: 285000,
    paidDate: '2026-09-25',
    status: 'Scheduled',
    vendor: 'Gumanpura Electronics Hub Kota',
    authorizedBy: 'Managing Director'
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

export const TODDLER_REVIEWS: any[] = [];

