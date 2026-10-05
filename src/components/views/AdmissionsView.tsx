import React, { useState } from 'react';
import { 
  Users, Phone, Mail, Calendar, MapPin, 
  Sparkles, CheckCircle2, Plus, MessageCircle, Copy, Check, ChevronRight,
  ExternalLink, Baby, Clock
} from 'lucide-react';
import { ParentInquiry } from '../../types';
import { getAccessToken, createGoogleCalendarEvent } from '../../services/firebaseAuth';
import { ConfirmationModal } from '../ConfirmationModal';

interface AdmissionsViewProps {
  inquiries: ParentInquiry[];
  onAddInquiry: (inquiry: ParentInquiry) => void;
  onUpdateStatus: (id: string, status: ParentInquiry['status']) => void;
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({
  inquiries,
  onAddInquiry,
  onUpdateStatus
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [aiDraftModal, setAiDraftModal] = useState<ParentInquiry | null>(null);
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // New form state
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childName: '',
    childAge: '3 yrs',
    grade: 'Nursery' as ParentInquiry['grade'],
    locality: 'Subhash Nagar' as ParentInquiry['locality'],
    parentBackground: 'Doctor (Medical College/Private)' as ParentInquiry['parentBackground'],
    notes: ''
  });

  // Calendar sync confirmation
  const [confirmCal, setConfirmCal] = useState<{
    open: boolean;
    inquiry: ParentInquiry | null;
  }>({
    open: false,
    inquiry: null
  });

  const getWhatsAppMessage = (inq: ParentInquiry) => {
    const isDoctor = inq.parentBackground.toLowerCase().includes('doctor');
    const isCoaching = inq.parentBackground.toLowerCase().includes('coaching') || inq.parentBackground.toLowerCase().includes('allen') || inq.parentBackground.toLowerCase().includes('resonance');

    if (isDoctor) {
      return `Hello ${inq.parentName}! This is Priya & Ananya from Maple Bear Canadian Pre-School, Subhash Nagar, Kota. 

Thank you for your interest in our Canadian early childhood program for ${inq.childName} (${inq.childAge}, ${inq.grade}). As healthcare professionals with intense schedules, we would love to host you for a private campus walkthrough to see our child-safe natural Kota stone flooring, CCTV childproofing, and bilingual inquiry classrooms.

Would Saturday morning at 10:30 AM or Sunday at 11:00 AM work for your visit?`;
    }

    if (isCoaching) {
      return `Namaste ${inq.parentName} Ji! This is Priya & Ananya from Maple Bear Canadian Pre-School, Subhash Nagar, Kota. 

Thank you for connecting with us regarding ${inq.childName} (${inq.childAge}) for ${inq.grade}. As educators in Kota's premier coaching institutes, you understand foundational inquiry better than anyone. Our Canadian immersion curriculum builds self-directed curiosity and early STEM habits before formal schooling begins.

We would love to welcome you and ${inq.childName} for a personalized campus tour this weekend. Let us know a convenient time!`;
    }

    return `Hello ${inq.parentName}! Thank you for reaching out to Maple Bear Canadian Pre-School in Subhash Nagar, Kota. 

We would love to invite you and ${inq.childName} (${inq.childAge}) for a personalized tour of our brand-new campus and Toddler Exploration Lab. 

When would be a convenient time for you to visit this week?`;
  };

