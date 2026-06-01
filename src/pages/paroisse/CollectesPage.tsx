import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HeartHandshake, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SafeImage } from '../../components/common/SafeImage';
import { CardSkeleton } from '../../components/common/CardSkeleton';
import { CampagneDonsModal } from '../../components/paroisse/CampagneDonsModal';
import { NewCampaignModal } from '../../components/modals/NewCampaignModal';
import { Modal } from '../../components/modals/Modal';
import type { CampagneParoisse } from '../../services/mockApi/paroisse/data';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import { formatFcfa } from '../../utils/formatCurrency';

function formatDateLabel(value: string) {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'd MMM yyyy', { locale: fr });
  } catch {
    return value;
  }
}

export default function CollectesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampagne, setEditingCampagne] = useState<CampagneParoisse | null>(null);
  const [deleteCampagneId, setDeleteCampagneId] = useState<string | null>(null);
  const [donsCampagne, setDonsCampagne] = useState<CampagneParoisse | null>(null);

  const {
    campagnes,
    loadPublicationsAndCampaigns,
    addCampagne,
    updateCampagne,
    deleteCampagne,
  } = useParoisseAppStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void loadPublicationsAndCampaigns().finally(() => setLoading(false));
  }, [loadPublicationsAndCampaigns]);

  const handleSave = async (data: Omit<CampagneParoisse, 'id' | 'collecte'>) => {
    if (editingCampagne) {
      await updateCampagne(editingCampagne.id, data);
    } else {
      await addCampagne(data);
    }
    setEditingCampagne(null);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Collectes</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {campagnes.length} campagne{campagnes.length > 1 ? 's' : ''} · visible par les fidèles
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingCampagne(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 min-h-touch px-3 rounded-lg bg-teal text-white text-sm font-medium shrink-0"
        >
          <Plus className="h-4 w-4" /> Nouvelle
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : campagnes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
          <HeartHandshake className="mx-auto h-7 w-7 text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-700">Aucune campagne</p>
          <p className="mt-1 text-xs text-gray-500">Lancez une collecte pour vos projets paroissiaux.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {campagnes.map((c) => {
            const pct = c.objectif > 0 ? Math.min(100, Math.round((c.collecte / c.objectif) * 100)) : 0;

            return (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                {c.image ? (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                    <SafeImage src={c.image} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-teal-light/40">
                    <HeartHandshake className="h-6 w-6 text-teal" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.titre}</p>
                    <span className="text-xs font-semibold text-teal shrink-0">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-amber rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatFcfa(c.collecte)} / {formatFcfa(c.objectif)}
                    {c.dateFin ? ` · jusqu'au ${formatDateLabel(c.dateFin)}` : ''}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setDonsCampagne(c)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-teal-light/60 hover:text-teal"
                    aria-label="Voir les dons"
                  >
                    <Users className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCampagne(c);
                      setModalOpen(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-teal"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCampagneId(c.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <NewCampaignModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCampagne(null);
        }}
        campagne={editingCampagne}
        onSave={handleSave}
      />

      <CampagneDonsModal
        open={!!donsCampagne}
        onClose={() => setDonsCampagne(null)}
        campagne={donsCampagne}
      />

      <Modal
        open={!!deleteCampagneId}
        onClose={() => setDeleteCampagneId(null)}
        title="Supprimer la campagne ?"
        size="sm"
      >
        <p className="text-sm text-gray-600">Cette action est définitive. Les dons déjà enregistrés ne seront pas remboursés.</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setDeleteCampagneId(null)}
            className="flex-1 min-h-touch rounded-xl border border-gray-200 text-sm font-medium text-gray-700"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              if (!deleteCampagneId) return;
              void deleteCampagne(deleteCampagneId).then(() => setDeleteCampagneId(null));
            }}
            className="flex-1 min-h-touch rounded-xl bg-red-600 text-white text-sm font-medium"
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}
