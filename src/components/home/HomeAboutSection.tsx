import { ArrowRight, Church, HandHeart, Radio, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './homeAbout.css';

const features = [
  {
    icon: Church,
    step: '01',
    title: 'Demander une messe',
    text: 'Paroisse, créneau et intention — en quelques minutes.',
    accent: {
      ring: 'ring-teal/20',
      icon: 'from-teal to-teal-800 shadow-teal/35',
      card: 'from-teal-50/90 via-white to-white',
      step: 'text-teal',
    },
  },
  {
    icon: Radio,
    step: '02',
    title: 'Suivre sa paroisse',
    text: 'Horaires, actus et favoris au même endroit.',
    accent: {
      ring: 'ring-connect/25',
      icon: 'from-connect to-connect-dark shadow-connect/35',
      card: 'from-amber-light/80 via-white to-white',
      step: 'text-connect-dark',
    },
  },
  {
    icon: HandHeart,
    step: '03',
    title: 'Soutenir une collecte',
    text: 'Participez aux campagnes de votre communauté.',
    accent: {
      ring: 'ring-purple/20',
      icon: 'from-purple to-purple-dark shadow-purple/35',
      card: 'from-purple-light/90 via-white to-white',
      step: 'text-purple',
    },
  },
] as const;

const journey = [
  { label: 'Trouver', sub: 'une paroisse' },
  { label: 'Demander', sub: 'ou suivre' },
  { label: 'Contribuer', sub: 'si besoin' },
];

export function HomeAboutSection() {
  return (
    <section aria-labelledby="home-about-title" className="mc-fade-up">
      <div className="relative overflow-hidden rounded-[24px] border border-gray-100/90 bg-white p-[3px] shadow-[0_20px_48px_-20px_rgba(15,110,86,0.28)]">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal/8 via-transparent to-connect/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-12 top-8 h-36 w-36 rounded-full bg-teal/15 blur-3xl mc-about-glow"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-connect/10 blur-2xl"
          aria-hidden
        />

        <div className="relative overflow-hidden rounded-[21px] bg-gradient-to-b from-gray-50/80 to-white">
          <div className="border-b border-gray-100/80 px-4 pb-4 pt-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/20 bg-teal-light/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-teal">
                <Sparkles className="h-3 w-3 text-connect" aria-hidden />
                Pourquoi MesseConnect
              </span>
              <span className="rounded-full bg-forest/5 px-2 py-0.5 text-[10px] font-medium text-forest">
                Burkina Faso
              </span>
            </div>

            <h2
              id="home-about-title"
              className="text-[1.35rem] font-bold leading-tight tracking-tight text-gray-900"
            >
              Votre paroisse,{' '}
              <span className="bg-gradient-to-r from-teal to-teal-mid bg-clip-text text-transparent">
                à portée de main
              </span>
            </h2>
            <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-gray-600">
              Une seule application pour les démarches du quotidien : plus besoin d’appeler ou de vous
              déplacer pour l’essentiel.
            </p>
          </div>

          <div className="-mx-1 mt-4 flex gap-2.5 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scrollbar-hide">
            {features.map(({ icon: Icon, step, title, text, accent }) => (
              <article
                key={title}
                className={[
                  'relative w-[min(200px,72vw)] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-100/90 p-3.5',
                  'ring-1 ring-inset',
                  accent.ring,
                  `bg-gradient-to-br ${accent.card}`,
                ].join(' ')}
              >
                <span
                  className={`absolute right-3 top-2 text-[2rem] font-black leading-none opacity-[0.07] ${accent.step}`}
                  aria-hidden
                >
                  {step}
                </span>
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.icon} shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.2} aria-hidden />
                </span>
                <h3 className="relative mt-3 text-sm font-bold leading-snug text-gray-900">{title}</h3>
                <p className="relative mt-1 text-[11px] leading-relaxed text-gray-500">{text}</p>
              </article>
            ))}
          </div>

          <div className="mx-4 mt-5 overflow-hidden rounded-2xl bg-forest shadow-[0_12px_32px_-12px_rgba(21,46,40,0.55)]">
            <div className="relative px-4 py-4">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(245,166,35,0.22),transparent_55%)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 mc-about-shine bg-gradient-to-r from-transparent via-white/10 to-transparent"
                aria-hidden
              />

              <p className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-teal-100/90">
                En bref
              </p>
              <p className="relative mt-1 text-sm font-medium leading-snug text-white/90">
                Trois gestes, un seul fil — de la recherche à l’action.
              </p>

              <div className="relative mt-4 flex items-stretch gap-1">
                {journey.map((item, index) => (
                  <div key={item.label} className="flex min-w-0 flex-1 items-center gap-1">
                    <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/10 px-1.5 py-2.5 text-center backdrop-blur-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-connect/90 text-[11px] font-bold text-forest">
                        {index + 1}
                      </span>
                      <span className="mt-1.5 text-[11px] font-bold leading-tight text-white">
                        {item.label}
                      </span>
                      <span className="text-[9px] leading-tight text-white/65">{item.sub}</span>
                    </div>
                    {index < journey.length - 1 ? (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/35" aria-hidden />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 pt-5">
            <Link
              to="/paroisses"
              className="group relative flex min-h-touch w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-teal via-teal-mid to-teal-800 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal/30 active:scale-[0.98] transition-transform"
            >
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity group-active:opacity-100"
                aria-hidden
              />
              <span className="relative">Explorer les paroisses</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-active:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
