import React from 'react';
import { useFest } from '../../context/FestContext';
import { Shield, Clock, User, Filter } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { currentFestival, auditLogs } = useFest();

  const festLogs = auditLogs.filter(l => l.festivalId === currentFestival.id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-600" />
          <span>Security & Operational Audit Trail</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Immutable log of administrative score modifications, approvals, results publications, and system events
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Logged System Actions
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {festLogs.length} events logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold w-40">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Authorized Actor</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {festLogs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50/70">
                  <td className="py-3 px-4 text-neutral-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-neutral-900">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 capitalize">
                    {log.role.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-700">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
