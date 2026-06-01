import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_OPTIONS = [
  { label: "S'inscrire", to: '/auth/register' },
  { label: 'Se connecter', to: '/auth/login' },
] as const;

const ROTATE_MS = 3500;

export function AuthAlternatingButton() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      setVisible(false);
      timeoutId = setTimeout(() => {
        setIndex((current) => (current + 1) % AUTH_OPTIONS.length);
        setVisible(true);
      }, 180);
    }, ROTATE_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  const active = AUTH_OPTIONS[index];

  return (
    <button
      type="button"
      onClick={() => navigate(active.to)}
      aria-label={active.label}
      className="relative z-10 min-w-[6.75rem] shrink-0 rounded-full bg-teal-light px-3 py-1.5 text-xs font-semibold text-teal transition-opacity duration-200 active:scale-95 touch-manipulation"
      style={{ opacity: visible ? 1 : 0.2 }}
    >
      {active.label}
    </button>
  );
}
