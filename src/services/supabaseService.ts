import { 
  TaskItem, ParentInquiry, FacilityZone, VoiceNudge, SetupConfig, 
  StaffMember, ExpenseItem, AcademicProgram, LocalVendor, QualityReview, DailyHandoff 
} from '../types';

export interface SupabaseInitialData {
  tasks: TaskItem[];
  inquiries: ParentInquiry[];
  facilityZones: FacilityZone[];
  nudges: VoiceNudge[];
  setupConfig?: SetupConfig | null;
  staff: StaffMember[];
  expenses: ExpenseItem[];
  academicPrograms: AcademicProgram[];
  vendors: LocalVendor[];
  reviews: QualityReview[];
  handoff?: DailyHandoff | null;
}

export async function fetchInitialDataFromSupabase(): Promise<SupabaseInitialData | null> {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) {
      console.warn('Failed to fetch from /api/data, status:', res.status);
      return null;
    }
    const data = await res.json();
    if (data.success && (data.tasks || data.setupConfig)) {
      return {
        tasks: data.tasks || [],
        inquiries: data.inquiries || [],
        facilityZones: data.facilityZones || [],
        nudges: data.nudges || [],
        setupConfig: data.setupConfig || null,
        staff: data.staff || [],
        expenses: data.expenses || [],
        academicPrograms: data.academicPrograms || [],
        vendors: data.vendors || [],
        reviews: data.reviews || [],
        handoff: data.handoff || null
      };
    }
    return null;
  } catch (err) {
    console.warn('Network/Supabase fetch error, fallback to local state:', err);
    return null;
  }
}

export async function syncTaskToSupabase(task: TaskItem): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-task',
        payload: {
          id: task.id,
          status: task.status,
          executionPlan: task.executionPlan
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync task to Supabase:', err);
    return false;
  }
}

export async function syncInquiryToSupabase(inquiry: ParentInquiry): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add-inquiry',
        payload: inquiry
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync inquiry to Supabase:', err);
    return false;
  }
}

export async function syncZoneProgressToSupabase(id: string, progress: number, status: string): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-zone-progress',
        payload: { id, progress, status }
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync zone to Supabase:', err);
    return false;
  }
}

export async function syncNudgeToSupabase(nudge: VoiceNudge): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add-nudge',
        payload: nudge
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync nudge to Supabase:', err);
    return false;
  }
}

export async function syncSetupToSupabase(setup: SetupConfig): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save-setup',
        payload: setup
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync setup config to Supabase:', err);
    return false;
  }
}

export async function syncStaffToSupabase(staffMember: StaffMember): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add-staff',
        payload: staffMember
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync staff to Supabase:', err);
    return false;
  }
}

export async function syncStaffVerificationToSupabase(id: string, policeVerified?: boolean, firstAidCertified?: boolean): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-staff-verification',
        payload: { id, policeVerified, firstAidCertified }
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync staff verification to Supabase:', err);
    return false;
  }
}

export async function syncExpenseToSupabase(expense: ExpenseItem): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add-expense',
        payload: expense
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync expense to Supabase:', err);
    return false;
  }
}

export async function syncCurriculumToSupabase(program: AcademicProgram): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save-curriculum',
        payload: program
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync curriculum to Supabase:', err);
    return false;
  }
}

export async function syncVendorToSupabase(vendor: LocalVendor): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add-vendor',
        payload: vendor
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync vendor to Supabase:', err);
    return false;
  }
}

export async function syncReviewToSupabase(review: QualityReview): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add-review',
        payload: review
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync review to Supabase:', err);
    return false;
  }
}

export async function syncHandoffToSupabase(handoff: DailyHandoff): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-handoff',
        payload: handoff
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync handoff to Supabase:', err);
    return false;
  }
}


