import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SafeImage } from '../../components/common/SafeImage';
import { CardSkeleton } from '../../components/common/CardSkeleton';
import { Modal } from '../../components/modals/Modal';
import { PublicationFormModal } from '../../components/modals/PublicationFormModal';
import type { PublicationParoisse } from '../../services/mockApi/paroisse/data';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

function excerpt(text: string, max = 72) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export default function MediaPage() {
  const [pubModalOpen, setPubModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<PublicationParoisse | null>(null);
  const [deletePubId, setDeletePubId] = useState<string | null>(null);

  const {
    publications,
    loadPublicationsAndCampaigns,
    addPublication,
    updatePublication,
    deletePublication,
  } = useParoisseAppStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void loadPublicationsAndCampaigns().finally(() => setLoading(false));
  }, [loadPublicationsAndCampaigns]);

  const handleSavePublication = async (data: Omit<PublicationParoisse, 'id'>) => {
    if (editingPublication) {
      await updatePublication(editingPublication.id, data);
    } else {
      await addPublication(data);
    }
    setEditingPublication(null);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Publications</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {publications.length} annonce{publications.length > 1 ? 's' : ''} · visible par les fidèles
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingPublication(null);
            setPubModalOpen(true);
          }}
          className="flex items-center gap-1.5 min-h-touch px-3 rounded-lg bg-teal text-white text-sm font-medium shrink-0"
        >
          <Plus className="h-4 w-4" /> Nouvelle
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : publications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
          <Newspaper className="mx-auto h-7 w-7 text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-700">Aucune publication</p>
          <p className="mt-1 text-xs text-gray-500">Créez votre première annonce avec texte et photos.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {publications.map((p) => {
            const images = p.images?.length ? p.images : p.image ? [p.image] : [];
            const cover = images[0];
            const extraCount = Math.max(0, images.length - 1);

            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                {cover ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                    <SafeImage src={cover} alt="" className="h-full w-full object-cover" />
                    {extraCount > 0 ? (
                      <span className="absolute bottom-0 right-0 rounded-tl-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        +{extraCount}
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-teal-light">
                    <Newspaper className="h-5 w-5 text-teal" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.titre}</p>
                  <p className="text-[11px] text-gray-400">
                    {format(parseISO(p.datePublication), 'd MMM yyyy', { locale: fr })}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">{excerpt(p.contenu)}</p>
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPublication(p);
                      setPubModalOpen(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-teal hover:bg-teal-light/60"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletePubId(p.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
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

      <PublicationFormModal
        open={pubModalOpen}
        onClose={() => {
          setPubModalOpen(false);
          setEditingPublication(null);
        }}
        publication={editingPublication}
        onSave={handleSavePublication}
      />

      <Modal open={!!deletePubId} onClose={() => setDeletePubId(null)} title="Supprimer la publication" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Cette action est définitive. La publication disparaîtra pour les fidèles.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDeletePubId(null)}
            className="flex-1 min-h-touch rounded-xl border border-gray-200 text-sm font-medium"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              if (!deletePubId) return;
              void deletePublication(deletePubId).then(() => setDeletePubId(null));
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
