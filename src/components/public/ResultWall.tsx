import React, { useState, useEffect } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Trophy, Award, Sparkles, Maximize2, Minimize2, 
  X, RefreshCw, Volume2, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultWallProps {
  onClose: () => void;
}

export const ResultWall: React.FC<ResultWallProps> = ({ onClose }) => {
  const { currentFestival, teams, results, programmes, categories } = useFest();
  const [activeSlide, setActiveSlide] = useState<'leaderboard' | 'recent_results'>('leaderboard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);
  const sortedTeams = [...festTeams].sort((a, b) => b.points - a.points);
  const publishedResults = results.filter(r => r.festivalId === currentFestival.id && r.status === 'published');

  // Trigger celebratory confetti on initial open
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  // Auto-rotate slides every 15 seconds for continuous projector presentation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => prev === 'leaderboard' ? 'recent_results' : 'leaderboard');
      setLastRefreshed(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Bar for Projector Wall */}
      <div className="px-8 py-5 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
              LIVE ARENA RESULTS DISPLAY
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {currentFestival.name}
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Slide selector pills */}
          <div className="flex items-center p-1 bg-neutral-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveSlide('leaderboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSlide === 'leaderboard' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Points Leaderboard
            </button>
            <button
              onClick={() => setActiveSlide('recent_results')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSlide === 'recent_results' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Recent Champions ({publishedResults.length})
            </button>
          </div>

          <button
            onClick={fireConfetti}
            className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors"
            title="Celebrate with Confetti"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 transition-colors"
            title="Close Results Wall"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Presentation Viewport */}
      <div className="flex-1 p-8 sm:p-12 overflow-y-auto">
        {activeSlide === 'leaderboard' ? (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Top 3 Trophies Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* 2nd Place */}
              {sortedTeams[1] && (
                <div className="bg-neutral-900 border border-slate-700 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-extrabold text-xl shadow-lg">
                    2
                  </div>
                  <div className="text-xs text-neutral-400 uppercase font-semibold">Runner Up</div>
                  <h3 className="text-2xl font-bold text-white">{sortedTeams[1].name}</h3>
                  <div className="text-4xl font-black text-slate-200 tabular-nums">
                    {sortedTeams[1].points} <span className="text-xs font-normal text-neutral-400">PTS</span>
                  </div>
                </div>
              )}

              {/* 1st Place Champion */}
              {sortedTeams[0] && (
                <div className="bg-gradient-to-b from-amber-950/60 to-neutral-900 border-2 border-amber-500 rounded-2xl p-8 text-center space-y-4 shadow-2xl md:-translate-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-3xl shadow-xl animate-bounce">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-400 uppercase font-extrabold tracking-widest">
                      CHAMPIONSHIP LEADER
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
                      {sortedTeams[0].name}
                    </h2>
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-amber-400 tabular-nums">
                    {sortedTeams[0].points} <span className="text-sm font-semibold text-neutral-400">PTS</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {sortedTeams[2] && (
                <div className="bg-neutral-900 border border-amber-800 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg">
                    3
                  </div>
                  <div className="text-xs text-neutral-400 uppercase font-semibold">2nd Runner Up</div>
                  <h3 className="text-2xl font-bold text-white">{sortedTeams[2].name}</h3>
                  <div className="text-4xl font-black text-amber-300 tabular-nums">
                    {sortedTeams[2].points} <span className="text-xs font-normal text-neutral-400">PTS</span>
                  </div>
                </div>
              )}
            </div>

            {/* Standings List */}
            <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="divide-y divide-neutral-800">
                {sortedTeams.map((team, idx) => (
                  <div key={team.id} className="p-5 flex items-center justify-between hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-extrabold text-neutral-400 font-mono w-8">
                        #{idx + 1}
                      </div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
                      <div>
                        <div className="text-lg font-bold text-white">{team.name}</div>
                        <div className="text-xs text-neutral-400">{team.institution}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-400 tabular-nums">
                        {team.points}
                      </span>
                      <span className="text-xs text-neutral-400 ml-1">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Recent Champions & Results Slide */
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-1">
              <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                HONOR ROLL
              </div>
              <h2 className="text-3xl font-black text-white">Latest Certified Programme Winners</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedResults.map(res => {
                const prog = programmes.find(p => p.id === res.programmeId);
                const winner = res.rankings.find(r => r.rank === 1);
                const runnerUp = res.rankings.find(r => r.rank === 2);

                return (
                  <div
                    key={res.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono text-amber-400">{prog?.code}</span>
                        <h3 className="text-xl font-bold text-white">{prog?.title}</h3>
                        {prog?.titleMl && (
                          <div className="text-xs text-neutral-400">{prog.titleMl}</div>
                        )}
                      </div>
                      <div className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                        Published
                      </div>
                    </div>

                    {/* Gold Winner */}
                    {winner && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-black">
                            1st
                          </div>
                          <div>
                            <div className="font-extrabold text-base text-amber-300">
                              {winner.participantName}
                            </div>
                            <div className="text-xs text-neutral-400">
                              Chest #{winner.chestNumber} · {winner.teamName}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white tabular-nums">{winner.totalMarks} / 100</div>
                          <div className="text-xs text-emerald-400 font-semibold">{winner.grade} Grade</div>
                        </div>
                      </div>
                    )}

                    {/* Silver Runner Up */}
                    {runnerUp && (
                      <div className="p-3 rounded-lg bg-neutral-800/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-bold text-[11px]">
                            2nd
                          </span>
                          <span className="font-semibold text-neutral-200">{runnerUp.participantName}</span>
                          <span className="text-neutral-500">(#{runnerUp.chestNumber})</span>
                        </div>
                        <div className="text-neutral-400 font-medium">
                          {runnerUp.teamName}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Ticker */}
      <div className="px-8 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Arena Feed · Synchronized with Results Controller</span>
        </div>
        <div>
          Auto-cycling display · Last updated: {lastRefreshed.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
