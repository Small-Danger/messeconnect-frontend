import { useEffect, useState } from 'react';

interface AnimatedStatProps {
  value: number;
  className?: string;
  format?: (value: number) => string;
  durationMs?: number;
}

/** Compteur animé rapide (ease-out) pour les stats du profil */
export function AnimatedStat({ value, className = '', format, durationMs = 380 }: AnimatedStatProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  const text = format ? format(display) : String(display);

  return <span className={className}>{text}</span>;
}
