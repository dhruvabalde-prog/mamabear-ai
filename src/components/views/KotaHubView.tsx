import React from 'react';
import { 
  MapPin, Flame, Phone, ShieldCheck, 
  Building2, Users, Compass, ExternalLink 
} from 'lucide-react';

export const KotaHubView: React.FC = () => {
  const kotaVendors = [
    {
      name: 'Hadoti Constructions & Kota Stone Crafts',
      service: 'Natural Green Kota Stone & Mirror Polishing',
      area: 'Subhash Nagar / Industrial Area Kota',
      phone: '+91 94141 88776',
      contactPerson: 'Rameshwar Ji Gurjar',
      status: 'On Site'
    },
    {
      name: 'Gumanpura Electronics & HVAC Center',
      service: 'Multi-split Inverter ACs & Industrial Desert Ducting',
      area: 'Gumanpura Main Market, Kota',
      phone: '+91 98290 22334',
      contactPerson: 'Deepak Agarwal',
      status: 'Quotation Approved'
    },
    {
      name: 'Hadoti Safety Glass & Rubber Profiles',
      service: '8mm Toughened Glass & Anti-Finger Trap Door Guards',
      area: 'Vigyan Nagar Road, Kota',
      phone: '+91 97850 66778',
      contactPerson: 'Mohan Sharma',
      status: 'Delivered'
    },
    {
      name: 'Kota City Signs & Canadian Acrylic Works',
      service: '3D Lit Canadian Maple Leaf Entrance Signage',
      area: 'Aerodrome Circle, Kota',
      phone: '+91 99281 99001',
      contactPerson: 'Sanjay Jain',
      status: 'Advance Paid'
    }
  ];

  const emergencyContacts = [
    { name: 'Subhash Nagar Police Station (Chowki)', phone: '0744-2423100 / 112', type: 'Law & Order / Verification' },
    { name: 'New Medical College Hospital (NMCH) Emergency', phone: '0744-2321155', type: 'Pediatric Care & Trauma' },
    { name: 'Rajasthan Fire Services (Kota Division)', phone: '101 / 0744-2391000', type: 'Fire NOC & Safety' },
    { name: 'Kota Municipal Corporation (KMC Helpdesk)', phone: '0744-2500000', type: 'Commercial Land & Health' }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kota & Subhash Nagar Intelligence Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Local vendors, extreme climate protocols, coaching demographic insights, and emergency authorities.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Subhash Nagar, Kota, Rajasthan</span>
        </div>
      </div>

      {/* Demographic Insights for Co-Founders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Users className="w-4 h-4 text-indigo-600" />
            Kota Parent Demographic Playbook
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Kota is world-famous as India\'s coaching capital. Hundreds of top faculties at Allen, Resonance, and Motion live in neighboring Talwandi and Subhash Nagar with young families. They work intense lecture hours and are eager for a global, loving, stress-free preschool that provides Canadian hands-on inquiry rather than rote memorization.
          </p>
          <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 p-2.5 rounded-xl">
            💡 Strategy: Offer extended afternoon Daycare till 5:30 PM aligned with faculty teaching shifts.
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Flame className="w-4 h-4 text-amber-600" />
            Kota Extreme Summer Heat Protocols
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            May & June temperatures in Hadoti region exceed 45°C. The school operates on morning timings (8:00 AM - 12:30 PM). Our campus features double-insulated roofs, 70% UV heat rejection solar film on windows, and 2.5-ton split inverter cooling to protect early years children.
          </p>
          <div className="text-[11px] font-bold text-amber-800 bg-amber-50 p-2.5 rounded-xl">
            💡 Strategy: Mandatory hydration breaks every 45 minutes; indoor air-conditioned gross motor gym.
          </div>
        </div>
      </div>

      {/* Local Vetted Vendors Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-base text-slate-900">Vetted Kota Vendors & Contractors</h2>
          <span className="text-xs text-slate-500 font-medium">Subhash Nagar & Gumanpura</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {kotaVendors.map((v, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{v.name}</h3>
                <p className="text-indigo-600 font-semibold mt-0.5">{v.service}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Area: {v.area} • Contact: {v.contactPerson}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px]">
                  {v.status}
                </span>
                <a
                  href={`tel:${v.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-indigo-600 transition-colors"
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Authorities */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Phone className="w-4 h-4 text-red-600" />
          Emergency Authorities & City Liaisons
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {emergencyContacts.map((c, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block text-xs">{c.name}</span>
                <span className="text-slate-500 text-[11px]">{c.type}</span>
              </div>
              <a
                href={`tel:${c.phone}`}
                className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg hover:bg-rose-100"
              >
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
