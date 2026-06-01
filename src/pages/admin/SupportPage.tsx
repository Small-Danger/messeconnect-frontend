import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HeadphonesIcon, MessageCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { TicketDetailsDrawer } from '../../components/admin/drawers/TicketDetailsDrawer';
import type { AdminTicket } from '../../services/mockAdminApi/data';
import { useAdminSupportStore } from '../../stores/adminSupportStore';

const filters = [
  { id: 'tous', label: 'Tous' },
  { id: 'ouvert', label: 'Ouverts' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'resolu', label: 'Résolus' },
] as const;

function formatTicketDate(value: string) {
  try {
    const d = parseISO(value);
    if (value.length <= 10) {
      return format(d, 'd MMM yyyy', { locale: fr });
    }
    return format(d, "d MMM yyyy 'à' HH:mm", { locale: fr });
  } catch {
    return value.slice(0, 10);
  }
}

function countByStatut(tickets: AdminTicket[], statut: string) {
  if (statut === 'tous') return tickets.length;
  return tickets.filter((t) => t.statut === statut).length;
}

export default function SupportPage() {
  const { tickets, filterStatut, loading, loadTickets, setFilterStatut, openTicketDrawer } = useAdminSupportStore();

  useEffect(() => {
    void loadTickets({ statut: filterStatut !== 'tous' ? filterStatut : undefined });
  }, [filterStatut, loadTickets]);

  const filterCounts = useMemo(() => {
    const base = { ouvert: 0, en_cours: 0, resolu: 0 };
    for (const t of tickets) {
      if (t.statut in base) base[t.statut as keyof typeof base] += 1;
    }
    return base;
  }, [tickets]);

  const columns = [
    { key: 'id', header: 'Référence', render: (t: AdminTicket) => <span className="font-mono text-xs text-purple">{t.reference}</span> },
    { key: 'titre', header: 'Sujet', render: (t: AdminTicket) => <span className="font-medium">{t.titre}</span> },
    { key: 'categorie', header: 'Catégorie', render: (t: AdminTicket) => t.categorie },
    { key: 'createur', header: 'Émetteur', render: (t: AdminTicket) => t.createur },
    { key: 'date', header: 'Date', render: (t: AdminTicket) => formatTicketDate(t.date) },
    { key: 'priorite', header: 'Priorité', render: (t: AdminTicket) => <StatusBadge statut={t.priorite} /> },
    { key: 'statut', header: 'Statut', render: (t: AdminTicket) => <StatusBadge statut={t.statut} /> },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Support technique"
        description="Tickets des paroisses et fidèles. Vous pouvez mettre à jour le statut ; la réponse détaillée sera disponible prochainement côté API."
        badge={loading ? 'Chargement…' : `${tickets.length} ticket${tickets.length > 1 ? 's' : ''}`}
      />

      <div className="rounded-2xl border border-purple/15 bg-purple-light/25 p-4 flex gap-3">
        <HeadphonesIcon className="h-5 w-5 text-purple shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 space-y-1">
          <p className="font-medium text-gray-900">Priorité aux tickets ouverts</p>
          <p>Cliquez sur une ligne pour consulter le détail et changer le statut (ouvert → en cours → résolu).</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => {
          const count =
            f.id === 'tous'
              ? tickets.length
              : filterCounts[f.id as keyof typeof filterCounts] ?? countByStatut(tickets, f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStatut(f.id)}
              className={[
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-touch inline-flex items-center gap-2',
                filterStatut === f.id ? 'bg-purple text-white' : 'bg-white border border-gray-200 text-gray-600',
              ].join(' ')}
            >
              {f.label}
              <span className={[
                'text-xs px-1.5 py-0.5 rounded-full',
                filterStatut === f.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600',
              ].join(' ')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading && tickets.length === 0 ? (
        <AdminListSkeleton rows={5} />
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900">Aucun ticket pour ce filtre</p>
          <p className="text-sm text-gray-500 mt-1">Les demandes de support apparaîtront ici dès qu&apos;elles seront créées.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tickets}
          onRowClick={(t) => void openTicketDrawer(t.id)}
          emptyMessage="Aucun ticket pour ce filtre."
        />
      )}
      <TicketDetailsDrawer />
    </div>
  );
}
