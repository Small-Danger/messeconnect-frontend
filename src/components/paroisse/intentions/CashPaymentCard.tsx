import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { PaiementEspecesEnAttente } from '../../../types/paroisseIntentions';
import { parseApiDate } from '../../../utils/formatDate';
import { formatFcfa } from '../../../utils/formatCurrency';

interface CashPaymentCardProps {
  paiement: PaiementEspecesEnAttente;
  loading?: boolean;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

function formatExpiration(value?: string) {
  if (!value) return null;
  try {
    return format(parseISO(value), 'd MMM yyyy · HH:mm', { locale: fr });
  } catch {
    return null;
  }
}

export function CashPaymentCard({ paiement, loading, onConfirm, onCancel }: CashPaymentCardProps) {
  const demande = paiement.demande;
  const expiration = formatExpiration(paiement.date_expiration);
  const messeLabel = demande?.messe
    ? `${parseApiDate(demande.messe.date) ? format(parseApiDate(demande.messe.date), 'EEE d MMM', { locale: fr }) : demande.messe.date} · ${demande.messe.heure}`
    : '—';

  return (
    <article className="rounded-2xl border border-amber-light/60 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{demande?.nom ?? '—'}</p>
          <p className="text-xs text-gray-500 mt-0.5">{demande?.telephone ?? paiement.telephone_payeur ?? '—'}</p>
        </div>
        <p className="text-sm font-bold text-teal shrink-0">{formatFcfa(Number(paiement.montant))}</p>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div>
          <dt className="text-xs text-gray-400">Créneau</dt>
          <dd className="font-medium text-gray-800">{messeLabel}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-400">Intention</dt>
          <dd className="text-gray-700">{demande?.intention ?? '—'}</dd>
        </div>
        {demande?.reference ? (
          <div>
            <dt className="text-xs text-gray-400">Référence</dt>
            <dd className="font-mono text-xs text-teal">{demande.reference}</dd>
          </div>
        ) : null}
        {expiration ? (
          <div>
            <dt className="text-xs text-gray-400">À confirmer avant</dt>
            <dd className="text-amber-dark text-xs font-medium">{expiration}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => onConfirm(paiement.id)}
          className="flex-1 min-h-touch rounded-xl bg-teal text-white text-sm font-semibold disabled:opacity-60"
        >
          Paiement reçu
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => onCancel(paiement.id)}
          className="flex-1 min-h-touch rounded-xl border border-red-200 text-red-600 text-sm font-semibold disabled:opacity-60"
        >
          Annuler
        </button>
      </div>
    </article>
  );
}
