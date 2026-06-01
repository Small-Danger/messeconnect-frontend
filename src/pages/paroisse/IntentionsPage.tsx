import { CalendarDays, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import { NewIntentionDrawer } from '../../components/drawers/NewIntentionDrawer';
import { DemandeDetailsModal } from '../../components/modals/DemandeDetailsModal';
import { MesseDetailModal } from '../../components/modals/MesseDetailModal';
import { CashPaymentCard } from '../../components/paroisse/intentions/CashPaymentCard';
import { CreneauxWeekSection } from '../../components/paroisse/intentions/CreneauxWeekSection';
import { HistoriqueFiltersBar } from '../../components/paroisse/intentions/HistoriqueFiltersBar';
import { HistoriqueIntentionRow } from '../../components/paroisse/intentions/HistoriqueIntentionRow';
import { IntentionsFiltersBar } from '../../components/paroisse/intentions/IntentionsFiltersBar';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { ParoisseDemande, ParoisseMesse } from '../../services/mockApi/paroisse/data';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import type {
  CreneauIntentions,
  HistoriquePeriodPreset,
  HistoriqueVue,
  IntentionsPeriodPreset,
  IntentionsViewMode,
} from '../../types/paroisseIntentions';
import {
  buildUpcomingPlanningFilters,
  getHistoriquePeriodRange,
  groupByMonth,
  groupByWeek,
} from '../../utils/intentionsGrouping';
import { formatFcfa } from '../../utils/formatCurrency';

type TabId = 'creneaux' | 'especes' | 'historique';

function toMesse(creneau: CreneauIntentions): ParoisseMesse {
  return {
    id: creneau.id,
    titre: creneau.titre,
    date: creneau.date,
    heure: creneau.heure,
    pretre: '—',
    lieu: 'Église paroisse',
    intentions: [],
    participants: creneau.places_reservees,
    capacite_max: creneau.capacite_max,
    statut: creneau.statut === 'celebree' ? 'celebree' : creneau.statut === 'annulee' ? 'annulee' : 'planifiee',
  };
}

export default function IntentionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab: TabId =
    tabParam === 'especes' ? 'especes' : tabParam === 'historique' ? 'historique' : 'creneaux';

  const {
    planningCreneaux,
    historiqueDemandes,
    cashPending,
    planningLoading,
    planningRefreshing,
    historiqueLoading,
    historiqueRefreshing,
    cashLoading,
    cashRefreshing,
    loadPlanningIntentions,
    loadHistoriqueDemandes,
    loadCashPending,
    confirmCashPayment,
    cancelCashPayment,
    loadPaymentAndOfferings,
  } = useParoisseAppStore();

  const [period, setPeriod] = useState<IntentionsPeriodPreset>('month');
  const [viewMode, setViewMode] = useState<IntentionsViewMode>('cards');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  const [histPeriod, setHistPeriod] = useState<HistoriquePeriodPreset>('quarter');
  const [histVue, setHistVue] = useState<HistoriqueVue>('historique');
  const [histQuery, setHistQuery] = useState('');
  const debouncedHistQuery = useDebouncedValue(histQuery, 300);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newIntentionOpen, setNewIntentionOpen] = useState(false);
  const [selectedCreneau, setSelectedCreneau] = useState<CreneauIntentions | null>(null);
  const [selectedHistorique, setSelectedHistorique] = useState<ParoisseDemande | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    void loadCashPending();
    void loadPaymentAndOfferings();
  }, [loadCashPending, loadPaymentAndOfferings]);

  useEffect(() => {
    if (tab !== 'creneaux') return;
    void loadPlanningIntentions(buildUpcomingPlanningFilters(period, debouncedQuery));
  }, [tab, period, debouncedQuery, loadPlanningIntentions]);

  useEffect(() => {
    if (tab !== 'historique') return;
    const { from, to } = getHistoriquePeriodRange(histPeriod);
    void loadHistoriqueDemandes({
      vue: histVue,
      from,
      to,
      q: debouncedHistQuery || undefined,
    });
  }, [tab, histPeriod, histVue, debouncedHistQuery, loadHistoriqueDemandes]);

  const setTab = (next: TabId) => {
    const params: Record<string, string> = {};
    if (next === 'especes') params.tab = 'especes';
    if (next === 'historique') params.tab = 'historique';
    setSearchParams(params);
  };

  const showPlanningSkeleton = planningLoading && planningCreneaux.length === 0 && tab === 'creneaux';
  const showCashSkeleton = cashLoading && cashPending.length === 0 && tab === 'especes';
  const showHistoriqueSkeleton = historiqueLoading && historiqueDemandes.length === 0 && tab === 'historique';

  const totalCollecte = useMemo(
    () => planningCreneaux.reduce((sum, c) => sum + c.montant_collecte, 0),
    [planningCreneaux],
  );

  const weekGroups = useMemo(() => groupByWeek(planningCreneaux), [planningCreneaux]);
  const historiqueGroups = useMemo(() => groupByMonth(historiqueDemandes), [historiqueDemandes]);

  const handleConfirmCash = async (id: string) => {
    setActionId(id);
    try {
      await confirmCashPayment(id);
    } finally {
      setActionId(null);
    }
  };

  const handleCancelCash = async (id: string) => {
    setActionId(id);
    try {
      await cancelCashPayment(id);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Intentions de messe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Planning par créneau — le système enregistre automatiquement les intentions payées en ligne.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {planningRefreshing || cashRefreshing || historiqueRefreshing ? (
            <span className="text-xs text-teal animate-pulse" aria-live="polite">
              Mise à jour…
            </span>
          ) : null}
          <Link
            to="/paroisse/calendrier"
            className="inline-flex items-center gap-1 rounded-xl border border-teal/30 px-3 py-2.5 text-sm font-medium text-teal min-h-touch"
          >
            <CalendarDays className="h-4 w-4" />
            Calendrier
          </Link>
          <button
            type="button"
            onClick={() => setNewIntentionOpen(true)}
            className="inline-flex items-center gap-1 rounded-xl bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white min-h-touch active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            Nouvelle intention
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
        {(
          [
            ['creneaux', 'Messes programmées'],
            ['especes', 'Paiements espèces'],
            ['historique', 'Historique'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              'px-4 py-2 text-sm font-medium rounded-t-lg min-h-touch whitespace-nowrap flex items-center gap-2',
              tab === id ? 'text-teal border-b-2 border-teal -mb-[3px]' : 'text-gray-500',
            ].join(' ')}
          >
            {label}
            {id === 'especes' && cashPending.length > 0 ? (
              <span className="rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-bold text-amber-dark">
                {cashPending.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === 'creneaux' ? (
        <>
          <IntentionsFiltersBar
            period={period}
            onPeriodChange={setPeriod}
            query={query}
            onQueryChange={setQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={planningCreneaux.length}
          />

          {planningCreneaux.length > 0 ? (
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-teal">{formatFcfa(totalCollecte)}</span> collectés sur la période
            </p>
          ) : null}

          {showPlanningSkeleton ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" rounded="2xl" />
              ))}
            </div>
          ) : planningCreneaux.length === 0 ? (
            <EmptyState
              title="Aucun créneau trouvé"
              description="Élargissez la période ou modifiez votre recherche."
            />
          ) : (
            <div className="space-y-6">
              {weekGroups.map((group) => (
                <CreneauxWeekSection
                  key={group.weekStart}
                  label={group.label}
                  creneaux={group.items}
                  viewMode={viewMode}
                  onView={(c) => {
                    setSelectedCreneau(c);
                    setDrawerOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : null}

      {tab === 'especes' ? (
        <>
          <p className="text-sm text-gray-600">
            Confirmez ici les paiements espèces choisis en ligne ou laissés en attente au guichet.
          </p>

          {showCashSkeleton ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-40" rounded="2xl" />
              ))}
            </div>
          ) : cashPending.length === 0 ? (
            <EmptyState
              title="Aucun paiement espèces en attente"
              description="Les réservations en espèces apparaîtront ici pour confirmation."
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {cashPending.map((paiement) => (
                <CashPaymentCard
                  key={paiement.id}
                  paiement={paiement}
                  loading={actionId === paiement.id}
                  onConfirm={handleConfirmCash}
                  onCancel={handleCancelCash}
                />
              ))}
            </div>
          )}
        </>
      ) : null}

      {tab === 'historique' ? (
        <>
          <HistoriqueFiltersBar
            period={histPeriod}
            onPeriodChange={setHistPeriod}
            vue={histVue}
            onVueChange={setHistVue}
            query={histQuery}
            onQueryChange={setHistQuery}
            resultCount={historiqueDemandes.length}
          />

          {showHistoriqueSkeleton ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" rounded="2xl" />
              ))}
            </div>
          ) : historiqueDemandes.length === 0 ? (
            <EmptyState
              title="Aucune intention archivée"
              description="Les intentions passées, célébrées ou annulées apparaîtront ici."
            />
          ) : (
            <div className="space-y-6">
              {historiqueGroups.map((group) => (
                <section key={group.monthKey} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 capitalize">{group.label}</h3>
                  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                    {group.items.map((demande) => (
                      <HistoriqueIntentionRow
                        key={demande.id}
                        demande={demande}
                        onSelect={setSelectedHistorique}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      ) : null}

      <MesseDetailModal
        open={drawerOpen && !!selectedCreneau}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCreneau(null);
        }}
        messe={selectedCreneau ? toMesse(selectedCreneau) : null}
        onCelebrated={() => {
          void loadPlanningIntentions(buildUpcomingPlanningFilters(period, debouncedQuery));
        }}
        onUpdated={() => {
          void loadPlanningIntentions(buildUpcomingPlanningFilters(period, debouncedQuery));
        }}
        onDeleted={() => {
          void loadPlanningIntentions(buildUpcomingPlanningFilters(period, debouncedQuery));
        }}
        onCancelled={() => {
          void loadPlanningIntentions(buildUpcomingPlanningFilters(period, debouncedQuery));
        }}
      />

      <DemandeDetailsModal
        open={!!selectedHistorique}
        onClose={() => setSelectedHistorique(null)}
        demande={selectedHistorique}
        readOnly
      />

      <NewIntentionDrawer open={newIntentionOpen} onClose={() => setNewIntentionOpen(false)} />
    </div>
  );
}
