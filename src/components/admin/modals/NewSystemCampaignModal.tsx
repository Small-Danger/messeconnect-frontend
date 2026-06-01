import { useForm } from 'react-hook-form';
import { Modal } from '../../modals/Modal';
import { FormInput } from '../../forms/FormInput';
import type { SystemCampagne } from '../../../services/mockAdminApi/data';

interface FormData {
  titre: string;
  description: string;
  objectif: number;
  image: string;
  dateDebut: string;
  dateFin: string;
}

interface NewSystemCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<SystemCampagne, 'id' | 'collecte'>) => Promise<void>;
}

export function NewSystemCampaignModal({ open, onClose, onSave }: NewSystemCampaignModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await onSave({ ...data, objectif: Number(data.objectif) });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle campagne système" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Titre" error={errors.titre} {...register('titre', { required: true })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" {...register('description', { required: true })} />
        </div>
        <FormInput label="Objectif (FCFA)" type="number" error={errors.objectif} {...register('objectif', { required: true, min: 1 })} />
        <FormInput label="URL image" error={errors.image} {...register('image')} />
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Date début" type="date" {...register('dateDebut', { required: true })} />
          <FormInput label="Date fin" type="date" {...register('dateFin', { required: true })} />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full min-h-touch rounded-xl bg-purple text-white font-medium">
          Créer la campagne
        </button>
      </form>
    </Modal>
  );
}
