import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdminDrawer } from './AdminDrawer';
import { StatusBadge } from '../StatusBadge';
import { formatFcfa } from '../../../utils/formatCurrency';
import { useTransactionsStore } from '../../../stores/transactionsStore';

const typeLabels = {
  intention: 'Intention de messe',
  campagne: 'Don campagne',
  autre: 'Paiement',
} as const;

function formatDetailDate(value: string) {
  try {
    return format(parseISO(value), "d MMM yyyy 'à' HH:mm", { locale: fr });
  } catch {
    return value;
  }
}

export function TransactionDetailsDrawer() {
  const { selectedTransactionId, transactionDetail, loading, closeTransactionDrawer } = useTransactionsStore();

  return (
    <AdminDrawer
      open={!!selectedTransactionId}
      onClose={closeTransactionDrawer}
      title={transactionDetail?.reference ?? 'Transaction'}
      wide
    >
      {transactionDetail ? (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">{typeLabels[transactionDetail.typePaiement]}</p>
              <p className="font-semibold text-gray-900 mt-0.5">{transactionDetail.libelleContexte}</p>
            </div>
            <StatusBadge statut={transactionDetail.statut} />
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Row label="Référence interne" value={transactionDetail.reference} mono />
            <Row label="Date" value={formatDetailDate(transactionDetail.date)} />
            <Row label="Montant" value={formatFcfa(transactionDetail.montant)} />
            <Row label="Frais techniques" value={transactionDetail.fraisTechniques > 0 ? formatFcfa(transactionDetail.fraisTechniques) : '—'} />
            <Row label="Méthode" value={transactionDetail.methode} />
            <Row label="Devise" value={transactionDetail.devise} />
            <Row label="Payeur" value={transactionDetail.utilisateur} />
            <Row label="Téléphone payeur" value={transactionDetail.telephonePayeur ?? '—'} />
            <Row label="Paroisse" value={transactionDetail.paroisse} />
            <Row label="Réf. opérateur" value={transactionDetail.referenceFournisseur ?? '—'} mono />
            <Row label="Statut opérateur" value={transactionDetail.statutFournisseur ?? '—'} />
            {transactionDetail.dateExpiration ? (
              <Row label="Expiration" value={formatDetailDate(transactionDetail.dateExpiration)} />
            ) : null}
          </dl>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Historique de traitement</h3>
            {transactionDetail.journal.length === 0 ? (
              <p className="text-sm text-gray-500 rounded-lg bg-gray-50 px-3 py-4 text-center">Aucune étape enregistrée.</p>
            ) : (
              <ol className="relative border-l-2 border-purple-light ml-3 space-y-4">
                {transactionDetail.journal.map((j, i) => (
                  <li key={i} className="ml-4">
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-purple" />
                    <p className="text-sm font-medium text-gray-900">{j.etape}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{j.detail}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDetailDate(j.date)}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">
            Supervision en lecture seule — la confirmation des espèces se fait côté paroisse.
          </p>
        </div>
      ) : loading ? (
        <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
          Impossible de charger le détail de cette transaction.
        </div>
      )}
    </AdminDrawer>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className={`font-medium text-gray-900 mt-0.5 break-all ${mono ? 'font-mono text-xs text-purple' : ''}`}>{value}</dd>
    </div>
  );
}
