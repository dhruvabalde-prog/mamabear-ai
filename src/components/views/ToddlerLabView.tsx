import React, { useState } from 'react';
import { 
  Baby, Heart, Star, Sparkles, CheckCircle, 
  Clock, ShieldAlert, Utensils, MessageSquare, Plus, X 
} from 'lucide-react';
import { QualityReview, DailyHandoff, SetupConfig } from '../../types';

interface ToddlerLabViewProps {
  reviews?: QualityReview[];
  handoff?: DailyHandoff | null;
  setupConfig?: SetupConfig | null;
  onAddReview?: (review: QualityReview) => void;
  onUpdateHandoff?: (handoff: DailyHandoff) => void;
  isLoading?: boolean;
}

export const ToddlerLabView: React.FC<ToddlerLabViewProps> = ({
  reviews = [],
  handoff,
  setupConfig,
  onAddReview,
  onUpdateHandoff,
  isLoading = false
}) => {
  const currentPickupLead = handoff?.afternoonPickupLead || setupConfig?.leadBusinessName || 'Managing Director';
  const acadName = setupConfig?.leadAcademicsName || 'Academic Director';
  const bizName = setupConfig?.leadBusinessName || 'Managing Director';

  const [showAddReview, setShowAddReview] = useState(false);
  const [itemInput, setItemInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [verdictInput, setVerdictInput] = useState<'Approved for Campus' | 'Modifications Required' | 'Rejected'>('Approved for Campus');

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-200 rounded-3xl"></div>
          <div className="h-32 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const handleTogglePickup = (lead: string) => {
    if (!onUpdateHandoff) return;
    const today = new Date().toISOString().split('T')[0];
    onUpdateHandoff({
      date: today,
      afternoonPickupLead: lead,
      statusNote: `Afternoon handoff coordinated for ${lead}`
    });
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemInput.trim() || !onAddReview) return;
    const rev: QualityReview = {
      id: `rev-${Date.now()}`,
      itemTested: itemInput.trim(),
      tester: 'Early Learners',
      rating: Number(ratingInput),
      verdict: verdictInput,
      comment: commentInput.trim() || 'Passed child-safety & durability assessment.'
    };
    onAddReview(rev);
    setItemInput('');
    setCommentInput('');
    setShowAddReview(false);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Safety
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Childproofing tests & daily handoffs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddReview(true)}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer shrink-0"
          title="Log Test"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Log Test</span>
        </button>
      </div>

      {/* Mom-Founder Daily Pickup & Coordination Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-rose-500" />
              <h3 className="font-extrabold text-base text-slate-900">Today's Daily Handoff</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Active Sync
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Coordinate site supervision and afternoon dismissal schedule between co-founders:
          </p>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Afternoon Lead</span>
              <span className="font-extrabold text-sm text-slate-900">{currentPickupLead}</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleTogglePickup(acadName)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPickupLead === acadName ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-slate-600 border'
                }`}
              >
                {acadName.split(' ')[0]}
              </button>
              <button
                type="button"
                onClick={() => handleTogglePickup(bizName)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPickupLead === bizName ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border'
                }`}
              >
                {bizName.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900">Childproofing Standard</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            All equipment inspected for non-toxic finishes, rounded edges, anti-finger trap door dampeners, and non-slip Kota stone coating.
          </p>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-semibold">
            ⭐ {reviews.length} quality tests logged with verified child-safe clearances.
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900">
          Equipment & Safety Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No equipment inspections logged yet. Click "Log Safety Test" to record childproofing trials.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{rev.itemTested}</h4>
                    <span className="text-[11px] text-slate-400">Tested by: {rev.tester}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.verdict === 'Approved for Campus' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rev.verdict}
                  </span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Log Equipment Quality Test</h3>
              <button type="button" onClick={() => setShowAddReview(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Item Tested *</label>
                <input
                  type="text"
                  required
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  placeholder="e.g. Sensory water table with anti-splash lip"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Safety Rating (1-5)</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value={5}>5 Stars (Flawless)</option>
                    <option value={4}>4 Stars (Minor adjustment)</option>
                    <option value={3}>3 Stars (Needs polish)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Verdict</label>
                  <select
                    value={verdictInput}
                    onChange={(e) => setVerdictInput(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Approved for Campus">Approved for Campus</option>
                    <option value="Modifications Required">Modifications Required</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Review Notes</label>
                <textarea
                  rows={2}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Observations on safety, stability, and child appeal..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Save Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
