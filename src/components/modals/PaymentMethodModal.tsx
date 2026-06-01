import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { FormInput } from '../forms/FormInput';
import { PaymentMethodBadge } from '../payment/PaymentMethodBadge';
import type { MoyenPaiementParoisse } from '../../services/mockApi/paroisse/data';

const types = [
  { id: 'orange', label: 'Orange Money' },
  { id: 'moov', label: 'Moov Money' },
  { id: 'wave', label: 'Wave' },
  { id: 'especes', label: 'Espèces' },
] as const;

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  method?: MoyenPaiementParoisse | null;
  onSave: (data: Omit<MoyenPaiementParoisse, 'id'>) => Promise<void>;
}

export function PaymentMethodModal({ open, onClose, method, onSave }: PaymentMethodModalProps) {
  const isEdit = !!method;
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<Omit<MoyenPaiementParoisse, 'id'>>({
    defaultValues: { type: 'orange', actif: true, numero: '', nomCompte: '' },
  });
  const selectedType = watch('type');

  useEffect(() => {
    if (!open) return;
    reset(
      method
        ? {
            type: method.type,
            numero: method.numero,
            nomCompte: method.nomCompte,
            actif: method.actif,
          }
        : { type: 'orange', actif: true, numero: '', nomCompte: '' },
    );
  }, [open, method, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier le moyen de paiement' : 'Ajouter un moyen de paiement'}
      size="md"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          await onSave(data);
          onClose();
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-2">
          {types.map((t) => (
            <label
              key={t.id}
              className={[
                'flex items-center gap-2 p-3 rounded-xl border cursor-pointer min-h-touch',
                selectedType === t.id ? 'border-teal bg-teal-light' : 'border-gray-200',
              ].join(' ')}
            >
              <input type="radio" value={t.id} {...register('type')} className="sr-only" />
              <PaymentMethodBadge id={t.id} size="sm" />
              <span className="text-sm font-medium">{t.label}</span>
            </label>
          ))}
        </div>
        <FormInput label="Numéro / Référence" {...register('numero', { required: true })} />
        <FormInput label="Nom du compte" {...register('nomCompte', { required: true })} />
        <label className="flex items-center justify-between min-h-touch rounded-xl border border-gray-200 px-4">
          <span className="text-sm">Actif</span>
          <input type="checkbox" {...register('actif')} className="h-5 w-5 rounded text-teal" />
        </label>
        <button type="submit" disabled={isSubmitting} className="w-full min-h-touch rounded-xl bg-teal text-white font-medium">
          {isEdit ? 'Enregistrer' : 'Ajouter'}
        </button>
      </form>
    </Modal>
  );
}
