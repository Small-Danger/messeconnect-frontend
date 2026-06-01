import type { ReactNode } from 'react';
import type { CreneauIntentions, IntentionsViewMode } from '../../../types/paroisseIntentions';
import { CreneauIntentionsCard } from './CreneauIntentionsCard';
import { CreneauIntentionsListRow } from './CreneauIntentionsListRow';

interface CreneauxWeekSectionProps {
  label: string;
  creneaux: CreneauIntentions[];
  viewMode: IntentionsViewMode;
  onView: (creneau: CreneauIntentions) => void;
}

export function CreneauxWeekSection({ label, creneaux, viewMode, onView }: CreneauxWeekSectionProps) {
  let content: ReactNode;

  if (viewMode === 'list') {
    content = (
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        {creneaux.map((creneau) => (
          <CreneauIntentionsListRow key={creneau.id} creneau={creneau} onView={onView} />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {creneaux.map((creneau) => (
          <CreneauIntentionsCard key={creneau.id} creneau={creneau} onView={onView} />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
      {content}
    </section>
  );
}
