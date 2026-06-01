import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicationCard } from '../../components/cards/PublicationCard';
import { BlurReveal } from '../../components/common/BlurReveal';
import { EmptyState } from '../../components/common/EmptyState';
import { PublicationCardSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { fideleService } from '../../services/fideleService';
import type { MockPublication } from '../../services/mockApi/data';
import { useAuthStore } from '../../stores/authStore';

export default function PublicationsPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  const [publications, setPublications] = useState<MockPublication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fideleService.getPublications(id, token).then(setPublications).finally(() => setLoading(false));
    }
  }, [id, token]);

  return (
    <MobileLayout header={<PageHeader title="Publications" backTo={`/paroisses/${id}`} />}>
      <div className="px-4 py-4">
        <div key={loading ? 'loading' : 'ready'} className="space-y-4">
          {loading ? (
            [1, 2].map((i) => <PublicationCardSkeleton key={i} />)
          ) : publications.length === 0 ? (
            <EmptyState title="Aucune publication" description="Cette paroisse n'a pas encore publié d'annonces." />
          ) : (
            publications.map((pub, index) => (
              <BlurReveal key={pub.id} delay={index * 0.08}>
                <PublicationCard publication={pub} />
              </BlurReveal>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
