import { useEffect, useRef, useState } from 'react';
import { IS_GOOGLE_AUTH_ENABLED, USE_MOCK_API } from '../../config/env';
import { renderGoogleSignInButton } from '../../lib/googleIdentity';
import { GoogleLogo } from './GoogleLogo';

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError?: () => void;
  disabled?: boolean;
}

function GoogleSignInButtonFace({
  disabled,
  loading,
  onClick,
}: {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'flex w-full min-h-touch items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 font-medium text-gray-800 shadow-sm transition-transform',
        'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
      ].join(' ')}
    >
      <GoogleLogo size={22} />
      <span className="text-sm">{loading ? 'Connexion…' : 'Continuer avec Google'}</span>
    </button>
  );
}

export function GoogleSignInButton({ onSuccess, onError, disabled = false }: GoogleSignInButtonProps) {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [loadError, setLoadError] = useState('');
  const [gsiReady, setGsiReady] = useState(false);
  const [loading, setLoading] = useState(false);

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!IS_GOOGLE_AUTH_ENABLED || disabled) {
      setGsiReady(false);
      return;
    }

    const container = hiddenRef.current;
    if (!container) return;

    let cancelled = false;
    setGsiReady(false);
    setLoadError('');

    const mount = () => {
      renderGoogleSignInButton(
        container,
        (idToken) => {
          if (!cancelled) {
            setLoading(false);
            onSuccessRef.current(idToken);
          }
        },
        () => {
          if (!cancelled) {
            setLoading(false);
            onErrorRef.current?.();
          }
        },
      )
        .then(() => {
          if (!cancelled) setGsiReady(true);
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            setLoadError(error instanceof Error ? error.message : 'Connexion Google indisponible');
          }
        });
    };

    requestAnimationFrame(mount);

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [disabled]);

  const triggerGoogleSignIn = () => {
    if (USE_MOCK_API && !IS_GOOGLE_AUTH_ENABLED) {
      setLoading(true);
      onSuccessRef.current('mock-google-id-token');
      setLoading(false);
      return;
    }

    const googleBtn = hiddenRef.current?.querySelector('[role="button"]') as HTMLElement | null;
    if (!googleBtn) {
      onErrorRef.current?.();
      return;
    }

    setLoading(true);
    googleBtn.click();
  };

  if (!IS_GOOGLE_AUTH_ENABLED && !USE_MOCK_API) {
    return (
      <div className="space-y-2">
        <GoogleSignInButtonFace disabled />
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
          Ajoutez{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">VITE_GOOGLE_CLIENT_ID</code> dans{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">frontend/.env</code>
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-2">
        <GoogleSignInButtonFace disabled={disabled} onClick={triggerGoogleSignIn} />
        <p className="text-center text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={hiddenRef} className="absolute h-0 w-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden />
      <GoogleSignInButtonFace
        disabled={disabled || (IS_GOOGLE_AUTH_ENABLED && !gsiReady)}
        loading={loading}
        onClick={triggerGoogleSignIn}
      />
    </div>
  );
}
