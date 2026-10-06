import React, { useState } from 'react';
import { 
  Building2, Users, GraduationCap, Baby, IndianRupee, 
  MapPin, ShieldCheck, Settings, ArrowLeft, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  ActiveFounderRole, ParentInquiry, FacilityZone, SetupConfig,
  StaffMember, ExpenseItem, AcademicProgram, LocalVendor, QualityReview, DailyHandoff 
} from '../../types';
import { AdmissionsView } from './AdmissionsView';
import { FacilityView } from './FacilityView';
import { AcademicsView } from './AcademicsView';
import { ToddlerLabView } from './ToddlerLabView';
import { FinanceView } from './FinanceView';
import { StaffView } from './StaffView';
import { KotaHubView } from './KotaHubView';
import { GoogleSettingsView } from './GoogleSettingsView';

interface SchoolHubViewProps {
  activeFounder: ActiveFounderRole;
  initialSubSection?: string;
  inquiries?: ParentInquiry[];
  onAddInquiry?: (inquiry: ParentInquiry) => void;
  onUpdateInquiryStatus?: (id: string, status: ParentInquiry['status']) => void;
  facilityZones?: FacilityZone[];
  onUpdateZoneProgress?: (id: string, progress: number) => void;
  setupConfig?: SetupConfig | null;
  staff?: StaffMember[];
  onAddStaff?: (member: StaffMember) => void;
  onUpdateStaffVerification?: (id: string, policeVerified?: boolean, firstAidCertified?: boolean) => void;
  expenses?: ExpenseItem[];
  onAddExpense?: (expense: ExpenseItem) => void;
  academicPrograms?: AcademicProgram[];
  onSaveAcademicProgram?: (program: AcademicProgram) => void;
  vendors?: LocalVendor[];
  onAddVendor?: (vendor: LocalVendor) => void;
  reviews?: QualityReview[];
  onAddReview?: (review: QualityReview) => void;
  handoff?: DailyHandoff | null;
  onUpdateHandoff?: (handoff: DailyHandoff) => void;
  googleUser?: User | null;
  hasGoogleToken?: boolean;
  onAuthSuccess?: (user: User, token: string | null) => void;
  onAuthLogout?: () => void;
}

