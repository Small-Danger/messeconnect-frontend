import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';

interface FormData {
  message: string;
  statut: string;
}

interface ReplyTicketModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (message: string, statut: string) => Promise<void>;
  loading?: boolean;
}

export function ReplyTicketModal({ open, onClose, onConfirm, loading }: ReplyTicketModalProps) {
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { statut: 'en_cours' } });

  const onSubmit = async (data: FormData) => {
    await onConfirm(data.message, data.statut);
  };

  return (
    <Modal open={open} onClose={onClose} title="Répondre au ticket" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Réponse</label>
          <textarea rows={5} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" {...register('message', { required: true })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pièce jointe</label>
          <input type="file" className="w-full text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Changer statut</label>
          <select className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('statut')}>
            <option value="ouvert">Ouvert</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full min-h-touch rounded-xl bg-purple text-white font-medium">
          {loading ? 'Envoi...' : 'Envoyer la réponse'}
        </button>
      </form>
    </Modal>
  );
}
