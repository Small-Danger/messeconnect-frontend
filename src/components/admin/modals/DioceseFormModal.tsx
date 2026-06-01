import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';
import type { AdminDiocese } from '../../../services/mockAdminApi/data';

interface FormData {
  nom: string;
  ville: string;
  pays: string;
  description: string;
  actif: boolean;
}

interface DioceseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  initial?: AdminDiocese | null;
}

export function DioceseFormModal({ open, onClose, onSubmit, loading, initial }: DioceseFormModalProps) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { nom: '', ville: '', pays: 'Burkina Faso', description: '', actif: true },
  });

  useEffect(() => {
    if (open) {
      reset({
        nom: initial?.nom ?? '',
        ville: initial?.ville ?? '',
        pays: initial?.pays ?? 'Burkina Faso',
        description: initial?.description ?? '',
        actif: initial?.actif ?? true,
      });
    }
  }, [open, initial, reset]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Modifier le diocèse' : 'Nouveau diocèse'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Nom *">
          <input className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('nom', { required: true })} />
        </Field>
        <Field label="Ville">
          <input className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('ville')} />
        </Field>
        <Field label="Pays">
          <input className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('pays')} />
        </Field>
        <Field label="Description">
          <textarea rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" {...register('description')} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('actif')} />
          Diocèse actif
        </label>
        <button type="submit" disabled={loading} className="w-full min-h-touch rounded-xl bg-purple text-white font-medium">
          {loading ? 'Enregistrement…' : initial ? 'Mettre à jour' : 'Créer le diocèse'}
        </button>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
