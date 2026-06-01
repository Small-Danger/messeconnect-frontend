import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SectionTitleProps {
  title: string;
  actionLabel?: string;
  actionTo?: string;
  subtitle?: ReactNode;
}

export function SectionTitle({ title, actionLabel, actionTo, subtitle }: SectionTitleProps) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p> : null}
      </div>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="text-sm font-medium text-teal shrink-0 active:opacity-70">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
