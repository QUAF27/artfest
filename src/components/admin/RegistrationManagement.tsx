import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { UserCheck, Plus, Search, Trash2, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { Registration } from '../../types';

export const RegistrationManagement: React.FC = () => {
  const { 
    currentFestival, registrations, programmes, participants, 
    teams, addRegistration, updateRegistrationStatus, deleteRegistration 
  } = useFest();

  const [search, setSearch] = useState('');
  const [selectedProg, setSelectedProg] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [programmeId, setProgrammeId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const festRegistrations = registrations.filter(r => r.festivalId === currentFestival.id);
  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);
  const festParticipants = participants.filter(p => p.festivalId === currentFestival.id);

  const filtered = festRegistrations.filter(r => {
    const prog = festProgrammes.find(p => p.id === r.programmeId);
    const team = festTeams.find(t => t.id === r.teamId);
    const matchSearch = r.chestNumber.includes(search) || (prog?.title.toLowerCase().includes(search.toLowerCase()));
    const matchProg = selectedProg === 'all' || r.programmeId === selectedProg;
    const matchTeam = selectedTeam === 'all' || r.teamId === selectedTeam;
    return matchSearch && matchProg && matchTeam;
  });

  const handleOpenAdd = () => {
    setProgrammeId(festProgrammes[0]?.id || '');
    setTeamId(festTeams[0]?.id || '');
    setParticipantId('');
    setErrorNotice(null);
    setShowModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programmeId || !teamId) return;

    const prog = festProgrammes.find(p => p.id === programmeId);
    const candidate = festParticipants.find(p => p.id === participantId);

    // Duplicate check: Is participant already registered for this competition?
    if (candidate) {
      const duplicate = festRegistrations.some(
        r => r.programmeId === programmeId && (r.participantId === candidate.id || r.chestNumber === candidate.chestNumber)
      );
      if (duplicate) {
        setErrorNotice(`Duplicate entry: Chest #${candidate.chestNumber} is already registered for "${prog?.title}".`);
        return;
      }
    }

    const chest = candidate ? candidate.chestNumber : `${Math.floor(100 + Math.random() * 900)}`;

    addRegistration({
      programmeId,
      teamId,
      participantId: candidate?.id,
      chestNumber: chest,
      status: 'confirmed'
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <span>Event Entry & Registration Control</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Validate candidate eligibility, prevent duplicate entries, and manage house quotas
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Candidate</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search chest number or event..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <select
          value={selectedProg}
          onChange={e => setSelectedProg(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg"
        >
          <option value="all">All Programmes</option>
          {festProgrammes.map(p => (
            <option key={p.id} value={p.id}>{p.code} - {p.title}</option>
          ))}
        </select>

        <select
          value={selectedTeam}
          onChange={e => setSelectedTeam(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg"
        >
          <option value="all">All Teams</option>
          {festTeams.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Chest #</th>
                <th className="py-3 px-4 font-semibold">Participant / Group</th>
                <th className="py-3 px-4 font-semibold">Programme Title</th>
                <th className="py-3 px-4 font-semibold">House / Team</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(reg => {
                const prog = festProgrammes.find(p => p.id === reg.programmeId);
                const team = festTeams.find(t => t.id === reg.teamId);
                let candidateName = 'Group Entry';
                if (reg.participantId) {
                  const part = festParticipants.find(p => p.id === reg.participantId);
                  if (part) candidateName = part.name;
                } else if (reg.groupMembers && reg.groupMembers.length > 0) {
                  candidateName = reg.groupMembers.map(m => m.name).join(', ');
                }

                return (
                  <tr key={reg.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        #{reg.chestNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-neutral-900">
                      {candidateName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-800">{prog?.title}</div>
                      <div className="text-[10px] font-mono text-neutral-400">{prog?.code}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: team?.color }} />
                        <span className="text-neutral-700">{team?.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                        reg.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : reg.status === 'rejected'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {reg.status !== 'confirmed' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'confirmed')}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Approve Registration"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {reg.status !== 'rejected' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                            title="Flag / Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Cancel this registration?')) {
                              deleteRegistration(reg.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
          Showing {filtered.length} entries
        </div>
      </div>

      {/* Add Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                Register Participant for Competition
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorNotice && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorNotice}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Select Programme *</label>
                <select
                  value={programmeId}
                  onChange={e => setProgrammeId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                >
                  {festProgrammes.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.title} ({p.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Select House / Team *</label>
                <select
                  value={teamId}
                  onChange={e => setTeamId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                >
                  {festTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Enrolled Candidate (Individual Events)
                </label>
                <select
                  value={participantId}
                  onChange={e => setParticipantId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm"
                >
                  <option value="">-- Or Assign As House Group Entry --</option>
                  {festParticipants.filter(p => !teamId || p.teamId === teamId).map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.chestNumber} - {p.name}
                    </option>
                  ))}
                </select>
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
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
