import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DemandeCard } from '../../components/cards/DemandeCard';
import { EmptyState } from '../../components/common/EmptyState';
import { DemandeListSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { fideleService } from '../../services/fideleService';
import type { MockDemande } from '../../services/mockApi/data';
import { useAuthStore } from '../../stores/authStore';
import { useParoisseStore } from '../../stores/paroisseStore';

type DemandeFilter = 'all' | 'en_cours' | 'payee' | 'celebree';

const filters: { id: DemandeFilter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'payee', label: 'Payées' },
  { id: 'celebree', label: 'Célébrées' },
];

function matchesFilter(demande: MockDemande, filter: DemandeFilter) {
  if (filter === 'all') return true;
  if (filter === 'en_cours') return demande.statut === 'en_attente' || demande.statut === 'confirmee';
  if (filter === 'payee') return demande.statut === 'payee';
  return demande.statut === 'celebree';
}

function GuestDemandesPrompt() {
  return (
    <div className="space-y-4">
      <EmptyState
        title="Connectez-vous pour vos demandes"
        description="Sans compte, vous pouvez quand même demander une messe — retrouvez-la avec votre référence."
        action={
          <div className="flex flex-col gap-2">
            <Link
              to="/auth/login"
              className="inline-flex min-h-touch items-center justify-center rounded-xl bg-teal px-4 text-sm font-semibold text-white active:scale-[0.98]"
            >
              Se connecter
            </Link>
            <Link to="/suivi" className="text-sm font-semibold text-teal">
              Suivre une demande par référence
            </Link>
            <Link to="/paroisses" className="text-sm font-medium text-gray-600">
              Demander une messe
            </Link>
          </div>
        }
      />
    </div>
  );
}

export default function MesDemandesPage() {
  const token = useAuthStore((s) => s.token);
  const { demandes, setDemandes } = useParoisseStore();
  const [filter, setFilter] = useState<DemandeFilter>('all');
  const [refreshing, setRefreshing] = useState(Boolean(token) && demandes.length === 0);

  useEffect(() => {
    if (!token) {
      setRefreshing(false);
      return;
    }

    let cancelled = false;
    const showLoader = demandes.length === 0;
    if (showLoader) setRefreshing(true);

    fideleService
      .getDemandes(token)
      .then((items) => {
        if (!cancelled) setDemandes(items);
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, setDemandes]);

  const filteredDemandes = useMemo(
    () => demandes.filter((d) => matchesFilter(d, filter)),
    [demandes, filter],
  );

  const enCoursCount = demandes.filter((d) => matchesFilter(d, 'en_cours')).length;
  const showSkeleton = Boolean(token) && refreshing && demandes.length === 0;

  return (
    <MobileLayout header={<PageHeader title="Mes demandes" showBack={false} />}>
      <div className="px-4 py-4 pb-28">
        {!token ? (
          <GuestDemandesPrompt />
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-teal">{demandes.length}</p>
                <p className="mt-1 text-xs text-gray-500">demande{demandes.length > 1 ? 's' : ''} au total</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-light/60 p-4 shadow-sm">
                <p className="text-2xl font-bold text-amber-dark">{enCoursCount}</p>
                <p className="mt-1 text-xs text-amber-dark/80">en cours</p>
              </div>
            </div>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {filters.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={[
                    'shrink-0 rounded-full px-4 py-2 text-sm font-medium min-h-touch transition-colors',
                    filter === id ? 'bg-teal text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>

            {showSkeleton ? (
              <DemandeListSkeleton count={3} />
            ) : filteredDemandes.length === 0 ? (
              <EmptyState
                title={filter === 'all' ? 'Aucune demande' : 'Aucun résultat'}
                description={
                  filter === 'all'
                    ? 'Vos demandes de messe apparaîtront ici.'
                    : 'Aucune demande ne correspond à ce filtre.'
                }
                action={
                  filter === 'all' ? (
                    <Link
                      to="/paroisses"
                      className="inline-flex min-h-touch items-center justify-center rounded-xl bg-teal px-5 text-sm font-semibold text-white"
                    >
                      Demander une messe
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFilter('all')}
                      className="text-sm font-semibold text-teal"
                    >
                      Voir toutes les demandes
                    </button>
                  )
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredDemandes.map((d) => (
                  <DemandeCard key={d.id} demande={d} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {token ? (
        <div className="fixed bottom-[72px] left-1/2 z-40 w-full max-w-mobile -translate-x-1/2 px-4 pb-2">
          <Link
            to="/paroisses"
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-teal text-white font-semibold shadow-lg shadow-teal/20 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Nouvelle demande
          </Link>
        </div>
      ) : null}
    </MobileLayout>
  );
}
