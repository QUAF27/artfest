import React, { useState } from 'react';
import { FestProvider, useFest } from './context/FestContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Public views
import { HeroSection } from './components/public/HeroSection';
import { LiveLeaderboard } from './components/public/LiveLeaderboard';
import { PublicResults } from './components/public/PublicResults';
import { PublicSchedule } from './components/public/PublicSchedule';
import { ProgrammeDirectory } from './components/public/ProgrammeDirectory';
import { MyResultSearch } from './components/public/MyResultSearch';
import { ResultWall } from './components/public/ResultWall';
import { NewsAndAnnouncements } from './components/public/NewsAndAnnouncements';
import { GallerySection } from './components/public/GallerySection';
import { CertificateVerification } from './components/public/CertificateVerification';
import { ContactSection } from './components/public/ContactSection';

// Admin views
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { TeamManagement } from './components/admin/TeamManagement';
import { ParticipantManagement } from './components/admin/ParticipantManagement';
import { IdCardGenerator } from './components/admin/IdCardGenerator';
import { ProgrammeManagement } from './components/admin/ProgrammeManagement';
import { RegistrationManagement } from './components/admin/RegistrationManagement';
import { VenuesManagement } from './components/admin/VenuesManagement';
import { SchedulingEngine } from './components/admin/SchedulingEngine';
import { JudgeManagement } from './components/admin/JudgeManagement';
import { ScoringPortal } from './components/admin/ScoringPortal';
import { ResultsController } from './components/admin/ResultsController';
import { CertificateGenerator } from './components/admin/CertificateGenerator';
import { ContentManager } from './components/admin/ContentManager';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { FestivalSettingsModal } from './components/admin/FestivalSettingsModal';
import { Participant } from './types';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [showResultWall, setShowResultWall] = useState<boolean>(false);
  const [selectedChestForProfile, setSelectedChestForProfile] = useState<string>('');
  const [selectedCertForModal, setSelectedCertForModal] = useState<string>('');
  const [selectedBadgeParticipant, setSelectedBadgeParticipant] = useState<Participant | null>(null);

  const handleOpenCertificate = (certId: string) => {
    setSelectedCertForModal(certId);
    setCurrentView('admin-certificates');
  };

  const handleOpenIdCard = (participant: Participant) => {
    setSelectedBadgeParticipant(participant);
    setCurrentView('admin-id-cards');
  };

  const handleSelectChest = (chest: string) => {
    setSelectedChestForProfile(chest);
    setCurrentView('my-result');
  };

  // If in admin mode, wrap with AdminLayout
  if (currentView.startsWith('admin')) {
    return (
      <>
        {showResultWall && <ResultWall onClose={() => setShowResultWall(false)} />}
        <AdminLayout
          currentTab={currentView}
          setCurrentTab={setCurrentView}
          onExitToPublic={() => setCurrentView('home')}
        >
          {currentView === 'admin-overview' && <DashboardOverview setCurrentTab={setCurrentView} />}
          {currentView === 'admin-festivals' && <FestivalSettingsModal />}
          {currentView === 'admin-teams' && <TeamManagement />}
          {currentView === 'admin-participants' && <ParticipantManagement onOpenIdCardModal={handleOpenIdCard} />}
          {currentView === 'admin-id-cards' && <IdCardGenerator selectedParticipant={selectedBadgeParticipant} />}
          {currentView === 'admin-programmes' && <ProgrammeManagement />}
          {currentView === 'admin-registrations' && <RegistrationManagement />}
          {currentView === 'admin-venues' && <VenuesManagement />}
          {currentView === 'admin-schedule' && <SchedulingEngine />}
          {currentView === 'admin-judges' && <JudgeManagement />}
          {currentView === 'admin-scoring' && <ScoringPortal />}
          {currentView === 'admin-results' && <ResultsController />}
          {currentView === 'admin-certificates' && <CertificateGenerator initialCertId={selectedCertForModal} />}
          {currentView === 'admin-content' && <ContentManager />}
          {currentView === 'admin-reports' && <ReportsAnalytics />}
          {currentView === 'admin-audit' && <AuditLogsView />}
        </AdminLayout>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {showResultWall && <ResultWall onClose={() => setShowResultWall(false)} />}

      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenResultWall={() => setShowResultWall(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentView === 'home' && (
          <div className="space-y-12">
            <HeroSection
              setCurrentView={setCurrentView}
              onOpenResultWall={() => setShowResultWall(true)}
            />
            <LiveLeaderboard />
            <PublicResults onSelectChestNumber={handleSelectChest} />
            <NewsAndAnnouncements />
            <GallerySection />
          </div>
        )}

        {currentView === 'leaderboard' && <LiveLeaderboard />}
        {currentView === 'results' && <PublicResults onSelectChestNumber={handleSelectChest} />}
        {currentView === 'schedule' && <PublicSchedule />}
        {currentView === 'programmes' && <ProgrammeDirectory />}
        {currentView === 'my-result' && (
          <MyResultSearch
            initialChestNumber={selectedChestForProfile}
            onOpenCertificateModal={handleOpenCertificate}
          />
        )}
        {currentView === 'cert-verify' && <CertificateVerification />}
        {currentView === 'news' && <NewsAndAnnouncements />}
        {currentView === 'gallery' && <GallerySection />}
        {currentView === 'contact' && <ContactSection />}
        {currentView === 'downloads' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Official Downloads & Syllabus</h2>
              <p className="text-xs text-neutral-500 mt-1">Download official festival brochures, timetables, and guidelines</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Official Arts Festival Rulebook 2026', desc: 'Complete competition rules, syllabi, duration limits and judging formulas.', size: '2.4 MB', file: 'ArtsFest_Rulebook_2026.pdf' },
                { title: 'Master Schedule & Venue Matrix', desc: 'Stage allocations, sound check timings, and daily order of stage events.', size: '1.1 MB', file: 'Master_Timetable_Tagore.pdf' },
                { title: 'House Captain & Team Handbook', desc: 'Registration limits, substitution rules, and code of discipline for managers.', size: '850 KB', file: 'Team_Manager_Manual.pdf' }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-white rounded-xl border border-neutral-200 shadow-xs flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
                    <div className="text-[10px] text-neutral-400 mt-2 font-mono">{item.file} · {item.size}</div>
                  </div>
                  <button
                    onClick={() => alert(`Initiating download for ${item.file}`)}
                    className="ml-4 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md shrink-0 transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentView === 'privacy' && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-4 text-xs leading-relaxed text-neutral-600">
            <h2 className="text-xl font-bold text-neutral-900">Privacy Policy & Festival Data Governance</h2>
            <p>
              ArtsFest Pro protects participant information. Contact details, dates of birth, and identity records are restricted exclusively to accredited house managers and registration officers.
            </p>
            <p>
              Only approved public records (chest numbers, names, awarded grades, ranks, and house allocations) are published to the public results directory and leaderboard.
            </p>
            <p>
              All merit certificates issued by this portal bear tamper-proof cryptographic verification hashes verifiable via the official certificate validator.
            </p>
          </div>
        )}
      </main>

      <Footer setCurrentView={setCurrentView} />
    </div>
  );
};

export function App() {
  return (
    <FestProvider>
      <MainApp />
    </FestProvider>
  );
}

export default App;
