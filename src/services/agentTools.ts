import { ActiveFounderRole, TaskItem, ParentInquiry } from '../types';
import { 
  sendGmailMessage, 
  listGmailMessages, 
  createGoogleCalendarEvent, 
  createGoogleTaskItem, 
  createGoogleDriveDocument,
  GmailMessageSummary 
} from './firebaseAuth';

export interface AgenticActionRecommendation {
  id: string;
  urgentLevel: 'immediate' | 'high' | 'normal';
  category: 'ECE & Academics' | 'Facility & Civil' | 'Parent Outreach' | 'Franchise & NOC' | 'Toddler Window';
  title: string;
  rationale: string;
  toddlerContext: string;
  recommendedTool: 'whatsapp' | 'gmail' | 'calendar' | 'task_plan' | 'vendor_call';
  actionData: {
    recipientName?: string;
    recipientContact?: string;
    draftText?: string;
    calendarSummary?: string;
    taskTitle?: string;
    taskId?: string;
  };
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  context: string;
  options: string[];
  fieldKey: string;
}

/**
 * Computes what needs to be done RIGHT NOW based on:
 * - Active Co-Founder (Priya vs Ananya)
 * - Current Local Time & 3yo Toddler Routine (Aarav & Myra)
 * - 60-day launch countdown milestones
 */
