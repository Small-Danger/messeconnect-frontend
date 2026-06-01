import { ExternalLink, Eye } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OfferingsCard } from '../../components/paroisse/OfferingsCard';
import { ParoisseProfileEditor } from '../../components/paroisse/ParoisseProfileEditor';
import { ParoissePublicPreview } from '../../components/paroisse/ParoissePublicPreview';
import { PaymentMethodsCard } from '../../components/paroisse/PaymentMethodsCard';
import type { ParoisseProfile } from '../../services/mockApi/paroisse/data';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

export default function ProfilePage() {
  const {
    profile,
    loadProfile,
    updateProfile,
    moyensPaiement,
    typesOffrandes,
    loadPaymentAndOfferings,
    addMoyenPaiement,
    updateMoyenPaiement,
    deleteMoyenPaiement,
    addTypeOffrande,
    updateTypeOffrande,
    deleteTypeOffrande,
  } = useParoisseAppStore();

  const [previewProfile, setPreviewProfile] = useState<ParoisseProfile | null>(null);

  useEffect(() => {
    void loadProfile();
    void loadPaymentAndOfferings();
  }, [loadProfile, loadPaymentAndOfferings]);

  useEffect(() => {
    if (profile) setPreviewProfile(profile);
  }, [profile]);

  const handlePreviewChange = useCallback((next: ParoisseProfile) => {
    setPreviewProfile(next);
  }, []);

  if (!profile || !previewProfile) {
    return (
      <div className="max-w-5xl space-y-4">
        <div className="h-8 w-48 rounded-lg bg-gray-200 animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="h-96 rounded-2xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Profil paroisse</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Modifiez ici ce que les fidèles voient sur votre fiche publique.
          </p>
        </div>
        {profile.id ? (
          <Link
            to={`/paroisses/${profile.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-teal/20 bg-teal-light px-3 py-2 text-sm font-medium text-teal hover:bg-teal-light/80"
          >
            <ExternalLink className="h-4 w-4" />
            Voir la fiche publique
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-3 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Eye className="h-3.5 w-3.5" />
            Aperçu fidèle
          </div>
          <ParoissePublicPreview profile={previewProfile} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <ParoisseProfileEditor
            profile={profile}
            onSave={updateProfile}
            onPreviewChange={handlePreviewChange}
          />
        </div>
      </div>

      <section className="space-y-4 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Paiements & offrandes</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Configuration interne pour les demandes de messe et les dons — non affichée sur la fiche publique.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
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
        </div>
      </section>
    </div>
  );
}
