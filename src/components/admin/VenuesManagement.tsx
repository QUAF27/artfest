import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { MapPin, Plus, Edit, Trash2, X, Users, Phone } from 'lucide-react';
import { Venue } from '../../types';

export const VenuesManagement: React.FC = () => {
  const { currentFestival, venues, addVenue, updateVenue, programmes } = useFest();
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [stageNumber, setStageNumber] = useState(1);
  const [capacity, setCapacity] = useState(500);
  const [location, setLocation] = useState('');
  const [isIndoor, setIsIndoor] = useState(true);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');

  const festVenues = venues.filter(v => v.festivalId === currentFestival.id);

  const openAdd = () => {
    setEditingVenue(null);
    setName('');
    setCode(`STG-${festVenues.length + 1}`);
    setStageNumber(festVenues.length + 1);
    setCapacity(500);
    setLocation('');
    setIsIndoor(true);
    setCoordinatorName('');
    setCoordinatorPhone('');
    setShowModal(true);
  };

  const openEdit = (v: Venue) => {
    setEditingVenue(v);
    setName(v.name);
    setCode(v.code);
    setStageNumber(v.stageNumber);
    setCapacity(v.capacity);
    setLocation(v.location);
    setIsIndoor(v.isIndoor);
    setCoordinatorName(v.coordinatorName);
    setCoordinatorPhone(v.coordinatorPhone);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingVenue) {
      updateVenue(editingVenue.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        stageNumber: Number(stageNumber),
        capacity: Number(capacity),
        location: location.trim(),
        isIndoor,
        coordinatorName: coordinatorName.trim(),
        coordinatorPhone: coordinatorPhone.trim()
      });
    } else {
      addVenue({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        stageNumber: Number(stageNumber),
        capacity: Number(capacity),
        location: location.trim(),
        isIndoor,
        coordinatorName: coordinatorName.trim(),
        coordinatorPhone: coordinatorPhone.trim()
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>Stages & Venues Setup</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure auditorium halls, outdoor stages, sound gear coordinators, and seating capacities
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stage / Venue</span>
        </button>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {festVenues.map(ven => {
          const venueProgrammes = programmes.filter(p => p.venueId === ven.id);

          return (
            <div
              key={ven.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                      {ven.code} · Stage #{ven.stageNumber}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 mt-1.5">{ven.name}</h3>
                    <div className="text-xs text-neutral-400">{ven.location}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                    ven.isIndoor ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {ven.isIndoor ? 'Indoor' : 'Open Air'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Audience Capacity:</span>
                    <span className="font-semibold text-neutral-900 tabular-nums">{ven.capacity} seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Stage Coordinator:</span>
                    <span className="font-medium text-neutral-800">{ven.coordinatorName || 'TBD'}</span>
                  </div>
                  {ven.coordinatorPhone && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Coordinator Phone:</span>
                      <span>{ven.coordinatorPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Allotted Events:</span>
                    <span className="font-bold text-amber-700 tabular-nums">{venueProgrammes.length} events</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => openEdit(ven)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                  title="Edit Venue"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {editingVenue ? 'Edit Stage Details' : 'Configure New Stage'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Stage / Venue Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Stage 1 (Tagore Auditorium)"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Venue Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. STG-1"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg uppercase font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Stage Number</label>
                  <input
                    type="number"
                    min={1}
                    value={stageNumber}
                    onChange={e => setStageNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min={50}
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Venue Type</label>
                  <select
                    value={isIndoor ? 'true' : 'false'}
                    onChange={e => setIsIndoor(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  >
                    <option value="true">Indoor Auditorium</option>
                    <option value="false">Open Air Pandal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Location / Directions</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Main Administrative Block Level 1"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Stage Coordinator</label>
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={e => setCoordinatorName(e.target.value)}
                    placeholder="Prof. Haris K."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Coordinator Phone</label>
                  <input
                    type="text"
                    value={coordinatorPhone}
                    onChange={e => setCoordinatorPhone(e.target.value)}
                    placeholder="+91 94470..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
