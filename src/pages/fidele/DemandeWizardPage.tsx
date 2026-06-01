import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Church, Sparkles } from 'lucide-react';
import { MessePicker } from '../../components/demande/MessePicker';
import { FormInput } from '../../components/forms/FormInput';
import { MoneyInput } from '../../components/forms/MoneyInput';
import { StepIndicator } from '../../components/forms/StepIndicator';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { USE_MOCK_API } from '../../config/env';
import { montantsRapides, typesMesse } from '../../constants/fidele';
import { formatFcfa } from '../../utils/formatCurrency';
import { fideleService } from '../../services/fideleService';
import type { ApiTypeOffrande } from '../../services/api/mappers/fideleDemande';
import type { MockMesse } from '../../services/mockApi/data';
import { useAuthStore } from '../../stores/authStore';
import { useDemandeFlowStore } from '../../stores/demandeFlowStore';
import { useDemandeStore } from '../../stores/demandeStore';

const stepLabels = ['Type de messe', 'Intention & date', 'Offrande', 'Récapitulatif'];

interface DemandeNavState {
  messeId?: string;
}

export default function DemandeWizardPage() {
  const { paroisseId } = useParams<{ paroisseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const { step, draft, setStep, setDraft, setCurrentDemande, reset } = useDemandeStore();
  const { prefetchForParoisse } = useDemandeFlowStore();
  const [paroisseNom, setParoisseNom] = useState('');
  const [typesOffrandes, setTypesOffrandes] = useState<ApiTypeOffrande[]>([]);
  const [messes, setMesses] = useState<MockMesse[]>([]);
  const [loadingFlow, setLoadingFlow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!paroisseId) return;

    fideleService
      .getParoisse(paroisseId, token)
      .then((p) => {
        setParoisseNom(p.nom);
        setDraft({ paroisseId, paroisseNom: p.nom });
      })
      .catch(() => navigate('/paroisses', { replace: true }));

    if (USE_MOCK_API) return () => reset();

    const cachedMesses = useDemandeFlowStore.getState().messesByParoisse[paroisseId];
    const cachedTypes = useDemandeFlowStore.getState().typesByParoisse[paroisseId];
    if (cachedMesses?.length) setMesses(cachedMesses);
    if (cachedTypes?.length) setTypesOffrandes(cachedTypes);

    const needsFetch = !cachedMesses?.length || !cachedTypes?.length;
    if (needsFetch) setLoadingFlow(true);

    prefetchForParoisse(paroisseId, token).finally(() => {
      const store = useDemandeFlowStore.getState();
      setMesses(store.messesByParoisse[paroisseId] ?? []);
      setTypesOffrandes(store.typesByParoisse[paroisseId] ?? []);
      setLoadingFlow(false);
    });

    return () => reset();
  }, [paroisseId, setDraft, reset, token, navigate, prefetchForParoisse]);

  useEffect(() => {
    const messeId = (location.state as DemandeNavState | null)?.messeId;
    if (!messeId || !messes.length) return;

    const messe = messes.find((m) => m.id === messeId);
    if (!messe) return;

    setDraft({
      messeId: messe.id,
      date: messe.date,
      creneau: messe.heure,
    });
  }, [location.state, messes, setDraft]);

  const next = () => setStep(Math.min(step + 1, 4));
  const prev = () => setStep(Math.max(step - 1, 1));

  const submit = async () => {
    setSubmitting(true);
    try {
      const demande = await fideleService.createDemande(
        {
          paroisseId: draft.paroisseId!,
          paroisseNom: draft.paroisseNom ?? paroisseNom,
          typeMesse: draft.typeMesse ?? 'Intention',
          intention: draft.intention ?? '',
          date: draft.date ?? '2026-06-01',
          creneau: draft.creneau ?? '09:00',
          montant: draft.montant ?? 5000,
          estAnonyme: draft.estAnonyme ?? false,
          messeId: draft.messeId,
          typeOffrandeId: draft.typeOffrandeId,
        },
        token,
      );
      setCurrentDemande(demande);
      navigate(`/paiement/${demande.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = USE_MOCK_API
    ? typesMesse.map((nom) => ({ id: nom, nom, montant_propose: undefined as number | undefined }))
    : typesOffrandes;

  const showMesseLoading = !USE_MOCK_API && loadingFlow && messes.length === 0;

  return (
    <MobileLayout showBottomNav={false} header={<PageHeader title="Demande de messe" backTo={`/paroisses/${paroisseId}`} />}>
      <div className="px-4 py-4">
        {(draft.paroisseNom ?? paroisseNom) ? (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-teal/10 bg-teal-light/70 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white">
              <Church className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-teal-800/70">Paroisse</p>
              <p className="truncate font-semibold text-teal-900">{draft.paroisseNom ?? paroisseNom}</p>
            </div>
          </div>
        ) : null}

        <StepIndicator current={step} labels={stepLabels} />

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {typeOptions.map((type) => {
              const selected = draft.typeOffrandeId === String(type.id) || draft.typeMesse === type.nom;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setDraft({
                      typeMesse: type.nom,
                      typeOffrandeId: String(type.id),
                      montant: type.montant_propose ? Number(type.montant_propose) : draft.montant,
                    });
                    next();
                  }}
                  className={[
                    'min-h-[5.5rem] rounded-2xl border p-4 text-left transition-all active:scale-95',
                    selected
                      ? 'border-teal bg-teal-light text-teal-900 shadow-sm ring-2 ring-teal/15'
                      : 'border-gray-100 bg-white text-gray-700 shadow-sm',
                  ].join(' ')}
                >
                  <Sparkles className={`mb-2 h-4 w-4 ${selected ? 'text-teal' : 'text-gray-400'}`} />
                  <span className="block text-sm font-semibold leading-snug">{type.nom}</span>
                  {type.montant_propose ? (
                    <span className="mt-1 block text-xs text-gray-500">dès {formatFcfa(Number(type.montant_propose))}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <FormInput
              label="Intention"
              value={draft.intention ?? ''}
              onChange={(e) => setDraft({ intention: e.target.value })}
              placeholder="Ex : Action de grâce pour ma famille"
            />

            {USE_MOCK_API ? (
              <>
                <FormInput
                  label="Date souhaitée"
                  type="date"
                  value={draft.date ?? ''}
                  onChange={(e) => setDraft({ date: e.target.value })}
                />
                <FormInput
                  label="Créneau horaire"
                  type="time"
                  value={draft.creneau ?? ''}
                  onChange={(e) => setDraft({ creneau: e.target.value })}
                />
                <FormInput
                  label="Prêtre souhaité (optionnel)"
                  value={draft.pretre ?? ''}
                  onChange={(e) => setDraft({ pretre: e.target.value })}
                />
              </>
            ) : (
              <MessePicker
                messes={messes}
                loading={showMesseLoading}
                selectedMesseId={draft.messeId}
                onSelect={(messe) =>
                  setDraft({
                    messeId: messe.id,
                    date: messe.date,
                    creneau: messe.heure,
                  })
                }
              />
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={prev} className="flex-1 min-h-touch rounded-xl border border-gray-200 bg-white font-medium active:scale-95">
                Retour
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!USE_MOCK_API && !draft.messeId}
                className="flex-1 min-h-touch rounded-xl bg-teal text-white font-semibold active:scale-95 disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Choisissez un montant d&apos;offrande</p>
            <div className="grid grid-cols-3 gap-3">
              {montantsRapides.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDraft({ montant: m })}
                  className={[
                    'min-h-touch rounded-xl border font-semibold active:scale-95 transition-colors',
                    draft.montant === m ? 'border-teal bg-teal text-white shadow-sm' : 'border-gray-100 bg-white text-gray-800',
                  ].join(' ')}
                >
                  {formatFcfa(m)}
                </button>
              ))}
            </div>
            <MoneyInput
              label="Montant libre"
              value={draft.montant ?? ''}
              onChange={(e) => setDraft({ montant: Number(e.target.value) })}
            />
            <label className="flex items-center justify-between min-h-touch rounded-2xl border border-gray-100 bg-white px-4 shadow-sm">
              <span className="text-sm text-gray-700">Je souhaite rester anonyme</span>
              <input
                type="checkbox"
                checked={draft.estAnonyme ?? false}
                onChange={(e) => setDraft({ estAnonyme: e.target.checked })}
                className="h-5 w-5 rounded text-teal focus:ring-teal"
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={prev} className="flex-1 min-h-touch rounded-xl border border-gray-200 bg-white font-medium active:scale-95">
                Retour
              </button>
              <button type="button" onClick={next} className="flex-1 min-h-touch rounded-xl bg-teal text-white font-semibold active:scale-95">
                Continuer
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-gray-500">Paroisse</span><span className="font-semibold text-right">{draft.paroisseNom}</span></div>
              <div className="flex justify-between gap-3"><span className="text-gray-500">Type</span><span className="font-semibold">{draft.typeMesse}</span></div>
              <div className="flex justify-between gap-3"><span className="text-gray-500">Intention</span><span className="font-semibold text-right max-w-[58%]">{draft.intention}</span></div>
              <div className="flex justify-between gap-3"><span className="text-gray-500">Date</span><span className="font-semibold">{draft.date} à {draft.creneau?.slice(0, 5)}</span></div>
              <div className="flex justify-between gap-3 border-t border-gray-100 pt-3"><span className="text-gray-500">Offrande</span><span className="text-xl font-bold text-teal">{formatFcfa(draft.montant ?? 0)}</span></div>
              {draft.estAnonyme ? <p className="text-xs text-amber-dark bg-amber-light rounded-xl px-3 py-2">Demande anonyme</p> : null}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={prev} className="flex-1 min-h-touch rounded-xl border border-gray-200 bg-white font-medium active:scale-95">
                Retour
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="flex-1 min-h-touch rounded-xl bg-teal text-white font-semibold active:scale-95 disabled:opacity-60 shadow-sm"
              >
                {submitting ? 'Envoi...' : 'Continuer vers le paiement'}
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
