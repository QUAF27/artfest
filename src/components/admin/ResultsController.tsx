import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Award, CheckCircle, Globe, RotateCcw, AlertTriangle, 
  CheckCircle2, FileText, ChevronRight, ShieldCheck, Calculator 
} from 'lucide-react';

export const ResultsController: React.FC = () => {
  const { 
    currentFestival, programmes, results, scores, 
    computeAndSaveResult, approveResult, publishResult, 
    withdrawResult 
  } = useFest();

  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const [selectedProgId, setSelectedProgId] = useState<string>(festProgrammes[0]?.id || '');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeProg = festProgrammes.find(p => p.id === selectedProgId);
  const activeResult = results.find(r => r.programmeId === selectedProgId);
  const progScores = scores.filter(s => s.programmeId === selectedProgId);

  const handleCompute = () => {
    if (!activeProg) return;
    computeAndSaveResult(activeProg.id);
    setActionNotice(`Rankings and grades computed from judge submissions.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleApprove = () => {
    if (!activeResult) return;
    approveResult(activeResult.id);
    setActionNotice(`Result approved by Results Controller.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handlePublish = () => {
    if (!activeResult) return;
    publishResult(activeResult.id);
    setActionNotice(`Published to public portal & updated live team points leaderboard!`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleWithdraw = () => {
    if (!activeResult) return;
    withdrawResult(activeResult.id);
    setActionNotice(`Result withdrawn from public view for re-evaluation.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Results Controller & Publication Workflow</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Adjudication review, deterministic grade calculation, rank approvals, and live publishing
          </p>
        </div>

        {/* Programme selector */}
        <select
          value={selectedProgId}
          onChange={e => setSelectedProgId(e.target.value)}
          className="px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg font-semibold text-neutral-900 shadow-xs"
        >
          {festProgrammes.map(p => (
            <option key={p.id} value={p.id}>
              {p.code} - {p.title}
            </option>
          ))}
        </select>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Workflow Progress Status Bar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Current Publication Lifecycle
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-base font-bold text-neutral-900">{activeProg?.title}</h3>
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
              activeResult?.status === 'published'
                ? 'bg-emerald-100 text-emerald-800'
                : activeResult?.status === 'approved'
                ? 'bg-blue-100 text-blue-800'
                : activeResult?.status === 'pending_review'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-neutral-100 text-neutral-600'
            }`}>
              {activeResult ? activeResult.status.replace('_', ' ').toUpperCase() : 'SCORES PENDING'}
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-0.5">
            Judge mark sheets logged: <strong className="text-neutral-700">{progScores.length}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCompute}
            className="px-3.5 py-2 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Re-Compute Rankings</span>
          </button>

          {activeResult && activeResult.status === 'pending_review' && (
            <button
              onClick={handleApprove}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve Result</span>
            </button>
          )}

          {activeResult && (activeResult.status === 'approved' || activeResult.status === 'pending_review') && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publish to Public Leaderboard</span>
            </button>
          )}

          {activeResult && activeResult.status === 'published' && (
            <button
              onClick={handleWithdraw}
              className="px-3.5 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Withdraw from Public</span>
            </button>
          )}
        </div>
      </div>

      {/* Rankings Preview Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Verified Final Rankings & Award Points
          </h4>
          <span className="text-xs text-neutral-400">
            {activeResult?.rankings.length || 0} contestants evaluated
          </span>
        </div>

        {activeResult && activeResult.rankings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold text-center w-16">Rank</th>
                  <th className="py-3 px-4 font-semibold">Chest #</th>
                  <th className="py-3 px-4 font-semibold">Participant / Group</th>
                  <th className="py-3 px-4 font-semibold">House / Team</th>
                  <th className="py-3 px-4 font-semibold text-center">Total Marks</th>
                  <th className="py-3 px-4 font-semibold text-center">Grade</th>
                  <th className="py-3 px-4 font-semibold text-right">Team Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activeResult.rankings.map(item => (
                  <tr key={item.chestNumber} className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 text-center font-bold font-mono">
                      {item.rank === 1 && <span className="text-amber-600 font-extrabold text-sm">#1</span>}
                      {item.rank === 2 && <span className="text-slate-600 font-extrabold text-sm">#2</span>}
                      {item.rank === 3 && <span className="text-amber-800 font-extrabold text-sm">#3</span>}
                      {item.rank > 3 && <span className="text-neutral-400">#{item.rank}</span>}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-800">
                      #{item.chestNumber}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-neutral-900">
                      {item.participantName}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700">
                      {item.teamName}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold tabular-nums text-neutral-900">
                      {item.totalMarks} / 100
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.grade === 'A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.grade === 'B'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {item.grade}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-black font-mono text-amber-700">
                      +{item.pointsEarned} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
            <div>No scores have been compiled yet for this event.</div>
            <button
              onClick={handleCompute}
              className="text-amber-700 font-semibold hover:underline"
            >
              Click here to compute rankings from judge marks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
