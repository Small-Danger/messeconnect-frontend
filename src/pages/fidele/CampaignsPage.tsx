import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../../components/common/SafeImage';
import { CampagneCardSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { formatFcfa } from '../../utils/formatCurrency';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import { useParoisseStore } from '../../stores/paroisseStore';

export default function CampaignsPage() {
  const token = useAuthStore((s) => s.token);
  const { campagnes, setCampagnes } = useParoisseStore();
  const [loading, setLoading] = useState(campagnes.length === 0);

  useEffect(() => {
    let cancelled = false;
    const showLoader = campagnes.length === 0;

    if (showLoader) {
      setLoading(true);
    }

    fideleService
      .getCampagnes(token)
      .then((items) => {
        if (!cancelled) setCampagnes(items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, setCampagnes]);

  const showSkeleton = loading && campagnes.length === 0;

  return (
    <MobileLayout header={<PageHeader title="Collectes" showBack={false} />}>
      <div className="px-4 py-4 space-y-4">
        {showSkeleton ? (
          [1, 2, 3].map((i) => <CampagneCardSkeleton key={i} />)
        ) : campagnes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Aucune collecte en cours.</p>
        ) : (
          campagnes.map((campagne) => {
            const progress = Math.min(100, Math.round((campagne.collecte / campagne.objectif) * 100));
            return (
              <article key={campagne.id} className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
                <SafeImage
                  src={campagne.image}
                  alt={campagne.titre}
                  className="w-full h-40"
                  fallbackLabel={campagne.titre}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{campagne.titre}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mt-2 gap-2">
                    <span>Collecté : {formatFcfa(campagne.collecte)}</span>
                    <span className="text-right">Objectif : {formatFcfa(campagne.objectif)}</span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-teal mt-2 font-medium">{progress}% de l&apos;objectif atteint</p>
                  <Link
                    to={`/campagnes/${campagne.id}/don`}
                    className="mt-4 w-full min-h-touch flex items-center justify-center gap-1 rounded-xl bg-teal text-white font-medium active:scale-95 transition-transform"
                  >
                    Contribuer
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </MobileLayout>
  );
}
