import { useEffect, useState } from 'react';
import { ParishCard } from '../../components/cards/ParishCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ParishCardSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import { useParoisseStore } from '../../stores/paroisseStore';

export default function FavoritesPage() {
  const { favoris, setFavoris } = useParoisseStore();
  const [loading, setLoading] = useState(favoris.length === 0);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    let cancelled = false;
    const showLoader = favoris.length === 0;

    if (showLoader) {
      setLoading(true);
    }

    fideleService
      .getFavoris(token)
      .then((items) => {
        if (!cancelled) setFavoris(items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, setFavoris]);

  const handleToggle = async (id: string) => {
    await fideleService.toggleFavori(id, token);
    setFavoris(await fideleService.getFavoris(token));
  };

  const showSkeleton = loading && favoris.length === 0;

  return (
    <MobileLayout header={<PageHeader title="Mes favoris" backTo="/profile" />}>
      <div className="px-4 py-4 space-y-4">
        {showSkeleton ? (
          [1, 2].map((i) => <ParishCardSkeleton key={i} />)
        ) : favoris.length === 0 ? (
          <EmptyState title="Aucun favori" description="Ajoutez des paroisses à vos favoris depuis la recherche." />
        ) : (
          favoris.map((p) => <ParishCard key={p.id} paroisse={p} onToggleFavori={handleToggle} />)
        )}
      </div>
    </MobileLayout>
  );
}
