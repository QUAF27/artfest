import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { BookOpen, Plus, Search, Edit, Trash2, X, Clock, Shield, PlusCircle } from 'lucide-react';
import { Programme, ScoringCriterion } from '../../types';

export const ProgrammeManagement: React.FC = () => {
  const { currentFestival, programmes, categories, venues, addProgramme, updateProgramme, deleteProgramme } = useFest();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProg, setEditingProg] = useState<Programme | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [titleMl, setTitleMl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'individual' | 'group'>('individual');
  const [stageType, setStageType] = useState<'stage' | 'non_stage'>('stage');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [venueId, setVenueId] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(12);
  const [judgeCount, setJudgeCount] = useState(3);
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([
    { id: 'c1', name: 'Rhythm & Melody', maxMarks: 35 },
    { id: 'c2', name: 'Expression & Bhavam', maxMarks: 35 },
    { id: 'c3', name: 'Stage Discipline', maxMarks: 30 }
  ]);

  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const festVenues = venues.filter(v => v.festivalId === currentFestival.id);

  const filtered = festProgrammes.filter(p => {
    const matchSearch = 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'all' || p.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditingProg(null);
    setCode(`EV-${festProgrammes.length + 1}`);
    setTitle('');
    setTitleMl('');
    setCategoryId(categories[0]?.id || '');
    setType('individual');
    setStageType('stage');
    setDurationMinutes(10);
    setVenueId(festVenues[0]?.id || '');
    setMaxParticipants(12);
    setJudgeCount(3);
    setCriteria([
      { id: 'c1', name: 'Rhythm & Technique', maxMarks: 40 },
      { id: 'c2', name: 'Artistic Expression', maxMarks: 35 },
      { id: 'c3', name: 'Overall Presentation', maxMarks: 25 }
    ]);
    setShowModal(true);
  };

  const openEdit = (p: Programme) => {
    setEditingProg(p);
    setCode(p.code);
    setTitle(p.title);
    setTitleMl(p.titleMl || '');
    setCategoryId(p.categoryId);
    setType(p.type);
    setStageType(p.stageType);
    setDurationMinutes(p.durationMinutes);
    setVenueId(p.venueId || '');
    setMaxParticipants(p.maxParticipants);
    setJudgeCount(p.judgeCount);
    setCriteria(p.criteria || []);
    setShowModal(true);
  };

  const handleCriterionChange = (idx: number, field: 'name' | 'maxMarks', val: any) => {
    setCriteria(prev => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  };

  const addCriterion = () => {
    setCriteria(prev => [
      ...prev,
      { id: `c-${Date.now()}`, name: 'New Criterion', maxMarks: 10 }
    ]);
  };

  const removeCriterion = (idx: number) => {
    setCriteria(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !categoryId) return;

    if (editingProg) {
      updateProgramme(editingProg.id, {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        titleMl: titleMl.trim() || undefined,
        categoryId,
        type,
        stageType,
        durationMinutes: Number(durationMinutes),
        venueId: venueId || undefined,
        maxParticipants: Number(maxParticipants),
        judgeCount: Number(judgeCount),
        criteria
      });
    } else {
      addProgramme({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        titleMl: titleMl.trim() || undefined,
        categoryId,
        type,
        stageType,
        durationMinutes: Number(durationMinutes),
        venueId: venueId || undefined,
        maxParticipants: Number(maxParticipants),
        judgeCount: Number(judgeCount),
        criteria,
        status: 'draft'
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>Programmes & Syllabus Management</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure competition rules, scoring criteria rubrics, and maximum duration
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Programme</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search code or competition title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg"
        >
          <option value="all">All Divisions</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Programme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => {
          const cat = categories.find(c => c.id === p.categoryId);
          const venue = festVenues.find(v => v.id === p.venueId);

          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                    {p.code}
                  </span>
                  <span>{cat?.name} · <strong className="capitalize text-neutral-700">{p.type}</strong></span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 leading-snug mt-1">
                  {p.title}
                </h3>
                {p.titleMl && (
                  <div className="text-xs text-neutral-500 font-medium">{p.titleMl}</div>
                )}

                <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Duration:</span>
                    <span>{p.durationMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Format:</span>
                    <span className="capitalize">{p.stageType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Venue:</span>
                    <span className="truncate max-w-[150px]">{venue?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Required Judges:</span>
                    <span>{p.judgeCount} Adjudicators</span>
                  </div>
                </div>

                {/* Criteria */}
                <div className="mt-3 pt-2 border-t border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Scoring Rubric ({p.criteria.length} criteria)
                  </div>
                  <div className="space-y-1">
                    {p.criteria.map(c => (
                      <div key={c.id} className="flex justify-between text-[11px] text-neutral-600">
                        <span className="truncate max-w-[160px]">{c.name}</span>
                        <span className="font-mono font-medium">{c.maxMarks}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                  p.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-800'
                }`}>
                  {p.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                    title="Edit Programme"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete programme ${p.title}?`)) {
                        deleteProgramme(p.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete Programme"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Programme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {editingProg ? 'Edit Programme Syllabus' : 'Add New Competition'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Programme Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. STG-05"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg uppercase font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Division / Category *</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Programme Title (English) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Carnatic Vocal Solo"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Programme Title (Malayalam)</label>
                <input
                  type="text"
                  value={titleMl}
                  onChange={e => setTitleMl(e.target.value)}
                  placeholder="e.g. ശാസ്ത്രീയ സംഗീതം"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Entry Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Stage Format</label>
                  <select
                    value={stageType}
                    onChange={e => setStageType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  >
                    <option value="stage">Stage</option>
                    <option value="non_stage">Non-Stage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={3}
                    max={180}
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Assigned Venue</label>
                  <select
                    value={venueId}
                    onChange={e => setVenueId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  >
                    <option value="">Unassigned</option>
                    {festVenues.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Judges Required</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={judgeCount}
                    onChange={e => setJudgeCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Criteria Editor */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-700">Judging Criteria Rubrics</label>
                  <button
                    type="button"
                    onClick={addCriterion}
                    className="text-amber-700 font-semibold text-xs flex items-center gap-1 hover:underline"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Criterion</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {criteria.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={c.name}
                        onChange={e => handleCriterionChange(idx, 'name', e.target.value)}
                        placeholder="Criterion name..."
                        className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs"
                      />
                      <input
                        type="number"
                        min={5}
                        max={100}
                        value={c.maxMarks}
                        onChange={e => handleCriterionChange(idx, 'maxMarks', Number(e.target.value))}
                        className="w-20 px-2 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono"
                        placeholder="Max"
                      />
                      <button
                        type="button"
                        onClick={() => removeCriterion(idx)}
                        className="p-1 text-neutral-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
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
                  Save Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
