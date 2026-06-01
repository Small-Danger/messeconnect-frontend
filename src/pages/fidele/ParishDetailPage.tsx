import {
  CalendarDays,
  Globe,
  Heart,
  MapPin,
  Newspaper,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SafeImage } from '../../components/common/SafeImage';
import { ParishDetailSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { fideleService } from '../../services/fideleService';
import type { MockParoisse } from '../../services/mockApi/data';
import { useAuthStore } from '../../stores/authStore';
import { useDemandeFlowStore } from '../../stores/demandeFlowStore';
import { useParoisseStore } from '../../stores/paroisseStore';

function findCachedParoisse(id: string): MockParoisse | undefined {
  const { paroisses, favoris } = useParoisseStore.getState();
  return paroisses.find((p) => p.id === id) ?? favoris.find((p) => p.id === id);
}

function dioceseLabel(diocese: string) {
  return diocese.replace('Archidiocèse de ', '').replace('Diocèse de ', '');
}

export default function ParishDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const updateParoisse = useParoisseStore((s) => s.updateParoisse);
  const prefetchForParoisse = useDemandeFlowStore((s) => s.prefetchForParoisse);
  const [paroisse, setParoisse] = useState<MockParoisse | null>(() => (id ? findCachedParoisse(id) ?? null : null));
  const [loading, setLoading] = useState(!paroisse);

  useEffect(() => {
    if (!id) return;

    const cached = findCachedParoisse(id);
    if (cached) {
      setParoisse(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    fideleService
      .getParoisse(id, token)
      .then((p) => {
        setParoisse(p);
        updateParoisse(p);
      })
      .catch(() => navigate('/paroisses', { replace: true }))
      .finally(() => setLoading(false));

    void prefetchForParoisse(id, token);
  }, [id, token, navigate, prefetchForParoisse, updateParoisse]);

  const handleToggleFavori = async () => {
    if (!paroisse) return;
    if (!token) {
      navigate('/auth/login');
      return;
    }
    try {
      const updated = await fideleService.toggleFavori(paroisse.id, token);
      setParoisse(updated);
      updateParoisse(updated);
    } catch {
      /* ignore */
    }
  };

  const isLoading = loading && !paroisse;

  return (
    <MobileLayout
      showBottomNav={isLoading}
      header={
        <PageHeader
          title={paroisse?.nom ?? 'Paroisse'}
          backTo="/paroisses"
          right={
            paroisse ? (
              <button
                type="button"
                aria-label={paroisse.estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                onClick={handleToggleFavori}
                className="flex min-h-touch min-w-touch items-center justify-center rounded-xl active:scale-95"
              >
                <Heart
                  className={`h-5 w-5 ${paroisse.estFavori ? 'fill-red-300 text-red-300' : 'text-white/90'}`}
                />
              </button>
            ) : undefined
          }
        />
      }
    >
      <div key={isLoading ? 'loading' : paroisse?.id}>
        {isLoading || !paroisse ? (
          <ParishDetailSkeleton />
        ) : (
          <div className="mc-blur-reveal">
            <div className="relative h-64">
              <SafeImage
                src={paroisse.image}
                alt={paroisse.nom}
                className="h-full w-full object-cover"
                width={430}
                height={256}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  {dioceseLabel(paroisse.diocese)}
                </span>
                <h2 className="mt-2 text-2xl font-bold leading-snug">{paroisse.nom}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {paroisse.ville} · {paroisse.pays}
                </p>
                <p className="mt-1 text-xs text-white/70">{paroisse.distance}</p>
              </div>
            </div>

            <div className="space-y-4 px-4 py-4 pb-32">
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${paroisse.telephone.replace(/\s/g, '')}`}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-teal/10 bg-teal-light p-3 shadow-sm active:scale-95"
                >
                  <Phone className="h-5 w-5 text-teal" />
                  <span className="text-xs font-semibold text-teal-900">Appeler</span>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(paroisse.adresse)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-teal/10 bg-teal-light p-3 shadow-sm active:scale-95"
                >
                  <MapPin className="h-5 w-5 text-teal" />
                  <span className="text-xs font-semibold text-teal-900">Itinéraire</span>
                </a>
                {paroisse.siteWeb ? (
                  <a
                    href={paroisse.siteWeb}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-teal/10 bg-teal-light p-3 shadow-sm active:scale-95"
                  >
                    <Globe className="h-5 w-5 text-teal" />
                    <span className="text-xs font-semibold text-teal-900">Site web</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-gray-100 bg-gray-50 p-3 opacity-60">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-400">Site web</span>
                  </div>
                )}
              </div>

              <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">À propos</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{paroisse.description}</p>
                <p className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  {paroisse.adresse}
                </p>
              </article>

              <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">Horaires du secrétariat</h3>
                {paroisse.horaires.length > 0 ? (
                  <ul className="mt-3 space-y-2.5">
                    {paroisse.horaires.map((h) => (
                      <li key={h} className="flex gap-3 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">Horaires non renseignés pour le moment.</p>
                )}
              </article>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Services</h3>
                <div className="space-y-2">
                  <Link
                    to={`/paroisses/${id}/messes`}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-light text-purple">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">Messes disponibles</p>
                      <p className="text-xs text-gray-500">Consulter les créneaux et réserver</p>
                    </div>
                    <span className="text-sm font-semibold text-teal">Voir →</span>
                  </Link>
                  <Link
                    to={`/paroisses/${id}/publications`}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-light text-amber-dark">
                      <Newspaper className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">Publications</p>
                      <p className="text-xs text-gray-500">Annonces et actualités de la paroisse</p>
                    </div>
                    <span className="text-sm font-semibold text-teal">Voir →</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-mobile -translate-x-1/2 border-t border-gray-100 bg-white/95 px-4 pb-safe-bottom pt-3 backdrop-blur">
              <Link
                to={`/demande/${id}`}
                className="flex min-h-touch w-full items-center justify-center gap-2 rounded-xl bg-teal font-semibold text-white shadow-lg shadow-teal/20 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                Demander une messe
              </Link>
              <Link
                to={`/paroisses/${id}/messes`}
                className="mt-2 flex min-h-touch w-full items-center justify-center text-sm font-medium text-teal active:opacity-80"
              >
                Voir les messes disponibles
              </Link>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
