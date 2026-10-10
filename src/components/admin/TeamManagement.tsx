import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Trophy, Plus, Edit, Trash2, Download, Search, X, Check } from 'lucide-react';
import { Team } from '../../types';

export const TeamManagement: React.FC = () => {
  const { currentFestival, teams, addTeam, updateTeam, deleteTeam, participants } = useFest();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [institution, setInstitution] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerEmail, setManagerEmail] = useState('');

  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);
  const filteredTeams = festTeams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.code.toLowerCase().includes(search.toLowerCase()) ||
    t.institution.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingTeam(null);
    setName('');
    setCode('');
    setColor('#2563EB');
    setInstitution('');
    setManagerName('');
    setManagerPhone('');
    setManagerEmail('');
    setShowModal(true);
  };

  const openEditModal = (t: Team) => {
    setEditingTeam(t);
    setName(t.name);
    setCode(t.code);
    setColor(t.color);
    setInstitution(t.institution);
    setManagerName(t.managerName);
    setManagerPhone(t.managerPhone);
    setManagerEmail(t.managerEmail || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        color,
        institution: institution.trim(),
        managerName: managerName.trim(),
        managerPhone: managerPhone.trim(),
        managerEmail: managerEmail.trim()
      });
    } else {
      addTeam({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        color,
        institution: institution.trim(),
        managerName: managerName.trim(),
        managerPhone: managerPhone.trim(),
        managerEmail: managerEmail.trim()
      });
    }

    setShowModal(false);
  };

  const exportTeamsCsv = () => {
    const headers = ['Team Code', 'Team Name', 'Institution', 'Manager', 'Phone', 'Points'];
    const rows = festTeams.map(t => [t.code, t.name, t.institution, t.managerName, t.managerPhone, t.points]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teams_${currentFestival.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span>Teams & House Management</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage participating houses, institution departments, and appointed team managers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportTeamsCsv}
            className="px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Team</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search team name, code or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map(team => {
          const teamParticipants = participants.filter(p => p.teamId === team.id);

          return (
            <div
              key={team.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: team.color }}
                    />
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">{team.name}</h3>
                      <div className="text-xs text-neutral-400">{team.institution}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                    {team.code}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Team Manager:</span>
                    <span className="font-medium text-neutral-800">{team.managerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Contact:</span>
                    <span>{team.managerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Enrolled Students:</span>
                    <span className="font-semibold text-neutral-900 tabular-nums">{teamParticipants.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400">Current Points:</span>
                  <div className="text-lg font-black text-amber-600 tabular-nums leading-none mt-0.5">
                    {team.points} pts
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(team)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                    title="Edit Team"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${team.name}?`)) {
                        deleteTeam(team.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete Team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                {editingTeam ? 'Edit Team Details' : 'Register New House / Team'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Team / House Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Al-Bayan House"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Team Code (3-4 Letters) *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABH"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">House Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="w-10 h-9 p-0.5 border border-neutral-300 rounded cursor-pointer"
                    />
                    <span className="font-mono text-neutral-600">{color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Institution Department / Faculty</label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="e.g. School of Arabic & Humanities"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={e => setManagerName(e.target.value)}
                    placeholder="e.g. Zubair Rahman"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Manager Phone</label>
                  <input
                    type="text"
                    value={managerPhone}
                    onChange={e => setManagerPhone(e.target.value)}
                    placeholder="+91 94471 00001"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Save Team Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
