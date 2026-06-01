import { Bell, CreditCard, Database, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminListSkeleton } from '../../components/admin/AdminListSkeleton';
import { AuditLogTable } from '../../components/admin/AuditLogTable';
import { USE_MOCK_API } from '../../config/env';
import { useAuditStore } from '../../stores/auditStore';

const sections = [
  {
    id: 'platform',
    title: 'Configuration plateforme',
    icon: Database,
    fields: [
      { label: 'Nom plateforme', value: 'MesseConnect' },
      { label: 'Pays', value: 'Burkina Faso' },
      { label: 'Devise', value: 'FCFA (XOF)' },
      { label: 'Fuseau horaire', value: 'Africa/Ouagadougou' },
    ],
  },
  {
    id: 'payments',
    title: 'Paiements',
    icon: CreditCard,
    fields: [
      { label: 'Orange Money', value: 'Activé' },
      { label: 'Moov Money', value: 'Activé' },
      { label: 'Wave', value: 'Activé' },
      { label: 'Commission plateforme', value: '2,5 %' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    fields: [
      { label: 'Email transaction', value: 'Activé' },
      { label: 'SMS validation', value: 'Activé' },
      { label: 'Push mobile', value: 'Désactivé' },
    ],
  },
  {
    id: 'security',
    title: 'Sécurité',
    icon: Shield,
    fields: [
      { label: '2FA admin', value: 'Recommandé' },
      { label: 'Durée session', value: '8 heures' },
      { label: 'Tentatives max', value: '5' },
    ],
  },
];

const quickLinks = [
  { to: '/admin/dioceses', label: 'Diocèses', description: 'Territoires ecclésiaux' },
  { to: '/admin/abonnements', label: 'Abonnements', description: 'Facturation paroisses' },
  { to: '/admin/moderation', label: 'Modération', description: 'Publications & campagnes' },
];

export default function SettingsPage() {
  const { logs, loading, loadLogs } = useAuditStore();

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  return (
    <div className="space-y-8 max-w-5xl pb-8">
      <AdminPageHeader
        title="Paramètres"
        description="Informations de référence, raccourcis de supervision et journal d'audit administrateur."
      />

      {!USE_MOCK_API ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Les cartes de configuration affichent des valeurs indicatives. Les sections Diocèses, Abonnements, Modération et le journal d&apos;audit sont connectées à l&apos;API.
        </p>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:border-purple/30 transition-colors"
          >
            <p className="font-semibold text-gray-900">{link.label}</p>
            <p className="text-sm text-gray-500 mt-1">{link.description}</p>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(({ id, title, icon: Icon, fields }) => (
          <section key={id} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="h-5 w-5 text-purple" />
              <h2 className="font-semibold text-gray-900">{title}</h2>
            </div>
            <dl className="space-y-3 text-sm">
              {fields.map((f) => (
                <div key={f.label} className="flex justify-between gap-4">
                  <dt className="text-gray-500">{f.label}</dt>
                  <dd className="font-medium text-gray-900 text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              disabled
              title="Fonctionnalité à venir"
              className="mt-4 text-sm text-gray-400 font-medium min-h-touch cursor-not-allowed"
            >
              Modifier (bientôt)
            </button>
          </section>
        ))}
      </div>

      <section className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-1">Sauvegardes</h2>
        <p className="text-sm text-gray-500 mb-4">
          {USE_MOCK_API
            ? 'Dernière sauvegarde simulée : 30 mai 2026 à 03:00'
            : 'Les sauvegardes sont gérées côté serveur (hors interface).'}
        </p>
        <button
          type="button"
          disabled
          className="min-h-touch px-4 rounded-xl bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
        >
          Lancer une sauvegarde (bientôt)
        </button>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Journal d&apos;audit</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Historique des actions administrateur enregistrées côté serveur.
            </p>
          </div>
          {USE_MOCK_API ? (
            <span className="shrink-0 rounded-full bg-amber-light px-3 py-1 text-xs font-medium text-amber-dark">
              Démo
            </span>
          ) : null}
        </div>
        {loading ? (
          <AdminListSkeleton rows={4} />
        ) : logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            Aucune entrée d&apos;audit pour le moment.
          </div>
        ) : (
          <AuditLogTable logs={logs} />
        )}
      </section>
    </div>
  );
}
