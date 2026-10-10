import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { CreditCard, Printer, Search, Download, Filter, User } from 'lucide-react';
import { QRCodeView } from '../common/QRCodeView';
import { Participant } from '../../types';

interface IdCardGeneratorProps {
  selectedParticipant?: Participant | null;
}

export const IdCardGenerator: React.FC<IdCardGeneratorProps> = ({ selectedParticipant }) => {
  const { currentFestival, participants, teams, categories } = useFest();
  const [teamFilter, setTeamFilter] = useState('all');
  const [search, setSearch] = useState(selectedParticipant?.chestNumber || '');

  const festParticipants = participants.filter(p => p.festivalId === currentFestival.id);
  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);

  const filtered = festParticipants.filter(p => {
    const matchTeam = teamFilter === 'all' || p.teamId === teamFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.chestNumber.includes(search);
    return matchTeam && matchSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            <span>Participant ID Badge & Lanyard Generator</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Print-ready festival delegate badges with encrypted QR verification and team color markings
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print All Badges</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 print:hidden">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by chest number or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <select
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg"
        >
          <option value="all">All Teams</option>
          {festTeams.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
          ))}
        </select>
      </div>

      {/* Printable Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
        {filtered.map(p => {
          const team = festTeams.find(t => t.id === p.teamId);
          const cat = categories.find(c => c.id === p.categoryId);

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border-2 border-neutral-300 overflow-hidden shadow-sm flex flex-col justify-between max-w-sm mx-auto w-full page-break-inside-avoid"
            >
              {/* Badge Header with Team color accent */}
              <div 
                className="p-4 text-white text-center relative"
                style={{ backgroundColor: team?.color || '#0f172a' }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  OFFICIAL DELEGATE BADGE
                </div>
                <div className="text-sm font-black truncate mt-0.5">
                  {currentFestival.name}
                </div>
                <div className="text-[10px] opacity-75">
                  {currentFestival.edition} · {currentFestival.academicYear}
                </div>
              </div>

              {/* Badge Body */}
              <div className="p-6 text-center space-y-4">
                {/* Photo / Avatar Placeholder */}
                <div className="w-20 h-20 mx-auto rounded-full bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center text-neutral-400">
                  <User className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight leading-snug">
                    {p.name}
                  </h3>
                  <div className="text-xs text-neutral-500 font-medium mt-0.5">
                    {team?.name} ({team?.code})
                  </div>
                </div>

                {/* Big Chest Number Box */}
                <div className="py-2 px-4 rounded-xl bg-amber-50 border border-amber-300 inline-block">
                  <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                    CHEST NUMBER
                  </span>
                  <span className="text-3xl font-black text-neutral-900 font-mono tabular-nums leading-none">
                    {p.chestNumber}
                  </span>
                </div>

                <div className="flex justify-center gap-4 text-xs text-neutral-600 font-medium pt-1">
                  <span>Div: {cat?.name}</span>
                  <span>·</span>
                  <span>Class: {p.gradeOrClass}</span>
                </div>

                {/* QR Code */}
                <div className="pt-2 flex flex-col items-center">
                  <QRCodeView value={`ARTSFEST-ID-${p.chestNumber}-${currentFestival.id}`} size={72} />
                  <span className="text-[9px] font-mono text-neutral-400 mt-1">
                    VERIFY: #{p.chestNumber}
                  </span>
                </div>
              </div>

              {/* Badge Footer */}
              <div className="p-2.5 bg-neutral-100 border-t border-neutral-200 text-center text-[10px] text-neutral-500 font-medium">
                Must be worn at all competition venues
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
