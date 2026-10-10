import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Trophy, Medal, Award, Star, ChevronRight, BarChart3, Info } from 'lucide-react';

export const LiveLeaderboard: React.FC = () => {
  const { currentFestival, teams, results, programmes, categories, language } = useFest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);
  const festResults = results.filter(r => r.festivalId === currentFestival.id && r.status === 'published');

  // Compute stats per team: 1st ranks, 2nd ranks, 3rd ranks, A grades count, category points
  const teamStats = festTeams.map(team => {
    let firstCount = 0;
    let secondCount = 0;
    let thirdCount = 0;
    let aGradeCount = 0;
    let categoryPoints = 0;

    festResults.forEach(res => {
      const prog = programmes.find(p => p.id === res.programmeId);
      const matchesCategory = selectedCategory === 'all' || prog?.categoryId === selectedCategory;

      res.rankings.forEach(item => {
        if (item.teamId === team.id) {
          if (item.rank === 1) firstCount++;
          if (item.rank === 2) secondCount++;
          if (item.rank === 3) thirdCount++;
          if (item.grade === 'A') aGradeCount++;
          if (matchesCategory) {
            categoryPoints += item.pointsEarned;
          }
        }
      });
    });

    // Display points: if category filter is active, use categoryPoints; else use team.points
    const displayPoints = selectedCategory === 'all' ? team.points : categoryPoints;

    return {
      ...team,
      firstCount,
      secondCount,
      thirdCount,
      aGradeCount,
      displayPoints
    };
  });

  // Sort descending
  const sortedTeams = [...teamStats].sort((a, b) => b.displayPoints - a.displayPoints);
  const maxPoints = sortedTeams[0]?.displayPoints || 1;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>{language === 'ml' ? 'സമഗ്ര പോയിന്റ് നില (ലീഡർബോർഡ്)' : 'Overall Points Leaderboard'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {language === 'ml' 
              ? 'അംഗീകൃത ഫലങ്ങളുടെ അടിസ്ഥാനത്തിൽ സ്വയം കണക്കുകൂട്ടുന്ന തത്സമയ പോയിന്റുകൾ'
              : 'Real-time standings automatically compiled from verified published results'}
          </p>
        </div>

        {/* Category Filter Tabs (Interactive Filter Buttons allowed by anti-slop rule A) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {language === 'ml' ? 'എല്ലാ വിഭാഗങ്ങളും' : 'All Divisions'}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Cards for Top 3 */}
      {sortedTeams.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* 2nd Place */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/90 shadow-sm text-center space-y-3 order-2 md:order-1">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg border border-slate-300">
              2nd
            </div>
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider">Runners Up</div>
              <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{sortedTeams[1].name}</h3>
              <div className="text-xs text-neutral-500">{sortedTeams[1].institution}</div>
            </div>
            <div className="text-3xl font-extrabold text-neutral-800 tabular-nums">
              {sortedTeams[1].displayPoints} <span className="text-xs font-normal text-neutral-500">pts</span>
            </div>
            <div className="pt-2 border-t border-neutral-100 flex justify-center gap-4 text-xs text-neutral-500">
              <span><strong>{sortedTeams[1].firstCount}</strong> 1st</span>
              <span><strong>{sortedTeams[1].secondCount}</strong> 2nd</span>
              <span><strong>{sortedTeams[1].aGradeCount}</strong> A-Grades</span>
            </div>
          </div>

          {/* 1st Place (Dominant Anchor) */}
          <div className="bg-gradient-to-b from-amber-500/10 to-white rounded-xl p-7 border-2 border-amber-400 shadow-md text-center space-y-3 order-1 md:order-2 md:-translate-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-extrabold text-2xl shadow-sm">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Festival Champions (Current)</div>
              <h3 className="text-xl font-extrabold text-neutral-900 mt-0.5">{sortedTeams[0].name}</h3>
              <div className="text-xs text-neutral-500">{sortedTeams[0].institution}</div>
            </div>
            <div className="text-4xl font-black text-amber-600 tabular-nums">
              {sortedTeams[0].displayPoints} <span className="text-sm font-medium text-neutral-500">pts</span>
            </div>
            <div className="pt-3 border-t border-amber-100 flex justify-center gap-4 text-xs text-neutral-600">
              <span><strong>{sortedTeams[0].firstCount}</strong> 1st Ranks</span>
              <span><strong>{sortedTeams[0].secondCount}</strong> 2nd</span>
              <span><strong>{sortedTeams[0].aGradeCount}</strong> A-Grades</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/90 shadow-sm text-center space-y-3 order-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg border border-amber-300">
              3rd
            </div>
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider">Second Runners Up</div>
              <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{sortedTeams[2].name}</h3>
              <div className="text-xs text-neutral-500">{sortedTeams[2].institution}</div>
            </div>
            <div className="text-3xl font-extrabold text-neutral-800 tabular-nums">
              {sortedTeams[2].displayPoints} <span className="text-xs font-normal text-neutral-500">pts</span>
            </div>
            <div className="pt-2 border-t border-neutral-100 flex justify-center gap-4 text-xs text-neutral-500">
              <span><strong>{sortedTeams[2].firstCount}</strong> 1st</span>
              <span><strong>{sortedTeams[2].secondCount}</strong> 2nd</span>
              <span><strong>{sortedTeams[2].aGradeCount}</strong> A-Grades</span>
            </div>
          </div>
        </div>
      )}

      {/* Complete High-Density Data Grid */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">
            {language === 'ml' ? 'പൂർണ്ണ ടീം പട്ടിക' : 'Full Team Point Standings & Tally'}
          </h3>
          <span className="text-xs text-neutral-400">
            {sortedTeams.length} {language === 'ml' ? 'ടീമുകൾ' : 'Teams Registered'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-6 font-semibold w-16 text-center">Rank</th>
                <th className="py-3.5 px-6 font-semibold">House / Team</th>
                <th className="py-3.5 px-4 font-semibold text-center">Code</th>
                <th className="py-3.5 px-4 font-semibold text-center">1st</th>
                <th className="py-3.5 px-4 font-semibold text-center">2nd</th>
                <th className="py-3.5 px-4 font-semibold text-center">3rd</th>
                <th className="py-3.5 px-4 font-semibold text-center">A Grade</th>
                <th className="py-3.5 px-6 font-semibold text-right w-44">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sortedTeams.map((team, idx) => {
                const percentage = Math.round((team.displayPoints / (maxPoints || 1)) * 100);
                const isFirst = idx === 0;

                return (
                  <tr key={team.id} className="hover:bg-neutral-50/80 transition-colors">
                    {/* Rank */}
                    <td className="py-4 px-6 text-center font-bold tabular-nums">
                      {idx === 0 && <span className="text-amber-500 font-extrabold">#1</span>}
                      {idx === 1 && <span className="text-slate-600 font-extrabold">#2</span>}
                      {idx === 2 && <span className="text-amber-700 font-extrabold">#3</span>}
                      {idx > 2 && <span className="text-neutral-400">#{idx + 1}</span>}
                    </td>

                    {/* Team Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0" 
                          style={{ backgroundColor: team.color }}
                        />
                        <div>
                          <div className="font-semibold text-neutral-900">{team.name}</div>
                          <div className="text-xs text-neutral-400">{team.institution}</div>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-4 px-4 text-center font-mono font-medium text-neutral-600">
                      {team.code}
                    </td>

                    {/* 1st */}
                    <td className="py-4 px-4 text-center tabular-nums text-neutral-700">
                      {team.firstCount}
                    </td>

                    {/* 2nd */}
                    <td className="py-4 px-4 text-center tabular-nums text-neutral-700">
                      {team.secondCount}
                    </td>

                    {/* 3rd */}
                    <td className="py-4 px-4 text-center tabular-nums text-neutral-700">
                      {team.thirdCount}
                    </td>

                    {/* A Grade */}
                    <td className="py-4 px-4 text-center tabular-nums text-neutral-700">
                      {team.aGradeCount}
                    </td>

                    {/* Total Points & Bar */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-neutral-900 text-base tabular-nums">
                          {team.displayPoints}
                        </span>
                        <div className="w-28 bg-neutral-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isFirst ? 'bg-amber-500' : 'bg-neutral-600'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-neutral-50/70 border-t border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>
            Scoring Rules: 1st Place = {currentFestival.scoringRules.firstPlace} pts, 2nd Place = {currentFestival.scoringRules.secondPlace} pts, 3rd Place = {currentFestival.scoringRules.thirdPlace} pts. Grade Bonuses: A Grade = +{currentFestival.scoringRules.aGrade} pts, B Grade = +{currentFestival.scoringRules.bGrade} pts. Group multiplier: {currentFestival.scoringRules.groupMultiplier}x.
          </span>
        </div>
      </div>
    </div>
  );
};
