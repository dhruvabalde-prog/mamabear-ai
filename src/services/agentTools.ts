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
 * - Active Co-Founder (Academic Director vs Managing Director)
 * - Current Local Time & Toddler Routine
 * - 60-day launch countdown milestones
 */
export function getAgenticPriorityNow(role: ActiveFounderRole, config?: any): {
  currentPhase: string;
  routineStatus: string;
  primaryAction: AgenticActionRecommendation;
  secondaryActions: AgenticActionRecommendation[];
  clarifyingQuestions: ClarifyingQuestion[];
} {
  const hour = new Date().getHours();
  const schoolName = config?.schoolName || 'Maple Bear Canadian School';
  const campus = config?.campusLocation || 'Subhash Nagar';
  const city = config?.city || 'Kota';
  
  const acadName = config?.leadAcademicsName || 'Academic Director';
  const acadTitle = config?.leadAcademicsTitle || 'Academic Director';
  const acadChild = config?.leadAcademicsChildName || 'Child';
  const acadPhone = config?.leadAcademicsPhone || '';

  const bizName = config?.leadBusinessName || 'Managing Director';
  const bizTitle = config?.leadBusinessTitle || 'Managing Director';
  const bizPhone = config?.leadBusinessPhone || '';

  if (role === 'academics') {
    const isNapTime = hour >= 13 && hour <= 15;
    
    return {
      currentPhase: isNapTime ? 'Toddler Nap Window (Deep Work)' : 'Active Operations & Classroom Setup',
      routineStatus: isNapTime 
        ? `${acadChild} is resting • Focused work & curriculum review window available`
        : `${acadChild} is active • Ideal for classroom materials testing & educator demonstrations`,
      primaryAction: {
        id: 'act-acad-1',
        urgentLevel: 'immediate',
        category: 'Parent Outreach',
        title: 'Reply to Parent Inquiry regarding Friday 10:00 AM Nursery Tour',
        rationale: 'High priority parent booking with 3yo twins. Prompt Canadian-standard reply confirms admission tour.',
        toddlerContext: 'Classroom sensory materials will be ready during the tour walkthrough.',
        recommendedTool: 'whatsapp',
        actionData: {
          recipientName: 'Dr. Radhika Mehta',
          recipientContact: '919414123456',
          draftText: `Dear Dr. Radhika Mehta, Warm greetings from ${acadName} at ${schoolName}, ${campus}, ${city}. We are thrilled to confirm your tour for twins Kabir & Vivaan this Friday at 10:00 AM. As a fellow parent of a young child, I look forward to personally walking you through our bilingual immersion and hygiene-certified protocols! See you Friday.`,
          calendarSummary: 'Tour: Dr. Radhika Mehta (Twins Kabir & Vivaan 3yo)'
        }
      },
      secondaryActions: [
        {
          id: 'act-acad-2',
          urgentLevel: 'high',
          category: 'ECE & Academics',
          title: 'Review Sound-Box phonics curriculum for Junior KG',
          rationale: 'Mandatory bilingual franchise pedagogy standard before teacher training starts on Day 14.',
          toddlerContext: 'Child-friendly task; early phonological exploration ready.',
          recommendedTool: 'task_plan',
          actionData: {
            taskTitle: 'Structure Junior KG early phonological awareness sound-boxes'
          }
        },
        {
          id: 'act-acad-3',
          urgentLevel: 'normal',
          category: 'Franchise & NOC',
          title: 'Send formal Offer Letter to Lead Educator candidate Sunita Rathore',
          rationale: 'Candidate passed the mock storytelling audition with distinction; competitive offer required today.',
          toddlerContext: 'Drafting can be done in 10 minutes.',
          recommendedTool: 'gmail',
          actionData: {
            recipientName: 'Sunita Rathore',
            recipientContact: 'sunita.rathore@gmail.com',
            draftText: `Dear Sunita ji,\n\nWe are delighted to extend an offer for the Lead Educator position at ${schoolName}, ${campus}, ${city}. We were inspired by your warmth and storytelling demo. Attached are the terms and pedagogy orientation schedule.\n\nWarmly,\n${acadName} (${acadTitle})`
          }
        }
      ],
      clarifyingQuestions: [
        {
          id: 'cq-p1',
          question: `Did the shipment of 150 early learning picture books arrive from the national hub?`,
          context: `Crucial for setting up the Central Reading Nook in Zone 2 before parent tours start.`,
          options: [`Yes, boxes received at ${campus}`, 'Delayed by 2 days in transit', 'Need to check with courier tracker'],
          fieldKey: 'books_received'
        },
        {
          id: 'cq-p2',
          question: 'Should we schedule the 5-day Teacher Pedagogy Workshop for morning or evening batches?',
          context: 'Morning batches (9 AM - 1 PM) allow hands-on classroom rehearsal before local afternoon heat.',
          options: ['Morning 9:00 AM - 1:00 PM', 'Afternoon 2:00 PM - 6:00 PM', 'Split into 2 Weekend Intensives'],
          fieldKey: 'teacher_training_timing'
        }
      ]
    };
  } else {
    return {
      currentPhase: 'Site Supervision & Vendor Procurement',
      routineStatus: 'Operations window • High mobility window for municipal clearances & site inspections',
      primaryAction: {
        id: 'act-biz-1',
        urgentLevel: 'immediate',
        category: 'Facility & Civil',
        title: 'Confirm non-slip stone mirror polish finish in Kindergarten Discovery Hub',
        rationale: 'Zone 4 civil work is at 60%. Sealing must dry 48 hours before furniture installation.',
        toddlerContext: 'Safety test required: verify smooth corner rounding with non-skid socks.',
        recommendedTool: 'whatsapp',
        actionData: {
          recipientName: 'Master Craftsman Suresh (Constructions)',
          recipientContact: '919829011223',
          draftText: `Namaste Suresh ji, ${bizName} here from ${schoolName} ${campus}. Please confirm if the zero-chemical matte polish in Zone 4 (Kindergarten) will be completed by 4 PM today. We need 48 hours cure time before furniture installation. Thank you!`,
          taskTitle: 'Flooring Polishing - Zone 4'
        }
      },
      secondaryActions: [
        {
          id: 'act-biz-2',
          urgentLevel: 'high',
          category: 'Franchise & NOC',
          title: `Submit Fire NOC inspection dossier to Municipal Corporation`,
          rationale: 'Mandatory clearance required 30 days prior to school inauguration.',
          toddlerContext: 'Requires 30 min focused documentation filing.',
          recommendedTool: 'gmail',
          actionData: {
            recipientName: 'Chief Fire Officer',
            recipientContact: 'fire.noc@rajasthan.gov.in',
            draftText: `To The Chief Fire Officer, Municipal Corporation.\nSub: Fire Safety NOC Application for ${schoolName}, ${campus}, ${city}.\n\nRespected Sir,\nWe hereby submit the architectural floor plans, emergency dual-exit maps, fire extinguisher certificates, and child-safe sprinkler layouts for our pre-school premises in ${campus}. We request a scheduled inspection.\n\nSincerely,\n${bizName} (${bizTitle}${bizPhone ? ', ' + bizPhone : ''})`
          }
        },
        {
          id: 'act-biz-3',
          urgentLevel: 'normal',
          category: 'Parent Outreach',
          title: 'Send Fee Structure & Day Care Options to Er. Rajesh Khandelwal',
          rationale: 'Visited campus yesterday and requested day care package details for his 2.5yo daughter.',
          toddlerContext: 'Instant 1-tap WhatsApp response ready.',
          recommendedTool: 'whatsapp',
          actionData: {
            recipientName: 'Er. Rajesh Khandelwal',
            recipientContact: '919829298765',
            draftText: `Namaste Rajesh ji! Thank you for visiting ${schoolName} ${campus} yesterday. Attached is the complete Term 1 fee breakdown for Toddler section along with our extended day-care schedule. Please let us know if you would like to secure the Founder Early Bird seat! Warmly, ${bizName}${bizPhone ? ' (' + bizPhone + ')' : ''}`
          }
        }
      ],
      clarifyingQuestions: [
        {
          id: 'cq-a1',
          question: 'Did the electronics vendor deliver the Inverter ACs and high-CFM air circulation units?',
          context: 'Crucial to test temperature distribution in Toddler Room before dry-run sessions.',
          options: ['Delivered and mounted on wall', 'Delivery scheduled for tomorrow morning', 'Awaiting electrical sub-meter clearance'],
          fieldKey: 'ac_delivery_status'
        },
        {
          id: 'cq-a2',
          question: 'Are the outdoor UV heat canopies over the play area ready for tension testing?',
          context: 'Canopies protect against midday sunshine during outdoor physical literacy.',
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
