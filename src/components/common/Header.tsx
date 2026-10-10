import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { DEMO_USERS } from '../../data/seedData';
import { 
  Trophy, ShieldAlert, Globe, UserCheck, 
  Menu, X, Sparkles, MonitorPlay, ChevronDown 
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenResultWall: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onOpenResultWall }) => {
  const { 
    currentFestival, festivals, selectFestival, 
    currentUser, switchUserRole, language, toggleLanguage,
    schedulingConflicts 
  } = useFest();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [festMenuOpen, setFestMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', labelEn: 'Home', labelMl: 'മുഖ്യം' },
    { id: 'leaderboard', labelEn: 'Leaderboard', labelMl: 'പോയിന്റ് നില' },
    { id: 'results', labelEn: 'Results', labelMl: 'ഫലങ്ങൾ' },
    { id: 'schedule', labelEn: 'Schedule', labelMl: 'സമയക്രമം' },
    { id: 'programmes', labelEn: 'Programmes', labelMl: 'ഇനങ്ങൾ' },
    { id: 'my-result', labelEn: 'My Result', labelMl: 'എന്റെ ഫലം' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top utility alert strip for conflicts if admin */}
      {currentUser.role !== 'public_visitor' && schedulingConflicts.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Timetable Alert:</strong> {schedulingConflicts.length} schedule conflict(s) detected. Check Management Dashboard.
            </span>
          </div>
          <button 
            onClick={() => setCurrentView('admin-schedule')}
            className="font-medium underline hover:text-amber-900 whitespace-nowrap"
          >
            Review Conflicts
          </button>
        </div>
      )}

      {/* Main Top Bar: 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap group-hover:text-amber-700 transition-colors">
              ArtsFest Pro
            </span>
          </button>

          {/* Festival Switcher */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setFestMenuOpen(!festMenuOpen)}
              className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 transition-colors whitespace-nowrap"
              title="Switch Festival Edition"
            >
              <span className="font-medium max-w-[140px] truncate">{currentFestival.name}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {festMenuOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  Select Festival
                </div>
                {festivals.map(fest => (
                  <button
                    key={fest.id}
                    onClick={() => {
                      selectFestival(fest.id);
                      setFestMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-amber-50 transition-colors ${
                      fest.id === currentFestival.id ? 'bg-amber-50/70 font-medium text-amber-900' : 'text-neutral-700'
                    }`}
                  >
                    <span>{fest.name}</span>
                    <span className="text-[10px] text-neutral-400">{fest.edition} · {fest.academicYear}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 shrink-0">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setCurrentView(link.id)}
              className={`hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentView === link.id
                  ? 'border-amber-600 text-amber-700 font-semibold'
                  : 'border-transparent text-neutral-600'
              }`}
            >
              {language === 'ml' ? link.labelMl : link.labelEn}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action block + controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-md border border-neutral-200 hover:border-neutral-300 transition-colors whitespace-nowrap"
            title="Toggle Malayalam / English"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* Role switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
              title="Change User Role to test permissions"
            >
              <UserCheck className="w-3.5 h-3.5 text-neutral-600" />
              <span className="capitalize hidden lg:inline">{currentUser.role.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-60 bg-white rounded-lg shadow-xl border border-neutral-200 py-1 z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  Switch Role Persona
                </div>
                {DEMO_USERS.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUserRole(user.role as UserRole);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-amber-50 transition-colors ${
                      currentUser.role === user.role ? 'bg-amber-50 font-semibold text-amber-900' : 'text-neutral-700'
                    }`}
                  >
                    <span>{user.name}</span>
                    <span className="text-[10px] text-neutral-400 capitalize">{user.role.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Wall Launcher */}
          <button
            onClick={onOpenResultWall}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 rounded-md transition-colors whitespace-nowrap shrink-0"
            title="Launch Full-Screen Live Results Wall Display for Projectors & TVs"
          >
            <MonitorPlay className="w-3.5 h-3.5 text-amber-700" />
            <span>Result Wall</span>
          </button>

          {/* Primary Action Button */}
          {currentView.startsWith('admin') ? (
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Public Website
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('admin-overview')}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Dashboard
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drop-down */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-md font-medium ${
                currentView === link.id ? 'bg-amber-50 text-amber-900' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {language === 'ml' ? link.labelMl : link.labelEn}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenResultWall();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-medium text-amber-900 bg-amber-50 rounded-md"
            >
              Open Result Wall
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-md"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
