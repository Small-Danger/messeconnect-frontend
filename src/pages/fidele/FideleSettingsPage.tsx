import { Bell, ChevronRight, Info, RefreshCw, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SettingToggle } from '../../components/settings/SettingToggle';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { APP_NAME } from '../../lib/config';
import { useFideleSettingsStore } from '../../stores/fideleSettingsStore';

export default function FideleSettingsPage() {
  const settings = useFideleSettingsStore();
  const {
    emailDemandes,
    emailPaiements,
    smsRappels,
    campagnesParoisse,
    setSetting,
    resetSettings,
  } = settings;

  return (
    <MobileLayout header={<PageHeader title="Paramètres" backTo="/profile" />}>
      <div className="px-4 py-4 space-y-4">
        <section className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 pt-4 pb-2">
            <Bell className="h-5 w-5 text-teal" />
            <h2 className="font-semibold text-gray-900">Préférences de notification</h2>
          </div>
          <div className="divide-y divide-gray-50 px-4">
            <SettingToggle
              label="E-mail — statut des demandes"
              description="Confirmation, validation ou rejet de vos demandes de messe."
              checked={emailDemandes}
              onChange={(value) => setSetting('emailDemandes', value)}
            />
            <SettingToggle
              label="E-mail — paiements"
              description="Reçus et confirmations après chaque transaction."
              checked={emailPaiements}
              onChange={(value) => setSetting('emailPaiements', value)}
            />
            <SettingToggle
              label="SMS — rappels"
              description="Rappel la veille d'une messe programmée (bientôt)."
              checked={smsRappels}
              onChange={(value) => setSetting('smsRappels', value)}
            />
            <SettingToggle
              label="Collectes de ma paroisse"
              description="Nouvelles campagnes et avancement des collectes."
              checked={campagnesParoisse}
              onChange={(value) => setSetting('campagnesParoisse', value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 pt-4 pb-2">
            <User className="h-5 w-5 text-teal" />
            <h2 className="font-semibold text-gray-900">Compte</h2>
          </div>
          <nav>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 min-h-touch border-t border-gray-50 active:bg-gray-50"
            >
              <span className="flex-1 text-sm text-gray-800">Informations personnelles</span>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </Link>
            <Link
              to="/recurrences"
              className="flex items-center gap-3 px-4 min-h-touch border-t border-gray-50 active:bg-gray-50"
            >
              <RefreshCw className="h-5 w-5 text-teal shrink-0" />
              <span className="flex-1 text-sm text-gray-800">Demandes récurrentes</span>
              <span className="text-[11px] font-medium text-amber-dark bg-amber-light px-2 py-0.5 rounded-full">
                Bientôt
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </Link>
          </nav>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 pt-4 pb-2">
            <Shield className="h-5 w-5 text-teal" />
            <h2 className="font-semibold text-gray-900">Confidentialité & app</h2>
          </div>
          <div className="px-4 pb-4 space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <Info className="h-5 w-5 text-teal shrink-0 mt-0.5" />
              <p className="text-gray-600 leading-relaxed">
                Vos préférences sont enregistrées sur cet appareil. La synchronisation serveur sera
                disponible prochainement.
              </p>
            </div>
            <div className="flex justify-between gap-4 pt-1">
              <span className="text-gray-500">Application</span>
              <span className="font-medium text-gray-900">{APP_NAME}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Langue</span>
              <span className="font-medium text-gray-900">Français</span>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={resetSettings}
          className="w-full min-h-touch rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 active:scale-[0.99] transition-transform"
        >
          Réinitialiser les préférences
        </button>
      </div>
    </MobileLayout>
  );
}
