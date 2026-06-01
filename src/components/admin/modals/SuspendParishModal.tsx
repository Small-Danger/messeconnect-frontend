import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';

interface FormData {
  commentaire: string;
}

interface SuspendParishModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (commentaire: string) => Promise<void>;
  onReactivate?: (commentaire: string) => Promise<void>;
  loading?: boolean;
  parishName?: string;
  mode: 'suspendre' | 'reactiver';
}

export function SuspendParishModal({
  open,
  onClose,
  onConfirm,
  onReactivate,
  loading,
  parishName,
  mode,
}: SuspendParishModalProps) {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (mode === 'reactiver' && onReactivate) {
      await onReactivate(data.commentaire);
    } else {
      await onConfirm(data.commentaire);
    }
  };

  const isSuspend = mode === 'suspendre';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isSuspend ? 'Suspendre la paroisse' : 'Réactiver la paroisse'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {parishName ? (
          <p className="text-sm text-gray-600">
            Paroisse : <strong>{parishName}</strong>
          </p>
        ) : null}
        <p className="text-sm text-gray-600">
          {isSuspend
            ? 'La paroisse ne pourra plus accéder à son espace tant qu\'elle est suspendue.'
            : 'La paroisse retrouvera l\'accès à son espace après réactivation.'}
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isSuspend ? 'Motif / commentaire *' : 'Commentaire (optionnel)'}
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            {...register('commentaire', { required: isSuspend })}
          />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 min-h-touch rounded-xl border border-gray-200 text-gray-700 font-medium">
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={[
              'flex-1 min-h-touch rounded-xl text-white font-medium',
              isSuspend ? 'bg-red-600' : 'bg-teal',
            ].join(' ')}
          >
            {loading ? 'Traitement…' : isSuspend ? 'Suspendre' : 'Réactiver'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
