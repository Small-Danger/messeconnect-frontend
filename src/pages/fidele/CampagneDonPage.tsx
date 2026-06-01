import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaymentMethodBadge } from '../../components/payment/PaymentMethodBadge';
import { MoneyInput } from '../../components/forms/MoneyInput';
import { SafeImage } from '../../components/common/SafeImage';
import { CampagneDonSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { USE_MOCK_API } from '../../config/env';
import { montantsRapides, methodesPaiement } from '../../constants/fidele';
import { formatFcfa } from '../../utils/formatCurrency';
import { fideleApi } from '../../services/api/fidele';
import type { ApiMoyenPaiement } from '../../services/api/mappers/fideleDemande';
import { API_TYPE_TO_MOCK_METHODE } from '../../services/api/mappers/paiement';
import { fideleService } from '../../services/fideleService';
import type { MockCampagne } from '../../services/mockApi/data';
import { useAuthStore } from '../../stores/authStore';
import { usePaiementStore } from '../../stores/paiementStore';

export default function CampagneDonPage() {
  const { campagneId } = useParams<{ campagneId: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const { methode, setMethode } = usePaiementStore();
  const [campagne, setCampagne] = useState<MockCampagne | null>(null);
  const [loadingCampagne, setLoadingCampagne] = useState(true);
  const [montant, setMontant] = useState(5000);
  const [moyensPaiement, setMoyensPaiement] = useState<ApiMoyenPaiement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!campagneId) return;
    setLoadingCampagne(true);
    fideleService.getCampagne(campagneId, token).then(setCampagne).finally(() => setLoadingCampagne(false));
  }, [campagneId, token]);

  useEffect(() => {
    if (USE_MOCK_API || !campagne?.paroisseId) return;

    fideleApi.getMoyenPaiements(campagne.paroisseId, token).then((moyens) => {
      const actifs = moyens.filter((m) => m.actif);
      setMoyensPaiement(actifs);
      const firstActive = actifs[0];
      const mockId = firstActive ? API_TYPE_TO_MOCK_METHODE[firstActive.type] : undefined;
      if (mockId) setMethode(mockId);
    });
  }, [campagne?.paroisseId, token, setMethode]);

  const paymentOptions = useMemo(() => {
    if (USE_MOCK_API) return methodesPaiement;

    const allowedIds = new Set(
      moyensPaiement
        .map((m) => API_TYPE_TO_MOCK_METHODE[m.type])
        .filter((id): id is string => Boolean(id)),
    );

    return methodesPaiement.filter((m) => allowedIds.has(m.id));
  }, [moyensPaiement]);

  const progress = campagne
    ? Math.min(100, Math.round((campagne.collecte / campagne.objectif) * 100))
    : 0;

  const handleDon = async () => {
    if (!campagneId || !campagne || montant < 1) return;
    setLoading(true);
    setError('');
    try {
      const { paiement } = await fideleService.processCampagneDonation(
        campagneId,
        campagne.paroisseId,
        montant,
        methode,
        token,
      );
      navigate(`/campagnes/confirmation/${paiement.reference}`, {
        state: { campagneTitre: campagne.titre, montant, methode },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Don impossible');
    } finally {
      setLoading(false);
    }
  };

  const isLoadingCampagne = loadingCampagne || !campagne;

  return (
    <MobileLayout showBottomNav={false} header={<PageHeader title="Faire un don" backTo="/campagnes" />}>
      <div key={isLoadingCampagne ? 'loading' : campagneId} className="px-4 py-4">
        {isLoadingCampagne ? (
          <CampagneDonSkeleton />
        ) : (
          <div className="mc-blur-reveal space-y-6">
        <article className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
          <SafeImage src={campagne.image} alt={campagne.titre} className="w-full h-36" fallbackLabel={campagne.titre} />
          <div className="p-4">
            <h2 className="font-semibold text-gray-900">{campagne.titre}</h2>
            <div className="flex justify-between text-sm text-gray-600 mt-2 gap-2">
              <span>Collecté : {formatFcfa(campagne.collecte)}</span>
              <span className="text-right">Objectif : {formatFcfa(campagne.objectif)}</span>
            </div>
            <div className="mt-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </article>

        <section className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Montant du don</p>
          <div className="grid grid-cols-3 gap-3">
            {montantsRapides.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMontant(m)}
                className={[
                  'min-h-touch rounded-xl border text-sm font-medium active:scale-95 transition-transform',
                  montant === m ? 'border-teal bg-teal-light text-teal-800' : 'border-gray-200 bg-white text-gray-700',
                ].join(' ')}
              >
                {formatFcfa(m)}
              </button>
            ))}
          </div>
          <MoneyInput
            label="Autre montant"
            value={montant || ''}
            onChange={(e) => setMontant(Number(e.target.value) || 0)}
          />
        </section>

        <section>
          <p className="text-sm font-medium text-gray-700 mb-3">Moyen de paiement</p>
          <div className="space-y-3">
            {paymentOptions.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethode(m.id)}
                className={[
                  'w-full flex items-center gap-3 min-h-touch rounded-xl border p-4 text-left active:scale-[0.99] transition-all',
                  methode === m.id ? 'border-teal bg-teal-light ring-1 ring-teal/20' : 'border-gray-200 bg-white',
                ].join(' ')}
              >
                <PaymentMethodBadge id={m.id} />
                <span className="min-w-0">
                  <span className="block font-medium text-gray-900">{m.label}</span>
                  <span className="block text-xs text-gray-500 mt-0.5">{m.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={handleDon}
          disabled={loading || montant < 1 || !methode}
          className="w-full min-h-touch rounded-xl bg-teal text-white font-medium active:scale-95 transition-transform disabled:opacity-60 shadow-sm"
        >
          {loading ? 'Traitement en cours...' : `Donner ${formatFcfa(montant)}`}
        </button>
        <p className="text-xs text-center text-gray-400 leading-relaxed">
          Paiement simulé pour la démo. Aucun débit réel ne sera effectué.
        </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
