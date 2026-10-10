import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Settings, Plus, CheckCircle2, Trophy, Calendar, MapPin, X } from 'lucide-react';
import { Festival } from '../../types';

export const FestivalSettingsModal: React.FC = () => {
  const { currentFestival, festivals, selectFestival, createFestival, updateFestival } = useFest();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Edit current festival form
  const [name, setName] = useState(currentFestival.name);
  const [edition, setEdition] = useState(currentFestival.edition);
  const [academicYear, setAcademicYear] = useState(currentFestival.academicYear);
  const [theme, setTheme] = useState(currentFestival.theme);
  const [description, setDescription] = useState(currentFestival.description);
  const [venue, setVenue] = useState(currentFestival.venue);
  const [location, setLocation] = useState(currentFestival.location);
  const [startDate, setStartDate] = useState(currentFestival.startDate);
  const [endDate, setEndDate] = useState(currentFestival.endDate);
  const [contactEmail, setContactEmail] = useState(currentFestival.contactEmail);
  const [contactPhone, setContactPhone] = useState(currentFestival.contactPhone);
  const [registrationOpen, setRegistrationOpen] = useState(currentFestival.registrationOpen);

  // Scoring rules
  const [firstPlace, setFirstPlace] = useState(currentFestival.scoringRules.firstPlace);
  const [secondPlace, setSecondPlace] = useState(currentFestival.scoringRules.secondPlace);
  const [thirdPlace, setThirdPlace] = useState(currentFestival.scoringRules.thirdPlace);
  const [aGrade, setAGrade] = useState(currentFestival.scoringRules.aGrade);
  const [bGrade, setBGrade] = useState(currentFestival.scoringRules.bGrade);
  const [groupMultiplier, setGroupMultiplier] = useState(currentFestival.scoringRules.groupMultiplier);

  // Create new festival form
  const [newFestName, setNewFestName] = useState('');
  const [newFestEdition, setNewFestEdition] = useState('1st Edition');
  const [newFestYear, setNewFestYear] = useState('2026-2027');
  const [newFestSlug, setNewFestSlug] = useState('');

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    updateFestival(currentFestival.id, {
      name,
      edition,
      academicYear,
      theme,
      description,
      venue,
      location,
      startDate,
      endDate,
      contactEmail,
      contactPhone,
      registrationOpen,
      scoringRules: {
        firstPlace: Number(firstPlace),
        secondPlace: Number(secondPlace),
        thirdPlace: Number(thirdPlace),
        aGrade: Number(aGrade),
        bGrade: Number(bGrade),
        cGrade: 1,
        groupMultiplier: Number(groupMultiplier)
      }
    });

    setNotice('Festival settings and custom scoring rules saved successfully.');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFestName.trim()) return;

    createFestival({
      slug: newFestSlug.trim() || newFestName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newFestName.trim(),
      edition: newFestEdition.trim(),
      academicYear: newFestYear.trim(),
      theme: 'Celebrating Cultural Excellence',
      description: 'Annual cultural arts competition and literary championship.',
      startDate: '2026-11-20',
      endDate: '2026-11-24',
      venue: 'Main Campus Cultural Grounds',
      location: 'Kozhikode, Kerala',
      status: 'active',
      scoringRules: {
        firstPlace: 5,
        secondPlace: 3,
        thirdPlace: 1,
        aGrade: 5,
        bGrade: 3,
        cGrade: 1,
        groupMultiplier: 2
      },
      registrationOpen: true,
      resultsPublished: false,
      contactEmail: 'desk@fest.org',
      contactPhone: '+91 94470 00000'
    });

    setShowCreateModal(false);
    setNotice(`New festival "${newFestName}" created and activated.`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600" />
            <span>Multi-Festival Governance & Scoring Configuration</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage festival metadata, date windows, registration locks, and points formula
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Festival</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Festival Selector Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
          Current Festival Scope ({festivals.length} Configured)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {festivals.map(fest => (
            <button
              key={fest.id}
              onClick={() => selectFestival(fest.id)}
              className={`p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-colors ${
                fest.id === currentFestival.id
                  ? 'bg-amber-50/80 border-amber-300 font-medium'
                  : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <div>
                <div className="text-sm font-bold text-neutral-900">{fest.name}</div>
                <div className="text-xs text-neutral-500">{fest.edition} · {fest.academicYear}</div>
                <div className="text-[10px] text-neutral-400 mt-1">{fest.venue}</div>
              </div>

              {fest.id === currentFestival.id && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-600 text-white shrink-0">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Festival Configuration Form */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSaveCurrent} className="space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2 mb-4">
              Basic Festival Information
            </h3>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Festival Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Edition *</label>
                  <input
                    type="text"
                    value={edition}
                    onChange={e => setEdition(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Festival Theme</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={e => setTheme(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Primary Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Rules Engine */}
          <div className="pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2 mb-4">
              Scoring System & Point Formula
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">1st Place Points</label>
                <input
                  type="number"
                  min={1}
                  value={firstPlace}
                  onChange={e => setFirstPlace(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">2nd Place Points</label>
                <input
                  type="number"
                  min={0}
                  value={secondPlace}
                  onChange={e => setSecondPlace(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">3rd Place Points</label>
                <input
                  type="number"
                  min={0}
                  value={thirdPlace}
                  onChange={e => setThirdPlace(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">A Grade Bonus</label>
                <input
                  type="number"
                  min={0}
                  value={aGrade}
                  onChange={e => setAGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">B Grade Bonus</label>
                <input
                  type="number"
                  min={0}
                  value={bGrade}
                  onChange={e => setBGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Group Event Multiplier</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={groupMultiplier}
                  onChange={e => setGroupMultiplier(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
              <input
                type="checkbox"
                checked={registrationOpen}
                onChange={e => setRegistrationOpen(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Registration Window Open</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors"
            >
              Save Festival Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Create New Festival Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">Create New Festival Instance</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Festival Name *</label>
                <input
                  type="text"
                  required
                  value={newFestName}
                  onChange={e => setNewFestName(e.target.value)}
                  placeholder="e.g. State Youth Arts Festival 2027"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Edition</label>
                  <input
                    type="text"
                    value={newFestEdition}
                    onChange={e => setNewFestEdition(e.target.value)}
                    placeholder="e.g. 29th Edition"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={newFestYear}
                    onChange={e => setNewFestYear(e.target.value)}
                    placeholder="e.g. 2026-2027"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">URL Identifier (Slug)</label>
                <input
                  type="text"
                  value={newFestSlug}
                  onChange={e => setNewFestSlug(e.target.value)}
                  placeholder="e.g. state-youth-fest-2027"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-sm"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                >
                  Create Festival
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
