import { Building2, Eye, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import { PendingParishesSection } from '../../components/admin/PendingParishesSection';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ParishDetailsDrawer } from '../../components/admin/drawers/ParishDetailsDrawer';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { formatFcfa } from '../../utils/formatCurrency';
import type { AdminParish } from '../../services/mockAdminApi/data';
import { useParishesStore } from '../../stores/parishesStore';

const statutFilters = [
  { id: 'tous', label: 'Toutes' },
  { id: 'en_attente', label: 'En attente' },
  { id: 'validee', label: 'Validées' },
  { id: 'rejetee', label: 'Rejetées' },
  { id: 'suspendue', label: 'Suspendues' },
] as const;

export default function ParishesPage() {
  const { parishes, pendingParishes, loading, loadParishes, loadPendingParishes, openParishDrawer } = useParishesStore();
  const [query, setQuery] = useState('');
  const [statut, setStatut] = useState('tous');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    void loadPendingParishes();
  }, [loadPendingParishes]);

  useEffect(() => {
    void loadParishes({ q: debouncedQuery, statut: statut !== 'tous' ? statut : undefined });
  }, [debouncedQuery, statut, loadParishes]);

  const statutCounts = useMemo(() => {
    const counts = { en_attente: 0, validee: 0, rejetee: 0, suspendue: 0 };
    for (const p of parishes) {
      if (p.statut in counts) counts[p.statut as keyof typeof counts] += 1;
    }
    return counts;
  }, [parishes]);

  const columns = [
    { key: 'nom', header: 'Paroisse', render: (p: AdminParish) => (
      <div>
        <span className="font-medium block">{p.nom}</span>
        <span className="text-xs text-gray-500">{p.responsable}</span>
      </div>
    ) },
    { key: 'ville', header: 'Ville', render: (p: AdminParish) => p.ville || '—' },
    { key: 'diocese', header: 'Diocèse', render: (p: AdminParish) => p.diocese || '—' },
    { key: 'date', header: 'Inscription', render: (p: AdminParish) => p.dateInscription || '—' },
    { key: 'demandes', header: 'Demandes', render: (p: AdminParish) => p.nombreDemandes },
    { key: 'montant', header: 'Collecté', render: (p: AdminParish) => formatFcfa(p.montantCollecte) },
    { key: 'statut', header: 'Statut', render: (p: AdminParish) => <StatusBadge statut={p.statut} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (p: AdminParish) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void openParishDrawer(p.id); }}
          className="inline-flex items-center gap-1 text-purple text-sm font-medium min-h-touch px-2"
        >
          <Eye className="h-4 w-4" />
          {p.statut === 'en_attente' ? 'Valider' : 'Voir'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Paroisses"
        description="Validez les nouvelles inscriptions, supervisez l'activité et le statut de chaque paroisse sur la plateforme."
        badge={loading ? 'Chargement…' : `${parishes.length} paroisse${parishes.length > 1 ? 's' : ''}`}
      />

      <PendingParishesSection
        parishes={pendingParishes}
        onReview={(id) => void openParishDrawer(id)}
      />

      <div className="rounded-2xl border border-purple/15 bg-purple-light/25 p-4 flex gap-3">
        <Building2 className="h-5 w-5 text-purple shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          Les paroisses <strong>validées</strong> sont visibles par les fidèles. Les dossiers <strong>en attente</strong> nécessitent votre examen
          (coordonnées, diocèse, responsable) avant publication.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Nom, ville, diocèse, email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-h-touch pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {statutFilters.map((f) => {
            const count = f.id === 'tous' ? parishes.length : statutCounts[f.id as keyof typeof statutCounts] ?? 0;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatut(f.id)}
                className={[
                  'shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-touch inline-flex items-center gap-2',
                  statut === f.id ? 'bg-purple text-white' : 'bg-white border border-gray-200 text-gray-600',
                ].join(' ')}
              >
                {f.label}
                <span className={[
                  'text-xs px-1.5 py-0.5 rounded-full',
                  statut === f.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600',
                ].join(' ')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading && parishes.length === 0 ? (
        <AdminListSkeleton rows={6} />
      ) : (
        <DataTable
          columns={columns}
          data={parishes}
          onRowClick={(p) => void openParishDrawer(p.id)}
          emptyMessage="Aucune paroisse ne correspond à votre recherche."
        />
      )}
      <ParishDetailsDrawer />
    </div>
  );
}
