import React, { useState } from 'react';
import { 
  Calendar, CheckCircle, Clock, Sparkles, Flag, 
  MapPin, Baby, Users, Shield, ArrowRight, Play
} from 'lucide-react';
import { TaskItem } from '../../types';

interface LaunchTimelineViewProps {
  tasks: TaskItem[];
  onOpenTaskModal: (task: TaskItem) => void;
}

export const LaunchTimelineView: React.FC<LaunchTimelineViewProps> = ({
  tasks,
  onOpenTaskModal
}) => {
  const [activeMode, setActiveMode] = useState<'launch' | 'operations'>('launch');
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const phases = [
    {
      phase: 1,
      days: 'Days 1 - 12',
      title: 'Site Handover & Kota Stone Civil Upgrades',
      focus: 'Subhash Nagar 9-year lease registered, ₹15L signing fee paid today, floor plan demarcations, mirror polish Kota stone floors, emergency plumbing pressure testing.',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      phase: 2,
      days: 'Days 13 - 28',
      title: 'Canadian Interior, HVAC & Learning Centers',
      focus: 'Maple Bear signature birchwood furniture shipments arrive, 6 inverter ACs + high-CFM desert coolers installed for Kota summers, childproofing foam & door safety guards.',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    {
      phase: 3,
      days: 'Days 29 - 42',
      title: 'Teacher Recruitment & Canadian Pedagogy',
      focus: 'Auditions for 4 pre-primary educators, Maple Bear South Asia 5-day training certification, background police verification at Subhash Nagar station.',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
    },
    {
      phase: 4,
      days: 'Days 43 - 54',
      title: 'Kota Parent Outreach & Experiential Demo Days',
      focus: 'Coffee morning for spouses of Allen and Resonance coaching faculty, free Saturday toddler play sessions, 2 GPS-enabled school vans route dry-runs in Talwandi.',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      phase: 5,
      days: 'Days 55 - 60',
      title: 'Statutory Fire NOC & Grand Canadian Launch',
      focus: 'Rajasthan Fire Department final clearance certificate, pediatric doctor tie-up, VIP ribbon-cutting ceremony, Day 1 kickoff for 35 enrolled children!',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  ];

  const phaseTasks = tasks.filter(t => {
    if (selectedPhase === 1) return t.phaseDay <= 12;
    if (selectedPhase === 2) return t.phaseDay > 12 && t.phaseDay <= 28;
    if (selectedPhase === 3) return t.phaseDay > 28 && t.phaseDay <= 42;
    if (selectedPhase === 4) return t.phaseDay > 42 && t.phaseDay <= 54;
    return t.phaseDay > 54;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            60-Day Countdown to Launch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            From today\'s signing payment to Day 60 Grand Canadian Opening in Subhash Nagar, Kota.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('launch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'launch'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 60-Day Setup Countdown
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('operations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'operations'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏫 Daily Operating School Mode
          </button>
        </div>
      </div>

      {activeMode === 'launch' ? (
        <>
          {/* Phase Selector Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {phases.map((p) => (
              <button
                key={p.phase}
                type="button"
                onClick={() => setSelectedPhase(p.phase)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedPhase === p.phase
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500 shadow-md'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${p.badgeColor}`}>
                    {p.days}
                  </span>
                  {p.phase === 1 && (
                    <span className="text-[10px] font-bold text-rose-600">Current</span>
                  )}
                </div>
                <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                  {p.title}
                </h3>
              </button>
            ))}
          </div>

          {/* Active Phase Briefing Card */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                Phase {selectedPhase}: {phases[selectedPhase - 1].days}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {phaseTasks.length} Milestones Scheduled
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {phases[selectedPhase - 1].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
              {phases[selectedPhase - 1].focus}
            </p>
          </div>

          {/* Tasks in this Phase */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Phase Milestones (Touch to Launch with AI)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phaseTasks.slice(0, 20).map((t) => (
                <div
                  key={t.id}
                  onClick={() => onOpenTaskModal(t)}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold font-mono text-slate-400">
                        {t.id}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {t.department}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                        Day {t.phaseDay}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {t.canadianSpec || t.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-slate-900 text-slate-700 group-hover:text-white text-xs font-bold transition-colors"
                  >
                    Launch
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Daily Operating School Mode */
        <div className="space-y-6">
          <div className="p-6 bg-emerald-950 text-white rounded-3xl shadow-lg border border-emerald-900">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-xl font-bold">Daily School Operations Engine</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-2xl">
              Post-Launch Operations: Manage attendance, Canadian lesson schedules, hot snacks, CCTV logs, and parent pickups with zero stress in Subhash Nagar.
            </p>
          </div>

          {/* Daily Schedule Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Morning Timetable (8:00 AM - 12:30 PM)
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { time: '8:00 AM', title: 'Campus Health & Kota AC Temperature Check', lead: 'Operations' },
                  { time: '8:30 AM', title: 'Children Arrival & Biometric Check-in', lead: 'Academics' },
                  { time: '9:00 AM', title: 'Canadian Morning Circle & Bilingual Greeting', lead: 'Educators' },
                  { time: '9:45 AM', title: 'Inquiry-Based Learning Centers & Discovery', lead: 'Educators' },
                  { time: '10:30 AM', title: 'Nutritious Organic Fruit Snack & Handwash', lead: 'Caregivers' },
                  { time: '11:00 AM', title: 'Outdoor Gross Motor Play & Tricycle Track', lead: 'Academics' },
                  { time: '12:00 PM', title: 'Closing Story & Canadian Song Reflection', lead: 'Educators' },
                  { time: '12:30 PM', title: 'Parent Pick-up & School Van Departure', lead: 'Operations' }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-emerald-700">{s.time}</span>
                      <span className="font-semibold text-slate-800">{s.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {s.lead}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Baby className="w-4 h-4 text-rose-600" />
                Extended Daycare & Toddler Care (12:30 PM - 5:30 PM)
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { time: '12:45 PM', title: 'Hot Lunch (Millets, Dal, Seasonal Vegetables)', lead: 'Caregivers' },
                  { time: '1:30 PM', title: 'Quiet Rest & Nap Suite (Lullabies & Dimmable Lights)', lead: 'Academics' },
                  { time: '3:30 PM', title: 'Wake-up Freshening & Light Snack', lead: 'Caregivers' },
                  { time: '4:00 PM', title: 'Messy Art, Sensory Clay & Storytelling', lead: 'Educators' },
                  { time: '5:00 PM', title: 'Free Choice Games & Evening Parent Handoff', lead: 'Operations' },
                  { time: '5:30 PM', title: 'Daily Deep Sanitization & CCTV Gate Lock', lead: 'Team' }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-rose-700">{s.time}</span>
                      <span className="font-semibold text-slate-800">{s.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {s.lead}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
