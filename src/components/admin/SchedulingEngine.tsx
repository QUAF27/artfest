import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Calendar, Zap, AlertTriangle, CheckCircle2, Clock, 
  MapPin, Printer, ShieldAlert, Sparkles, Filter 
} from 'lucide-react';

export const SchedulingEngine: React.FC = () => {
  const { 
    currentFestival, programmes, venues, updateProgramme, 
    schedulingConflicts, runAutoScheduler 
  } = useFest();

  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [schedulerNotice, setSchedulerNotice] = useState<string | null>(null);

  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const festVenues = venues.filter(v => v.festivalId === currentFestival.id);

  const dates = Array.from(new Set(festProgrammes.map(p => p.date).filter(Boolean))) as string[];
  dates.sort();

  const filtered = festProgrammes.filter(p => {
    const matchDate = selectedDate === 'all' || p.date === selectedDate;
    const matchVenue = selectedVenue === 'all' || p.venueId === selectedVenue;
    return matchDate && matchVenue;
  });

  const handleRunAutoScheduler = () => {
    const res = runAutoScheduler();
    setSchedulerNotice(`Auto-Scheduler complete: ${res.scheduledCount} events allotted across stages.`);
    setTimeout(() => setSchedulerNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span>Automatic Timetable & Scheduling Engine</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Venue collision analysis, participant simultaneous clash detection, and auto-allotment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Master Timetable</span>
          </button>
          <button
            onClick={handleRunAutoScheduler}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs print:hidden"
          >
            <Zap className="w-4 h-4 text-neutral-950 fill-neutral-950" />
            <span>Run Auto-Scheduler</span>
          </button>
        </div>
      </div>

      {schedulerNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{schedulerNotice}</span>
        </div>
      )}

      {/* Conflict Detection Warnings Banner */}
      {schedulingConflicts.length > 0 ? (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Detected Scheduling Clashes ({schedulingConflicts.length})</span>
          </div>
          <div className="space-y-2">
            {schedulingConflicts.map((conf, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                <div className="font-semibold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{conf.title}</span>
                </div>
                <p className="text-neutral-600">{conf.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No timetable conflicts detected. All candidate entries and stage slots are conflict-free.</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 print:hidden">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Timetable:</span>
        </div>

        {/* Date filter */}
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg"
        >
          <option value="all">All Dates</option>
          {dates.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Venue filter */}
        <select
          value={selectedVenue}
          onChange={e => setSelectedVenue(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg"
        >
          <option value="all">All Stages</option>
          {festVenues.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      {/* Timetable Matrix */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Time Slot</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Programme Title</th>
                <th className="py-3 px-4 font-semibold">Assigned Stage</th>
                <th className="py-3 px-4 font-semibold text-center">Duration</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Adjust Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(p => {
                const venue = festVenues.find(v => v.id === p.venueId);

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Time Slot */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      {p.startTime ? `${p.startTime} - ${p.endTime}` : (
                        <span className="text-neutral-400 font-normal">Not Scheduled</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-neutral-600">
                      {p.date || 'TBD'}
                    </td>

                    {/* Programme */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">{p.title}</div>
                      <div className="text-[10px] font-mono text-neutral-400">{p.code}</div>
                    </td>

                    {/* Stage */}
                    <td className="py-3.5 px-4 text-neutral-700">
                      {venue?.name || <span className="text-amber-600">Unassigned</span>}
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-center tabular-nums text-neutral-600">
                      {p.durationMinutes}m
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                        p.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Quick Adjust controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <input
                          type="time"
                          value={p.startTime || '09:00'}
                          onChange={e => {
                            const newStart = e.target.value;
                            const [h, m] = newStart.split(':').map(Number);
                            const endH = String(h + Math.floor((m + p.durationMinutes) / 60)).padStart(2, '0');
                            const endM = String((m + p.durationMinutes) % 60).padStart(2, '0');
                            updateProgramme(p.id, {
                              startTime: newStart,
                              endTime: `${endH}:${endM}`,
                              date: p.date || currentFestival.startDate,
                              venueId: p.venueId || festVenues[0]?.id
                            });
                          }}
                          className="px-2 py-1 text-xs border border-neutral-300 rounded bg-neutral-50"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
