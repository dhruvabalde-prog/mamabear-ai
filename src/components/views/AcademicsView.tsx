import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Baby, CheckCircle, 
  Clock, Music, Palette, Compass, Heart, Plus, Edit2, Check
} from 'lucide-react';
import { AcademicProgram } from '../../types';

interface AcademicsViewProps {
  programs?: AcademicProgram[];
  onSaveProgram?: (program: AcademicProgram) => void;
  isLoading?: boolean;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  programs = [],
  onSaveProgram,
  isLoading = false
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>('nursery');
  const [showAddCenterModal, setShowAddCenterModal] = useState(false);
  const [newCenterInput, setNewCenterInput] = useState('');

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          🍁
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">No Curriculum Modules Available</h2>
          <p className="text-xs text-slate-500 mt-1">Curriculum units have not been seeded or loaded from Supabase.</p>
        </div>
      </div>
    );
  }

  const currentProgram = programs.find(p => p.slug === selectedSlug) || programs[0];

  const handleAddLearningCenter = () => {
    if (!newCenterInput.trim() || !onSaveProgram) return;
    const updated: AcademicProgram = {
      ...currentProgram,
      learningCenters: [...currentProgram.learningCenters, newCenterInput.trim()]
    };
    onSaveProgram(updated);
    setNewCenterInput('');
    setShowAddCenterModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Maple Bear Canadian Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global Canadian inquiry-based early childhood pedagogy with bilingual immersion & learning centers.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
          <span>🍁</span>
          Certified Canadian ECE Framework
        </span>
      </div>

      {/* Grade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {programs.map((g) => (
          <button
            key={g.slug}
            type="button"
            onClick={() => setSelectedSlug(g.slug)}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              selectedSlug === g.slug
                ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-1">{g.icon}</div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{g.name}</h3>
            <span className="text-[11px] font-semibold text-slate-500">{g.ageBracket}</span>
          </button>
        ))}
      </div>

      {/* Program Detail Card */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentProgram.icon}</span>
              <h2 className="text-xl font-extrabold text-slate-900">
                {currentProgram.name} ({currentProgram.ageBracket})
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              {currentProgram.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCenterModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Center</span>
          </button>
        </div>

        {/* Modal to add learning center */}
        {showAddCenterModal && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Add Classroom Learning Center / Station</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCenterInput}
                onChange={(e) => setNewCenterInput(e.target.value)}
                placeholder="e.g. Loose Parts Natural Wood Station"
                className="flex-1 p-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddLearningCenter}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddCenterModal(false)}
                className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Learning Centers & Weekly Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Centers */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-500" />
              <span>Classroom Learning Centers ({currentProgram.learningCenters.length})</span>
            </h3>

            <div className="space-y-2">
              {currentProgram.learningCenters.map((center, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700 font-semibold"
                >
                  <span className="w-5 h-5 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{center}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Thematic Units */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>Thematic Units & Inquiries</span>
            </h3>

            <div className="space-y-2">
              {currentProgram.weeklyThemes.map((theme, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700 font-semibold"
                >
                  <span className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                    W{theme.week || idx + 1}
                  </span>
                  <span>{theme.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
