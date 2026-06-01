import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { FormInput } from '../forms/FormInput';
import type { MockUser } from '../../services/mockApi/data';

interface FideleProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  user: MockUser;
  onSave: (data: Partial<Pick<MockUser, 'nom' | 'prenom' | 'email' | 'telephone'>>) => Promise<void>;
}

export function FideleProfileEditModal({ open, onClose, user, onSave }: FideleProfileEditModalProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="Modifier mon profil" size="md">
      <form
        onSubmit={handleSubmit(async (data) => {
          await onSave(data);
          onClose();
        })}
        className="space-y-4"
      >
        <FormInput label="Prénom" {...register('prenom', { required: true })} />
        <FormInput label="Nom" {...register('nom', { required: true })} />
        <FormInput label="Email" type="email" {...register('email', { required: true })} />
        <FormInput label="Téléphone" {...register('telephone')} />
        <button type="submit" disabled={isSubmitting} className="w-full min-h-touch rounded-xl bg-teal text-white font-medium">
          Enregistrer
        </button>
      </form>
    </Modal>
  );
}
