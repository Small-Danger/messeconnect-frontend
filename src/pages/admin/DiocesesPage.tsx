import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import { DioceseFormModal } from '../../components/admin/modals/DioceseFormModal';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { AdminDiocese } from '../../services/mockAdminApi/data';
import { useDiocesesStore } from '../../stores/diocesesStore';

export default function DiocesesPage() {
  const {
    dioceses,
    loading,
    formOpen,
    editingId,
    loadDioceses,
    openCreateForm,
    openEditForm,
    closeForm,
    saveDiocese,
    deleteDiocese,
  } = useDiocesesStore();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    void loadDioceses({ q: debouncedQuery || undefined });
  }, [debouncedQuery, loadDioceses]);

  const editing = useMemo(
    () => dioceses.find((d) => d.id === editingId) ?? null,
    [dioceses, editingId],
  );

  const columns = [
    { key: 'nom', header: 'Diocèse', render: (d: AdminDiocese) => <span className="font-medium">{d.nom}</span> },
    { key: 'ville', header: 'Ville', render: (d: AdminDiocese) => d.ville || '—' },
    { key: 'pays', header: 'Pays', render: (d: AdminDiocese) => d.pays || '—' },
    { key: 'paroisses', header: 'Paroisses', render: (d: AdminDiocese) => d.paroissesCount },
    {
      key: 'actif',
      header: 'Statut',
      render: (d: AdminDiocese) => (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${d.actif ? 'bg-teal-light text-teal-800' : 'bg-gray-100 text-gray-600'}`}>
          {d.actif ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (d: AdminDiocese) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openEditForm(d.id); }}
            className="inline-flex items-center gap-1 text-purple text-sm font-medium min-h-touch px-2"
          >
            <Edit className="h-4 w-4" /> Modifier
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (d.paroissesCount > 0) {
                window.alert('Ce diocèse est lié à des paroisses et ne peut pas être supprimé.');
                return;
              }
              if (window.confirm(`Supprimer le diocèse « ${d.nom} » ?`)) void deleteDiocese(d.id);
            }}
            className="inline-flex items-center gap-1 text-red-600 text-sm font-medium min-h-touch px-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminPageHeader
          title="Diocèses"
          description="Gérez les diocèses rattachés aux paroisses inscrites sur MesseConnect."
          badge={loading ? 'Chargement…' : `${dioceses.length} diocèse${dioceses.length > 1 ? 's' : ''}`}
        />
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 min-h-touch px-4 rounded-xl bg-purple text-white text-sm font-medium shrink-0"
        >
          <Plus className="h-4 w-4" /> Nouveau diocèse
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Rechercher un diocèse…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full min-h-touch pl-10 pr-4 rounded-xl border border-gray-200 text-sm"
        />
      </div>

      {loading && dioceses.length === 0 ? (
        <AdminListSkeleton rows={5} />
      ) : (
        <DataTable columns={columns} data={dioceses} emptyMessage="Aucun diocèse trouvé." />
      )}

      <DioceseFormModal
        open={formOpen}
        onClose={closeForm}
        onSubmit={saveDiocese}
        loading={loading}
        initial={editing}
      />
    </div>
  );
}
