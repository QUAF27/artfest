import React from 'react';
import { useFest } from '../../context/FestContext';
import {
  Users, Trophy, BookOpen, UserCheck, Calendar, MapPin,
  Scale, CheckSquare, Award, FileText, AlertTriangle,
  ArrowRight, ShieldCheck, Clock
} from 'lucide-react';

interface DashboardOverviewProps {
  setCurrentTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setCurrentTab }) => {
  const {
    currentFestival, teams, participants, programmes,
    registrations, venues, judges, scores, results,
    certificates, auditLogs, schedulingConflicts, runAutoScheduler
  } = useFest();

  const festParticipants = participants.filter(p => p.festivalId === currentFestival.id);
  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);
  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const festRegistrations = registrations.filter(r => r.festivalId === currentFestival.id);
  const festVenues = venues.filter(v => v.festivalId === currentFestival.id);
  const festJudges = judges.filter(j => j.festivalId === currentFestival.id);

  const pendingScoresCount = festProgrammes.filter(p => p.status === 'scheduled' || p.status === 'in_progress').length;
  const resultsAwaitingApproval = results.filter(r => r.festivalId === currentFestival.id && r.status === 'pending_review').length;
  const publishedResultsCount = results.filter(r => r.festivalId === currentFestival.id && r.status === 'published').length;
  const festCertificatesCount = certificates.filter(c => c.festivalId === currentFestival.id).length;

  const completedProgrammes = festProgrammes.filter(p => p.status === 'completed').length;
  const completionPercentage = festProgrammes.length > 0 ? Math.round((completedProgrammes / festProgrammes.length) * 100) : 0;

  // Sorted teams
  const sortedTeams = [...festTeams].sort((a, b) => b.points - a.points);
  const recentLogs = auditLogs.filter(l => l.festivalId === currentFestival.id).slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            {currentFestival.edition} · {currentFestival.academicYear}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentFestival.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            {currentFestival.theme} — Live monitoring, scoring workflows, and certified publishing.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentTab('admin-scoring')}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Score Entry Portal
          </button>
          <button
            onClick={() => setCurrentTab('admin-results')}
            className="px-4 py-2 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors whitespace-nowrap"
          >
            Review & Publish
          </button>
        </div>
      </div>

      {/* Conflicts Alert if any */}
      {schedulingConflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-900">
                {schedulingConflicts.length} Timetable Conflict(s) Detected
              </div>
              <div className="text-xs text-amber-700 mt-0.5">
                {schedulingConflicts[0].description}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('admin-schedule')}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-md whitespace-nowrap shrink-0 transition-colors"
          >
            Open Scheduler
          </button>
        </div>
      )}

      {/* Summary KPI Cards Grid (11 Required Metrics from Database) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Participants */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Total Participants</div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">{festParticipants.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Verified entries</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Teams */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Teams / Houses</div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">{festTeams.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Active competing</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        {/* Total Programmes */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Competitions</div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">{festProgrammes.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Stage & literary</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Registrations */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Registrations</div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">{festRegistrations.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Individual & group</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Active Venues */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Active Stages / Venues</div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">{festVenues.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Equipped halls</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        {/* Assigned Judges */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Assigned Adjudicators</div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">{festJudges.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Jury panel</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Results Awaiting Approval */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Awaiting Approval</div>
            <div className="text-2xl font-bold text-amber-600 tabular-nums mt-1">{resultsAwaitingApproval}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Score reviews</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Published Results */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Published Results</div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums mt-1">{publishedResultsCount}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Live on leaderboard</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics & Operational Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Programme Completion Progress */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Festival Progress</h3>
            <span className="text-xs font-bold text-amber-700 tabular-nums">{completionPercentage}%</span>
          </div>

          <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-400">Completed:</span>
              <div className="text-base font-bold text-neutral-900 mt-0.5 tabular-nums">
                {completedProgrammes} Events
              </div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-400">Remaining:</span>
              <div className="text-base font-bold text-neutral-900 mt-0.5 tabular-nums">
                {festProgrammes.length - completedProgrammes} Events
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('admin-schedule')}
            className="w-full py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Manage Timetable & Stages
          </button>
        </div>

        {/* Team Leaderboard Standing */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Points Standing</h3>
            <button
              onClick={() => setCurrentTab('admin-teams')}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {sortedTeams.slice(0, 4).map((team, idx) => (
              <div key={team.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-400 font-mono w-4">#{idx + 1}</span>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                  <span className="font-semibold text-neutral-800">{team.name}</span>
                </div>
                <span className="font-bold text-neutral-900 tabular-nums">{team.points} pts</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-400">
            Points calculated deterministically from published rankings & grades
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Audit Trail</h3>
            <button
              onClick={() => setCurrentTab('admin-audit')}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              Full Logs
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {recentLogs.map(log => (
              <div key={log.id} className="p-2.5 rounded bg-neutral-50/70 border border-neutral-100 space-y-0.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-medium text-neutral-700">{log.actor}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-neutral-600 line-clamp-1">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
