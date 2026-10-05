import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Baby, CheckCircle, 
  Clock, Music, Palette, Compass, Heart 
} from 'lucide-react';

export const AcademicsView: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('nursery');

  const gradePrograms = [
    {
      id: 'toddler',
      name: 'Toddler Explorer',
      age: '1.5 to 2.5 Years',
      icon: '🧸',
      desc: 'Gentle bilingual immersion focusing on sensory development, safe exploration, self-soothing, and joyful social attachment.',
      learningCenters: [
        'Sensory discovery bottles & texture wall',
        'Soft gross-motor climbing foam gym',
        'Early Canadian finger rhymes & songs',
        'Mirror self-awareness & emotion recognition'
      ],
      weeklyThemes: [
        'Week 1: Cozy Hands & Gentle Greetings',
        'Week 2: Animal Sounds & Movement',
        'Week 3: Water, Sand & Color Splash',
        'Week 4: Shapes & Natural Wooden Blocks'
      ]
    },
    {
      id: 'nursery',
      name: 'Nursery Canadian Nest',
      age: '2.5 to 3.5 Years',
      icon: '🐥',
      desc: 'Emergent language development, inquiry through dramatic play, phonological awareness sound boxes, and fine-motor mastery.',
      learningCenters: [
        'Dramatic play Canadian wooden kitchen',
        'Phonological sound cylinders & word wall',
        'Loose parts loose materials building studio',
        'Tactile finger-painting & easel chemistry'
      ],
      weeklyThemes: [
        'Week 1: Our Cozy Maple Bear Family',
        'Week 2: Wonders of Rajasthan Winds & Birds',
        'Week 3: Big Machines, Wheels & Construction',
        'Week 4: Healthy Fruits & Colorful Food'
      ]
    },
    {
      id: 'junior-kg',
      name: 'Junior Kindergarten',
      age: '3.5 to 4.5 Years',
      icon: '🚀',
      desc: 'Early math manipulatives, emergent reading story sacks, Canadian science observations, and social collaboration.',
      learningCenters: [
        'Science light table & translucent prisms',
        'Canadian story sack literacy library',
        'Math counting beads, tens frames & balance',
        'Collaborative construction block architecture'
      ],
      weeklyThemes: [
        'Week 1: Community Helpers in Subhash Nagar',
        'Week 2: Living Gardens & Plant Botany',
        'Week 3: Water Habitats & Splash Ecology',
        'Week 4: Space, Stars & Night Reflections'
      ]
    },
    {
      id: 'senior-kg',
      name: 'Senior Kindergarten',
      age: '4.5 to 5.5 Years',
      icon: '🎓',
      desc: 'Confident emergent writing, mathematical problem solving, bilingual storytelling, and joyful readiness for formal schooling.',
      learningCenters: [
        'Writer\'s workshop & illustrated journal table',
        'STEM robotics & gear mechanism boards',
        'Canadian geography & world culture atlas',
        'Drama theatre & puppet stage'
      ],
      weeklyThemes: [
        'Week 1: Inventions & Simple Machines',
        'Week 2: Forests, Animals & Canadian Wildlife',
        'Week 3: Architecture & Bridges of India',
        'Week 4: Graduation & Celebration of Learning'
      ]
    }
  ];

  const currentProgram = gradePrograms.find(g => g.id === selectedGrade) || gradePrograms[1];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Maple Bear Canadian Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global Canadian inquiry-based early childhood pedagogy, managed by Academic Director Priya.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
          <span>🍁</span>
          Certified Canadian ECE Framework
        </span>
      </div>

      {/* Grade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {gradePrograms.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSelectedGrade(g.id)}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              selectedGrade === g.id
                ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-1">{g.icon}</div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{g.name}</h3>
            <span className="text-[11px] font-semibold text-slate-500">{g.age}</span>
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
                {currentProgram.name} ({currentProgram.age})
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              {currentProgram.desc}
            </p>
          </div>

          <div className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            Canadian Bilingual Immersion
          </div>
        </div>

        {/* 2 Cols: Learning Centers vs Weekly Thematic Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Centers */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-500" />
              Core Canadian Learning Centers
            </h3>
            <div className="space-y-2">
              {currentProgram.learningCenters.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Thematic Units */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Term 1 Thematic Inquiry Units
            </h3>
            <div className="space-y-2">
              {currentProgram.weeklyThemes.map((w, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
