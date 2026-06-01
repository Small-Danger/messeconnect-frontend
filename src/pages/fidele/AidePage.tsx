import { Link } from 'react-router-dom';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';

const faqItems = [
  {
    question: 'Puis-je demander une messe sans compte ?',
    answer:
      'Oui. À la fin de votre demande, conservez votre référence (MSS-…) pour suivre l’avancement via « Suivre une demande ».',
  },
  {
    question: 'Comment retrouver un paiement ?',
    answer:
      'Utilisez la référence reçue après votre paiement dans « Suivre une demande » ou « Retrouver un paiement » depuis votre profil.',
  },
  {
    question: 'Pourquoi créer un compte ?',
    answer:
      'Vos demandes, paiements et paroisses favorites sont enregistrés automatiquement, sans retaper de référence.',
  },
];

export default function AidePage() {
  return (
    <MobileLayout header={<PageHeader title="Aide" backTo="/profile" />}>
      <div className="px-4 py-4 space-y-4">
        <p className="text-sm text-gray-600">
          Besoin d&apos;assistance ? Consultez les réponses ci-dessous ou contactez le support de votre paroisse.
        </p>

        <div className="space-y-3">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">{item.question}</h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl bg-teal-light border border-teal/10 p-4">
          <p className="text-sm font-medium text-teal-900">Vous avez une référence ?</p>
          <p className="mt-1 text-sm text-teal-800">
            Retrouvez votre demande ou paiement en quelques secondes.
          </p>
          <Link
            to="/suivi"
            className="mt-3 inline-flex min-h-touch items-center text-sm font-semibold text-teal active:opacity-80"
          >
            Suivre ma demande →
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}
