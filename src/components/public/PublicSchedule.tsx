import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Calendar, Clock, MapPin, Users, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

export const PublicSchedule: React.FC = () => {
  const { currentFestival, programmes, venues, categories, language } = useFest();
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const festVenues = venues.filter(v => v.festivalId === currentFestival.id);

  // Extract unique dates
  const dates = Array.from(new Set(festProgrammes.map(p => p.date).filter(Boolean))) as string[];
  dates.sort();

  const filteredProgrammes = festProgrammes.filter(p => {
    const matchesVenue = selectedVenue === 'all' || p.venueId === selectedVenue;
    const matchesDate = selectedDate === 'all' || p.date === selectedDate;
    return matchesVenue && matchesDate;
  });

  // Sort by date then startTime
  filteredProgrammes.sort((a, b) => {
    if ((a.date || '') !== (b.date || '')) return (a.date || '').localeCompare(b.date || '');
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" />
            <span>{language === 'ml' ? 'മത്സര സമയക്രമവും വേദികളും' : 'Festival Timetable & Venues'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {language === 'ml'
              ? 'ദിവസേനയുള്ള മത്സര സമയങ്ങളും വേദി വിവരങ്ങളും'
              : 'Stage allocations, start times, and daily schedule matrix'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedDate('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedDate === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Days
          </button>
          {dates.map((date, idx) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedDate === date ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Day {idx + 1} ({date})
            </button>
          ))}
        </div>

        <div className="hidden sm:block h-4 w-px bg-neutral-200 mx-1" />

        {/* Venue Filter */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedVenue('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedVenue === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Stages
          </button>
          {festVenues.map(ven => (
            <button
              key={ven.id}
              onClick={() => setSelectedVenue(ven.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedVenue === ven.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {ven.name}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProgrammes.map(prog => {
          const venue = festVenues.find(v => v.id === prog.venueId);
          const cat = categories.find(c => c.id === prog.categoryId);
          const isCompleted = prog.status === 'completed';

          return (
            <div
              key={prog.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-neutral-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-mono font-semibold text-neutral-700">{prog.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {isCompleted ? 'Completed' : 'Scheduled'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 leading-snug">
                  {prog.title}
                </h3>
                {prog.titleMl && (
                  <div className="text-xs text-neutral-500 font-medium">
                    {prog.titleMl}
                  </div>
                )}

                <div className="text-xs text-neutral-500">
                  {cat?.name} · {prog.type === 'group' ? 'Group Event' : 'Individual'}
                </div>
              </div>

              {/* Time & Venue meta */}
              <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="font-medium text-neutral-800">
                    {prog.startTime ? `${prog.startTime} - ${prog.endTime || ''}` : 'Time TBD'}
                  </span>
                  <span className="text-neutral-400">({prog.durationMinutes} mins)</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{venue?.name || 'Venue to be allotted'}</span>
                </div>

                {prog.date && (
                  <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{prog.date}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
