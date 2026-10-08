import React, { useState } from 'react';
import { 
  MapPin, Flame, Phone, ShieldCheck, 
  Building2, Users, Compass, ExternalLink, Plus, X 
} from 'lucide-react';
import { LocalVendor, SetupConfig } from '../../types';

interface KotaHubViewProps {
  vendors?: LocalVendor[];
  setupConfig?: SetupConfig | null;
  onAddVendor?: (vendor: LocalVendor) => void;
  isLoading?: boolean;
}

export const KotaHubView: React.FC<KotaHubViewProps> = ({
  vendors = [],
  setupConfig,
  onAddVendor,
  isLoading = false
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<LocalVendor>>({
    name: '',
    serviceCategory: 'Civil & Flooring',
    area: setupConfig?.campusLocation || 'Subhash Nagar',
    phone: '',
    contactPerson: '',
    status: 'Lead'
  });

  const emergencyContacts = [
    { name: 'Subhash Nagar Police Station (Chowki)', phone: '0744-2423100 / 112', type: 'Law & Order / Verification' },
    { name: 'New Medical College Hospital (NMCH) Emergency', phone: '0744-2321155', type: 'Pediatric Care & Trauma' },
    { name: 'Rajasthan Fire Services (Kota Division)', phone: '101 / 0744-2391000', type: 'Fire NOC & Safety' },
    { name: 'Kota Municipal Corporation (KMC Helpdesk)', phone: '0744-2500000', type: 'Commercial Land & Health' }
  ];

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !onAddVendor) return;
    const newVendor: LocalVendor = {
      id: `vend-${Date.now()}`,
      name: formData.name,
      serviceCategory: formData.serviceCategory || 'Vendor',
      area: formData.area || 'Kota',
      phone: formData.phone,
      contactPerson: formData.contactPerson || 'Representative',
      status: formData.status as any || 'Lead'
    };
    onAddVendor(newVendor);
    setShowAddModal(false);
    setFormData({
      name: '',
      serviceCategory: 'Civil & Flooring',
      area: setupConfig?.campusLocation || 'Subhash Nagar',
      phone: '',
      contactPerson: '',
      status: 'Lead'
    });
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Vendors
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Kota local supplies & emergency services
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer shrink-0"
          title="Add Supplier"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Supplier</span>
        </button>
      </div>

      {/* Demographic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Parent Demographic Strategy</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Families prioritize bilingual immersion, safe childproofed premises, and flexible daycare schedules aligned with professional shifts.
          </p>
          <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 p-2.5 rounded-xl">
            💡 Strategy: Extended afternoon Daycare slots till 5:30 PM with structured activities.
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Climate & Summer Heat Protocols</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Extreme dry summer heat requires insulated ceilings, solar UV reduction film, multi-split cooling, and indoor gross motor play spaces.
          </p>
          <div className="text-[11px] font-bold text-amber-800 bg-amber-50 p-2.5 rounded-xl">
            💡 Strategy: Hydration checks every 45 mins; indoor air-conditioned gross motor gym.
          </div>
        </div>
      </div>

      {/* Local Vetted Vendors Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Contracted Local Suppliers ({vendors.length})
          </h3>
        </div>

        {vendors.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No local suppliers registered yet. Click "Add Local Supplier" to onboard vendors.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">Vendor & Service</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{v.name}</div>
                      <div className="text-[11px] text-slate-500">{v.serviceCategory}</div>
                    </td>
                    <td className="p-4 text-slate-600">{v.area}</td>
                    <td className="p-4 text-slate-600">{v.contactPerson}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`tel:${v.phone}`}
                        className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-800"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Emergency Authorities Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory & Emergency Services Directory</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyContacts.map((contact, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-slate-900">{contact.name}</h4>
                <span className="text-[10px] text-slate-500">{contact.type}</span>
              </div>
              <a
                href={`tel:${contact.phone.split('/')[0].trim()}`}
                className="font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200"
              >
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Add Local Supplier</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hadoti Crafts & Stone"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Service Category</label>
                  <input
                    type="text"
                    value={formData.serviceCategory}
                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                    placeholder="e.g. HVAC Ducting"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Area / Locality</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Representative name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
