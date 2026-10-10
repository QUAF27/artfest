import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { BookOpen, Search, CheckSquare, Clock, Users, Shield } from 'lucide-react';

export const ProgrammeDirectory: React.FC = () => {
  const { currentFestival, programmes, categories, language } = useFest();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);

  const filtered = festProgrammes.filter(p => {
    const matchSearch = 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      (p.titleMl && p.titleMl.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCat === 'all' || p.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <span>{language === 'ml' ? 'മത്സര ഇനങ്ങളുടെ നിയമാവലി' : 'Festival Syllabus & Programme Directory'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Rules, duration limits, judging rubrics, and maximum marks distribution
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search disciplines..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs overflow-x-auto">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
            selectedCat === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCat === cat.id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(prog => {
          const cat = categories.find(c => c.id === prog.categoryId);
          const totalMaxMarks = prog.criteria.reduce((s, c) => s + c.maxMarks, 0);

          return (
            <div
              key={prog.id}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span className="font-mono font-bold text-neutral-800">{prog.code}</span>
                  <span>{cat?.name} · <strong className="capitalize text-neutral-700">{prog.type}</strong></span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900">{prog.title}</h3>
                {prog.titleMl && (
                  <div className="text-xs text-neutral-500 font-medium mb-3">{prog.titleMl}</div>
                )}

                <div className="flex items-center gap-4 text-xs text-neutral-600 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Duration: {prog.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Judges: {prog.judgeCount} Adjudicators</span>
                  </div>
                </div>

                {/* Scoring Criteria Rubric */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Judging Criteria & Marks ({totalMaxMarks} Total)
                  </div>
                  <div className="space-y-1.5">
                    {prog.criteria.map(crit => (
                      <div key={crit.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-neutral-50">
                        <span className="text-neutral-700">{crit.name}</span>
                        <span className="font-bold text-neutral-900 font-mono">{crit.maxMarks} marks</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Format: {prog.stageType === 'stage' ? 'Auditorium Stage' : 'Written / Non-Stage'}</span>
                <span>Max {prog.maxParticipants} participants</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
