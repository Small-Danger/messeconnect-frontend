import { Church, HandHeart, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const points = [
  {
    icon: Church,
    title: 'Demander une messe',
    text: 'Choisissez une paroisse, un créneau et déposez votre intention en ligne.',
  },
  {
    icon: Radio,
    title: 'Suivre votre paroisse',
    text: 'Horaires, actualités et favoris : restez informé au quotidien.',
  },
  {
    icon: HandHeart,
    title: 'Soutenir une collecte',
    text: 'Participez aux campagnes caritatives de votre communauté.',
  },
];

export function HomeAboutSection() {
  return (
    <section aria-labelledby="home-about-title">
      <h2 id="home-about-title" className="text-lg font-bold text-gray-900">
        À propos de MesseConnect
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
        MesseConnect relie les fidèles et les paroisses au Burkina Faso : tout se fait depuis votre
        téléphone, sans vous déplacer pour les démarches simples.
      </p>

      <ul className="mt-4 space-y-3">
        {points.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="flex gap-3 rounded-2xl border border-gray-100/90 bg-white p-3.5 shadow-[0_8px_24px_-12px_rgba(15,110,86,0.15)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal">
              <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-xl border border-teal/15 bg-teal-light/50 px-3.5 py-3 text-xs leading-relaxed text-teal-900">
        <span className="font-semibold">En bref :</span> vous trouvez une paroisse, vous demandez ou
        suivez une messe, et vous contribuez si une collecte est ouverte — le tout sur une seule
        application.
      </p>

      <Link
        to="/paroisses"
        className="mt-4 flex min-h-touch w-full items-center justify-center rounded-full bg-teal px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal/25 active:scale-[0.98] transition-transform"
      >
        Découvrir les paroisses
      </Link>
    </section>
  );
}
