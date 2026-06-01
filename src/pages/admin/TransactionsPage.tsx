import { AlertCircle, CheckCircle2, Clock, Search, Wallet, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { AdminKpiCard } from '../../components/admin/AdminKpiCard';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { TransactionDetailsDrawer } from '../../components/admin/drawers/TransactionDetailsDrawer';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { formatFcfa } from '../../utils/formatCurrency';
import type { AdminTransaction } from '../../services/mockAdminApi/data';
import { useTransactionsStore } from '../../stores/transactionsStore';

const statutFilters = [
  { id: 'tous', label: 'Tous' },
  { id: 'reussi', label: 'Réussis' },
  { id: 'en_attente', label: 'En attente' },
  { id: 'echoue', label: 'Échoués' },
  { id: 'rembourse', label: 'Remboursés' },
] as const;

const methodeOptions = [
  { value: 'tous', label: 'Toutes méthodes' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'moov_money', label: 'Moov Money' },
  { value: 'wave', label: 'Wave' },
  { value: 'especes', label: 'Espèces' },
];

const typeLabels: Record<AdminTransaction['typePaiement'], string> = {
  intention: 'Intention',
  campagne: 'Campagne',
  autre: 'Autre',
};

function formatTxDate(value: string) {
  try {
    return format(parseISO(value.length > 10 ? value : `${value}T12:00:00`), 'd MMM yyyy', { locale: fr });
  } catch {
    return value.slice(0, 10);
  }
}

export default function TransactionsPage() {
  const { transactions, synthese, loading, loadTransactions, openTransactionDrawer } = useTransactionsStore();
  const [query, setQuery] = useState('');
  const [statut, setStatut] = useState('tous');
  const [methode, setMethode] = useState('tous');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [montantMin, setMontantMin] = useState('');
  const [montantMax, setMontantMax] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    void loadTransactions({
      q: debouncedQuery,
      statut: statut !== 'tous' ? statut : undefined,
      methode: methode !== 'tous' ? methode : undefined,
      dateDebut: dateDebut || undefined,
      dateFin: dateFin || undefined,
      montantMin: montantMin ? Number(montantMin) : undefined,
      montantMax: montantMax ? Number(montantMax) : undefined,
    });
  }, [debouncedQuery, statut, methode, dateDebut, dateFin, montantMin, montantMax, loadTransactions]);

  const pendingTransactions = useMemo(
    () => transactions.filter((t) => t.statut === 'en_attente'),
    [transactions],
  );

  const statutCounts = useMemo(() => ({
    reussi: synthese.reussis,
    en_attente: synthese.enAttente,
    echoue: synthese.echoues,
    rembourse: transactions.filter((t) => t.statut === 'rembourse').length,
  }), [synthese, transactions]);

  const columns = [
    { key: 'ref', header: 'Référence', render: (t: AdminTransaction) => <span className="font-mono text-xs text-purple">{t.reference}</span> },
    { key: 'date', header: 'Date', render: (t: AdminTransaction) => formatTxDate(t.date) },
    { key: 'type', header: 'Type', render: (t: AdminTransaction) => (
      <div>
        <span className="text-xs font-medium text-gray-700">{typeLabels[t.typePaiement]}</span>
        <span className="block text-xs text-gray-400 truncate max-w-[140px]">{t.libelleContexte}</span>
      </div>
    ) },
    { key: 'montant', header: 'Montant', render: (t: AdminTransaction) => <span className="font-medium">{formatFcfa(t.montant)}</span> },
    { key: 'methode', header: 'Méthode', render: (t: AdminTransaction) => t.methode },
    { key: 'user', header: 'Payeur', render: (t: AdminTransaction) => t.utilisateur },
    { key: 'paroisse', header: 'Paroisse', render: (t: AdminTransaction) => <span className="text-gray-600">{t.paroisse}</span> },
    { key: 'statut', header: 'Statut', render: (t: AdminTransaction) => <StatusBadge statut={t.statut} /> },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Paiements & transactions"
        description="Supervision des flux Mobile Money et espèces : suivi des encaissements, des échecs et des paiements en attente de confirmation."
        badge={loading ? 'Chargement…' : `${synthese.total} transaction${synthese.total > 1 ? 's' : ''}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminKpiCard label="Montant filtré" value={formatFcfa(synthese.montantTotal)} icon={Wallet} />
        <AdminKpiCard label="Encaissé (réussi)" value={formatFcfa(synthese.montantReussi)} icon={CheckCircle2} accent="teal" trend={`${synthese.reussis} paiement${synthese.reussis > 1 ? 's' : ''}`} />
        <AdminKpiCard label="En attente" value={String(synthese.enAttente)} icon={Clock} accent="amber" trend="À surveiller" />
        <AdminKpiCard label="Échoués" value={String(synthese.echoues)} icon={XCircle} accent="purple" />
      </div>

      {synthese.enAttente > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-dark shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {synthese.enAttente} paiement{synthese.enAttente > 1 ? 's' : ''} en attente de confirmation
              </p>
              <p className="text-sm text-amber-800/90 mt-0.5">
                Espèces au guichet ou Mobile Money non finalisé — vérifiez le statut côté paroisse si le délai est dépassé.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {pendingTransactions.slice(0, 4).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => void openTransactionDrawer(t.id)}
                className="rounded-xl bg-white border border-amber-100 px-3 py-2 text-left text-sm hover:border-purple/30 min-h-touch"
              >
                <span className="font-mono text-xs text-purple block">{t.reference}</span>
                <span className="font-medium">{formatFcfa(t.montant)}</span>
                <span className="text-gray-500 text-xs block">{t.paroisse}</span>
              </button>
            ))}
            {pendingTransactions.length > 4 ? (
              <button
                type="button"
                onClick={() => setStatut('en_attente')}
                className="rounded-xl border border-dashed border-amber-200 px-3 py-2 text-sm text-amber-900 min-h-touch"
              >
                +{pendingTransactions.length - 4} autres
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Référence, intention, paroisse, payeur…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-h-touch pl-10 pr-4 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statutFilters.map((f) => {
            const count = f.id === 'tous' ? synthese.total : statutCounts[f.id as keyof typeof statutCounts] ?? 0;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatut(f.id)}
                className={[
                  'shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-touch inline-flex items-center gap-2',
                  statut === f.id ? 'bg-purple text-white' : 'bg-gray-50 border border-gray-200 text-gray-600',
                ].join(' ')}
              >
                {f.label}
                <span className={['text-xs px-1.5 py-0.5 rounded-full', statut === f.id ? 'bg-white/20' : 'bg-white text-gray-600'].join(' ')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <input type="date" aria-label="Date début" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="min-h-touch rounded-xl border border-gray-200 px-3 text-sm" />
          <input type="date" aria-label="Date fin" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="min-h-touch rounded-xl border border-gray-200 px-3 text-sm" />
          <input type="number" placeholder="Montant min" value={montantMin} onChange={(e) => setMontantMin(e.target.value)} className="min-h-touch rounded-xl border border-gray-200 px-3 text-sm" />
          <input type="number" placeholder="Montant max" value={montantMax} onChange={(e) => setMontantMax(e.target.value)} className="min-h-touch rounded-xl border border-gray-200 px-3 text-sm" />
          <select value={methode} onChange={(e) => setMethode(e.target.value)} className="min-h-touch rounded-xl border border-gray-200 px-3 text-sm bg-white">
            {methodeOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {loading && transactions.length === 0 ? (
        <AdminListSkeleton rows={6} />
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          onRowClick={(t) => void openTransactionDrawer(t.id)}
          emptyMessage="Aucune transaction ne correspond aux filtres sélectionnés."
        />
      )}
      <TransactionDetailsDrawer />
    </div>
  );
}
