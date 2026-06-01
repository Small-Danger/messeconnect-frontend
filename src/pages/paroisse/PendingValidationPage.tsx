import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ParoisseAuthLayout } from '../../components/paroisse/ParoisseAuthLayout';

export default function PendingValidationPage() {
  return (
    <ParoisseAuthLayout variant="pending">
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-white lg:p-10 lg:shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-light">
          <Clock className="h-10 w-10 text-amber-dark" strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 text-xl font-bold text-teal-900">En attente de validation</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          Votre demande a bien été reçue. L&apos;équipe MesseConnect vous contactera par email dès que
          votre paroisse sera activée.
        </p>
        <Link
          to="/paroisse/login"
          className="mt-8 inline-flex min-h-touch items-center text-sm font-semibold text-teal active:opacity-80"
        >
          Retour à la connexion
        </Link>
      </div>
    </ParoisseAuthLayout>
  );
}
