import React, { useState } from 'react';
import { 
  Baby, Heart, Star, Sparkles, CheckCircle, 
  Clock, ShieldAlert, Utensils, MessageSquare 
} from 'lucide-react';
import { TODDLER_REVIEWS } from '../../data/initialData';

export const ToddlerLabView: React.FC = () => {
  const [reviews, setReviews] = useState(TODDLER_REVIEWS);
  const [activePickupMom, setActivePickupMom] = useState<'Priya' | 'Ananya'>('Ananya');

  const [newReviewItem, setNewReviewItem] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newTester, setNewTester] = useState('Aarav & Myra');
  const [showAddReview, setShowAddReview] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewItem) return;
    const rev = {
      id: `tr-${Date.now()}`,
      tester: newTester,
      item: newReviewItem,
      rating: 5,
      comment: newReviewComment || 'Tested on Subhash Nagar campus. Safe and toddler-approved!',
      verdict: 'Approved for Campus'
    };
    setReviews([rev, ...reviews]);
    setNewReviewItem('');
    setNewReviewComment('');
    setShowAddReview(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The 3yo Toddler Lab (Aarav & Myra)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built by two 32-33 yr old mothers. Every single toy, safety corner & mattress is tested by our 3-year-olds!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddReview(true)}
          className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Log New Kid-Test
        </button>
      </div>

      {/* Mom-Founder Daily Pickup & Snack Handoff Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup & Daycare Handoff */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-rose-500" />
              <h3 className="font-extrabold text-base text-slate-900">Today\'s Mom-Sync Handoff</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Co-Founder Co-op
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Both toddlers are on site in Subhash Nagar during morning inspections. Coordinate who drives them home or supervises afternoon nap:
          </p>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Afternoon Pickup Lead</span>
              <span className="font-extrabold text-sm text-slate-900">{activePickupMom} Sharma/Verma</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setActivePickupMom('Priya')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePickupMom === 'Priya' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-slate-600 border'
                }`}
              >
                Priya\'s Turn
              </button>
              <button
                type="button"
                onClick={() => setActivePickupMom('Ananya')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePickupMom === 'Ananya' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border'
                }`}
              >
                Ananya\'s Turn
              </button>
            </div>
          </div>
        </div>

        {/* Nutrition & Snack Station */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900">Toddler Nutrition & Snack Lab</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Zero Junk Policy
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Pre-tested healthy snack menu designed for Kota weather hydration:
          </p>

          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">10:00 AM Fruit Snack</span>
              <span className="font-bold text-amber-600">Fresh Papaya & Pomegranate</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">1:00 PM Warm Lunch</span>
              <span className="font-bold text-emerald-600">Millet Khichdi & Desi Ghee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toddler Reviews of School Equipment */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Aarav & Myra\'s Campus Equipment Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  {r.tester}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{r.rating} / 5</span>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{r.item}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ✓ {r.verdict}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Log Aarav & Myra Kid-Test
              </h3>
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Equipment / Toy Item</label>
                <input
                  type="text"
                  required
                  value={newReviewItem}
                  onChange={(e) => setNewReviewItem(e.target.value)}
                  placeholder="e.g. Pikler Wooden Triangle Ramp"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kid-Tester</label>
                <select
                  value={newTester}
                  onChange={(e) => setNewTester(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Aarav (Priya's 3yo)">Aarav (Priya\'s 3yo)</option>
                  <option value="Myra (Ananya's 3yo)">Myra (Ananya\'s 3yo)</option>
                  <option value="Aarav & Myra (Joint)">Aarav & Myra (Joint)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observations & Kid Reaction</label>
                <textarea
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="e.g. Climbed smoothly, corners are rounded, loved the slide grip."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Save Test Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