  const handleOpenWhatsApp = (inq: ParentInquiry) => {
    const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = getWhatsAppMessage(inq);
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleGenerateAiMessage = async (inquiry: ParentInquiry) => {
    setAiDraftModal(inquiry);
    setIsGenerating(true);
    setGeneratedDraft('');
    try {
      const res = await fetch('/api/ai/parent-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: inquiry.parentName,
          childName: inquiry.childName,
          childAge: inquiry.childAge,
          parentBackground: inquiry.parentBackground,
          interestGrade: inquiry.grade
        })
      });
      const data = await res.json();
      setGeneratedDraft(data.response || getWhatsAppMessage(inquiry));
    } catch (err) {
      setGeneratedDraft(getWhatsAppMessage(inquiry));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone) return;

    const newInq: ParentInquiry = {
      id: `inq-${Date.now()}`,
      parentName: formData.parentName,
      phone: formData.phone,
      email: formData.email,
      childName: formData.childName || 'Child',
      childAge: formData.childAge,
      grade: formData.grade,
      locality: formData.locality,
      parentBackground: formData.parentBackground,
      status: 'New Inquiry',
      notes: formData.notes,
      dateLogged: new Date().toISOString().split('T')[0]
    };

    onAddInquiry(newInq);
    setShowNewModal(false);
    setFormData({
      parentName: '',
      phone: '',
      email: '',
      childName: '',
      childAge: '3 yrs',
      grade: 'Nursery',
      locality: 'Subhash Nagar',
      parentBackground: 'Doctor (Medical College/Private)',
      notes: ''
    });
  };

  const handleConfirmCalendarTour = async () => {
    const inq = confirmCal.inquiry;
    setConfirmCal({ open: false, inquiry: null });
    if (!inq) return;

    const token = await getAccessToken();
    if (token) {
      try {
        const tourTime = new Date();
        tourTime.setDate(tourTime.getDate() + 2);
        tourTime.setHours(10, 30, 0, 0);
        const endTour = new Date(tourTime);
        endTour.setHours(11, 30, 0, 0);

        await createGoogleCalendarEvent(token, {
          summary: `[Campus Tour] ${inq.parentName} (${inq.childName})`,
          description: `Maple Bear Subhash Nagar Campus Tour\nChild: ${inq.childName} (${inq.grade})\nParent Background: ${inq.parentBackground}\nPhone: ${inq.phone}`,
          startDateTime: tourTime.toISOString(),
          endDateTime: endTour.toISOString()
        });
      } catch (e) {
        console.warn('Calendar sync error:', e);
      }
    }
    onUpdateStatus(inq.id, 'Tour Booked');
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (filterStatus === 'all') return true;
    return inq.status === filterStatus;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Parent Relationship CRM
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Admissions & WhatsApp Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Allen & Resonance faculties, New Medical College doctors, and Subhash Nagar local families. Tap any parent to reply directly on WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Parent Inquiry</span>
          </button>
        </div>

        {/* Summary Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">{inquiries.length}</span>
            <span className="text-[10px] text-slate-500">Subhash Nagar & Talwandi</span>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-2xl">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Tours Booked</span>
            <span className="text-xl sm:text-2xl font-black text-blue-700 mt-0.5 block">
              {inquiries.filter(i => i.status === 'Tour Booked' || i.status === 'Tour Done').length}
            </span>
            <span className="text-[10px] text-blue-600">Weekend slots</span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Confirmed Enrolled</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5 block">
              {inquiries.filter(i => i.status === 'Enrolled').length}
            </span>
            <span className="text-[10px] text-emerald-600">Target: 35 Day-1</span>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-2xl">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Fee Advance</span>
            <span className="text-xl sm:text-2xl font-black text-amber-800 mt-0.5 block">₹1,40,000</span>
            <span className="text-[10px] text-amber-700">Early-Bird Tier</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Mobile-Friendly Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'New Inquiry', 'Tour Booked', 'Tour Done', 'Form Submitted', 'Enrolled'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === st
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'all' ? `All Inquiries (${inquiries.length})` : st}
          </button>
        ))}
      </div>

      {/* Inquiries Cards List (Clean, High Whitespace, Mobile First) */}
      <div className="space-y-4">
        {filteredInquiries.map((inq) => (
          <div
            key={inq.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all space-y-4"
          >
            {/* Top row: Parent Name, Background Tag, Status Selector */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {inq.parentName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {inq.parentBackground}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{inq.locality}, Kota</span>
                  <span className="text-slate-300">•</span>
                  <span>Logged {inq.dateLogged}</span>
                </p>
              </div>

              {/* Status Selector */}
              <select
                value={inq.status}
                onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  inq.status === 'Enrolled'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : inq.status === 'Tour Booked'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <option value="New Inquiry">New Inquiry</option>
                <option value="Tour Booked">Tour Booked</option>
                <option value="Tour Done">Tour Done</option>
                <option value="Form Submitted">Form Submitted</option>
                <option value="Enrolled">Enrolled</option>
              </select>
            </div>

            {/* Child Specs & Target Grade */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Child</span>
                  <strong className="text-slate-900 font-bold">{inq.childName} ({inq.childAge})</strong>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Grade Target</span>
                <span className="font-extrabold text-rose-600">{inq.grade}</span>
              </div>
            </div>

            {/* Notes */}
            {inq.notes && (
              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
                💬 {inq.notes}
              </p>
            )}

            {/* ACTION ROW: Prominent WhatsApp Reply Button + Call + Calendar Tour */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              
              {/* PRIMARY ACTION: Direct WhatsApp Reply */}
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(inq)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reply on WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Phone Call */}
                <a
                  href={`tel:${inq.phone}`}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>

                {/* AI Draft Customizer */}
                <button
                  type="button"
                  onClick={() => handleGenerateAiMessage(inq)}
                  className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 border border-purple-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Pitch</span>
                </button>

                {/* Book Tour */}
                {inq.status !== 'Tour Booked' && inq.status !== 'Enrolled' && (
                  <button
                    type="button"
                    onClick={() => setConfirmCal({ open: true, inquiry: inq })}
                    className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Book Tour</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Draft Customizer Modal */}
      {aiDraftModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Custom WhatsApp Draft for {aiDraftModal.parentName}
                </h3>
              </div>
              <button
                onClick={() => setAiDraftModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Personalized for {aiDraftModal.parentBackground} • Child: {aiDraftModal.childName} ({aiDraftModal.childAge})
            </p>

            <div className="relative">
              <textarea
                rows={6}
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                className="w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedDraft);
                  setCopiedDraft(true);
                  setTimeout(() => setCopiedDraft(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                {copiedDraft ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const cleanPhone = aiDraftModal.phone.replace(/[^0-9]/g, '');
                  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                  const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(generatedDraft)}`;
                  window.open(url, '_blank');
                  setAiDraftModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Inquiry Modal Form */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Log New Kota Parent Inquiry
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Parent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alok Gupta or Er. Rajesh Meena"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98290 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="parent@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Child Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav / Myra"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Child Age</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.5 yrs or 3 yrs"
                    value={formData.childAge}
                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grade Target</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Toddler">Toddler (18mo - 2.5yo)</option>
                    <option value="Nursery">Nursery (2.5yo - 3.5yo)</option>
                    <option value="Junior KG">Junior KG (3.5yo - 4.5yo)</option>
                    <option value="Senior KG">Senior KG (4.5yo - 5.5yo)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parent Background</label>
                  <select
                    value={formData.parentBackground}
                    onChange={(e) => setFormData({ ...formData, parentBackground: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Doctor (Medical College/Private)">Doctor (Medical College/Private)</option>
                    <option value="Allen/Resonance/Motion Coaching Faculty">Allen/Resonance/Motion Faculty</option>
                    <option value="Kota Business Owner">Kota Business Owner</option>
                    <option value="Civil Services / Police / Govt">Civil Services / Police / Govt</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Preferences</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inquired about afternoon daycare and finger safety guards..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Google Calendar Tour */}
      <ConfirmationModal
        isOpen={confirmCal.open}
        title="Schedule Campus Tour on Google Calendar?"
        description={`This will add a 1-hour tour slot for ${confirmCal.inquiry?.parentName} (${confirmCal.inquiry?.childName}) to your connected Google Calendar.`}
        actionLabel="Book & Sync Calendar"
        onConfirm={handleConfirmCalendarTour}
        onCancel={() => setConfirmCal({ open: false, inquiry: null })}
      />
    </div>
  );
};
