import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
}

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export function Skeleton({ className = '', rounded = 'lg', ...props }: SkeletonProps) {
  return (
    <div
      className={['mc-shimmer', roundedMap[rounded], className].join(' ')}
      aria-hidden
      {...props}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/** Barres de texte skeleton (titres, noms, descriptions) */
export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  const widths = ['w-full', 'w-5/6', 'w-2/3', 'w-4/5'];

  return (
    <div className={['space-y-2', className].join(' ')} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={`h-3.5 ${widths[i % widths.length]}`} rounded="md" />
      ))}
    </div>
  );
}
