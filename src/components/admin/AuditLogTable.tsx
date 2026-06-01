import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { AuditLog } from '../../services/mockAdminApi/data';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead className="bg-purple-light/50 text-left text-xs text-purple-dark uppercase">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Utilisateur</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Module</th>
            <th className="px-4 py-3">Adresse IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-gray-50">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {format(parseISO(log.date), 'd MMM yyyy HH:mm', { locale: fr })}
              </td>
              <td className="px-4 py-3">{log.utilisateur}</td>
              <td className="px-4 py-3">{log.action}</td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-light text-purple">{log.module}</span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
