import { Edit, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AbonnementFormModal } from '../../components/admin/modals/AbonnementFormModal';
import { formatFcfa } from '../../utils/formatCurrency';
import type { AdminAbonnement } from '../../services/mockAdminApi/data';
import { useAbonnementsStore } from '../../stores/abonnementsStore';

const statutFilters = [
  { id: 'tous', label: 'Tous' },
  { id: 'actif', label: 'Actifs' },
  { id: 'suspendu', label: 'Suspendus' },
  { id: 'expire', label: 'Expirés' },
] as const;

export default function AbonnementsPage() {
  const {
    abonnements,
    parishes,
    loading,
    formOpen,
    editingId,
    loadAbonnements,
    loadParishes,
    openCreateForm,
    openEditForm,
    closeForm,
    saveAbonnement,
  } = useAbonnementsStore();
  const [statut, setStatut] = useState('tous');

  useEffect(() => {
    void loadAbonnements({ statut: statut !== 'tous' ? statut : undefined });
  }, [statut, loadAbonnements]);

  useEffect(() => {
    void loadParishes();
  }, [loadParishes]);

  const editing = useMemo(
    () => abonnements.find((a) => a.id === editingId) ?? null,
    [abonnements, editingId],
  );

  const columns = [
    { key: 'paroisse', header: 'Paroisse', render: (a: AdminAbonnement) => <span className="font-medium">{a.paroisseNom}</span> },
    { key: 'plan', header: 'Plan', render: (a: AdminAbonnement) => a.plan },
    { key: 'montant', header: 'Montant', render: (a: AdminAbonnement) => formatFcfa(a.montant) },
    { key: 'debut', header: 'Début', render: (a: AdminAbonnement) => a.dateDebut || '—' },
    { key: 'fin', header: 'Fin', render: (a: AdminAbonnement) => a.dateFin || '—' },
    { key: 'statut', header: 'Statut', render: (a: AdminAbonnement) => <StatusBadge statut={a.statut} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (a: AdminAbonnement) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openEditForm(a.id); }}
          className="inline-flex items-center gap-1 text-purple text-sm font-medium min-h-touch px-2"
        >
          <Edit className="h-4 w-4" /> Modifier
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminPageHeader
          title="Abonnements paroisses"
          description="Suivez et gérez les abonnements des paroisses à la plateforme MesseConnect."
          badge={loading ? 'Chargement…' : `${abonnements.length} abonnement${abonnements.length > 1 ? 's' : ''}`}
        />
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 min-h-touch px-4 rounded-xl bg-purple text-white text-sm font-medium shrink-0"
        >
          <Plus className="h-4 w-4" /> Nouvel abonnement
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statutFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatut(f.id)}
            className={[
              'min-h-touch px-4 rounded-xl text-sm font-medium border transition-colors',
              statut === f.id ? 'bg-purple text-white border-purple' : 'bg-white text-gray-600 border-gray-200',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && abonnements.length === 0 ? (
        <AdminListSkeleton rows={4} />
      ) : (
        <DataTable columns={columns} data={abonnements} emptyMessage="Aucun abonnement pour ce filtre." />
      )}

      <AbonnementFormModal
        open={formOpen}
        onClose={closeForm}
        onSubmit={async (data) => {
          await saveAbonnement({
            paroisse_id: data.paroisse_id,
            plan: data.plan,
            montant: data.montant,
            date_debut: data.date_debut,
            date_fin: data.date_fin || undefined,
            statut: data.statut,
          });
        }}
        loading={loading}
        parishes={parishes}
        initial={editing}
      />
    </div>
  );
}
