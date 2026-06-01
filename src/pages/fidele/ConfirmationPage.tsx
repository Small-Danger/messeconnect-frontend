import { CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { MobileLayout } from '../../components/layout/MobileLayout';

export default function ConfirmationPage() {
  const { reference } = useParams<{ reference: string }>();

  return (
    <MobileLayout showBottomNav={false}>
      <div className="px-4 py-12 text-center">
        <CheckCircle className="h-20 w-20 text-teal mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="text-xl font-semibold text-gray-900">Demande enregistrée avec succès</h1>
        <p className="text-sm text-gray-500 mt-3">Votre demande a bien été prise en compte.</p>
        <div className="mt-6 rounded-xl bg-teal-light px-4 py-3 inline-block">
          <p className="text-xs text-teal-800">Référence</p>
          <p className="font-mono font-semibold text-teal mt-1">{reference}</p>
        </div>
        <div className="flex flex-col gap-3 mt-10">
          <Link
            to="/suivi"
            className="w-full min-h-touch flex items-center justify-center rounded-xl bg-teal text-white font-medium active:scale-95"
          >
            Voir ma demande
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
