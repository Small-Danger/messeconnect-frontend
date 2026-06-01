import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DemandeListSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { formatFcfa } from '../../utils/formatCurrency';
import { fideleService } from '../../services/fideleService';
import type { MockDemande } from '../../services/mockApi/data';
import { useAuthStore } from '../../stores/authStore';
import { useParoisseStore } from '../../stores/paroisseStore';

const statutLabels: Record<MockDemande['statut'], string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  payee: 'Payée',
  celebree: 'Célébrée',
};

export default function DemandeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  const cachedDemandes = useParoisseStore((s) => s.demandes);
  const [demande, setDemande] = useState<MockDemande | null>(() =>
    id ? cachedDemandes.find((d) => d.id === id) ?? null : null,
  );
  const [loading, setLoading] = useState(Boolean(id && token && !demande));

  useEffect(() => {
    if (!id || !token) return;

    const cached = cachedDemandes.find((d) => d.id === id);
    if (cached) {
      setDemande(cached);
      setLoading(false);
    }

    fideleService
      .getDemande(id, token)
      .then(setDemande)
      .catch(() => setDemande(null))
      .finally(() => setLoading(false));
  }, [id, token, cachedDemandes]);

  if (loading && !demande) {
    return (
      <MobileLayout header={<PageHeader title="Détail demande" backTo="/mes-demandes" />}>
        <div className="px-4 py-4">
          <DemandeListSkeleton count={1} />
        </div>
      </MobileLayout>
    );
  }

  if (!demande) {
    return (
      <MobileLayout header={<PageHeader title="Détail demande" backTo="/mes-demandes" />}>
        <div className="px-4 py-8 text-center text-sm text-gray-500">Demande introuvable.</div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<PageHeader title="Détail demande" backTo="/mes-demandes" />}>
      <div className="px-4 py-4 space-y-4">
        <div className="rounded-2xl border border-teal/10 bg-teal-light p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-800">Référence</p>
          <p className="mt-1 font-mono text-lg font-bold text-teal">{demande.reference}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4 text-sm">
          <Row label="Paroisse" value={demande.paroisseNom} />
          <Row label="Type" value={demande.typeMesse} />
          <Row label="Intention" value={demande.intention} />
          <Row
            label="Date"
            value={`${format(parseISO(demande.date), 'd MMMM yyyy', { locale: fr })} à ${demande.creneau.slice(0, 5)}`}
          />
          <Row label="Montant" value={formatFcfa(demande.montant)} highlight />
          <Row label="Statut" value={statutLabels[demande.statut]} />
          {demande.estAnonyme ? (
            <p className="text-xs text-amber-dark bg-amber-light rounded-xl px-3 py-2">Demande anonyme</p>
          ) : null}
        </div>
      </div>
    </MobileLayout>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`font-semibold text-right ${highlight ? 'text-teal text-lg' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}
