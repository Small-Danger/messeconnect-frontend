import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import { formatFcfa } from '../../utils/formatCurrency';
import type { AdminCampagneModeration, AdminPublicationModeration } from '../../services/mockAdminApi/data';
import { useModerationStore } from '../../stores/moderationStore';

type TabId = 'publications' | 'campagnes';

const visibilityFilters = [
  { id: 'tous' as const, label: 'Toutes' },
  { id: 'visible' as const, label: 'Visibles' },
  { id: 'masque' as const, label: 'Masquées' },
];

export default function ModerationPage() {
  const [tab, setTab] = useState<TabId>('publications');
  const {
    publications,
    campagnes,
    loading,
    visibilityFilter,
    loadPublications,
    loadCampagnes,
    setVisibilityFilter,
    togglePublicationVisible,
  } = useModerationStore();

  useEffect(() => {
    if (tab === 'publications') void loadPublications();
    else void loadCampagnes();
  }, [tab, visibilityFilter, loadPublications, loadCampagnes]);

  const publicationColumns = [
    { key: 'titre', header: 'Publication', render: (p: AdminPublicationModeration) => (
      <div>
        <span className="font-medium block">{p.titre}</span>
        <span className="text-xs text-gray-500 line-clamp-1">{p.contenu}</span>
      </div>
    ) },
    { key: 'paroisse', header: 'Paroisse', render: (p: AdminPublicationModeration) => p.paroisseNom },
    { key: 'type', header: 'Type', render: (p: AdminPublicationModeration) => p.type },
    { key: 'date', header: 'Date', render: (p: AdminPublicationModeration) => p.datePublication || '—' },
    {
      key: 'visible',
      header: 'Visibilité',
      render: (p: AdminPublicationModeration) => (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${p.visible ? 'bg-teal-light text-teal-800' : 'bg-red-100 text-red-700'}`}>
          {p.visible ? 'Visible' : 'Masquée'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p: AdminPublicationModeration) => (
        <button
          type="button"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            void togglePublicationVisible(p.id, !p.visible);
          }}
          className="inline-flex items-center gap-1 text-purple text-sm font-medium min-h-touch px-2"
        >
          {p.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {p.visible ? 'Masquer' : 'Afficher'}
        </button>
      ),
    },
  ];

  const campagneColumns = [
    { key: 'nom', header: 'Campagne', render: (c: AdminCampagneModeration) => (
      <div>
        <span className="font-medium block">{c.nom}</span>
        <span className="text-xs text-gray-500 line-clamp-1">{c.description}</span>
      </div>
    ) },
    { key: 'paroisse', header: 'Paroisse', render: (c: AdminCampagneModeration) => c.paroisseNom },
    { key: 'objectif', header: 'Objectif', render: (c: AdminCampagneModeration) => formatFcfa(c.objectif) },
    { key: 'collecte', header: 'Collecté', render: (c: AdminCampagneModeration) => formatFcfa(c.collecte) },
    { key: 'fin', header: 'Fin', render: (c: AdminCampagneModeration) => c.dateFin || '—' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Modération"
        description="Supervisez les publications paroissiales et consultez les campagnes de collecte actives."
        badge={loading ? 'Chargement…' : undefined}
      />

      <div className="flex flex-wrap gap-2">
        {([
          { id: 'publications' as const, label: 'Publications' },
          { id: 'campagnes' as const, label: 'Campagnes' },
        ]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              'min-h-touch px-4 rounded-xl text-sm font-medium border transition-colors',
              tab === t.id ? 'bg-purple text-white border-purple' : 'bg-white text-gray-600 border-gray-200',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'publications' ? (
        <>
          <div className="flex flex-wrap gap-2">
            {visibilityFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setVisibilityFilter(f.id)}
                className={[
                  'min-h-touch px-3 rounded-xl text-sm border',
                  visibilityFilter === f.id ? 'bg-purple-light text-purple border-purple/30' : 'bg-white text-gray-600 border-gray-200',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>
          {loading && publications.length === 0 ? (
            <AdminListSkeleton rows={4} />
          ) : (
            <DataTable columns={publicationColumns} data={publications} emptyMessage="Aucune publication à modérer." />
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Vue de supervision en lecture seule. Les campagnes sont gérées par chaque paroisse.
          </p>
          {loading && campagnes.length === 0 ? (
            <AdminListSkeleton rows={4} />
          ) : (
            <DataTable columns={campagneColumns} data={campagnes} emptyMessage="Aucune campagne enregistrée." />
          )}
        </>
      )}
    </div>
  );
}
