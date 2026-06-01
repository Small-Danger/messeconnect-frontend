import { type ReactNode } from 'react';

interface BlurRevealProps {
  children: ReactNode;
  /** Délai en secondes avant l’apparition */
  delay?: number;
  className?: string;
}

/** Contenu qui apparaît en passant du flou au net (CSS pur — compatible React 19) */
export function BlurReveal({ children, delay = 0, className = '' }: BlurRevealProps) {
  return (
    <div
      className={['mc-blur-reveal', className].filter(Boolean).join(' ')}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
