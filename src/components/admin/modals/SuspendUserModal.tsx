import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';

interface FormData {
  motif: string;
  duree: string;
}

interface SuspendUserModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (motif: string, duree: string) => Promise<void>;
  loading?: boolean;
  userName?: string;
}

export function SuspendUserModal({ open, onClose, onConfirm, loading, userName }: SuspendUserModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await onConfirm(data.motif, data.duree);
  };

  return (
    <Modal open={open} onClose={onClose} title="Suspendre l'utilisateur" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {userName ? <p className="text-sm text-gray-600">Utilisateur : <strong>{userName}</strong></p> : null}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motif *</label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            {...register('motif', { required: 'Motif obligatoire' })}
          />
          {errors.motif ? <p className="text-xs text-red-600 mt-1">{errors.motif.message}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durée suspension</label>
          <select className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('duree', { required: true })}>
            <option value="7 jours">7 jours</option>
            <option value="30 jours">30 jours</option>
            <option value="90 jours">90 jours</option>
            <option value="Indéfinie">Indéfinie</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 min-h-touch rounded-xl border border-gray-200 text-gray-700 font-medium">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="flex-1 min-h-touch rounded-xl bg-red-600 text-white font-medium">
            {loading ? 'Suspension...' : 'Confirmer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
