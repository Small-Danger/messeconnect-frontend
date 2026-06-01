import { GOOGLE_CLIENT_ID } from '../config/env';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number | boolean>,
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Identity indisponible côté serveur'));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-mc-google-gsi]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Script Google bloqué')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.mcGoogleGsi = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Impossible de charger Google Identity'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function renderGoogleSignInButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void,
  onError?: () => void,
): Promise<void> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('VITE_GOOGLE_CLIENT_ID manquant');
  }

  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity non disponible');
  }

  container.replaceChildren();

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => {
      if (response.credential) {
        onCredential(response.credential);
        return;
      }
      onError?.();
    },
  });

  window.google.accounts.id.renderButton(container, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    width: Math.max(container.parentElement?.clientWidth ?? 0, 320),
  });
}
