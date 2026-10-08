import React, { useState } from 'react';
import { 
  Users, ShieldCheck, CheckCircle2, AlertCircle, 
  Phone, Mail, Award, Plus, Sparkles, X 
} from 'lucide-react';
import { StaffMember } from '../../types';

interface StaffViewProps {
  staffList?: StaffMember[];
  onAddStaff?: (member: StaffMember) => void;
  onUpdateVerification?: (id: string, policeVerified?: boolean, firstAidCertified?: boolean) => void;
  isLoading?: boolean;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList = [],
  onAddStaff,
  onUpdateVerification,
  isLoading = false
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    role: 'Early Years Teacher',
    status: 'Shortlisted',
    salary: 25000,
    contact: '',
    assignedClass: 'Toddler Room',
    policeVerified: false,
    firstAidCertified: false
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !onAddStaff) return;
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: formData.name,
      role: formData.role as any,
      status: formData.status as any,
      policeVerified: Boolean(formData.policeVerified),
      firstAidCertified: Boolean(formData.firstAidCertified),
      salary: Number(formData.salary || 0),
      assignedClass: formData.assignedClass,
      contact: formData.contact
    };
    onAddStaff(newMember);
    setShowAddModal(false);
    setFormData({
      name: '',
      role: 'Early Years Teacher',
      status: 'Shortlisted',
      salary: 25000,
      contact: '',
      assignedClass: 'Toddler Room',
      policeVerified: false,
      firstAidCertified: false
    });
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Team
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Educators, verification & payroll
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer shrink-0"
          title="Add Staff"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Staff</span>
        </button>
      </div>

      {/* Staff Roster Grid or Empty State */}
      {staffList.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">No Staff Members Added</h3>
            <p className="text-xs text-slate-500 mt-1">Begin onboarding educators and caregivers to track salaries and police verification.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Staff Member</span>
          </button>
        </div>
      ) : (
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

              {/* Certifications & Badges with Toggle Action */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateVerification && onUpdateVerification(member.id, !member.policeVerified, member.firstAidCertified)}
                  className={`p-2.5 rounded-xl flex items-center gap-2 border transition-colors cursor-pointer text-left ${
                    member.policeVerified
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Click to toggle Police Verification status"
                >
                  <ShieldCheck className={`w-4 h-4 shrink-0 ${member.policeVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-[11px]">
                    {member.policeVerified ? 'Police Verified' : 'Mark Verified'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateVerification && onUpdateVerification(member.id, member.policeVerified, !member.firstAidCertified)}
                  className={`p-2.5 rounded-xl flex items-center gap-2 border transition-colors cursor-pointer text-left ${
                    member.firstAidCertified
                      ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Click to toggle First Aid Certification status"
                >
                  <Award className={`w-4 h-4 shrink-0 ${member.firstAidCertified ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-[11px]">
                    {member.firstAidCertified ? 'First Aid Certified' : 'Mark Certified'}
                  </span>
                </button>
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
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Add Team Member</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Educator / Staff full name"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Lead Educator">Lead Educator</option>
                    <option value="Early Years Teacher">Early Years Teacher</option>
                    <option value="Activity Specialist">Activity Specialist</option>
                    <option value="Center Head">Center Head</option>
                    <option value="Caregiver / Didi">Caregiver / Didi</option>
                    <option value="Security Officer">Security Officer</option>
                    <option value="Bus Driver">Bus Driver</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Audition Passed">Audition Passed</option>
                    <option value="Canadian Certified">Canadian Certified</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+91..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
