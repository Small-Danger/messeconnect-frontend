import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';

export default function RecurrencesPage() {
  return (
    <MobileLayout header={<PageHeader title="Récurrences" backTo="/profile" />}>
      <div className="px-4 py-4">
        <EmptyState
          title="Demandes récurrentes"
          description="Programmez vos intentions de messe récurrentes. Fonctionnalité bientôt disponible."
        />
      </div>
    </MobileLayout>
  );
}
