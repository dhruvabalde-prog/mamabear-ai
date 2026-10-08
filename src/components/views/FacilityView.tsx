import React from 'react';
import { 
  Building, Hammer, ShieldCheck, Flame, 
  MapPin, CheckCircle, Clock, Baby, AlertTriangle 
} from 'lucide-react';
import { FacilityZone } from '../../types';

interface FacilityViewProps {
  zones: FacilityZone[];
  onUpdateZoneProgress?: (id: string, progress: number) => void;
}

export const FacilityView: React.FC<FacilityViewProps> = ({
  zones = [],
  onUpdateZoneProgress
}) => {
  const totalAllocated = zones.reduce((acc, z) => acc + z.budgetAllocated, 0);
  const totalSpent = zones.reduce((acc, z) => acc + z.budgetSpent, 0);
  const avgProgress = zones.length > 0 ? Math.round(zones.reduce((acc, z) => acc + z.progress, 0) / zones.length) : 0;

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Facility
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Subhash Nagar site renovation & childproofing
          </p>
        </div>

        <div className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-1 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Subhash Nagar</span>
        </div>
      </div>

      {/* Progress & Budget Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Civil Renovation Status</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{avgProgress}% Complete</span>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${avgProgress}%` }}></div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Civil Capex Budget</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">
            ₹{(totalSpent / 100000).toFixed(2)}L <span className="text-xs font-semibold text-slate-400">/ ₹{(totalAllocated / 100000).toFixed(2)}L</span>
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Under 5% contingency margin</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Toddler Childproofing</span>
          <span className="text-2xl font-black text-rose-600 mt-0.5 block">5.0 / 5.0 ★</span>
          <span className="text-[11px] text-slate-500 font-semibold block mt-1">Verified with Canadian Safety Protocols</span>
        </div>
      </div>

      {/* Kota Summer Heat Safeguards Banner */}
      <div className="p-5 bg-amber-50/90 border border-amber-200/90 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-amber-950">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Flame className="w-4 h-4 text-amber-600" />
            Kota Summer Climate Shield (45°C Protection Protocol)
          </div>
          <p className="text-xs text-amber-900 leading-relaxed max-w-3xl">
            Kota summers feature intense dry heat. Our Subhash Nagar campus integrates 6 multi-split 2.5-ton inverter ACs, centralized high-CFM desert ducting, 70% solar heat-rejection window film, and tensile UV-mesh outdoor playground shades.
          </p>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-200/70 text-amber-900 font-extrabold text-xs">
          Target Room Temp: 23°C - 24°C
        </div>
      </div>

      {/* Facility Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  {zone.name}
                </h3>
                <span className="text-xs font-semibold text-indigo-600 mt-0.5 block">
                  Lead: {zone.lead} • Target: {zone.targetDate}
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                zone.status === 'Ready for Kids'
                  ? 'bg-emerald-100 text-emerald-800'
                  : zone.status === 'Furnished'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {zone.status}
              </span>
            </div>

            {/* Progress bar with interactive updates */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Renovation Progress</span>
                <span className="font-bold text-slate-900">{zone.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                  style={{ width: `${zone.progress}%` }}
                ></div>
              </div>
              {onUpdateZoneProgress && (
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Update:</span>
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => onUpdateZoneProgress(zone.id, pct)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        zone.progress === pct
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs & Safety */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Canadian & Civil Spec</span>
                <p className="text-slate-700 font-medium leading-relaxed">{zone.canadianSpecs}</p>
              </div>
            </div>

            {/* Budget & Safety ratings */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Spent: <strong className="text-slate-900">₹{(zone.budgetSpent / 1000).toLocaleString()}k</strong> / ₹{(zone.budgetAllocated / 1000).toLocaleString()}k
              </span>

              <span className="flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                <Baby className="w-3.5 h-3.5" />
                {zone.toddlerSafetyRating} / 5 Safety Score
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
