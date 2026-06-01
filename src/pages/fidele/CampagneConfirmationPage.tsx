import { CheckCircle } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { formatFcfa } from '../../utils/formatCurrency';

interface DonConfirmationState {
  campagneTitre?: string;
  montant?: number;
}

export default function CampagneConfirmationPage() {
  const { reference } = useParams<{ reference: string }>();
  const location = useLocation();
  const state = (location.state ?? {}) as DonConfirmationState;

  return (
    <MobileLayout
      showBottomNav={false}
      header={<PageHeader title="Don confirmé" backTo="/campagnes" />}
    >
      <div className="px-4 py-12 text-center">
        <CheckCircle className="h-20 w-20 text-teal mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="text-xl font-semibold text-gray-900">Merci pour votre générosité</h1>
        <p className="text-sm text-gray-500 mt-3">
          Votre don{state.campagneTitre ? ` pour « ${state.campagneTitre} »` : ''} a bien été enregistré.
        </p>

        {state.montant ? (
          <p className="text-2xl font-semibold text-teal mt-4">{formatFcfa(state.montant)}</p>
        ) : null}

        <div className="mt-6 rounded-xl bg-teal-light px-4 py-3 inline-block">
          <p className="text-xs text-teal-800">Référence du paiement</p>
          <p className="font-mono font-semibold text-teal mt-1">{reference}</p>
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <Link
            to="/campagnes"
            className="w-full min-h-touch flex items-center justify-center rounded-xl bg-teal text-white font-medium active:scale-95"
          >
            Voir les collectes
          </Link>
          <Link
            to="/"
            className="w-full min-h-touch flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 font-medium active:scale-95"
          >
            Retour accueil
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}
