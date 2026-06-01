import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  to: string;
  accent: 'teal' | 'amber' | 'purple';
}

const accentStyles = {
  teal: {
    wash: 'from-teal-50/80 to-white',
    icon: 'from-teal to-teal-800 shadow-teal/30',
    ring: 'group-active:ring-teal/20',
  },
  amber: {
    wash: 'from-amber-light/90 to-white',
    icon: 'from-amber to-amber-dark shadow-amber/30',
    ring: 'group-active:ring-amber/20',
  },
  purple: {
    wash: 'from-purple-light/90 to-white',
    icon: 'from-purple to-purple-dark shadow-purple/30',
    ring: 'group-active:ring-purple/20',
  },
} as const;

export function QuickActionCard({ icon: Icon, label, to, accent }: QuickActionCardProps) {
  const styles = accentStyles[accent];

  return (
    <Link
      to={to}
      className={[
        'group relative flex min-h-[104px] flex-col justify-between overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-4',
        'shadow-[0_10px_30px_-12px_rgba(15,110,86,0.18)] active:scale-[0.98] transition-transform',
        'ring-1 ring-transparent',
        styles.ring,
      ].join(' ')}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.wash} opacity-70`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.icon} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
        </span>
        <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-active:translate-x-0.5" />
      </div>
      <p className="relative mt-3 text-sm font-semibold leading-snug text-gray-900">{label}</p>
    </Link>
  );
}
