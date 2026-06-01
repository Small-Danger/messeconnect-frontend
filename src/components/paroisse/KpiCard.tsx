import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: 'teal' | 'amber';
  href?: string;
}

export function KpiCard({ label, value, icon: Icon, accent = 'teal', href }: KpiCardProps) {
  const bg = accent === 'teal' ? 'bg-teal-light' : 'bg-amber-light';
  const iconColor = accent === 'teal' ? 'text-teal' : 'text-amber-dark';
  const valueColor = accent === 'teal' ? 'text-teal' : 'text-amber-dark';

  const inner = (
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-semibold mt-1 ${valueColor}`}>{value}</p>
      </div>
      <span className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </span>
    </div>
  );

  const className = [
    'rounded-2xl bg-white border border-gray-100 p-4 shadow-sm block text-left w-full',
    href ? 'transition-shadow hover:shadow-md active:scale-[0.99]' : '',
  ].join(' ');

  if (href) {
    return (
      <Link to={href} className={className} aria-label={`${label} : ${value}`}>
        {inner}
      </Link>
    );
  }

  return <article className={className}>{inner}</article>;
}
