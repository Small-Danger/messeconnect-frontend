import { formatFcfa } from '../../utils/formatCurrency';
import type { MockPaiement } from '../../services/mockApi/data';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaiementCardProps {
  paiement: MockPaiement;
}

export function PaiementCard({ paiement }: PaiementCardProps) {
  const statutClass =
    paiement.statut === 'reussi'
      ? 'bg-teal-light text-teal-800'
      : paiement.statut === 'en_attente'
        ? 'bg-amber-light text-amber-dark'
        : 'bg-red-50 text-red-700';

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-gray-900">{paiement.methode}</p>
          <p className="text-xs text-gray-400 mt-1">{paiement.reference}</p>
          <p className="text-xs text-gray-500 mt-2">
            {format(parseISO(paiement.date), 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-teal">{formatFcfa(paiement.montant)}</p>
          <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${statutClass}`}>
            {paiement.statut === 'reussi' ? 'Réussi' : paiement.statut === 'en_attente' ? 'En attente' : 'Échoué'}
          </span>
        </div>
      </div>
    </div>
  );
}
