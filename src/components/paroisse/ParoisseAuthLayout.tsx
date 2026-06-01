import { ArrowLeft, CalendarDays, ClipboardList, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AfricanPatternFooter } from '../common/AfricanPatternFooter';
import { MesseConnectLogo } from '../common/MesseConnectLogo';
import { SafeImage } from '../common/SafeImage';
import { appImages } from '../../lib/images';

type ParoisseAuthVariant = 'login' | 'register' | 'pending';

interface ParoisseAuthLayoutProps {
  variant: ParoisseAuthVariant;
  children: ReactNode;
}

function ChurchSilhouette() {
  return (
    <svg viewBox="0 0 120 100" className="mx-auto h-24 w-28 opacity-25" aria-hidden>
      <path
        fill="currentColor"
        d="M60 8v-4h-8v4L36 28h48L60 8zm-28 24v48h16V68h24v32h16V32H32z"
      />
    </svg>
  );
}

function SidePanel({ variant }: { variant: ParoisseAuthVariant }) {
  const isRegister = variant === 'register';

  return (
    <aside className="relative hidden flex-col overflow-hidden bg-teal-900 p-8 text-white lg:flex lg:w-[340px] xl:w-[400px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="relative flex flex-1 flex-col">
        <div className="rounded-xl bg-white/95 px-3 py-2 inline-flex self-start">
          <MesseConnectLogo size="sm" />
        </div>

        <h2 className="mt-8 text-2xl font-bold leading-snug">
          {isRegister ? 'Inscription paroisse' : 'Espace Paroisse'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          {isRegister
            ? 'Créez le compte de votre paroisse et soumettez votre demande de validation à MesseConnect.'
            : 'Gérez vos demandes de messe, planifiez les célébrations et suivez vos offrandes en toute simplicité.'}
        </p>

        {isRegister ? (
          <ul className="mt-8 space-y-4">
            {[
              { icon: ClipboardList, label: 'Gérez vos demandes' },
              { icon: CalendarDays, label: 'Planifiez les messes' },
              { icon: Wallet, label: 'Suivez vos offrandes' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-10">
          <ChurchSilhouette />
        </div>
      </div>
    </aside>
  );
}

export function ParoisseAuthLayout({ variant, children }: ParoisseAuthLayoutProps) {
  const navigate = useNavigate();
  const showBack = variant === 'register';

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <SidePanel variant={variant} />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          {showBack ? (
            <button
              type="button"
              aria-label="Retour"
              onClick={() => navigate('/paroisse/login')}
              className="mr-2 flex min-h-touch min-w-touch items-center justify-center text-teal active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <span className="min-w-touch" />
          )}
          <div className="flex flex-1 justify-center">
            <MesseConnectLogo size="sm" />
          </div>
          <span className="min-w-touch" />
        </header>

        <div className="flex flex-1">
          <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-6 sm:px-8 lg:py-10">
            {children}
          </main>

          <aside className="relative hidden w-[280px] shrink-0 xl:block 2xl:w-[360px]">
            <SafeImage
              src={appImages.cathedraleOuaga}
              alt=""
              className="h-full w-full object-cover"
              fallbackLabel="MesseConnect"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-50/20" />
          </aside>
        </div>

        <div className="lg:hidden">
          <AfricanPatternFooter />
        </div>
      </div>
    </div>
  );
}

export function ParoisseAuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-gray-200" />
      </div>
      <p className="relative flex justify-center">
        <span className="relative flex justify-center bg-white px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
          ou
        </span>
      </p>
    </div>
  );
}

export function ParoisseAuthFooterLink({
  prompt,
  action,
  to,
}: {
  prompt: string;
  action: string;
  to: string;
}) {
  return (
    <p className="mt-8 text-center text-sm text-gray-600">
      {prompt}{' '}
      <Link to={to} className="font-semibold text-teal hover:underline">
        {action}
      </Link>
    </p>
  );
}
