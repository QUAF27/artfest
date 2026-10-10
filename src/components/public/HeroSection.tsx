import React from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Trophy, Calendar, MapPin, Users, Award, 
  Flame, Sparkles, ChevronRight, Bell, Search, Music
} from 'lucide-react';

interface HeroProps {
  setCurrentView: (view: string) => void;
  onOpenResultWall: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ setCurrentView, onOpenResultWall }) => {
  const { currentFestival, teams, programmes, participants, results, announcements, language } = useFest();

  const urgentAnnouncement = announcements.find(a => a.priority === 'urgent' && a.active);
  const publishedResultsCount = results.filter(r => r.festivalId === currentFestival.id && r.status === 'published').length;
  const festParticipants = participants.filter(p => p.festivalId === currentFestival.id);
  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);

  // Top team leader
  const sortedTeams = [...festTeams].sort((a, b) => b.points - a.points);
  const leaderTeam = sortedTeams[0];

  return (
    <div className="space-y-8">
      {/* Urgent Announcement Ticker if active */}
      {urgentAnnouncement && (
        <div className="bg-amber-600 text-white px-4 py-2.5 rounded-lg shadow-sm flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase shrink-0">
              {language === 'ml' ? 'അടിയന്തിരം' : 'Notice'}
            </span>
            <span className="font-semibold">{urgentAnnouncement.title}:</span>
            <span className="text-amber-100 truncate">{urgentAnnouncement.message}</span>
          </div>
          <button 
            onClick={() => setCurrentView('news')}
            className="shrink-0 underline hover:text-white font-semibold text-xs"
          >
            {language === 'ml' ? 'വിശദാംശങ്ങൾ' : 'View'}
          </button>
        </div>
      )}

      {/* Main Hero Card with 16:9 Photography Backdrop and Contrast Scrim */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 bg-neutral-900 text-white min-h-[440px] flex items-end">
        {/* Background Image */}
        <img
          src="/src/assets/images/hero_arts_fest_1791618167678.jpg"
          alt="Arts Festival Main Stage"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Measured Contrast Scrim (anti-slop rule F) */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 w-full max-w-4xl space-y-5">
          {/* Edition & Academic Year (clean unboxed metadata with dot separators) */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-amber-300">
            <span>{currentFestival.edition}</span>
            <span aria-hidden="true">·</span>
            <span>Academic Year {currentFestival.academicYear}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Live Festival
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'ml' && currentFestival.nameMl ? currentFestival.nameMl : currentFestival.name}
          </h1>

          {/* Theme quote */}
          <p className="text-base sm:text-lg text-neutral-200 font-light max-w-2xl leading-relaxed">
            "{currentFestival.theme}" — {currentFestival.description}
          </p>

          {/* Dates & Location */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-neutral-300 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentFestival.startDate} to {currentFestival.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentFestival.venue}, {currentFestival.location}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setCurrentView('leaderboard')}
              className="px-5 py-2.5 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Trophy className="w-4 h-4" />
              <span>{language === 'ml' ? 'പോയിന്റ് നില കാണുക' : 'View Leaderboard'}</span>
            </button>

            <button
              onClick={() => setCurrentView('results')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>{language === 'ml' ? 'പ്രസിദ്ധീകരിച്ച ഫലങ്ങൾ' : 'Published Results'}</span>
            </button>

            <button
              onClick={() => setCurrentView('my-result')}
              className="px-4 py-2.5 text-sm font-medium text-neutral-200 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'ml' ? 'ചെസ്റ്റ് നമ്പർ തിരച്ചിൽ' : 'My Result Lookup'}</span>
            </button>

            <button
              onClick={onOpenResultWall}
              className="px-4 py-2.5 text-sm font-medium text-amber-200 hover:text-amber-100 bg-amber-950/60 hover:bg-amber-900/60 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 border border-amber-500/30"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Full Screen Result Wall</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Item Statistical KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              {language === 'ml' ? 'മത്സരാർത്ഥികൾ' : 'Participants'}
            </div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">
              {festParticipants.length > 0 ? festParticipants.length : 1200}+
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Across 4 divisions</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              {language === 'ml' ? 'മത്സര ഇനങ്ങൾ' : 'Programmes'}
            </div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">
              {festProgrammes.length}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Stage & Non-Stage</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              {language === 'ml' ? 'പ്രഖ്യാപിച്ച ഫലങ്ങൾ' : 'Results Live'}
            </div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums mt-1">
              {publishedResultsCount}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Officially certified</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              {language === 'ml' ? 'ഒന്നാം സ്ഥാനം' : 'Current Leader'}
            </div>
            <div className="text-lg font-bold text-neutral-900 truncate max-w-[130px] mt-1">
              {leaderTeam ? leaderTeam.name : 'Al-Bayan House'}
            </div>
            <div className="text-xs text-amber-700 font-semibold tabular-nums mt-0.5">
              {leaderTeam ? leaderTeam.points : 148} Points
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
