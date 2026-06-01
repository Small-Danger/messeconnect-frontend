import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  fallback?: string;
}

export function BackButton({ fallback = '..' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Retour"
      onClick={() => navigate(-1)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          navigate(fallback);
        }
      }}
      className="min-h-touch min-w-touch flex items-center justify-center text-white active:scale-95 transition-transform"
    >
      ←
    </button>
  );
}