export const SchoolHubView: React.FC<SchoolHubViewProps> = ({
  activeFounder,
  initialSubSection,
  inquiries = [],
  onAddInquiry = () => {},
  onUpdateInquiryStatus = () => {},
  facilityZones = [],
  onUpdateZoneProgress,
  setupConfig,
  staff = [],
  onAddStaff,
  onUpdateStaffVerification,
  expenses = [],
  onAddExpense,
  academicPrograms = [],
  onSaveAcademicProgram,
  vendors = [],
  onAddVendor,
  reviews = [],
  onAddReview,
  handoff,
  onUpdateHandoff,
  googleUser = null,
  hasGoogleToken = false,
  onAuthSuccess = () => {},
  onAuthLogout = () => {}
}) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(initialSubSection || null);

  const sections = [
    {
      id: 'admissions',
      title: 'Admissions & Parent CRM',
      subtitle: 'Allen/Resonance/Motion coaching faculties & doctors in Kota',
      icon: Users,
      color: 'bg-emerald-500',
      tag: `${inquiries.length} Inquiries`,
      accent: 'border-emerald-200 hover:border-emerald-400',
      badge: 'Active pipeline'
    },
    {
      id: 'facility',
      title: 'Facility & Subhash Nagar Site',
      subtitle: 'Renovation, Kota stone non-slip flooring & CCTV childproofing',
      icon: Building2,
      color: 'bg-amber-500',
      tag: '68% Complete',
      accent: 'border-amber-200 hover:border-amber-400',
      badge: 'Launch priority'
    },
    {
      id: 'academics',
      title: 'Canadian Curriculum',
      subtitle: 'Maple Bear early childhood immersion, Toddler & Nursery units',
      icon: GraduationCap,
      color: 'bg-red-500',
      tag: 'Priya’s Domain',
      accent: 'border-red-200 hover:border-red-400',
      badge: 'Bilingual ECE'
    },
    {
      id: 'toddlers',
      title: 'Mom-Founder Toddler Lab',
      subtitle: 'Aarav & Myra (3yo) play-testing, nap-time sync & mom guilt-buster',
      icon: Baby,
      color: 'bg-purple-500',
      tag: 'Aarav & Myra',
      accent: 'border-purple-200 hover:border-purple-400',
      badge: 'Our 3-Year-Olds'
    },
    {
      id: 'finances',
      title: 'Capex, Fee Matrix & P&L',
      subtitle: '₹15L signing amount verified today, Kota fee slab & break-even',
      icon: IndianRupee,
      color: 'bg-blue-500',
      tag: '₹15L Paid',
      accent: 'border-blue-200 hover:border-blue-400',
      badge: 'Ananya’s Domain'
    },
    {
      id: 'staff',
      title: 'Staff Roster & Verification',
      subtitle: '12-member team, Canadian Pedagogy Cert & Police verification',
      icon: ShieldCheck,
      color: 'bg-teal-500',
      tag: '7/12 Onboarded',
      accent: 'border-teal-200 hover:border-teal-400',
      badge: 'HR & Safety'
    },
    {
      id: 'kota',
      title: 'Kota Local Intelligence',
      subtitle: 'Subhash Nagar vendors, 46°C heat protocols & hospital tie-ups',
      icon: MapPin,
      color: 'bg-orange-500',
      tag: 'Subhash Nagar',
      accent: 'border-orange-200 hover:border-orange-400',
      badge: 'Hyper-Local'
    },
    {
      id: 'google',
      title: 'Google Workspace Settings',
      subtitle: 'Connected Calendar, Tasks, Gmail, Drive & progressive permissions',
      icon: Settings,
      color: 'bg-indigo-500',
      tag: hasGoogleToken ? 'Connected' : 'Action needed',
      accent: 'border-indigo-200 hover:border-indigo-400',
      badge: 'Cloud Sync'
    },
  ];

  if (selectedSection) {
    return (
      <div className="min-h-[85vh] pb-24">
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-3 sm:px-4 py-3 shadow-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to School Hub</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-semibold text-gray-400">Department:</span>
              <span className="text-xs font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                {sections.find(s => s.id === selectedSection)?.title}
              </span>
            </div>
          </div>
        </div>

        {/* Full-Page Content for Selected Department */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6">
          {selectedSection === 'admissions' && (
            <AdmissionsView
              inquiries={inquiries}
              onAddInquiry={onAddInquiry}
              onUpdateStatus={onUpdateInquiryStatus}
            />
          )}
          {selectedSection === 'facility' && (
            <FacilityView 
              zones={facilityZones} 
              onUpdateZoneProgress={onUpdateZoneProgress}
            />
          )}
          {selectedSection === 'academics' && (
            <AcademicsView
              programs={academicPrograms}
              onSaveProgram={onSaveAcademicProgram}
            />
          )}
          {selectedSection === 'toddlers' && (
            <ToddlerLabView
              reviews={reviews}
              handoff={handoff}
              setupConfig={setupConfig}
              onAddReview={onAddReview}
              onUpdateHandoff={onUpdateHandoff}
            />
          )}
          {selectedSection === 'finances' && (
            <FinanceView
              expenses={expenses}
              setupConfig={setupConfig}
              onAddExpense={onAddExpense}
            />
          )}
          {selectedSection === 'staff' && (
            <StaffView
              staffList={staff}
              onAddStaff={onAddStaff}
              onUpdateVerification={onUpdateStaffVerification}
            />
          )}
          {selectedSection === 'kota' && (
            <KotaHubView
              vendors={vendors}
              setupConfig={setupConfig}
              onAddVendor={onAddVendor}
            />
          )}
          {selectedSection === 'google' && (
            <GoogleSettingsView 
              user={googleUser} 
              hasToken={hasGoogleToken} 
              onAuthSuccess={onAuthSuccess} 
              onAuthLogout={onAuthLogout} 
              onClose={() => setSelectedSection(null)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-5 sm:p-8 text-white shadow-lg mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Subhash Nagar, Kota Franchise Command</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight mb-2">
            School Operations Hub
          </h1>
          <p className="text-red-50 text-xs sm:text-sm leading-relaxed">
            All departments housed with simplicity and clarity. Tap any department to open its full workspace — no popups or cramped cards.
          </p>
        </div>

        <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 text-xs">
          <div className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Signing Amount: ₹15L Paid</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>Launch Target: 60 Days</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Moms of Aarav & Myra (3yo)</span>
          </div>
        </div>
      </div>

      {/* Grid of Department Portals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`bg-white rounded-2xl p-4 sm:p-5 border-2 border-gray-100 ${section.accent} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group text-left`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${section.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    {section.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-1">
                  {section.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3.5">
                  {section.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                  {section.tag}
                </span>
                <span className="text-red-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Dept</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mom Nuance Quick Status Footer Card */}
      <div className="mt-6 sm:mt-8 bg-purple-50 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-950">Mom-Founders Dual Balance</h4>
            <p className="text-xs text-purple-700">Aarav & Myra (3 yrs old) are currently scheduled for lunch & nap playgroup at 1:30 PM</p>
          </div>
        </div>
        <button
          onClick={() => setSelectedSection('toddlers')}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
        >
          Check Toddler Lab
        </button>
      </div>
    </div>
  );
};

export default SchoolHubView;
