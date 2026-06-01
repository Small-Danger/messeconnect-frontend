import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MesseConnectLogo } from '../common/MesseConnectLogo';

interface AuthHeaderProps {
  backTo?: string;
}

export function AuthHeader({ backTo }: AuthHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }
    navigate(-1);
  };

  return (
    <header className="flex items-center px-4 py-3 bg-white border-b border-gray-100">
      <button
        type="button"
        aria-label="Retour"
        onClick={handleBack}
        className="min-h-touch min-w-touch flex items-center justify-center text-teal active:scale-95 transition-transform shrink-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="flex-1 flex justify-center pr-10">
        <MesseConnectLogo size="md" />
      </div>
    </header>
  );
}
