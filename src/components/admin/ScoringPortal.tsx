import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { CheckSquare, Lock, Save, AlertCircle, CheckCircle2, User, ChevronRight } from 'lucide-react';
import { ScoringCriterion } from '../../types';

export const ScoringPortal: React.FC = () => {
  const { currentFestival, programmes, registrations, participants, teams, judges, scores, saveScore, currentUser } = useFest();

  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const [selectedProgId, setSelectedProgId] = useState<string>(festProgrammes[0]?.id || '');

  const activeProg = festProgrammes.find(p => p.id === selectedProgId);
  const progRegistrations = registrations.filter(r => r.programmeId === selectedProgId);

  // Active judge (use logged-in judge if assigned, or first available judge for demonstration)
  const activeJudge = judges.find(j => j.id === currentUser.assignedJudgeId) || judges[0];

  const [selectedRegId, setSelectedRegId] = useState<string>('');
  const activeReg = progRegistrations.find(r => r.id === selectedRegId) || progRegistrations[0];

  // Scoring states for the active candidate
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  // Sync state whenever selected candidate changes
  React.useEffect(() => {
    if (activeReg && activeJudge) {
      const existing = scores.find(s => 
        s.programmeId === selectedProgId && 
        s.judgeId === activeJudge.id && 
        (s.registrationId === activeReg.id || s.chestNumber === activeReg.chestNumber)
      );

      if (existing) {
        setCriterionScores(existing.criterionScores || {});
        setRemarks(existing.remarks || '');
      } else {
        const initScores: Record<string, number> = {};
        activeProg?.criteria.forEach(c => {
          initScores[c.id] = Math.round(c.maxMarks * 0.8);
        });
        setCriterionScores(initScores);
        setRemarks('');
      }
    }
  }, [activeReg?.id, selectedProgId, activeJudge?.id]);

  const handleScoreChange = (critId: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(max, val));
    setCriterionScores(prev => ({
      ...prev,
      [critId]: clamped
    }));
  };

  const totalScore = Object.values(criterionScores).reduce((a, b) => a + b, 0);

  const handleSubmitScore = (status: 'draft' | 'locked') => {
    if (!activeReg || !activeProg || !activeJudge) return;

    saveScore({
      programmeId: activeProg.id,
      judgeId: activeJudge.id,
      registrationId: activeReg.id,
      chestNumber: activeReg.chestNumber,
      criterionScores,
      totalScore,
      remarks,
      status
    });

    setSubmittedNotice(`Score for Chest #${activeReg.chestNumber} (${totalScore} pts) ${status === 'locked' ? 'submitted and locked' : 'saved as draft'}.`);
    setTimeout(() => setSubmittedNotice(null), 3000);
  };

  // Find candidate info
  const candidateParticipant = participants.find(p => p.id === activeReg?.participantId || p.chestNumber === activeReg?.chestNumber);
  const candidateTeam = teams.find(t => t.id === activeReg?.teamId);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-600" />
            <span>Digital Judging & Mark Entry Portal</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Adjudicator panel: <strong className="text-neutral-800">{activeJudge?.name}</strong> ({activeJudge?.specialization})
          </p>
        </div>

        {/* Programme Selector */}
        <select
          value={selectedProgId}
          onChange={e => {
            setSelectedProgId(e.target.value);
            setSelectedRegId('');
          }}
          className="px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg font-semibold text-neutral-900 shadow-xs focus:ring-2 focus:ring-amber-500/20"
        >
          {festProgrammes.map(p => (
            <option key={p.id} value={p.id}>
              {p.code} - {p.title} ({p.criteria.length} criteria)
            </option>
          ))}
        </select>
      </div>

      {submittedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submittedNotice}</span>
        </div>
      )}

      {/* Main Split Layout: Left candidate list, Right criterion scoring sheet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Contestants Queue List */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Candidates ({progRegistrations.length})
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">By Chest #</span>
          </div>

          <div className="divide-y divide-neutral-100 max-h-[500px] overflow-y-auto">
            {progRegistrations.map(reg => {
              const part = participants.find(p => p.id === reg.participantId || p.chestNumber === reg.chestNumber);
              const isSelected = (activeReg?.id === reg.id);
              const scoreEntry = scores.find(s => s.registrationId === reg.id && s.judgeId === activeJudge?.id);

              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegId(reg.id)}
                  className={`w-full text-left p-3.5 flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-amber-50/80 font-medium' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      #{reg.chestNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">
                        {part?.name || 'Group Member List'}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {part?.gradeOrClass || 'House Entry'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {scoreEntry ? (
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        {scoreEntry.totalScore} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400">Pending</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Scoring Sheet */}
        <div className="md:col-span-2 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
          {activeReg && activeProg ? (
            <>
              {/* Active Candidate Header */}
              <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-neutral-950 flex flex-col items-center justify-center font-black">
                    <span className="text-[9px] uppercase tracking-wider">CHEST</span>
                    <span className="text-lg leading-none font-mono">#{activeReg.chestNumber}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">
                      {candidateParticipant?.name || 'Team Ensemble'}
                    </h3>
                    <div className="text-xs text-neutral-500">
                      {candidateTeam?.name} ({candidateTeam?.code}) · {activeProg.title}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-400">Total Awarded:</span>
                  <div className="text-3xl font-black text-neutral-900 font-mono tabular-nums">
                    {totalScore} <span className="text-xs font-normal text-neutral-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Criterion Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Scoring Criteria Breakdown
                </h4>

                <div className="space-y-3">
                  {activeProg.criteria.map(crit => {
                    const currentMarks = criterionScores[crit.id] || 0;

                    return (
                      <div key={crit.id} className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-800">{crit.name}</span>
                          <span className="font-mono font-bold text-neutral-900">
                            {currentMarks} / {crit.maxMarks} marks
                          </span>
                        </div>

                        {/* Slider & number input */}
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={crit.maxMarks}
                            value={currentMarks}
                            onChange={e => handleScoreChange(crit.id, Number(e.target.value), crit.maxMarks)}
                            className="flex-1 accent-amber-600"
                          />
                          <input
                            type="number"
                            min={0}
                            max={crit.maxMarks}
                            value={currentMarks}
                            onChange={e => handleScoreChange(crit.id, Number(e.target.value), crit.maxMarks)}
                            className="w-16 px-2 py-1 text-xs border border-neutral-300 rounded font-mono font-bold text-center bg-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Adjudicator Remarks & Technical Observations
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="e.g. Excellent shruti sync, subtle body language, very clear pronunciation..."
                  className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSubmitScore('draft')}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitScore('locked')}
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Submit & Lock Score</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400">
              Select a candidate from the left list to begin mark evaluation.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
