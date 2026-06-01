import { Church, Heart, ListOrdered, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAlternatingButton } from '../../components/auth/AuthAlternatingButton';
import { CampagneHighlightCard } from '../../components/cards/CampagneHighlightCard';
import { ParishCard } from '../../components/cards/ParishCard';
import { HomeFeedSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { SectionTitle } from '../../components/common/SectionTitle';
import { MesseConnectLogo } from '../../components/common/MesseConnectLogo';
import { HomeAboutSection } from '../../components/home/HomeAboutSection';
import { HomeHero } from '../../components/home/HomeHero';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import { useParoisseStore } from '../../stores/paroisseStore';

const quickLinks = [
  { icon: Church, label: 'Demander une messe', to: '/paroisses', accent: 'teal' as const },
  { icon: Search, label: 'Trouver une paroisse', to: '/paroisses', accent: 'amber' as const },
  { icon: ListOrdered, label: 'Suivre ma demande', to: '/suivi', accent: 'purple' as const },
  { icon: Heart, label: 'Mes favoris', to: '/favoris', accent: 'teal' as const },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { paroisses, campagnes, setParoisses, setCampagnes } = useParoisseStore();
  const [loadingFeed, setLoadingFeed] = useState(paroisses.length === 0 && campagnes.length === 0);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const featuredParoisses = paroisses.slice(0, 3);
  const featuredCampagne = campagnes[0] ?? null;
  const showFeedSkeleton = loadingFeed && featuredParoisses.length === 0 && !featuredCampagne;

  useEffect(() => {
    let cancelled = false;
    const showLoader = paroisses.length === 0 && campagnes.length === 0;

    if (showLoader) {
      setLoadingFeed(true);
    }

    Promise.all([
      fideleService.getParoisses(undefined, token).then((items) => {
        if (!cancelled) setParoisses(items);
      }),
      fideleService.getCampagnes(token).then((items) => {
        if (!cancelled) setCampagnes(items);
      }),
    ]).finally(() => {
      if (!cancelled) setLoadingFeed(false);
    });

    return () => {
      cancelled = true;
    };
  }, [token, setParoisses, setCampagnes]);

  return (
    <MobileLayout
      header={
        <header className="sticky top-0 z-50 flex items-center gap-2 border-b border-gray-100/70 bg-white/85 px-4 py-3 backdrop-blur-lg">
          <div className="min-w-0 flex-1">
            <MesseConnectLogo size="sm" />
          </div>
          {token ? (
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="shrink-0 rounded-full bg-teal-light px-3 py-1.5 text-xs font-semibold text-teal active:scale-95 touch-manipulation"
            >
              {user?.prenom ?? 'Profil'}
            </button>
          ) : (
            <AuthAlternatingButton />
          )}
        </header>
      }
    >
      <HomeHero />

      <div className="space-y-6 px-4 py-4">
        <section>
          <SectionTitle title="Accès rapide" subtitle="Tout en un geste" />
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((item) => (
              <QuickActionCard key={item.label} {...item} />
            ))}
          </div>
        </section>

        {showFeedSkeleton ? (
          <HomeFeedSkeleton />
        ) : (
          <>
            {featuredCampagne ? (
              <section>
                <SectionTitle title="Collecte en cours" actionLabel="Voir tout" actionTo="/campagnes" />
                <CampagneHighlightCard campagne={featuredCampagne} />
              </section>
            ) : null}

            {featuredParoisses.length > 0 ? (
              <section>
                <SectionTitle title="Paroisses près de vous" actionLabel="Tout voir" actionTo="/paroisses" />
                <div className="-mx-4 flex items-start gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scrollbar-hide">
                  {featuredParoisses.map((p) => (
                    <ParishCard key={p.id} paroisse={p} compact featured />
                  ))}
                </div>
              </section>
            ) : null}

            <HomeAboutSection />
          </>
        )}
      </div>
    </MobileLayout>
  );
}
