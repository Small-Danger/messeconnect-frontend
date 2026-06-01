import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthDivider } from './AuthDivider';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useAuthStore } from '../../stores/authStore';

interface AuthGoogleSectionProps {
  disabled?: boolean;
}

export function AuthGoogleSection({ disabled = false }: AuthGoogleSectionProps) {
  const navigate = useNavigate();
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (idToken: string) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(idToken);
      navigate('/profile');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion Google impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthDivider />
      <GoogleSignInButton
        disabled={disabled || loading}
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Connexion Google annulée ou impossible')}
      />
      {error ? <p className="mt-3 text-center text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
