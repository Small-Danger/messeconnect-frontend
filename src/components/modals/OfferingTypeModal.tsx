import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { FormInput } from '../forms/FormInput';
import { MoneyInput } from '../forms/MoneyInput';
import type { TypeOffrandeParoisse } from '../../services/mockApi/paroisse/data';

type OfferingFormValues = Omit<TypeOffrandeParoisse, 'id'>;

interface OfferingTypeModalProps {
  open: boolean;
  onClose: () => void;
  offering?: TypeOffrandeParoisse | null;
  onSave: (data: OfferingFormValues) => Promise<void>;
}

export function OfferingTypeModal({ open, onClose, offering, onSave }: OfferingTypeModalProps) {
  const isEdit = !!offering;
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<OfferingFormValues>({
    defaultValues: { nom: '', montantConseille: 5000, description: '', actif: true },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      offering
        ? {
            nom: offering.nom,
            montantConseille: offering.montantConseille,
            description: offering.description,
            actif: offering.actif,
          }
        : { nom: '', montantConseille: 5000, description: '', actif: true },
    );
  }, [open, offering, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier le type d\'offrande' : 'Ajouter un type d\'offrande'}
      size="md"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          await onSave({ ...data, montantConseille: Number(data.montantConseille) });
          onClose();
        })}
        className="space-y-4"
      >
        <FormInput label="Nom" {...register('nom', { required: true })} />
        <MoneyInput label="Montant conseillé (FCFA)" {...register('montantConseille', { required: true, valueAsNumber: true })} />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <textarea {...register('description')} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </label>
        {isEdit ? (
          <label className="flex items-center justify-between min-h-touch rounded-xl border border-gray-200 px-4">
            <span className="text-sm">Actif</span>
            <input type="checkbox" {...register('actif')} className="h-5 w-5 rounded text-teal" />
          </label>
        ) : null}
        <button type="submit" disabled={isSubmitting} className="w-full min-h-touch rounded-xl bg-teal text-white font-medium">
          {isEdit ? 'Enregistrer' : 'Ajouter'}
        </button>
      </form>
    </Modal>
  );
}
