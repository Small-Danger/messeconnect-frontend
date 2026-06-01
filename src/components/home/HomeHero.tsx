import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appImages } from '../../lib/images';
import './homeHero.css';

export function HomeHero() {
  return (
    <section className="px-4 pt-3 pb-1">
      <div className="relative overflow-hidden rounded-[24px] bg-forest shadow-[0_16px_36px_-14px_rgba(21,46,40,0.5)]">
        {/* Symbole discret — église floutée */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <img
            src={appImages.cathedraleOuaga}
            alt=""
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-15 blur-3xl"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-forest-light/95 via-forest/95 to-forest-dark/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(245,166,35,0.14),transparent_48%)]" />

        <div className="relative p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-forest-dark/50 px-2.5 py-1 text-[11px] font-medium text-white">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-connect opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-connect" />
              </span>
              Burkina Faso
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-connect/35 bg-connect/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
              <Sparkles className="h-3 w-3" />
              Foi & communauté
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-forest-dark/60 bg-gradient-to-r from-forest-light via-forest to-forest-dark p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div
              className="pointer-events-none absolute inset-0 mc-hero-shine bg-gradient-to-r from-transparent via-white/8 to-transparent"
              aria-hidden
            />

            <p className="text-xs font-medium text-teal-100">Bienvenue sur MesseConnect</p>
            <h1 className="mt-1 text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
              Votre foi,{' '}
              <span className="text-connect">notre engagement</span>
            </h1>
            <p className="mt-2 text-[13px] leading-snug text-white/85">
              Demandez une messe, suivez votre paroisse et restez connecté à votre communauté.
            </p>

            <div className="mt-4 flex gap-2.5">
              <Link
                to="/paroisses"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-forest shadow-md shadow-black/10 active:scale-[0.98] transition-transform"
              >
                Commencer
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/suivi"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 bg-forest-dark/40 px-4 text-sm font-medium text-white active:scale-[0.98] transition-transform"
              >
                Suivre
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
