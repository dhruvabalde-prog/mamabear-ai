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

const DEFAULT_ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'prog-1',
    slug: 'toddlers',
    name: 'Toddlers (Early Discovery)',
    ageBracket: '1.5 – 2.5 Years',
    icon: '🧸',
    description: 'Bilingual Canadian immersion focused on sensory exploration, gentle separation confidence, and motor skill development.',
    learningCenters: ['Sensory Water & Sand Table', 'Soft Block Building Nook', 'Texture & Discovery Wall', 'Quiet Cozy Picture Book Corner'],
    weeklyThemes: [
      { week: 1, title: 'Welcome to Maple Bear & Classroom Routines' },
      { week: 2, title: 'Colors, Shapes & Natural Kota Stones' },
      { week: 3, title: 'Friendly Animal Sounds & Canadian Wildlife' },
      { week: 4, title: 'Rhythm, Movement & Toddler Music' }
    ]
  },
  {
    id: 'prog-2',
    slug: 'nursery',
    name: 'Nursery (Active Inquirers)',
    ageBracket: '2.5 – 3.5 Years',
    icon: '🎨',
    description: 'Canadian Early Childhood framework fostering expressive language, peer collaboration, and structured dramatic play.',
    learningCenters: ['Canadian Story Sack & Reading Hub', 'Dramatic Role-play Grocery & Kitchen', 'Natural Loose-parts Exploration Station', 'Fine-motor Scissor & Lacing Center'],
    weeklyThemes: [
      { week: 1, title: 'My Family, My Teachers & New Friends' },
      { week: 2, title: 'Our Classroom Environment & Helping Hands' },
      { week: 3, title: 'Plants, Trees & Native Kota Flora' },
      { week: 4, title: 'Water Play, Sinks & Floats Discovery' }
    ]
  },
  {
    id: 'prog-3',
    slug: 'junior-kg',
    name: 'Junior KG (Foundational Inquiry)',
    ageBracket: '3.5 – 4.5 Years',
    icon: '🔍',
    description: 'Emergent phonological awareness, early Canadian math manipulatives, and hands-on environmental exploration.',
    learningCenters: ['Phonological Sound Box Station', 'Math Counter & Patterning Shelves', 'Junior Science Discovery Lab', 'Art Easel & Finger-painting Studio'],
    weeklyThemes: [
      { week: 1, title: 'Letters, Sounds & Story Wonder' },
      { week: 2, title: 'Counting, Sorting & Canadian Seasons' },
      { week: 3, title: 'Weather Patterns & Kota Sun Observations' },
      { week: 4, title: 'Community Helpers & Health Heroes' }
    ]
  },
  {
    id: 'prog-4',
    slug: 'senior-kg',
    name: 'Senior KG (Graduation Readiness)',
    ageBracket: '4.5 – 6.0 Years',
    icon: '🎓',
    description: 'Bilingual fluency, emergent writing, mathematical problem-solving, and socio-emotional leadership.',
    learningCenters: ['Author & Illustrator Writing Workshop', 'STEM Robotic & Balance Center', 'World Geography & Cultural Exploration', 'Gross-motor Agility & Sports Zone'],
    weeklyThemes: [
      { week: 1, title: 'Inquiry-led Story Writing & Journaling' },
      { week: 2, title: 'Mathematical Measurement & Balance Scales' },
      { week: 3, title: 'Our World, Continents & Ocean Habitats' },
      { week: 4, title: 'Celebrations, Canadian Traditions & Rajasthan Heritage' }
    ]
  }
];

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  programs = [],
  onSaveProgram,
  isLoading = false
}) => {
  const activePrograms = programs.length > 0 ? programs : DEFAULT_ACADEMIC_PROGRAMS;
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

  const currentProgram = activePrograms.find(p => p.slug === selectedSlug) || activePrograms[0];

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
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Curriculum
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Canadian inquiry early years framework
          </p>
        </div>

        <span className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1 shrink-0">
          <span>🍁</span>
          <span className="hidden sm:inline">Canadian ECE</span>
        </span>
      </div>

      {/* Grade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {activePrograms.map((g) => (
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
                placeholder="Learning center name (e.g. Reading Corner)"
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
