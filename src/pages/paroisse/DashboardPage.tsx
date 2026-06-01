import { Calendar, ChevronRight, ClipboardList, Coins, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { ParoisseDashboardSkeleton } from '../../components/common/skeletons/ParoisseSkeletons';
import { ScheduleMassDrawer } from '../../components/drawers/ScheduleMassDrawer';
import { CampaignsCard } from '../../components/paroisse/CampaignsCard';
import { KpiCard } from '../../components/paroisse/KpiCard';
import { OfferingsCard } from '../../components/paroisse/OfferingsCard';
import { PaymentMethodsCard } from '../../components/paroisse/PaymentMethodsCard';
import { PublicationsCard } from '../../components/paroisse/PublicationsCard';
import type { ParoisseMesse } from '../../services/mockApi/paroisse/data';
import { useCalendarStore } from '../../stores/calendarStore';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import {
  formatDateShort,
  formatMesseDay,
  formatMesseMonth,
} from '../../utils/formatDate';
import { formatFcfa } from '../../utils/formatCurrency';

function SectionLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-0.5 text-xs font-medium text-teal hover:text-teal-800 active:opacity-80"
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function MesseItem({ messe }: { messe: ParoisseMesse }) {
  return (
    <li className="flex gap-3 p-2 rounded-xl bg-gray-50">
      <div className="h-10 w-10 rounded-lg bg-teal-light flex flex-col items-center justify-center text-teal shrink-0 overflow-hidden">
        <span className="text-xs font-bold leading-none">{formatMesseDay(messe.date)}</span>
        <span className="text-[9px] uppercase leading-none mt-0.5">{formatMesseMonth(messe.date)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{messe.titre}</p>
        <p className="text-xs text-gray-500">
          {messe.heure.slice(0, 5)}
          {messe.pretre && messe.pretre !== '—' ? ` · ${messe.pretre}` : ''}
        </p>
      </div>
    </li>
  );
}

export default function DashboardPage() {
  const openScheduleDrawer = useCalendarStore((s) => s.openScheduleDrawer);
  const {
    dashboard,
    dashboardLoading,
    dashboardRefreshing,
    cashPending,
    planningCreneaux,
    loadDashboard,
    loadPaymentAndOfferings,
    loadPublicationsAndCampaigns,
    loadPlanningIntentions,
    loadCashPending,
    moyensPaiement,
    typesOffrandes,
    publications,
    campagnes,
    addMoyenPaiement,
    updateMoyenPaiement,
    deleteMoyenPaiement,
    addTypeOffrande,
    updateTypeOffrande,
    deleteTypeOffrande,
    addPublication,
    addCampagne,
  } = useParoisseAppStore();

  const [configOpen, setConfigOpen] = useState(false);

  useEffect(() => {
    void loadDashboard();
    void loadPaymentAndOfferings();
    void loadPublicationsAndCampaigns();
    void loadPlanningIntentions();
    void loadCashPending();
  }, [
    loadDashboard,
    loadPaymentAndOfferings,
    loadPublicationsAndCampaigns,
    loadPlanningIntentions,
    loadCashPending,
  ]);

  const kpis = dashboard?.kpis ?? null;
  const messes = dashboard?.messesAVenir ?? [];
  const activites = dashboard?.activites ?? [];
  const cashCount = cashPending.length;
  const prochainsCreneaux = planningCreneaux.slice(0, 5);

  const showSkeleton = dashboardLoading && !dashboard;

  if (showSkeleton) {
    return <ParoisseDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de votre paroisse</p>
        </div>
        {dashboardRefreshing ? (
          <span className="text-xs text-teal animate-pulse" aria-live="polite">
            Mise à jour…
          </span>
        ) : null}
      </div>

      {kpis ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Intentions enregistrées"
            value={String(kpis.demandesRecues)}
            icon={ClipboardList}
            accent="teal"
            href="/paroisse/intentions"
          />
          <KpiCard label="Offrandes reçues" value={formatFcfa(kpis.offrandesRecues)} icon={Coins} accent="teal" />
          <KpiCard
            label="Messes à venir"
            value={String(kpis.messesAVenir)}
            icon={Calendar}
            href="/paroisse/calendrier"
          />
          <KpiCard label="Fidèles inscrits" value={String(kpis.fidelesInscrits)} icon={Users} accent="teal" />
        </div>
      ) : null}

      {cashCount > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-light bg-amber-light/40 px-4 py-3">
          <p className="text-sm text-amber-dark">
            <span className="font-semibold">{cashCount}</span> paiement{cashCount > 1 ? 's' : ''} espèces à
            confirmer
          </p>
          <Link
            to="/paroisse/intentions?tab=especes"
            className="text-sm font-semibold text-teal active:opacity-80"
          >
            Voir les paiements →
          </Link>
        </div>
      ) : null}

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">Prochains créneaux</h2>
              {prochainsCreneaux.length > 0 ? (
                <span className="text-xs text-teal bg-teal-light px-2 py-0.5 rounded-full font-medium">
                  {planningCreneaux.length}
                </span>
              ) : null}
            </div>
            <SectionLink to="/paroisse/intentions" label="Voir le planning" />
          </div>

          {prochainsCreneaux.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="Aucun créneau ouvert"
                description="Configurez vos modèles de messe dans le calendrier pour recevoir des intentions."
                action={
                  <Link to="/paroisse/calendrier" className="text-sm font-semibold text-teal">
                    Ouvrir le calendrier
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {prochainsCreneaux.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.titre}</p>
                    <p className="text-xs text-gray-500">
                      {formatDateShort(c.date)} · {c.heure.slice(0, 5)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-teal">{c.intentions_count} intention{c.intentions_count > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-400">{formatFcfa(c.montant_collecte)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-semibold text-gray-900">Messes à venir</h2>
            <SectionLink to="/paroisse/calendrier" label="Calendrier" />
          </div>

          {messes.length === 0 ? (
            <EmptyState
              title="Aucune messe planifiée"
              description="Programmez vos prochaines célébrations."
              action={
                <button
                  type="button"
                  onClick={openScheduleDrawer}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-teal"
                >
                  <Plus className="h-4 w-4" />
                  Programmer une messe
                </button>
              }
            />
          ) : (
            <>
              <ul className="space-y-3">
                {messes.map((m) => (
                  <MesseItem key={m.id} messe={m} />
                ))}
              </ul>
              <button
                type="button"
                onClick={openScheduleDrawer}
                className="mt-4 w-full min-h-touch rounded-xl border border-dashed border-teal/30 text-sm font-medium text-teal hover:bg-teal-light/30 active:scale-[0.99]"
              >
                + Programmer une messe
              </button>
            </>
          )}
        </section>
      </div>

      <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-3">Activité récente</h2>
        {activites.length === 0 ? (
          <EmptyState title="Aucune activité récente" description="L'activité de votre paroisse s'affichera ici." />
        ) : (
          <ul className="space-y-2">
            {activites.map((a) => (
              <li
                key={a.id}
                className="flex justify-between gap-3 text-sm py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-700 min-w-0">{a.label}</span>
                <span className="text-xs text-gray-400 shrink-0">{a.date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <button
          type="button"
          onClick={() => setConfigOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm active:scale-[0.99]"
          aria-expanded={configOpen}
        >
          Configuration rapide
          <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${configOpen ? 'rotate-90' : ''}`} />
        </button>
        {configOpen ? (
          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <PaymentMethodsCard
              methods={moyensPaiement}
              onAdd={addMoyenPaiement}
              onUpdate={updateMoyenPaiement}
              onDelete={deleteMoyenPaiement}
            />
            <OfferingsCard
              offerings={typesOffrandes}
              onAdd={addTypeOffrande}
              onUpdate={updateTypeOffrande}
              onDelete={deleteTypeOffrande}
            />
            <PublicationsCard publications={publications} onAdd={addPublication} limit={3} />
            <CampaignsCard campagnes={campagnes} onAdd={addCampagne} />
          </div>
        ) : null}
      </section>

      <ScheduleMassDrawer />
    </div>
  );
}