export function getAgenticPriorityNow(role: ActiveFounderRole): {
  currentPhase: string;
  routineStatus: string;
  primaryAction: AgenticActionRecommendation;
  secondaryActions: AgenticActionRecommendation[];
  clarifyingQuestions: ClarifyingQuestion[];
} {
  const hour = new Date().getHours();

  if (role === 'academics') {
    // Priya Sharma - Academics & Care (Mom to Aarav, 3yo)
    const isNapTime = hour >= 13 && hour <= 15;
    
    return {
      currentPhase: isNapTime ? 'Toddler Nap Window (Deep Work)' : 'Active Operations & Classroom Setup',
      routineStatus: isNapTime 
        ? 'Aarav is sleeping (1:30 PM - 3:15 PM) • 75 mins uninterrupted focus available'
        : 'Aarav is active • Ideal for sensory materials testing & teacher demonstration observations',
      primaryAction: {
        id: 'act-priya-1',
        urgentLevel: 'immediate',
        category: 'Parent Outreach',
        title: 'Reply to Dr. Radhika Mehta regarding Friday 10:00 AM Nursery Tour',
        rationale: 'Dr. Mehta is HOD Cardiology with 3yo twin boys. Prompt Canadian-standard reply locks in admission.',
        toddlerContext: 'Aarav will test the Canadian sensory water-table during this time.',
        recommendedTool: 'whatsapp',
        actionData: {
          recipientName: 'Dr. Radhika Mehta',
          recipientContact: '919414123456',
          draftText: 'Dear Dr. Radhika Mehta, Warm greetings from Priya at Maple Bear Canadian School, Subhash Nagar, Kota. We are thrilled to confirm your tour for twins Kabir & Vivaan this Friday at 10:00 AM. As a fellow mother of a 3-year-old boy (Aarav), I look forward to personally walking you through our Canadian bilingual immersion and doctor-approved sanitization protocols! See you Friday.',
          calendarSummary: 'Tour: Dr. Radhika Mehta (Twins Kabir & Vivaan 3yo)'
        }
      },
      secondaryActions: [
        {
          id: 'act-priya-2',
          urgentLevel: 'high',
          category: 'ECE & Academics',
          title: 'Review Canadian Sound-Box phonics curriculum for Junior KG',
          rationale: 'Mandatory Canadian franchise pedagogy standard before teacher training starts on Day 14.',
          toddlerContext: 'Child-friendly task; Aarav can explore sound-boxes as real-world tester.',
          recommendedTool: 'task_plan',
          actionData: {
            taskTitle: 'Structure Junior KG early phonological awareness sound-boxes'
          }
        },
        {
          id: 'act-priya-3',
          urgentLevel: 'normal',
          category: 'Franchise & NOC',
          title: 'Send formal Offer Letter to Lead Educator candidate Sunita Rathore',
          rationale: 'She passed the mock storytelling audition with 5 stars; competitive offer needed today.',
          toddlerContext: 'Drafting can be done in 10 minutes.',
          recommendedTool: 'gmail',
          actionData: {
            recipientName: 'Sunita Rathore',
            recipientContact: 'sunita.rathore@gmail.com',
            draftText: 'Dear Sunita ji,\n\nWe are delighted to extend an offer for the Lead Educator position at Maple Bear Canadian Pre-School, Subhash Nagar, Kota. We were inspired by your warmth and Canadian storytelling demo. Attached are the terms and Canadian pedagogy orientation schedule.\n\nWarmly,\nPriya Sharma (Academic Director)'
          }
        }
      ],
      clarifyingQuestions: [
        {
          id: 'cq-p1',
          question: 'Did the shipment of 150 Canadian picture books arrive from Maple Bear Mumbai hub?',
          context: 'Crucial for setting up the Central Reading Nook in Zone 2 before parent tours start.',
          options: ['Yes, boxes received at Subhash Nagar', 'Delayed by 2 days in transit', 'Need to check with courier tracker'],
          fieldKey: 'canadian_books_received'
        },
        {
          id: 'cq-p2',
          question: 'Should we schedule the 5-day Teacher Pedagogy Workshop for morning or evening batches?',
          context: 'Morning batches (9 AM - 1 PM) allow hands-on classroom rehearsal before Kota heat peaks.',
          options: ['Morning 9:00 AM - 1:00 PM', 'Afternoon 2:00 PM - 6:00 PM', 'Split into 2 Weekend Intensives'],
          fieldKey: 'teacher_training_timing'
        }
      ]
    };
  } else {
    // Ananya Verma - Business & Operations (Mom to Myra, 3yo)
    return {
      currentPhase: 'Site Supervision & Vendor Procurement',
      routineStatus: 'Myra is at grandparents for 2 hours • High mobility window for Kota Municipal & site meetings',
      primaryAction: {
        id: 'act-ananya-1',
        urgentLevel: 'immediate',
        category: 'Facility & Civil',
        title: 'Confirm Hadoti Crafts mirror polish finish in Kindergarten Discovery Hub',
        rationale: 'Zone 4 civil work is at 60%. Sealing must dry 48 hours before furniture installation.',
        toddlerContext: 'Safety test required: Myra to inspect smooth edges in non-skid socks.',
        recommendedTool: 'whatsapp',
        actionData: {
          recipientName: 'Master Craftsman Suresh (Hadoti Constructions)',
          recipientContact: '919829011223',
          draftText: 'Namaste Suresh ji, Ananya here from Maple Bear Subhash Nagar. Please confirm if the zero-chemical matte polish in Zone 4 (Kindergarten) will be completed by 4 PM today. We need 48 hours cure time before Canadian shelf installation. Thank you!',
          taskTitle: 'Kota Stone Mirror Polishing - Zone 4'
        }
      },
      secondaryActions: [
        {
          id: 'act-ananya-2',
          urgentLevel: 'high',
          category: 'Franchise & NOC',
          title: 'Submit Fire NOC inspection dossier to Kota Municipal Corporation',
          rationale: 'Mandatory clearance required 30 days prior to school inauguration.',
          toddlerContext: 'Requires 30 min focused documentation filing.',
          recommendedTool: 'gmail',
          actionData: {
            recipientName: 'Kota Fire Officer Office',
            recipientContact: 'fire.noc.kota@rajasthan.gov.in',
            draftText: 'To The Chief Fire Officer, Kota Municipal Corporation.\nSub: Fire Safety NOC Application for Maple Bear Canadian School, Subhash Nagar, Kota.\n\nRespected Sir,\nWe hereby submit the architectural floor plans, emergency dual-exit maps, ABC fire extinguisher certificates, and child-safe sprinkler layouts for our pre-school premises in Subhash Nagar. We request a scheduled inspection.\n\nSincerely,\nAnanya Verma (Managing Director, +91 98290 85678)'
          }
        },
        {
          id: 'act-ananya-3',
          urgentLevel: 'normal',
          category: 'Parent Outreach',
          title: 'Send Fee Structure & Day Care Options to Er. Rajesh Khandelwal (Allen Faculty)',
          rationale: 'He visited campus yesterday and requested day care package details for his 2.5yo daughter Anvi.',
          toddlerContext: 'Instant 1-tap WhatsApp response ready.',
          recommendedTool: 'whatsapp',
          actionData: {
            recipientName: 'Er. Rajesh Khandelwal',
            recipientContact: '919829298765',
            draftText: 'Namaste Rajesh ji! Thank you for visiting Maple Bear Subhash Nagar yesterday. Attached is the complete Term 1 fee breakdown for Toddler section along with our 5:30 PM Allen Faculty extended day-care schedule. Please let us know if you would like to secure the Founder Early Bird seat for Anvi! Warmly, Ananya (+91 98290 85678)'
          }
        }
      ],
      clarifyingQuestions: [
        {
          id: 'cq-a1',
          question: 'Did Gumanpura Electronics deliver the 6 Inverter ACs and high-CFM coolers?',
          context: 'Crucial to test AC temperature distribution in Toddler Room before dry-run sessions.',
          options: ['Delivered and mounted on wall', 'Delivery scheduled for tomorrow morning', 'Awaiting electrical sub-meter clearance'],
          fieldKey: 'ac_delivery_status'
        },
        {
          id: 'cq-a2',
          question: 'Are the outdoor UV heat canopies over the splash pool ready for tension testing?',
          context: 'Canopies protect against harsh Kota midday sunshine during outdoor physical literacy.',
          options: ['Ready for safety pull-test', 'Fabricator stitching final corner grommets', 'Need landlord permission for roof anchor'],
          fieldKey: 'canopy_readiness'
        }
      ]
    };
  }
}

/**
 * Builds direct WhatsApp URL with pre-filled, URL-encoded message
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}
