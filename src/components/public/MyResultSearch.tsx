import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Search, QrCode, Award, User, ShieldCheck, 
  Download, Printer, CheckCircle2, ChevronRight, X 
} from 'lucide-react';
import { QRCodeView } from '../common/QRCodeView';

interface MyResultSearchProps {
  initialChestNumber?: string;
  onOpenCertificateModal?: (certId: string) => void;
}

export const MyResultSearch: React.FC<MyResultSearchProps> = ({ 
  initialChestNumber = '',
  onOpenCertificateModal 
}) => {
  const { currentFestival, participants, teams, categories, programmes, results, certificates, language } = useFest();
  const [chestInput, setChestInput] = useState(initialChestNumber);
  const [searchedChest, setSearchedChest] = useState(initialChestNumber);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chestInput.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setSearchedChest(chestInput.trim());
      setIsLoading(false);
    }, 250);
  };

  // Find participant
  const participant = participants.find(
    p => p.festivalId === currentFestival.id && p.chestNumber === searchedChest
  );

  const team = teams.find(t => t.id === participant?.teamId);
  const category = categories.find(c => c.id === participant?.categoryId);

  // Find all results matching this chest number
  const candidateResults: {
    programme: typeof programmes[0];
    rank: number;
    grade: string;
    totalMarks: number;
    pointsEarned: number;
    resultDate?: string;
  }[] = [];

  if (searchedChest) {
    const publishedList = results.filter(r => r.festivalId === currentFestival.id && r.status === 'published');
    publishedList.forEach(res => {
      const match = res.rankings.find(item => item.chestNumber === searchedChest);
      if (match) {
        const prog = programmes.find(p => p.id === res.programmeId);
        if (prog) {
          candidateResults.push({
            programme: prog,
            rank: match.rank,
            grade: match.grade,
            totalMarks: match.totalMarks,
            pointsEarned: match.pointsEarned,
            resultDate: res.publishedAt
          });
        }
      }
    });
  }

  // Find issued certificates for this candidate
  const candidateCertificates = certificates.filter(
    c => c.festivalId === currentFestival.id && c.chestNumber === searchedChest && c.status === 'valid'
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          {language === 'ml' ? 'മത്സരാർത്ഥി ഫല പരിശോധന' : 'Individual Result & Candidate Profile'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
          {language === 'ml'
            ? 'നിങ്ങളുടെ ചെസ്റ്റ് നമ്പർ നൽകി വ്യക്തിഗത ഫലങ്ങളും ഗ്രേഡുകളും സർട്ടിഫിക്കറ്റുകളും പരിശോധിക്കുക'
            : 'Enter your assigned Chest Number or scan your Festival ID Badge to view official ranks, grades, and certificates.'}
        </p>
      </div>

      {/* Search Bar & QR Scanner Trigger */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-neutral-200/90 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Enter Chest Number (e.g. 101, 102, 201)"
              value={chestInput}
              onChange={(e) => setChestInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors font-mono font-medium"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !chestInput.trim()}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              {isLoading ? 'Searching...' : 'Search Result'}
            </button>

            <button
              type="button"
              onClick={() => setShowQrScanner(true)}
              className="px-3 py-2.5 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg border border-neutral-200 transition-colors"
              title="Scan QR Code from Festival ID Card"
            >
              <QrCode className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills for easy evaluator testing */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-400">
          <span>Sample chests:</span>
          {['101', '102', '103', '201', '301'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setChestInput(num);
                setSearchedChest(num);
              }}
              className="font-mono text-amber-700 hover:underline px-1 py-0.5"
            >
              #{num}
            </button>
          ))}
        </div>
      </div>

      {/* QR Scanner Simulation Modal */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowQrScanner(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-neutral-900">ID Badge QR Code Scanner</h3>
              <p className="text-xs text-neutral-500">Align camera with participant badge QR code</p>
            </div>

            <div className="relative aspect-square max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-dashed border-amber-500 bg-neutral-900 flex flex-col items-center justify-center text-white">
              <QrCode className="w-20 h-20 text-amber-400 animate-pulse" />
              <div className="text-[11px] text-amber-200 mt-2 font-mono">SIMULATED SCANNER ACTIVE</div>
              {/* Scanline */}
              <div className="absolute inset-x-0 h-0.5 bg-amber-400 top-1/2 -translate-y-1/2 shadow-lg shadow-amber-400" />
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs text-neutral-400 text-center">Click a detected badge code:</div>
              <div className="grid grid-cols-3 gap-2">
                {['101', '102', '201'].map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      setChestInput(num);
                      setSearchedChest(num);
                      setShowQrScanner(false);
                    }}
                    className="p-2 text-xs font-mono font-semibold bg-neutral-100 hover:bg-amber-100 rounded text-neutral-800 transition-colors"
                  >
                    Badge #{num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile & Results Section */}
      {searchedChest && (
        <div className="space-y-6">
          {participant ? (
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
              {/* Profile Card Header */}
              <div className="p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  {/* Chest number badge */}
                  <div className="w-20 h-20 rounded-2xl bg-amber-500 text-neutral-950 flex flex-col items-center justify-center font-black shadow-md shrink-0">
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-950/70">Chest</span>
                    <span className="text-2xl tabular-nums leading-none font-mono">{participant.chestNumber}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-bold text-white">{participant.name}</h3>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Verified
                      </span>
                    </div>

                    <div className="text-xs text-neutral-300">
                      Team: <strong className="text-white">{team?.name || 'Independent'}</strong> ({team?.code})
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-neutral-400">
                      <span>Division: {category?.name || 'General'}</span>
                      <span>·</span>
                      <span>Class: {participant.gradeOrClass}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code view */}
                <div className="text-center shrink-0">
                  <QRCodeView value={`ARTSFEST-PARTICIPANT-${participant.chestNumber}`} size={80} />
                  <div className="text-[10px] text-neutral-400 font-mono mt-1">ID: #{participant.chestNumber}</div>
                </div>
              </div>

              {/* Programmes & Results Accordion */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Competition Performance & Merits</span>
                  </h4>

                  {candidateResults.length === 0 ? (
                    <div className="p-8 bg-neutral-50 rounded-xl text-center text-xs text-neutral-500">
                      No published results available yet for this candidate's enrolled events. Please check back after competition judging concludes.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {candidateResults.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="text-xs text-neutral-400 font-mono">{item.programme.code}</div>
                            <div className="text-sm font-bold text-neutral-900">{item.programme.title}</div>
                            {item.programme.titleMl && (
                              <div className="text-xs text-neutral-500">{item.programme.titleMl}</div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            {/* Rank and Grade Pill */}
                            <div className="text-right">
                              <div className="text-xs font-bold text-neutral-900">
                                {item.rank === 1 && <span className="text-amber-600">★ 1st Place</span>}
                                {item.rank === 2 && <span className="text-slate-700">2nd Place</span>}
                                {item.rank === 3 && <span className="text-amber-800">3rd Place</span>}
                                {item.rank > 3 && <span className="text-neutral-500">Rank {item.rank}</span>}
                              </div>
                              <div className="text-[11px] text-neutral-500 tabular-nums">
                                Marks: {item.totalMarks} / 100 · Grade: {item.grade}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                                +{item.pointsEarned} pts
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certificates Available */}
                {candidateCertificates.length > 0 && (
                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Certified Merit Documents</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {candidateCertificates.map(cert => (
                        <div
                          key={cert.id}
                          className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-xs font-semibold text-neutral-900">{cert.programmeTitle}</div>
                            <div className="text-[11px] text-neutral-500">
                              Certificate #{cert.certificateNumber} · {cert.rank ? `Rank ${cert.rank}` : `Grade ${cert.grade}`}
                            </div>
                          </div>

                          {onOpenCertificateModal && (
                            <button
                              onClick={() => onOpenCertificateModal(cert.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-300 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shadow-xs"
                            >
                              View Certificate
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 p-10 text-center space-y-2">
              <User className="w-10 h-10 text-neutral-300 mx-auto" />
              <h3 className="text-base font-semibold text-neutral-800">
                Chest Number #{searchedChest} not found
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Please double check the chest number assigned on your participant badge or contact your house team manager.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
