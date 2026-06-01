import { Building2, ClipboardList, HeadphonesIcon, TrendingUp, Users, Wallet } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminKpiCard } from '../../components/admin/AdminKpiCard';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DemandesChart, InscriptionsChart, ParoissesChart, RevenusChart } from '../../components/admin/DashboardCharts';
import { SystemAnnouncementsCard } from '../../components/admin/SystemAnnouncementsCard';
import { SystemCampaignsCard } from '../../components/admin/SystemCampaignsCard';
import { USE_MOCK_API } from '../../config/env';
import { formatFcfa } from '../../utils/formatCurrency';
import { useAdminStore } from '../../stores/adminStore';

export default function DashboardPage() {
  const { dashboard, dashboardLoading, loadDashboard, addAnnonce, addCampagne, annonces, campagnes } = useAdminStore();

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (dashboardLoading && !dashboard) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-600">Impossible de charger le tableau de bord.</p>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="mt-4 min-h-touch px-4 rounded-xl bg-purple text-white text-sm font-medium"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const { kpis, inscriptionsChart, revenusChart, demandesChart, paroissesChart, activites } = dashboard;
  const croissanceLabel =
    kpis.croissanceMensuelle !== 0
      ? `${kpis.croissanceMensuelle > 0 ? '+' : ''}${kpis.croissanceMensuelle}%`
      : '—';
  const paroissesEnAttente = paroissesChart.find((p) => p.label === 'En attente')?.value ?? 0;

  return (
    <div className="space-y-8 pb-8">
      <AdminPageHeader
        title="Tableau de bord global"
        description="Indicateurs clés de la plateforme : fidèles, paroisses, demandes, paiements et support."
        badge={dashboardLoading ? 'Mise à jour…' : undefined}
      />

      {paroissesEnAttente > 0 ? (
        <Link
          to="/admin/paroisses"
          className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 hover:border-amber-300 transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-amber-900">
              {paroissesEnAttente} inscription{paroissesEnAttente > 1 ? 's' : ''} paroissiale{paroissesEnAttente > 1 ? 's' : ''} à valider
            </p>
            <p className="text-sm text-amber-800/90 mt-0.5">Consultez les dossiers en attente et validez ou refusez les demandes.</p>
          </div>
          <span className="shrink-0 text-sm font-medium text-purple">Voir les paroisses →</span>
        </Link>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <AdminKpiCard label="Fidèles inscrits" value={kpis.utilisateurs.toLocaleString('fr-FR')} icon={Users} />
        <AdminKpiCard label="Paroisses" value={String(kpis.paroisses)} icon={Building2} accent="teal" />
        <AdminKpiCard label="Demandes de messe" value={kpis.demandesMesses.toLocaleString('fr-FR')} icon={ClipboardList} accent="amber" />
        <AdminKpiCard label="Montant collecté" value={formatFcfa(kpis.montantTotal)} icon={Wallet} />
        <AdminKpiCard
          label="Croissance mensuelle"
          value={croissanceLabel}
          icon={TrendingUp}
          accent="teal"
          trend={kpis.croissanceMensuelle !== 0 ? 'vs mois précédent' : 'Donnée non disponible'}
        />
        <Link to="/admin/support" className="block">
          <AdminKpiCard label="Tickets ouverts" value={String(kpis.ticketsOuverts)} icon={HeadphonesIcon} accent="amber" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InscriptionsChart data={inscriptionsChart} />
        <RevenusChart data={revenusChart} />
        <DemandesChart data={demandesChart} />
        <ParoissesChart data={paroissesChart} />
      </div>

      {USE_MOCK_API ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemAnnouncementsCard annonces={annonces} onAdd={addAnnonce} />
          <SystemCampaignsCard campagnes={campagnes} onAdd={addCampagne} />
        </div>
      ) : (
        <div className="rounded-2xl border border-purple/20 bg-purple-light/30 p-4 text-sm text-gray-700">
          Les annonces et campagnes système sont gérées par chaque paroisse. Utilisez les pages{' '}
          <strong>Paroisses</strong> et <strong>Transactions</strong> pour la supervision opérationnelle.
        </div>
      )}

      <section>
        <h2 className="font-semibold text-gray-900 mb-4">Activité récente</h2>
        {activites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            Aucune activité récente enregistrée pour le moment.
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-purple-light/50 text-left text-xs text-purple-dark uppercase">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {activites.map((a) => (
                  <tr key={a.id} className="border-t border-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {format(parseISO(a.date), 'd MMM HH:mm', { locale: fr })}
                    </td>
                    <td className="px-4 py-3">{a.action}</td>
                    <td className="px-4 py-3 font-medium">{a.utilisateur}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-light text-purple">{a.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
