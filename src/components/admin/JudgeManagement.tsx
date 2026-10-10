import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Scale, Plus, Search, Edit, Trash2, X, BookOpen, Check } from 'lucide-react';
import { Judge } from '../../types';

export const JudgeManagement: React.FC = () => {
  const { currentFestival, judges, addJudge, updateJudge, programmes } = useFest();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [assignedProgrammes, setAssignedProgrammes] = useState<string[]>([]);

  const festJudges = judges.filter(j => j.festivalId === currentFestival.id);
  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);

  const filtered = festJudges.filter(j =>
    j.name.toLowerCase().includes(search.toLowerCase()) ||
    j.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingJudge(null);
    setName('');
    setDesignation('Senior Performing Arts Adjudicator');
    setSpecialization('Classical Dance & Music');
    setPhone('+91 94470...');
    setEmail('adjudicator@artsfestpro.org');
    setAssignedProgrammes([festProgrammes[0]?.id || '']);
    setShowModal(true);
  };

  const openEdit = (j: Judge) => {
    setEditingJudge(j);
    setName(j.name);
    setDesignation(j.designation);
    setSpecialization(j.specialization);
    setPhone(j.phone);
    setEmail(j.email);
    setAssignedProgrammes(j.assignedProgrammes || []);
    setShowModal(true);
  };

  const toggleProgrammeAssignment = (progId: string) => {
    setAssignedProgrammes(prev =>
      prev.includes(progId) ? prev.filter(id => id !== progId) : [...prev, progId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingJudge) {
      updateJudge(editingJudge.id, {
        name: name.trim(),
        designation: designation.trim(),
        specialization: specialization.trim(),
        phone: phone.trim(),
        email: email.trim(),
        assignedProgrammes
      });
    } else {
      addJudge({
        name: name.trim(),
        designation: designation.trim(),
        specialization: specialization.trim(),
        phone: phone.trim(),
        email: email.trim(),
        assignedProgrammes
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600" />
            <span>Adjudicator & Judge Management</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage expert jury profiles, professional credentials, and event jury panel allocations
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Adjudicator</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search judge name or specialization..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      {/* Judges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(j => (
          <div
            key={j.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{j.name}</h3>
                  <div className="text-xs text-amber-700 font-medium">{j.specialization}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{j.designation}</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold text-xs">
                  <Scale className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Phone:</span>
                  <span>{j.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Email:</span>
                  <span className="truncate max-w-[170px]">{j.email}</span>
                </div>
                <div className="pt-2">
                  <span className="text-neutral-400 block mb-1">Assigned Events ({j.assignedProgrammes.length}):</span>
                  <div className="flex flex-wrap gap-1">
                    {j.assignedProgrammes.map(progId => {
                      const p = festProgrammes.find(prog => prog.id === progId);
                      return (
                        <span key={progId} className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-mono text-neutral-700">
                          {p?.code || progId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end">
              <button
                onClick={() => openEdit(j)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                title="Edit Adjudicator"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Judge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {editingJudge ? 'Edit Adjudicator Details' : 'Register New Adjudicator'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Prof. K.V. Sreeraman"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Artistic Specialization *</label>
                <input
                  type="text"
                  required
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  placeholder="e.g. Classical Vocal & Carnatic Music"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Designation & Institution</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  placeholder="e.g. Former Dean, Faculty of Fine Arts"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 94472..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="judge@domain.org"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Programme Assignments */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="block font-medium text-neutral-700 mb-2">
                  Assigned Competitions
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                  {festProgrammes.map(prog => (
                    <label key={prog.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={assignedProgrammes.includes(prog.id)}
                        onChange={() => toggleProgrammeAssignment(prog.id)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-mono text-neutral-500">{prog.code}</span>
                      <span className="text-neutral-800">{prog.title}</span>
                    </label>
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
                  Save Adjudicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
