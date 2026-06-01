import type { LucideIcon } from 'lucide-react';

interface AdminKpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: 'purple' | 'teal' | 'amber';
}

const accents = {
  purple: 'bg-purple-light text-purple',
  teal: 'bg-teal-light text-teal',
  amber: 'bg-amber-light text-amber-dark',
};

export function AdminKpiCard({ label, value, icon: Icon, trend, accent = 'purple' }: AdminKpiCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend ? <p className="text-xs text-teal font-medium mt-1">{trend}</p> : null}
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
