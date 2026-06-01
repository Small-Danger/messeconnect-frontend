import { useEffect, useState } from 'react';
import { PaiementCard } from '../../components/cards/PaiementCard';
import { EmptyState } from '../../components/common/EmptyState';
import { PaiementListSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import { useParoisseStore } from '../../stores/paroisseStore';

export default function MesPaiementsPage() {
  const token = useAuthStore((s) => s.token);
  const { paiements, setPaiements } = useParoisseStore();
  const [loading, setLoading] = useState(paiements.length === 0);

  useEffect(() => {
    let cancelled = false;
    const showLoader = paiements.length === 0;

    if (showLoader) {
      setLoading(true);
    }

    fideleService
      .getPaiements(token)
      .then((items) => {
        if (!cancelled) setPaiements(items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, setPaiements]);

  const showSkeleton = loading && paiements.length === 0;

  return (
    <MobileLayout header={<PageHeader title="Mes paiements" backTo="/profile" />}>
      <div className="px-4 py-4 space-y-3">
        {showSkeleton ? (
          <PaiementListSkeleton count={2} />
        ) : paiements.length === 0 ? (
          <EmptyState title="Aucun paiement" description="Vos transactions apparaîtront ici." />
        ) : (
          paiements.map((p) => <PaiementCard key={p.id} paiement={p} />)
        )}
      </div>
    </MobileLayout>
  );
}
