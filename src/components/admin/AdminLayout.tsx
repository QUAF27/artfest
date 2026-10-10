import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import {
  LayoutDashboard, Users, Trophy, BookOpen, UserCheck,
  Calendar, MapPin, Scale, CheckSquare, Award, FileText,
  Settings, Newspaper, BarChart3, Shield, CreditCard,
  ChevronRight, ArrowLeft, ShieldAlert
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitToPublic,
  children
}) => {
  const { currentFestival, currentUser, schedulingConflicts } = useFest();

  const navItems = [
    { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-festivals', label: 'Festival Settings', icon: Settings, roles: ['super_admin', 'festival_admin'] },
    { id: 'admin-teams', label: 'Teams & Houses', icon: Trophy, roles: ['super_admin', 'festival_admin', 'team_manager'] },
    { id: 'admin-participants', label: 'Participants', icon: Users, roles: ['super_admin', 'festival_admin', 'registration_manager', 'team_manager'] },
    { id: 'admin-id-cards', label: 'ID Badges & Cards', icon: CreditCard, roles: ['super_admin', 'festival_admin', 'registration_manager'] },
    { id: 'admin-programmes', label: 'Programmes & Rules', icon: BookOpen, roles: ['super_admin', 'festival_admin', 'programme_coordinator'] },
    { id: 'admin-registrations', label: 'Registrations', icon: UserCheck, roles: ['super_admin', 'festival_admin', 'registration_manager', 'team_manager'] },
    { id: 'admin-venues', label: 'Venues & Stages', icon: MapPin, roles: ['super_admin', 'festival_admin', 'programme_coordinator'] },
    { id: 'admin-schedule', label: 'Scheduling Engine', icon: Calendar, badge: schedulingConflicts.length > 0 ? `${schedulingConflicts.length}` : undefined, roles: ['super_admin', 'festival_admin', 'programme_coordinator'] },
    { id: 'admin-judges', label: 'Adjudicators', icon: Scale, roles: ['super_admin', 'festival_admin', 'programme_coordinator'] },
    { id: 'admin-scoring', label: 'Score Entry Portal', icon: CheckSquare, roles: ['super_admin', 'festival_admin', 'judge', 'results_controller'] },
    { id: 'admin-results', label: 'Results Controller', icon: Award, roles: ['super_admin', 'festival_admin', 'results_controller'] },
    { id: 'admin-certificates', label: 'Certificates Desk', icon: FileText, roles: ['super_admin', 'festival_admin', 'certificate_manager'] },
    { id: 'admin-content', label: 'CMS & Announcements', icon: Newspaper, roles: ['super_admin', 'festival_admin'] },
    { id: 'admin-reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['super_admin', 'festival_admin', 'results_controller'] },
    { id: 'admin-audit', label: 'Audit Logs', icon: Shield, roles: ['super_admin', 'festival_admin'] }
  ];

  // Filter accessible tabs based on current role
  const accessibleItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  });

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar (260px wide, SaaS discipline) */}
      <aside className="w-full md:w-64 bg-neutral-900 text-neutral-300 flex flex-col shrink-0 border-r border-neutral-800">
        {/* Brand bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">ArtsFest Pro</div>
              <div className="text-[10px] text-neutral-400">Management Console</div>
            </div>
          </div>
          <button
            onClick={onExitToPublic}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Current Festival Scope Indicator */}
        <div className="px-4 py-2.5 bg-neutral-950/60 border-b border-neutral-800/80">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            Festival Scope
          </div>
          <div className="text-xs font-medium text-amber-400 truncate mt-0.5">
            {currentFestival.name}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-0.5 flex-1 overflow-y-auto text-xs">
          {accessibleItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isActive ? 'bg-neutral-950 text-amber-400' : 'bg-amber-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Persona Profile in Sidebar Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/40 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-neutral-700 text-neutral-200 flex items-center justify-center text-xs font-bold uppercase shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="truncate flex-1">
            <div className="text-xs font-medium text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] text-amber-400/90 capitalize truncate">
              {currentUser.role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Breadcrumb Bar */}
        <div className="bg-white border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">{currentFestival.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="capitalize text-neutral-600 font-medium">
              {currentTab.replace('admin-', '').replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitToPublic}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
            >
              Preview Public Site
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
