import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Drawer } from './Drawer';
import { FormInput } from '../forms/FormInput';
import { FormSelect } from '../forms/FormSelect';
import { PhoneInputBF } from '../forms/PhoneInputBF';
import type { CreneauIntentions } from '../../types/paroisseIntentions';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

interface NewIntentionForm {
  messe_id: string;
  type_offrande_id: string;
  nom_demandeur: string;
  telephone_demandeur: string;
  intention: string;
  montant: number;
  est_anonyme: boolean;
  moyen_paiement_id: string;
  paiement_recu: boolean;
}

const moyenLabels: Record<string, string> = {
  especes: 'Espèces au secrétariat',
  orange: 'Orange Money',
  moov: 'Moov Money',
  wave: 'Wave',
};

interface NewIntentionDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NewIntentionDrawer({ open, onClose }: NewIntentionDrawerProps) {
  const {
    planningCreneaux,
    moyensPaiement,
    typesOffrandes,
    loadPaymentAndOfferings,
    createGuichetIntention,
  } = useParoisseAppStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<NewIntentionForm>({
    defaultValues: {
      est_anonyme: false,
      paiement_recu: true,
      montant: 5000,
    },
  });

  const estAnonyme = watch('est_anonyme');
  const selectedMoyenId = watch('moyen_paiement_id');
  const selectedMoyen = moyensPaiement.find((m) => m.id === selectedMoyenId);
  const isEspeces = selectedMoyen?.type === 'especes';

  useEffect(() => {
    if (open) {
      void loadPaymentAndOfferings();
      reset({
        messe_id: planningCreneaux[0]?.id ?? '',
        type_offrande_id: typesOffrandes[0]?.id ?? '',
        moyen_paiement_id: moyensPaiement.find((m) => m.type === 'especes')?.id ?? moyensPaiement[0]?.id ?? '',
        nom_demandeur: '',
        telephone_demandeur: '',
        intention: '',
        montant: typesOffrandes[0]?.montantConseille ?? 5000,
        est_anonyme: false,
        paiement_recu: true,
      });
    }
  }, [open, loadPaymentAndOfferings, planningCreneaux, typesOffrandes, moyensPaiement, reset]);

  const onSubmit = async (data: NewIntentionForm) => {
    await createGuichetIntention({
      messe_id: data.messe_id,
      type_offrande_id: data.type_offrande_id,
      nom_demandeur: data.est_anonyme ? undefined : data.nom_demandeur,
      telephone_demandeur: data.telephone_demandeur,
      intention: data.intention,
      montant: Number(data.montant),
      est_anonyme: data.est_anonyme,
      moyen_paiement_id: data.moyen_paiement_id,
      paiement_recu: data.paiement_recu,
    });
    onClose();
  };

  const creneauOptions = planningCreneaux.map((c: CreneauIntentions) => ({
    value: c.id,
    label: `${c.titre} — ${c.date} ${c.heure.slice(0, 5)}`,
  }));

  return (
    <Drawer open={open} onClose={onClose} title="Nouvelle intention">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-500">
          Enregistrement au guichet — l&apos;intention rejoint le même planning que les demandes en ligne.
        </p>

        <FormSelect
          label="Créneau de messe *"
          options={creneauOptions}
          error={errors.messe_id}
          {...register('messe_id', { required: 'Choisissez un créneau' })}
        />

        <FormSelect
          label="Type d'offrande *"
          options={typesOffrandes.map((t) => ({ value: t.id, label: t.nom }))}
          error={errors.type_offrande_id}
          {...register('type_offrande_id', { required: 'Type requis' })}
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="rounded border-gray-300" {...register('est_anonyme')} />
          Demande anonyme
        </label>

        {!estAnonyme ? (
          <FormInput
            label="Nom du fidèle *"
            error={errors.nom_demandeur}
            {...register('nom_demandeur', { required: estAnonyme ? false : 'Nom requis' })}
          />
        ) : null}

        <PhoneInputBF
          label="Téléphone *"
          error={errors.telephone_demandeur}
          {...register('telephone_demandeur', { required: 'Téléphone requis' })}
        />

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Intention *</span>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            {...register('intention', { required: 'Intention requise' })}
          />
          {errors.intention ? (
            <span className="text-xs text-red-600">{errors.intention.message}</span>
          ) : null}
        </label>

        <FormInput
          label="Montant (FCFA) *"
          type="number"
          min={1}
          error={errors.montant}
          {...register('montant', { required: 'Montant requis', min: 1, valueAsNumber: true })}
        />

        <FormSelect
          label="Mode de paiement *"
          options={moyensPaiement
            .filter((m) => m.actif)
            .map((m) => ({ value: m.id, label: moyenLabels[m.type] ?? m.type }))}
          error={errors.moyen_paiement_id}
          {...register('moyen_paiement_id', { required: 'Mode requis' })}
        />

        {isEspeces ? (
          <label className="flex items-center gap-2 rounded-xl bg-amber-light/40 border border-amber-light px-3 py-3 text-sm text-amber-dark">
            <input
              type="checkbox"
              className="rounded border-amber-dark/30"
              {...register('paiement_recu')}
            />
            Paiement espèces reçu maintenant
            <span className="block text-xs text-amber-dark/80 w-full mt-1 pl-6">
              Décoché = réservation en attente dans l&apos;onglet « Espèces »
            </span>
          </label>
        ) : (
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" defaultChecked {...register('paiement_recu')} />
            Paiement reçu et confirmé
          </label>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-touch rounded-xl bg-teal-900 text-white font-semibold disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer l\'intention'}
        </button>
      </form>
    </Drawer>
  );
}
