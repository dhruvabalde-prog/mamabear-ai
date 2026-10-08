import React, { useState } from 'react';
import { 
  Users, Building2, GraduationCap, IndianRupee, ShieldCheck, 
  MapPin, ChevronRight, ArrowLeft
} from 'lucide-react';
import { ParentInquiry, FacilityZone, SetupConfig, StaffMember, ExpenseItem, AcademicProgram, LocalVendor } from '../../types';
import { AdmissionsView } from './AdmissionsView';
import { FacilityView } from './FacilityView';
import { AcademicsView } from './AcademicsView';
import { FinanceView } from './FinanceView';
import { StaffView } from './StaffView';
import { KotaHubView } from './KotaHubView';

interface SchoolHubViewProps {
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
}

interface DeptItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  badge: string;
}

export const SchoolHubView: React.FC<SchoolHubViewProps> = ({
  initialSubSection,
  inquiries = [],
  onAddInquiry = () => {},
  onUpdateInquiryStatus = () => {},
  facilityZones = [],
  onUpdateZoneProgress,
  setupConfig,
  staff = [],
  onAddStaff = () => {},
  onUpdateStaffVerification = () => {},
  expenses = [],
  onAddExpense = () => {},
  academicPrograms = [],
  onSaveAcademicProgram = () => {},
  vendors = [],
  onAddVendor = () => {}
}) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(initialSubSection || null);

  // Clean departments without Toddler Lab or Google OAuth (moved to left drawer/accounts)
  const departments: DeptItem[] = [
    {
      id: 'admissions',
      title: 'Admissions',
      subtitle: `${inquiries.length} parent inquiries registered`,
      icon: Users,
      color: 'bg-emerald-500',
      badge: `${inquiries.length}`
    },
    {
      id: 'facility',
      title: 'Facility',
      subtitle: 'Campus civil and safety zones',
      icon: Building2,
      color: 'bg-amber-500',
      badge: 'Site'
    },
    {
      id: 'academics',
      title: 'Curriculum',
      subtitle: 'Early childhood learning frameworks',
      icon: GraduationCap,
      color: 'bg-rose-500',
      badge: 'ECE'
    },
    {
      id: 'finances',
      title: 'Finances',
      subtitle: `${expenses.length} expenses logged`,
      icon: IndianRupee,
      color: 'bg-blue-500',
      badge: 'Budget'
    },
    {
      id: 'staff',
      title: 'Staff',
      subtitle: `${staff.length} team members onboarded`,
      icon: ShieldCheck,
      color: 'bg-teal-500',
      badge: `${staff.length}`
    },
    {
      id: 'kota',
      title: 'Vendors',
      subtitle: `${vendors.length} local suppliers & contracts`,
      icon: MapPin,
      color: 'bg-orange-500',
      badge: 'Local'
    }
  ];

  if (selectedSection) {
    const activeDept = departments.find(d => d.id === selectedSection);
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        {/* Department Page Header: Back arrow + 1-2 words Title */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedSection(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-black tracking-tight text-slate-900">
              {activeDept?.title || 'Department'}
            </h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-4">
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
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-2 pb-24 px-3 pt-2">
      {/* WhatsApp chat-style long vertical tiles */}
      <div className="divide-y divide-slate-100 bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedSection(dept.id)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-2xl ${dept.color} text-white flex items-center justify-center shrink-0 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {dept.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {dept.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {dept.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
