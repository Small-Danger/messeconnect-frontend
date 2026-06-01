import { Eye, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { UserDetailsDrawer } from '../../components/admin/drawers/UserDetailsDrawer';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { AdminUser } from '../../services/mockAdminApi/data';
import { useUsersStore } from '../../stores/usersStore';

const statutOptions = [
  { value: 'tous', label: 'Tous statuts' },
  { value: 'actif', label: 'Actifs' },
  { value: 'suspendu', label: 'Suspendus' },
  { value: 'inactif', label: 'Inactifs' },
] as const;

export default function UsersPage() {
  const { users, loading, loadUsers, openUserDrawer } = useUsersStore();
  const [query, setQuery] = useState('');
  const [statut, setStatut] = useState('tous');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    void loadUsers({ q: debouncedQuery, statut: statut !== 'tous' ? statut : undefined });
  }, [debouncedQuery, statut, loadUsers]);

  const columns = [
    { key: 'nom', header: 'Nom', render: (u: AdminUser) => <span className="font-medium">{u.prenom} {u.nom}</span> },
    { key: 'telephone', header: 'Téléphone', render: (u: AdminUser) => u.telephone },
    { key: 'email', header: 'Email', render: (u: AdminUser) => <span className="text-gray-600">{u.email}</span> },
    { key: 'ville', header: 'Ville', render: (u: AdminUser) => u.ville },
    { key: 'date', header: 'Inscription', render: (u: AdminUser) => u.dateInscription },
    { key: 'demandes', header: 'Demandes', render: (u: AdminUser) => u.nombreDemandes },
    { key: 'statut', header: 'Statut', render: (u: AdminUser) => <StatusBadge statut={u.statut} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (u: AdminUser) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void openUserDrawer(u.id); }}
          className="inline-flex items-center gap-1 text-purple text-sm font-medium min-h-touch px-2"
        >
          <Eye className="h-4 w-4" /> Voir
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Fidèles inscrits"
        description="Consultez les profils, l'activité et gérez la suspension ou la réactivation des comptes."
        badge={loading ? 'Chargement…' : `${users.length} résultat${users.length > 1 ? 's' : ''}`}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Nom, email, téléphone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-h-touch pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm"
          />
        </div>
        <select value={statut} onChange={(e) => setStatut(e.target.value)} className="min-h-touch rounded-xl border border-gray-200 px-3 text-sm bg-white">
          {statutOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading && users.length === 0 ? (
        <AdminListSkeleton rows={6} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onRowClick={(u) => void openUserDrawer(u.id)}
          emptyMessage="Aucun fidèle ne correspond à votre recherche."
        />
      )}
      <UserDetailsDrawer />
    </div>
  );
}
