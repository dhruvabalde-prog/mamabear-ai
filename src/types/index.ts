export type FounderRole = 'academics' | 'business' | 'common';
export type ActiveFounderRole = 'academics' | 'business';

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  founderRole: FounderRole;
  isAutomation?: boolean; // For the 50 automations
  isOneOff?: boolean; // For the 50 one-off common tasks
  description: string;
  estimatedDays: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  phaseDay: number; // 1 to 60 for launch roadmap
  tags: string[];
  department: string;
  canadianSpec?: string;
  kotaSpec?: string;
  kidCompatibility?: 'kid_friendly' | 'deep_work_no_kids';
  executionPlan?: {
    summary: string;
    steps: string[];
    checklist: { id: string; text: string; done: boolean }[];
    draftMessage?: string;
    founderTips?: string;
    syncedGoogle?: {
      calendar?: boolean;
      tasks?: boolean;
      gmail?: boolean;
      drive?: boolean;
    };
  };
}

export interface ChatChannelMessage {
  id: string;
  sender: string;
  senderRole: string;
  avatar: string;
  text: string;
  timestamp: string;
  channel: 'founders' | 'parents' | 'maplebear_hq' | 'staff' | 'vendors';
  isAudio?: boolean;
  duration?: string;
  whatsappRecipientPhone?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface CoFounder {
  id: string;
  name: string;
  title: string;
  age: number;
  childName: string;
  childAge: string;
  avatarColor: string;
  role: 'academics' | 'business';
  phone: string;
  email: string;
  currentStatus: string;
  statusIcon: string;
}

export interface VoiceNudge {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  tag: 'Urgent' | 'Site Visit' | 'Parent' | 'Toddler' | 'Franchise' | 'Celebration';
  duration?: string;
  audioPlayed?: boolean;
}

export interface ParentInquiry {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  childName: string;
  childAge: string;
  grade: 'Toddler' | 'Nursery' | 'Junior KG' | 'Senior KG' | 'Daycare';
  locality: 'Subhash Nagar' | 'Talwandi' | 'Vigyan Nagar' | 'Mahaveer Nagar' | 'Aerodrome' | 'Other Kota';
  parentBackground: 'Allen Faculty' | 'Resonance/Motion Faculty' | 'Doctor (Medical College/Private)' | 'Businessman/Trader' | 'Other Professional';
  status: 'New Inquiry' | 'Tour Booked' | 'Tour Done' | 'Form Submitted' | 'Enrolled';
  tourDate?: string;
  notes: string;
  dateLogged: string;
}

export interface FacilityZone {
  id: string;
  name: string;
  status: 'Planning' | 'Demolition' | 'Kota Stone Polishing' | 'Canadian Painting' | 'Furnished' | 'Ready for Kids';
  progress: number;
  targetDate: string;
  canadianSpecs: string;
  toddlerSafetyRating: number; // 1 to 5
  budgetAllocated: number;
  budgetSpent: number;
  lead: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Lead Educator' | 'Early Years Teacher' | 'Activity Specialist' | 'Center Head' | 'Caregiver / Didi' | 'Security Officer' | 'Bus Driver';
  status: 'Shortlisted' | 'Audition Passed' | 'Canadian Certified' | 'Active';
  policeVerified: boolean;
  firstAidCertified: boolean;
  salary: number;
  assignedClass?: string;
  contact: string;
}

export interface ExpenseItem {
  id: string;
  category: 'Franchise Signing & Royalty' | 'Civil & Kota Stone' | 'Canadian Play Equipment' | 'HVAC & Kota Heat-Shield' | 'Marketing & Signage' | 'Staff Pre-launch' | 'Contingency';
  item: string;
  amount: number;
  paidDate: string;
  status: 'Paid' | 'Advance Done' | 'Scheduled';
  vendor: string;
  authorizedBy: string;
}

export interface SetupConfig {
  id?: string;
  schoolName: string;
  campusLocation: string;
  city: string;
  state: string;
  franchiseBrand: string;
  leadAcademicsName: string;
  leadAcademicsTitle: string;
  leadAcademicsPhone: string;
  leadAcademicsEmail: string;
  leadAcademicsChildName?: string;
  leadAcademicsChildAge?: string;
  leadBusinessName: string;
  leadBusinessTitle: string;
  leadBusinessPhone: string;
  leadBusinessEmail: string;
  leadBusinessChildName?: string;
  leadBusinessChildAge?: string;
  launchDate: string;
  targetEnrollment: number;
  totalBudgetAllocated: number;
  signingFeePaid: number;
  isSetupCompleted: boolean;
  setupStep: number;
}

export interface AcademicProgram {
  id: string;
  slug: string;
  name: string;
  ageBracket: string;
  icon: string;
  description: string;
  learningCenters: string[];
  weeklyThemes: { week: number; title: string; description?: string }[];
}

export interface LocalVendor {
  id: string;
  name: string;
  serviceCategory: string;
  area: string;
  phone: string;
  contactPerson: string;
  status: 'Lead' | 'Quotation Approved' | 'Advance Paid' | 'On Site' | 'Delivered' | 'Completed';
}

export interface QualityReview {
  id: string;
  itemTested: string;
  tester: string;
  rating: number;
  verdict: 'Approved for Campus' | 'Modifications Required' | 'Rejected';
  comment: string;
  createdAt?: string;
}

export interface DailyHandoff {
  id?: string;
  date: string;
  afternoonPickupLead: string;
  statusNote?: string;
}

export interface StoryCard {
  card_id: string;
  chat_id: string;
  contact_name: string;
  category: 'UNANSWERED_PING' | 'FOLLOW_UP_NEEDED' | 'TASK_COMMITMENT' | 'PLANNING' | 'REMINDER' | 'URGENT_TRIAGE';
  urgency: 'critical' | 'medium' | 'low';
  headline: string;
  context_summary: string;
  ai_proposal: string;
  pre_drafted_action: {
    action_type: 'SEND_WHATSAPP_REPLY' | 'CREATE_CALENDAR_EVENT' | 'SET_REMINDER' | 'DISMISS';
    reply_text: string | null;
    action_payload: Record<string, any>;
  };
  suggested_background_theme: 'dark-crimson' | 'deep-blue' | 'emerald' | 'amber' | 'charcoal';
}

export interface BaileysConnectionStatus {
  status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected';
  qrCode?: string;
  pairingCode?: string;
  phone?: string;
  name?: string;
}

export interface ConnectedAppItem {
  id: string; // 'gmail' | 'calendar' | 'drive' | 'docs' | 'sheets' | 'slides' | 'tasks' | 'keep' | 'notebook' | 'forms' | 'maps' | 'phone_call' | 'camera' | 'mic' | 'draw_overlay' | 'contacts';
  name: string;
  category: 'google_workspace' | 'device_hardware' | 'automation';
  icon: string;
  description: string;
  enabled: boolean;
  requiredScope?: string;
  status: 'connected' | 'permission_granted' | 'disabled' | 'not_connected';
}

export interface AutomationSchedule {
  id: string;
  taskId: string;
  title: string;
  cronExpression: string;
  frequencyText: string;
  skillName: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  status: 'active' | 'idle' | 'running';
}

export interface RecentMessagePayload {
  from: string;
  is_user: boolean;
  timestamp: string;
  text: string;
  status?: string;
}



