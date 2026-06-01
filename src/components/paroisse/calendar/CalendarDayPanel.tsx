import { X } from 'lucide-react';
import type { CreneauIntentions } from '../../../types/paroisseIntentions';
import { CreneauIntentionsCard } from '../intentions/CreneauIntentionsCard';
import { formatDateLabel } from '../../../utils/formatDate';

interface CalendarDayPanelProps {
  date: string | null;
  creneaux: CreneauIntentions[];
  onClose: () => void;
  onViewCreneau: (creneau: CreneauIntentions) => void;
}

export function CalendarDayPanel({ date, creneaux, onClose, onViewCreneau }: CalendarDayPanelProps) {
  if (!date) return null;

  const dayCreneaux = creneaux.filter((c) => c.date === date);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-teal-light/20">
        <div>
          <p className="text-xs uppercase tracking-wide text-teal font-semibold">Créneaux du jour</p>
          <h2 className="text-sm font-semibold text-gray-900">{formatDateLabel(date)}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-white min-h-touch"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {dayCreneaux.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-500">Aucun créneau ce jour-là.</p>
      ) : (
        <div className="p-4 grid sm:grid-cols-2 gap-3">
          {dayCreneaux.map((creneau) => (
            <CreneauIntentionsCard key={creneau.id} creneau={creneau} onView={onViewCreneau} />
          ))}
        </div>
      )}
    </div>
  );
}
