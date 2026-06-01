import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';

interface FormData {
  commentaire: string;
}

interface ValidateParishModalProps {
  open: boolean;
  onClose: () => void;
  onValidate: (action: 'valider' | 'refuser', commentaire: string) => Promise<void>;
  loading?: boolean;
  parishName?: string;
}

export function ValidateParishModal({ open, onClose, onValidate, loading, parishName }: ValidateParishModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Validation d'inscription" size="md">
      <form className="space-y-4">
        {parishName ? (
          <p className="text-sm text-gray-600">
            Dossier de la paroisse <strong className="text-gray-900">{parishName}</strong>
          </p>
        ) : null}
        <p className="text-sm text-gray-500">
          En validant, la paroisse devient visible sur MesseConnect. En cas de refus, indiquez un motif (documents manquants, diocèse incorrect, etc.).
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commentaire <span className="text-gray-400 font-normal">(obligatoire en cas de refus)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Ex. : Dossier complet, paroisse rattachée au diocèse de Ouagadougou."
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            {...register('commentaire')}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit((d) => {
              if (!d.commentaire?.trim()) {
                void onValidate('refuser', 'Inscription refusée par l\'administrateur.');
                return;
              }
              void onValidate('refuser', d.commentaire.trim());
            })}
            className="flex-1 min-h-touch rounded-xl border border-red-200 text-red-600 font-medium text-sm disabled:opacity-60"
          >
            Refuser l&apos;inscription
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit((d) => void onValidate('valider', d.commentaire?.trim() ?? 'Paroisse validée.'))}
            className="flex-1 min-h-touch rounded-xl bg-teal text-white font-medium text-sm disabled:opacity-60"
          >
            {loading ? 'Traitement…' : 'Valider la paroisse'}
          </button>
        </div>
        {errors.commentaire ? (
          <p className="text-xs text-red-600">{errors.commentaire.message}</p>
        ) : null}
      </form>
    </Modal>
  );
}
