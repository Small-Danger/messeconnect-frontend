import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatFcfa } from '../../utils/formatCurrency';
import { OfferingTypeModal } from '../modals/OfferingTypeModal';
import { Modal } from '../modals/Modal';
import type { TypeOffrandeParoisse } from '../../services/mockApi/paroisse/data';

interface OfferingsCardProps {
  offerings: TypeOffrandeParoisse[];
  onAdd: (data: Omit<TypeOffrandeParoisse, 'id' | 'actif'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<Omit<TypeOffrandeParoisse, 'id'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function OfferingsCard({ offerings, onAdd, onUpdate, onDelete }: OfferingsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TypeOffrandeParoisse | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <>
      <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Types d&apos;offrandes</h3>
          <button type="button" onClick={() => setModalOpen(true)} className="flex items-center gap-1 text-sm text-teal font-medium min-h-touch px-2">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
        <ul className="space-y-2">
          {offerings.map((o) => (
            <li key={o.id} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 text-sm">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-900">{o.nom}</span>
                {!o.actif ? (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">Inactif</span>
                ) : null}
              </div>
              <span className="text-teal font-medium shrink-0">{formatFcfa(o.montantConseille)}</span>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditing(o)}
                  className="p-2 rounded-lg text-gray-500 hover:text-teal hover:bg-teal-light/50 min-h-touch min-w-touch"
                  aria-label={`Modifier ${o.nom}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(o.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 min-h-touch min-w-touch"
                  aria-label={`Supprimer ${o.nom}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <OfferingTypeModal
        open={modalOpen || !!editing}
        offering={editing}
        onClose={closeModal}
        onSave={async (data) => {
          if (editing) await onUpdate(editing.id, data);
          else await onAdd({ nom: data.nom, montantConseille: data.montantConseille, description: data.description });
        }}
      />

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Supprimer ce type d'offrande ?"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Ce type ne sera plus proposé aux fidèles. Les demandes existantes ne sont pas affectées.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setDeleteId(null)}
            className="flex-1 min-h-touch rounded-xl border border-gray-200 text-sm font-medium text-gray-700"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              if (!deleteId) return;
              void onDelete(deleteId).then(() => setDeleteId(null));
            }}
            className="flex-1 min-h-touch rounded-xl bg-red-600 text-white text-sm font-medium"
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </>
  );
}
