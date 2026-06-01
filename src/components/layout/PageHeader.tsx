import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  right?: ReactNode;
}

export function PageHeader({ title, showBack = true, backTo, right }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-teal px-4">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {showBack ? (
          <button
            type="button"
            aria-label="Retour"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="min-h-touch min-w-touch flex items-center justify-center text-white active:scale-95 transition-transform shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <span className="min-w-touch" />
        )}
        <h1 className="text-white font-medium text-base truncate">{title}</h1>
      </div>
      {right ? <div className="relative z-10 shrink-0">{right}</div> : <span className="min-w-touch" />}
    </header>
  );
}
