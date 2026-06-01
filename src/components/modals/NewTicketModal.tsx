import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { FormInput } from '../forms/FormInput';

interface NewTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { titre: string; categorie: string; description: string }) => Promise<void>;
}

const categories: { value: string; label: string; hint: string }[] = [
  { value: 'Technique', label: 'Technique', hint: 'Bug, lenteur, page qui ne s\'affiche pas…' },
  { value: 'Paiement', label: 'Paiement', hint: 'Orange Money, Wave, Moov, espèces…' },
  { value: 'Formation', label: 'Formation', hint: 'Utiliser l\'application au secrétariat' },
  { value: 'Compte', label: 'Compte & accès', hint: 'Mot de passe, connexion, droits…' },
  { value: 'Autre', label: 'Autre', hint: 'Toute autre question MesseConnect' },
];

export function NewTicketModal({ open, onClose, onSave }: NewTicketModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<{ titre: string; categorie: string; description: string }>({
    defaultValues: { categorie: 'Technique', titre: '', description: '' },
  });

  const selectedCategory = watch('categorie');
  const categoryHint = categories.find((c) => c.value === selectedCategory)?.hint;

  useEffect(() => {
    if (!open) return;
    reset({ categorie: 'Technique', titre: '', description: '' });
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Contacter l'équipe MesseConnect" size="md">
      <p className="text-sm text-gray-600 -mt-2 mb-4">
        Décrivez votre problème le plus précisément possible. Ne pas utiliser ce formulaire pour les intentions de messe
        des fidèles.
      </p>
      <form
        onSubmit={handleSubmit(async (data) => {
          await onSave(data);
          onClose();
        })}
        className="space-y-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Type de demande</span>
          <select {...register('categorie')} className="min-h-touch w-full rounded-xl border border-gray-200 px-4 text-sm">
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {categoryHint ? <span className="text-xs text-gray-500">{categoryHint}</span> : null}
        </label>
        <FormInput
          label="Objet de votre demande"
          placeholder="Ex. : Les messes de juin ne s'affichent pas"
          {...register('titre', { required: true })}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Détails</span>
          <textarea
            {...register('description', { required: true })}
            rows={4}
            placeholder="Décrivez ce qui se passe, depuis quand, et ce que vous avez déjà essayé…"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
          />
        </label>
        <button type="submit" disabled={isSubmitting} className="w-full min-h-touch rounded-xl bg-teal text-white font-medium">
          {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>
      </form>
    </Modal>
  );
}
