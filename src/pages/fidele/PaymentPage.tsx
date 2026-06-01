import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { PaymentMethodPicker } from '../../components/demande/PaymentMethodPicker';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { formatFcfa } from '../../utils/formatCurrency';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import { useDemandeStore } from '../../stores/demandeStore';
import { usePaiementStore } from '../../stores/paiementStore';
import type { MockDemande } from '../../services/mockApi/data';

export default function PaymentPage() {
  const { demandeId } = useParams<{ demandeId: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const { currentDemande } = useDemandeStore();
  const { methode, setMethode } = usePaiementStore();
  const [demande, setDemande] = useState<MockDemande | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!demandeId) return;

    if (currentDemande?.id === demandeId) {
      setDemande(currentDemande);
      return;
    }

    if (token) {
      fideleService.getDemande(demandeId, token).then(setDemande).catch(() => {
        /* demande anonyme ou session expirée */
      });
    }
  }, [demandeId, token, currentDemande]);

  const activeDemande = demande ?? (currentDemande?.id === demandeId ? currentDemande : null);

  const handlePay = async () => {
    if (!demandeId || !activeDemande) return;
    setLoading(true);
    setError('');
    try {
      const { demande: updated } = await fideleService.processPayment(demandeId, methode, token, {
        paroisseId: activeDemande.paroisseId,
        reference: activeDemande.reference,
      });
      navigate(`/confirmation/${updated.reference}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Paiement impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout showBottomNav={false} header={<PageHeader title="Paiement" backTo={`/demande/${activeDemande?.paroisseId}`} />}>
      <div className="px-4 py-6">
        <div className="mb-6 overflow-hidden rounded-2xl border border-teal/10 bg-gradient-to-br from-teal-light to-white p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-teal-800">Montant à payer</p>
          <p className="mt-1 text-4xl font-bold text-teal">{formatFcfa(activeDemande?.montant ?? 0)}</p>
          {activeDemande ? (
            <p className="mt-2 text-xs text-teal-700/80">
              {activeDemande.paroisseNom} · {activeDemande.typeMesse}
            </p>
          ) : null}
        </div>

        <p className="mb-3 text-sm font-semibold text-gray-800">Choisissez votre moyen de paiement</p>

        {activeDemande?.paroisseId ? (
          <PaymentMethodPicker
            paroisseId={activeDemande.paroisseId}
            token={token}
            methode={methode}
            onChange={setMethode}
          />
        ) : (
          <div className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
        )}

        {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={handlePay}
          disabled={loading || !activeDemande || !methode}
          className="mt-8 w-full min-h-touch rounded-xl bg-teal font-semibold text-white shadow-lg shadow-teal/15 transition-transform active:scale-95 disabled:opacity-60"
        >
          {loading ? 'Traitement en cours...' : 'Payer maintenant'}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Paiement simulé pour la démo · aucun débit réel
        </p>
      </div>
    </MobileLayout>
  );
}
