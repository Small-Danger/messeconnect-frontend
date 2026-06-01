import { Church, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ParishCard } from '../../components/cards/ParishCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ParishCardSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import { useParoisseStore } from '../../stores/paroisseStore';

const filters = ['Toutes', 'Ouaga', 'Bobo', 'Koudougou'] as const;

export default function ParishSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 350);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Toutes');
  const { paroisses, setParoisses, updateParoisse } = useParoisseStore();
  const [refreshing, setRefreshing] = useState(paroisses.length === 0);
  const token = useAuthStore((s) => s.token);

  const isFiltered = debouncedQuery.length > 0 || activeFilter !== 'Toutes';

  useEffect(() => {
    let cancelled = false;
    const hasCache = useParoisseStore.getState().paroisses.length > 0;
    const filtered = debouncedQuery.length > 0 || activeFilter !== 'Toutes';

    if (!hasCache || filtered) {
      setRefreshing(true);
    }

    fideleService
      .getParoisses({ q: debouncedQuery, ville: activeFilter }, token)
      .then((items) => {
        if (!cancelled) setParoisses(items);
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, activeFilter, setParoisses, token]);

  const handleToggleFavori = async (id: string) => {
    if (!token) {
      navigate('/auth/login');
      return;
    }
    try {
      const updated = await fideleService.toggleFavori(id, token);
      updateParoisse(updated);
    } catch {
      /* ignore */
    }
  };

  const favorisCount = useMemo(() => paroisses.filter((p) => p.estFavori).length, [paroisses]);
  const showSkeleton = refreshing && (paroisses.length === 0 || isFiltered);
  const showList = !showSkeleton && paroisses.length > 0;

  return (
    <MobileLayout header={<PageHeader title="Paroisses" showBack={false} />}>
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-teal/10 bg-gradient-to-br from-teal via-[#0f5c48] to-[#0a3d31] p-5 text-white shadow-lg shadow-teal/15">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Church className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-snug">Trouvez votre paroisse</h2>
              <p className="mt-1 text-sm text-white/80 leading-relaxed">
                Consultez les horaires, demandez une messe ou découvrez les publications.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-14 z-30 border-b border-gray-100 bg-gray-50/95 px-4 py-3 backdrop-blur">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Nom, ville ou quartier..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-h-touch rounded-2xl border border-gray-200 bg-white pl-10 pr-10 text-base shadow-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
          {query ? (
            <button
              type="button"
              aria-label="Effacer la recherche"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 flex min-h-touch min-w-touch -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 active:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium min-h-[36px] transition-all active:scale-95',
                activeFilter === filter
                  ? 'bg-teal text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-600',
              ].join(' ')}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-6">
        {showList ? (
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{paroisses.length}</span> paroisse
              {paroisses.length > 1 ? 's' : ''}
              {isFiltered ? ' trouvée' + (paroisses.length > 1 ? 's' : '') : ''}
            </p>
            {token && favorisCount > 0 ? (
              <span className="rounded-full bg-teal-light px-3 py-1 text-xs font-semibold text-teal">
                {favorisCount} favori{favorisCount > 1 ? 's' : ''}
              </span>
            ) : null}
            {refreshing && !isFiltered ? (
              <span className="text-xs text-teal animate-pulse">Mise à jour…</span>
            ) : null}
          </div>
        ) : null}

        {showSkeleton ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ParishCardSkeleton key={i} />
            ))}
          </div>
        ) : paroisses.length === 0 ? (
          <EmptyState
            title="Aucune paroisse trouvée"
            description="Essayez un autre filtre ou un terme de recherche plus court."
            action={
              (query || activeFilter !== 'Toutes') ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveFilter('Toutes');
                  }}
                  className="text-sm font-semibold text-teal"
                >
                  Réinitialiser les filtres
                </button>
              ) : (
                <Link to="/" className="text-sm font-semibold text-teal">
                  Retour à l&apos;accueil
                </Link>
              )
            }
          />
        ) : (
          <div className="space-y-4">
            {paroisses.map((p) => (
              <ParishCard key={p.id} paroisse={p} onToggleFavori={handleToggleFavori} />
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
