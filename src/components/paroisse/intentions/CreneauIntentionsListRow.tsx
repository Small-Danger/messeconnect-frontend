import { ChevronRight } from 'lucide-react';
import type { CreneauIntentions } from '../../../types/paroisseIntentions';
import { formatDateShort } from '../../../utils/formatDate';
import { formatFcfa } from '../../../utils/formatCurrency';

interface CreneauIntentionsListRowProps {
  creneau: CreneauIntentions;
  onView: (creneau: CreneauIntentions) => void;
}

export function CreneauIntentionsListRow({ creneau, onView }: CreneauIntentionsListRowProps) {
  return (
    <button
      type="button"
      onClick={() => onView(creneau)}
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-teal-light/20 active:bg-teal-light/40 border-b border-gray-50 last:border-0"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{creneau.titre}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatDateShort(creneau.date)} · {creneau.heure.slice(0, 5)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-teal">{creneau.intentions_count} intention{creneau.intentions_count > 1 ? 's' : ''}</p>
        <p className="text-xs text-gray-400">{formatFcfa(creneau.montant_collecte)}</p>
      </div>
      {creneau.paiements_especes_en_attente > 0 ? (
        <span className="shrink-0 rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-semibold text-amber-dark">
          {creneau.paiements_especes_en_attente}
        </span>
      ) : null}
      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
    </button>
  );
}
