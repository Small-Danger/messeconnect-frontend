import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';
import { FormInput } from '../../forms/FormInput';
import type { SystemAnnonce } from '../../../services/mockAdminApi/data';

interface FormData {
  titre: string;
  contenu: string;
  datePublication: string;
  dateExpiration: string;
  priorite: SystemAnnonce['priorite'];
}

interface NewAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<SystemAnnonce, 'id' | 'actif'>) => Promise<void>;
}

export function NewAnnouncementModal({ open, onClose, onSave }: NewAnnouncementModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await onSave(data);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle annonce système" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Titre" error={errors.titre} {...register('titre', { required: 'Titre requis' })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            {...register('contenu', { required: 'Contenu requis' })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Date publication" type="date" error={errors.datePublication} {...register('datePublication', { required: true })} />
          <FormInput label="Date expiration" type="date" error={errors.dateExpiration} {...register('dateExpiration', { required: true })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
          <select className="w-full min-h-touch rounded-xl border border-gray-200 px-3 text-sm" {...register('priorite')}>
            <option value="info">Info</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full min-h-touch rounded-xl bg-purple text-white font-medium">
          Publier
        </button>
      </form>
    </Modal>
  );
}
