import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Users, Plus, Search, Filter, Download, 
  Upload, Trash2, Edit, QrCode, X, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { Participant } from '../../types';

interface ParticipantManagementProps {
  onOpenIdCardModal?: (participant: Participant) => void;
}

export const ParticipantManagement: React.FC<ParticipantManagementProps> = ({ onOpenIdCardModal }) => {
  const { 
    currentFestival, participants, teams, categories, 
    addParticipant, updateParticipant, deleteParticipant, 
    bulkImportParticipants 
  } = useFest();

  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [chestNumber, setChestNumber] = useState('');
  const [teamId, setTeamId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [gradeOrClass, setGradeOrClass] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [phone, setPhone] = useState('');

  // Bulk CSV text state
  const [csvText, setCsvText] = useState('');
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const festParticipants = participants.filter(p => p.festivalId === currentFestival.id);
  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);

  const filtered = festParticipants.filter(p => {
    const matchSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.chestNumber.includes(search);
    const matchTeam = teamFilter === 'all' || p.teamId === teamFilter;
    const matchCat = catFilter === 'all' || p.categoryId === catFilter;
    return matchSearch && matchTeam && matchCat;
  });

  const generateAutoChest = () => {
    const used = new Set(festParticipants.map(p => parseInt(p.chestNumber, 10)).filter(n => !isNaN(n)));
    let next = 101;
    while (used.has(next)) {
      next++;
    }
    setChestNumber(String(next));
  };

  const openAdd = () => {
    setEditingParticipant(null);
    setName('');
    generateAutoChest();
    setTeamId(festTeams[0]?.id || '');
    setCategoryId(categories[0]?.id || '');
    setGradeOrClass('Degree 1st Year');
    setGender('M');
    setPhone('');
    setShowAddModal(true);
  };

  const openEdit = (p: Participant) => {
    setEditingParticipant(p);
    setName(p.name);
    setChestNumber(p.chestNumber);
    setTeamId(p.teamId);
    setCategoryId(p.categoryId);
    setGradeOrClass(p.gradeOrClass);
    setGender(p.gender);
    setPhone(p.phone || '');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !chestNumber.trim() || !teamId || !categoryId) return;

    if (editingParticipant) {
      updateParticipant(editingParticipant.id, {
        name: name.trim(),
        chestNumber: chestNumber.trim(),
        teamId,
        categoryId,
        gradeOrClass,
        gender,
        phone: phone.trim()
      });
    } else {
      addParticipant({
        name: name.trim(),
        chestNumber: chestNumber.trim(),
        teamId,
        categoryId,
        gradeOrClass,
        gender,
        phone: phone.trim(),
        status: 'verified'
      });
    }

    setShowAddModal(false);
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    const toImport: Omit<Participant, 'id' | 'festivalId' | 'createdAt'>[] = [];

    lines.forEach(line => {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        const pName = parts[0];
        const pChest = parts[1] || `${Math.floor(200 + Math.random() * 800)}`;
        const pTeamCode = parts[2] || '';
        const foundTeam = festTeams.find(t => t.code.toUpperCase() === pTeamCode.toUpperCase()) || festTeams[0];
        const foundCat = categories[0];

        if (pName && pName.toLowerCase() !== 'name') {
          toImport.push({
            name: pName,
            chestNumber: pChest,
            teamId: foundTeam ? foundTeam.id : 'team-01',
            categoryId: foundCat ? foundCat.id : 'cat-01',
            gradeOrClass: parts[3] || 'General',
            gender: 'M',
            phone: parts[4] || '',
            status: 'verified'
          });
        }
      }
    });

    if (toImport.length > 0) {
      const count = bulkImportParticipants(toImport);
      setImportNotice(`Successfully imported ${count} participants.`);
      setTimeout(() => {
        setImportNotice(null);
        setShowImportModal(false);
        setCsvText('');
      }, 1500);
    }
  };

  const exportParticipantsCsv = () => {
    const headers = ['Chest No', 'Full Name', 'Team', 'Division', 'Class', 'Gender', 'Phone'];
    const rows = festParticipants.map(p => {
      const t = festTeams.find(team => team.id === p.teamId);
      const c = categories.find(cat => cat.id === p.categoryId);
      return [p.chestNumber, p.name, t?.name || '', c?.name || '', p.gradeOrClass, p.gender, p.phone || ''];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Participants_${currentFestival.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Participant Master Directory</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage candidates, unique chest numbers, division eligibility, and ID generation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={exportParticipantsCsv}
            className="px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export List</span>
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Participant</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search candidate name or chest #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Team filter */}
        <select
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">All Teams</option>
          {festTeams.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">All Divisions</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold w-24">Chest #</th>
                <th className="py-3 px-4 font-semibold">Candidate Name</th>
                <th className="py-3 px-4 font-semibold">House / Team</th>
                <th className="py-3 px-4 font-semibold">Division</th>
                <th className="py-3 px-4 font-semibold">Class / Year</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(p => {
                const team = festTeams.find(t => t.id === p.teamId);
                const cat = categories.find(c => c.id === p.categoryId);

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Chest # */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        #{p.chestNumber}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">
                      {p.name}
                      {p.phone && <div className="text-[10px] text-neutral-400 font-normal">{p.phone}</div>}
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: team?.color }} />
                        <span className="text-neutral-700">{team?.name || 'Independent'}</span>
                      </div>
                    </td>

                    {/* Division */}
                    <td className="py-3.5 px-4 text-neutral-600">
                      {cat?.name || 'General'}
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-4 text-neutral-600">
                      {p.gradeOrClass}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenIdCardModal && (
                          <button
                            onClick={() => onOpenIdCardModal(p)}
                            className="p-1 text-neutral-500 hover:text-amber-700 rounded hover:bg-amber-50"
                            title="Generate ID Badge"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove participant ${p.name}?`)) {
                              deleteParticipant(p.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-200 text-[11px] text-neutral-500">
          Showing {filtered.length} of {festParticipants.length} registered candidates
        </div>
      </div>

      {/* Add / Edit Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {editingParticipant ? 'Edit Participant Record' : 'Enroll New Participant'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Full Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aysha Ridha"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-neutral-700">Chest Number *</label>
                    <button
                      type="button"
                      onClick={generateAutoChest}
                      className="text-[10px] text-amber-700 hover:underline"
                    >
                      Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={chestNumber}
                    onChange={e => setChestNumber(e.target.value)}
                    placeholder="e.g. 104"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Assigned Team *</label>
                  <select
                    value={teamId}
                    onChange={e => setTeamId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                  >
                    {festTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Category / Division *</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Class / Year</label>
                  <input
                    type="text"
                    value={gradeOrClass}
                    onChange={e => setGradeOrClass(e.target.value)}
                    placeholder="e.g. BA 2nd Year"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98471..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Save Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                Bulk Participant CSV Import
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-500 space-y-1">
              <p>Paste CSV rows with the following column structure:</p>
              <code className="block p-2 rounded bg-neutral-100 font-mono text-[11px] text-neutral-800">
                Candidate Name, Chest Number, Team Code, Class, Phone
              </code>
            </div>

            <textarea
              rows={6}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder={`Ameer Ali, 501, ABH, BA 1st Year, +91 94471 22331\nFathima Noor, 502, CBF, Plus Two, +91 94471 22332\nZainab K., 503, AHG, Degree 3rd Year, +91 94471 22333`}
              className="w-full p-3 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />

            {importNotice && (
              <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{importNotice}</span>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => setCsvText(`Suhail P., 501, ABH, Final BA\nMaryam J., 502, CBF, Plus One\nHasanul Banna, 503, TLD, MA Arabic`)}
                className="text-amber-700 hover:underline"
              >
                Insert Sample Batch
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCsvImport}
                  className="px-5 py-2 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                >
                  Import Candidates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
