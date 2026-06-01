import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';
import type { AdminAbonnement, AdminParish } from '../../../services/mockAdminApi/data';

interface FormData {
  paroisse_id: string;
  plan: string;
  montant: number;
  date_debut: string;
  date_fin: string;
  statut: string;
}

interface AbonnementFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  parishes: AdminParish[];
  initial?: AdminAbonnement | null;
}

export function AbonnementFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  parishes,
  initial,
}: AbonnementFormModalProps) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      paroisse_id: '',
      plan: 'standard',
      montant: 15000,
      date_debut: new Date().toISOString().slice(0, 10),
      date_fin: '',
      statut: 'actif',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        paroisse_id: initial?.paroisseId ?? parishes[0]?.id ?? '',
        plan: initial?.plan ?? 'standard',
        montant: initial?.montant ?? 15000,
        date_debut: initial?.dateDebut ?? new Date().toISOString().slice(0, 10),
        date_fin: initial?.dateFin ?? '',
        statut: initial?.statut ?? 'actif',
      });
    }
  }, [open, initial, parishes, reset]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Modifier l\'abonnement' : 'Nouvel abonnement'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paroisse *</label>
          <select className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('paroisse_id', { required: true })} disabled={!!initial}>
            {parishes.map((p) => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan *</label>
          <select className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('plan', { required: true })}>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="essentiel">Essentiel</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA) *</label>
          <input type="number" min={0} className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('montant', { required: true, valueAsNumber: true })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
            <input type="date" className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('date_debut', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <input type="date" className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('date_fin')} />
          </div>
        </div>
        {initial ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('statut')}>
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
              <option value="expire">Expiré</option>
            </select>
          </div>
        ) : null}
        <button type="submit" disabled={loading} className="w-full min-h-touch rounded-xl bg-purple text-white font-medium">
          {loading ? 'Enregistrement…' : initial ? 'Mettre à jour' : 'Créer l\'abonnement'}
        </button>
      </form>
    </Modal>
  );
}
