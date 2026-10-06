import React, { useState } from 'react';
import { 
  Building2, Users, Calendar, DollarSign, Sparkles, Check, 
  ArrowRight, ArrowLeft, ShieldCheck, Award, FileCheck, CheckCircle2 
} from 'lucide-react';
import { SetupConfig } from '../types';

interface SetupWizardProps {
  initialConfig?: SetupConfig | null;
  onSaveConfig: (config: SetupConfig) => void;
  onCancel?: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({
  initialConfig,
  onSaveConfig,
  onCancel
}) => {
  const [step, setStep] = useState<number>(initialConfig?.setupStep || 1);
  const [formData, setFormData] = useState<SetupConfig>({
    schoolName: initialConfig?.schoolName || 'Maple Bear Canadian School',
    campusLocation: initialConfig?.campusLocation || 'Subhash Nagar',
    city: initialConfig?.city || 'Kota',
    state: initialConfig?.state || 'Rajasthan',
    franchiseBrand: initialConfig?.franchiseBrand || 'Maple Bear Global',
    leadAcademicsName: initialConfig?.leadAcademicsName || '',
    leadAcademicsTitle: initialConfig?.leadAcademicsTitle || 'Co-Founder & Academic Director',
    leadAcademicsPhone: initialConfig?.leadAcademicsPhone || '',
    leadAcademicsEmail: initialConfig?.leadAcademicsEmail || '',
    leadAcademicsChildName: initialConfig?.leadAcademicsChildName || '',
    leadAcademicsChildAge: initialConfig?.leadAcademicsChildAge || '3 yrs',
    leadBusinessName: initialConfig?.leadBusinessName || '',
    leadBusinessTitle: initialConfig?.leadBusinessTitle || 'Co-Founder & Managing Director',
    leadBusinessPhone: initialConfig?.leadBusinessPhone || '',
    leadBusinessEmail: initialConfig?.leadBusinessEmail || '',
    leadBusinessChildName: initialConfig?.leadBusinessChildName || '',
    leadBusinessChildAge: initialConfig?.leadBusinessChildAge || '3 yrs',
    launchDate: initialConfig?.launchDate || '2026-11-15',
    targetEnrollment: initialConfig?.targetEnrollment || 50,
    totalBudgetAllocated: initialConfig?.totalBudgetAllocated || 4500000,
    signingFeePaid: initialConfig?.signingFeePaid || 1500000,
    isSetupCompleted: Boolean(initialConfig?.isSetupCompleted),
    setupStep: initialConfig?.setupStep || 1
  });

  const handleChange = (field: keyof SetupConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      const finalConfig: SetupConfig = {
        ...formData,
        isSetupCompleted: true,
        setupStep: 4
      };
      onSaveConfig(finalConfig);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-28">
      {/* Step Indicators */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-xs font-black text-xl">
              🍁
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                School Setup & Launch Rules
              </h2>
              <p className="text-xs text-slate-500">
                Step {step} of 4: {
                  step === 1 ? 'School Profile & Campus' :
                  step === 2 ? 'Leadership & Co-Founders' :
                  step === 3 ? 'Launch Targets & Capital' :
                  'Operational Rules & Skill Calibration'
                }
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: School Profile */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Campus Profile & Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">School / Center Name *</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  placeholder="e.g. Maple Bear Canadian Pre-School"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Franchise Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.franchiseBrand}
                  onChange={(e) => handleChange('franchiseBrand', e.target.value)}
                  placeholder="e.g. Maple Bear Global"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Campus / Locality *</label>
                <input
                  type="text"
                  required
                  value={formData.campusLocation}
                  onChange={(e) => handleChange('campusLocation', e.target.value)}
                  placeholder="e.g. Subhash Nagar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g. Kota"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="e.g. Rajasthan"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Co-Founders & Leadership */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              <span>Co-Founders & Operational Roles</span>
            </h3>

            {/* Academic Director Section */}
            <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                  Academic Director (Curriculum & Teachers)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.leadAcademicsName}
                    onChange={(e) => handleChange('leadAcademicsName', e.target.value)}
                    placeholder="Enter Academic Lead Name"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Official Title</label>
                  <input
                    type="text"
                    value={formData.leadAcademicsTitle}
                    onChange={(e) => handleChange('leadAcademicsTitle', e.target.value)}
                    placeholder="Co-Founder & Academic Director"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.leadAcademicsPhone}
                    onChange={(e) => handleChange('leadAcademicsPhone', e.target.value)}
                    placeholder="Mobile number for WhatsApp updates"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.leadAcademicsEmail}
                    onChange={(e) => handleChange('leadAcademicsEmail', e.target.value)}
                    placeholder="director@school.com"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Managing Director Section */}
            <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                  Managing Director (Business, Facility & Finance)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.leadBusinessName}
                    onChange={(e) => handleChange('leadBusinessName', e.target.value)}
                    placeholder="Enter Managing Lead Name"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Official Title</label>
                  <input
                    type="text"
                    value={formData.leadBusinessTitle}
                    onChange={(e) => handleChange('leadBusinessTitle', e.target.value)}
                    placeholder="Co-Founder & Managing Director"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.leadBusinessPhone}
                    onChange={(e) => handleChange('leadBusinessPhone', e.target.value)}
                    placeholder="Mobile number for WhatsApp updates"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.leadBusinessEmail}
                    onChange={(e) => handleChange('leadBusinessEmail', e.target.value)}
                    placeholder="managing@school.com"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Launch Targets & Capital */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Launch Timeline & Financial Milestones</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Inauguration Date</label>
                <input
                  type="date"
                  value={formData.launchDate}
                  onChange={(e) => handleChange('launchDate', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Day-1 Enrollment (Seats)</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={formData.targetEnrollment}
                  onChange={(e) => handleChange('targetEnrollment', Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Total Project Budget (₹)</label>
                <input
                  type="number"
                  step="50000"
                  value={formData.totalBudgetAllocated}
                  onChange={(e) => handleChange('totalBudgetAllocated', Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Franchise License Fee Paid (₹)</label>
                <input
                  type="number"
                  step="50000"
                  value={formData.signingFeePaid}
                  onChange={(e) => handleChange('signingFeePaid', Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Rule Calibration & Skill Deployment */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Operational Rules & 500 Functional Skills</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">200 Academic Execution Skills Activated</h4>
                  <p className="text-[11px] text-slate-500">
                    Bilingual inquiry-based curriculum, teacher audition rubrics, sensory water table protocols, and daily early literacy routines configured for {formData.leadAcademicsName || 'Academic Director'}.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">200 Business & Civil Operations Skills Activated</h4>
                  <p className="text-[11px] text-slate-500">
                    Municipal fire safety NOC, Kota stone childproofing, HVAC ventilation, vendor contracts, and admissions pipelines calibrated for {formData.leadBusinessName || 'Managing Director'}.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100 Automated Tasks & Chief of Staff AI</h4>
                  <p className="text-[11px] text-slate-500">
                    Daily safety audits, proactive clarifying questions, parent inquiry auto-drafts, and real-time voice nudges synchronized with Supabase PostgreSQL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <span>{step === 4 ? 'Save & Activate School' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
