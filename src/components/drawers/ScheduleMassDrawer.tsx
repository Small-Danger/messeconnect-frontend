import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Drawer } from '../drawers/Drawer';
import { FormInput } from '../forms/FormInput';
import { useCalendarStore } from '../../stores/calendarStore';

type ScheduleMode = 'ponctuelle' | 'recurrente';

interface SingleForm {
  titre: string;
  date: string;
  heure: string;
  pretre: string;
  lieu: string;
}

interface RecurringForm {
  titre: string;
  jour_semaine: string;
  heure: string;
  semaines: number;
  capacite_max: number;
  pretre: string;
  lieu: string;
}

const JOURS_SEMAINE = [
  { value: '0', label: 'Dimanche' },
  { value: '1', label: 'Lundi' },
  { value: '2', label: 'Mardi' },
  { value: '3', label: 'Mercredi' },
  { value: '4', label: 'Jeudi' },
  { value: '5', label: 'Vendredi' },
  { value: '6', label: 'Samedi' },
];

export function ScheduleMassDrawer() {
  const { scheduleDrawerOpen, closeScheduleDrawer, scheduleMesse, scheduleRecurringMesses } = useCalendarStore();
  const [mode, setMode] = useState<ScheduleMode>('ponctuelle');
  const [error, setError] = useState<string | null>(null);

  const singleForm = useForm<SingleForm>({
    defaultValues: { titre: 'Messe', lieu: 'Église principale' },
  });

  const recurringForm = useForm<RecurringForm>({
    defaultValues: {
      titre: 'Messe dominicale',
      jour_semaine: '0',
      heure: '09:00',
      semaines: 8,
      capacite_max: 20,
      lieu: 'Église principale',
    },
  });

  const onSubmitSingle = async (data: SingleForm) => {
    setError(null);
    try {
      await scheduleMesse(data);
      singleForm.reset({ titre: 'Messe', lieu: 'Église principale' });
    } catch {
      setError('Impossible de programmer cette messe.');
    }
  };

  const onSubmitRecurring = async (data: RecurringForm) => {
    setError(null);
    try {
      await scheduleRecurringMesses({
        titre: data.titre,
        jour_semaine: Number(data.jour_semaine),
        heure: data.heure,
        semaines: data.semaines,
        capacite_max: data.capacite_max > 0 ? data.capacite_max : undefined,
        pretre: data.pretre || undefined,
        lieu: data.lieu || undefined,
      });
      recurringForm.reset({
        titre: 'Messe dominicale',
        jour_semaine: data.jour_semaine,
        heure: data.heure,
        semaines: data.semaines,
        capacite_max: data.capacite_max,
        lieu: data.lieu,
      });
    } catch {
      setError('Impossible de générer les messes récurrentes.');
    }
  };

  const handleClose = () => {
    setError(null);
    closeScheduleDrawer();
  };

  return (
    <Drawer open={scheduleDrawerOpen} onClose={handleClose} title="Programmer une messe">
      <div className="space-y-4">
        <div className="flex rounded-xl bg-gray-100 p-1">
          {([
            { id: 'ponctuelle' as const, label: 'Ponctuelle' },
            { id: 'recurrente' as const, label: 'Récurrente' },
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMode(tab.id);
                setError(null);
              }}
              className={[
                'flex-1 min-h-touch rounded-lg text-sm font-medium transition-colors',
                mode === tab.id ? 'bg-white text-teal shadow-sm' : 'text-gray-600',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === 'ponctuelle' ? (
          <form onSubmit={singleForm.handleSubmit(onSubmitSingle)} className="space-y-4">
            <p className="text-sm text-gray-500">Crée une messe à une date précise (exception, fête, obsèques…).</p>
            <FormInput label="Titre" {...singleForm.register('titre', { required: true })} />
            <FormInput label="Date" type="date" {...singleForm.register('date', { required: true })} />
            <FormInput label="Heure" type="time" {...singleForm.register('heure', { required: true })} />
            <FormInput label="Prêtre" {...singleForm.register('pretre', { required: true })} />
            <FormInput label="Lieu" {...singleForm.register('lieu', { required: true })} />
            <button
              type="submit"
              disabled={singleForm.formState.isSubmitting}
              className="w-full min-h-touch rounded-xl bg-teal text-white font-medium active:scale-95 disabled:opacity-60"
            >
              {singleForm.formState.isSubmitting ? 'Programmation…' : 'Programmer'}
            </button>
          </form>
        ) : (
          <form onSubmit={recurringForm.handleSubmit(onSubmitRecurring)} className="space-y-4">
            <p className="text-sm text-gray-500">
              Génère automatiquement les messes chaque semaine sur le jour choisi (ex. tous les dimanches pendant 8 semaines).
            </p>
            <FormInput label="Titre" {...recurringForm.register('titre', { required: true })} />
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">Jour de la semaine</span>
              <select
                className="min-h-touch w-full rounded-xl border border-gray-200 px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                {...recurringForm.register('jour_semaine', { required: true })}
              >
                {JOURS_SEMAINE.map((j) => (
                  <option key={j.value} value={j.value}>{j.label}</option>
                ))}
              </select>
            </label>
            <FormInput label="Heure" type="time" {...recurringForm.register('heure', { required: true })} />
            <FormInput
              label="Nombre de semaines à générer"
              type="number"
              min={1}
              max={52}
              {...recurringForm.register('semaines', { required: true, valueAsNumber: true, min: 1, max: 52 })}
            />
            <FormInput
              label="Capacité d'intentions (max)"
              type="number"
              min={1}
              {...recurringForm.register('capacite_max', { valueAsNumber: true, min: 1 })}
            />
            <FormInput label="Prêtre (optionnel)" {...recurringForm.register('pretre')} />
            <FormInput label="Lieu" {...recurringForm.register('lieu')} />
            <button
              type="submit"
              disabled={recurringForm.formState.isSubmitting}
              className="w-full min-h-touch rounded-xl bg-amber text-white font-medium active:scale-95 disabled:opacity-60"
            >
              {recurringForm.formState.isSubmitting ? 'Génération…' : 'Générer les messes'}
            </button>
          </form>
        )}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
      </div>
    </Drawer>
  );
}
