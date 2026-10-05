import React, { useState } from 'react';
import { 
  Users, ShieldCheck, CheckCircle2, AlertCircle, 
  Phone, Mail, Award, Plus, Sparkles 
} from 'lucide-react';
import { INITIAL_STAFF } from '../../data/initialData';
import { StaffMember } from '../../types';

export const StaffView: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Educators, Caregivers & Operations Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Canadian pedagogy certified teachers, Subhash Nagar police verified caregivers & van fleet crew.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Police Verified
          </span>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staffList.map((member) => (
          <div
            key={member.id}
            className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {member.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {member.status}
                  </span>
                </div>
                <p className="text-xs text-rose-600 font-bold mt-0.5">
                  {member.role}
                </p>
                {member.assignedClass && (
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Assigned: {member.assignedClass}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{member.salary.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">/ month</span>
              </div>
            </div>

            {/* Certifications & Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">
                  {member.policeVerified ? 'Police Verified' : 'Verification Pending'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2">
                <Award className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-slate-700 font-medium">
                  {member.firstAidCertified ? 'Pediatric First Aid' : 'Training Scheduled'}
                </span>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Contact: {member.contact}</span>
              <a
                href={`tel:${member.contact}`}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
