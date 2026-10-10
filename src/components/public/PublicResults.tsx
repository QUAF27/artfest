import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Award, Search, CheckCircle2, Filter, Printer, ExternalLink } from 'lucide-react';

interface PublicResultsProps {
  onSelectChestNumber?: (chest: string) => void;
}

export const PublicResults: React.FC<PublicResultsProps> = ({ onSelectChestNumber }) => {
  const { currentFestival, results, programmes, categories, venues, language } = useFest();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStageType, setSelectedStageType] = useState('all');

  const publishedResults = results.filter(
    r => r.festivalId === currentFestival.id && r.status === 'published'
  );

  const filteredResults = publishedResults.filter(res => {
    const prog = programmes.find(p => p.id === res.programmeId);
    if (!prog) return false;

    const matchesSearch = 
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prog.titleMl && prog.titleMl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.rankings.some(item => item.participantName.toLowerCase().includes(searchQuery.toLowerCase()) || item.chestNumber.includes(searchQuery));

    const matchesCategory = selectedCategory === 'all' || prog.categoryId === selectedCategory;
    const matchesStage = selectedStageType === 'all' || prog.stageType === selectedStageType;

    return matchesSearch && matchesCategory && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>{language === 'ml' ? 'പ്രഖ്യാപിച്ച ഔദ്യോഗിക ഫലങ്ങൾ' : 'Official Published Results'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {language === 'ml'
              ? 'റിസൾട്ട് കൺട്രോളർ പരിശോധിച്ച് അംഗീകരിച്ച മത്സര ഫലങ്ങളുടെ സമഗ്ര വിവരങ്ങൾ'
              : 'Officially certified results verified and approved by the Results Controller'}
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={language === 'ml' ? 'ഇനം, ചെസ്റ്റ് നമ്പർ, പേര് തിരയുക...' : 'Search programme, chest # or name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Bar (Segmented Controls) */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Divisions
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="hidden sm:block h-4 w-px bg-neutral-200 mx-1" />

        {/* Stage / Non-Stage Filter */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedStageType('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedStageType === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Formats
          </button>
          <button
            onClick={() => setSelectedStageType('stage')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedStageType === 'stage'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Stage Events
          </button>
          <button
            onClick={() => setSelectedStageType('non_stage')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedStageType === 'non_stage'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Non-Stage / Literary
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center space-y-3">
          <Award className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-700">No matching published results found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search keywords or filter settings. Results are published immediately after judge verification.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResults.map(res => {
            const prog = programmes.find(p => p.id === res.programmeId);
            const cat = categories.find(c => c.id === prog?.categoryId);
            const venue = venues.find(v => v.id === prog?.venueId);

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {/* Quiet unboxed metadata */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                        <span className="font-mono font-semibold text-neutral-700">{prog?.code}</span>
                        <span aria-hidden="true">·</span>
                        <span>{cat?.name}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{prog?.stageType.replace('_', ' ')}</span>
                      </div>
                      <h3 className="text-base font-bold text-neutral-900 leading-snug">
                        {prog?.title}
                      </h3>
                      {prog?.titleMl && (
                        <div className="text-xs text-neutral-500 font-medium mt-0.5">
                          {prog.titleMl}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified</span>
                    </div>
                  </div>

                  {venue && (
                    <div className="text-[11px] text-neutral-400 mt-2">
                      Venue: {venue.name} · Completed
                    </div>
                  )}
                </div>

                {/* Rankings Table */}
                <div className="p-5">
                  <div className="space-y-2.5">
                    {res.rankings.map(item => (
                      <div
                        key={`${item.chestNumber}-${item.rank}`}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                          item.rank === 1
                            ? 'bg-amber-50/60 border-amber-200/80'
                            : item.rank === 2
                            ? 'bg-slate-50 border-slate-200'
                            : item.rank === 3
                            ? 'bg-amber-50/30 border-amber-100'
                            : 'bg-white border-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank badge */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              item.rank === 1
                                ? 'bg-amber-400 text-amber-950 shadow-xs'
                                : item.rank === 2
                                ? 'bg-slate-300 text-slate-800'
                                : item.rank === 3
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-neutral-100 text-neutral-500'
                            }`}
                          >
                            {item.rank}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs sm:text-sm text-neutral-900">
                                {item.participantName}
                              </span>
                              {onSelectChestNumber && (
                                <button
                                  onClick={() => onSelectChestNumber(item.chestNumber)}
                                  className="text-[11px] font-mono text-amber-800 hover:underline"
                                  title="View full candidate profile"
                                >
                                  (#{item.chestNumber})
                                </button>
                              )}
                              {!onSelectChestNumber && (
                                <span className="text-[11px] font-mono text-neutral-500">
                                  (#{item.chestNumber})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {item.teamName}
                            </div>
                          </div>
                        </div>

                        {/* Marks & Grade */}
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs font-bold text-neutral-900 tabular-nums">
                              {item.totalMarks} / 100
                            </span>
                            {item.grade !== 'None' && (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                {item.grade} Grade
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-amber-700 font-semibold tabular-nums mt-0.5">
                            +{item.pointsEarned} pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {res.notes && (
                    <div className="text-[11px] text-neutral-400 italic mt-3">
                      Note: {res.notes}
                    </div>
                  )}
                </div>

                {/* Footer with verification metadata */}
                <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                  <div>
                    Approved by: <span className="text-neutral-600 font-medium">{res.approvedBy || 'Results Committee'}</span>
                  </div>
                  <div>
                    {res.publishedAt ? new Date(res.publishedAt).toLocaleDateString() : 'Verified'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
