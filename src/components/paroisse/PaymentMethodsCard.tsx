import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PaymentMethodBadge } from '../payment/PaymentMethodBadge';
import { PaymentMethodModal } from '../modals/PaymentMethodModal';
import { Modal } from '../modals/Modal';
import type { MoyenPaiementParoisse } from '../../services/mockApi/paroisse/data';

const typeLabels: Record<MoyenPaiementParoisse['type'], string> = {
  orange: 'Orange Money',
  moov: 'Moov Money',
  wave: 'Wave',
  especes: 'Espèces',
};

interface PaymentMethodsCardProps {
  methods: MoyenPaiementParoisse[];
  onAdd: (data: Omit<MoyenPaiementParoisse, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<Omit<MoyenPaiementParoisse, 'id'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PaymentMethodsCard({ methods, onAdd, onUpdate, onDelete }: PaymentMethodsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MoyenPaiementParoisse | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <>
      <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Moyens de paiement</h3>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 text-sm text-teal font-medium min-h-touch px-2 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
        <ul className="space-y-2">
          {methods.map((m) => (
            <li key={m.id} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
              <PaymentMethodBadge id={m.type} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{typeLabels[m.type]}</p>
                <p className="text-xs text-gray-500 truncate">{m.numero}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${m.actif ? 'bg-teal-light text-teal-800' : 'bg-gray-200 text-gray-500'}`}>
                {m.actif ? 'Actif' : 'Inactif'}
              </span>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditing(m)}
                  className="p-2 rounded-lg text-gray-500 hover:text-teal hover:bg-teal-light/50 min-h-touch min-w-touch"
                  aria-label={`Modifier ${typeLabels[m.type]}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(m.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 min-h-touch min-w-touch"
                  aria-label={`Supprimer ${typeLabels[m.type]}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <PaymentMethodModal
        open={modalOpen || !!editing}
        method={editing}
        onClose={closeModal}
        onSave={async (data) => {
          if (editing) await onUpdate(editing.id, data);
          else await onAdd(data);
        }}
      />

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Supprimer ce moyen de paiement ?"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Les fidèles ne pourront plus utiliser ce moyen de paiement pour leurs demandes.
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
