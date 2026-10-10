import React from 'react';
import { useFest } from '../../context/FestContext';
import { BarChart3, Download, FileSpreadsheet, Users, Trophy, Award, Scale } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { currentFestival, teams, participants, programmes, results, scores, certificates } = useFest();

  const festParticipants = participants.filter(p => p.festivalId === currentFestival.id);
  const festTeams = teams.filter(t => t.festivalId === currentFestival.id);
  const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id);
  const festResults = results.filter(r => r.festivalId === currentFestival.id);

  const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${currentFestival.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTeamStandings = () => {
    const headers = ['Rank', 'Team Code', 'Team Name', 'Institution', 'Manager', 'Total Points'];
    const sorted = [...festTeams].sort((a, b) => b.points - a.points);
    const rows = sorted.map((t, idx) => [idx + 1, t.code, t.name, t.institution, t.managerName, t.points]);
    downloadCsv('Team_Leaderboard_Report', headers, rows);
  };

  const exportAllParticipants = () => {
    const headers = ['Chest Number', 'Candidate Name', 'Team ID', 'Category ID', 'Class', 'Gender', 'Contact Phone'];
    const rows = festParticipants.map(p => [p.chestNumber, p.name, p.teamId, p.categoryId, p.gradeOrClass, p.gender, p.phone || '']);
    downloadCsv('Participants_Master_Registry', headers, rows);
  };

  const exportResultsTally = () => {
    const headers = ['Programme Code', 'Title', 'Rank', 'Chest Number', 'Candidate Name', 'Team Name', 'Marks', 'Grade', 'Points'];
    const rows: (string | number)[][] = [];

    festResults.forEach(res => {
      const prog = festProgrammes.find(p => p.id === res.programmeId);
      res.rankings.forEach(item => {
        rows.push([
          prog?.code || '',
          prog?.title || '',
          item.rank,
          item.chestNumber,
          item.participantName,
          item.teamName,
          item.totalMarks,
          item.grade,
          item.pointsEarned
        ]);
      });
    });

    downloadCsv('Published_Results_Comprehensive', headers, rows);
  };

  const exportCertificatesRegistry = () => {
    const headers = ['Certificate No', 'Recipient', 'Chest No', 'Event', 'Rank', 'Grade', 'Team', 'Issue Date', 'Verification Code'];
    const rows = certificates.filter(c => c.festivalId === currentFestival.id).map(c => [
      c.certificateNumber,
      c.participantName,
      c.chestNumber,
      c.programmeTitle,
      c.rank || 'Merit',
      c.grade || '',
      c.teamName,
      c.issueDate,
      c.verificationCode
    ]);
    downloadCsv('Certificates_Official_Registry', headers, rows);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-600" />
          <span>Official Reports & Data Exports</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Generate structured CSV and audit documents populated from real database queries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Report 1 */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Team Points & Leaderboard Standings
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Complete team ranking ledger with total accumulated points, institutional departments, and manager details.
            </p>
          </div>

          <button
            onClick={exportTeamStandings}
            className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Leaderboard CSV</span>
          </button>
        </div>

        {/* Report 2 */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Participant Master Directory
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Full candidate roster with unique chest numbers, division assignments, classes, and contact records.
            </p>
          </div>

          <button
            onClick={exportAllParticipants}
            className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Participants CSV</span>
          </button>
        </div>

        {/* Report 3 */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Official Published Results Tally
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Detailed breakdown of all published events, candidate rankings, total marks out of 100, letter grades, and points awarded.
            </p>
          </div>

          <button
            onClick={exportResultsTally}
            className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Results Matrix CSV</span>
          </button>
        </div>

        {/* Report 4 */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Certificates & Merit Register
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Audit log of all issued merit certificates with unique certificate serial numbers and QR cryptographic verification hashes.
            </p>
          </div>

          <button
            onClick={exportCertificatesRegistry}
            className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificates Log CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
