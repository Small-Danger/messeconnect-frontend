import { ChevronRight, Users } from 'lucide-react';
import type { CreneauIntentions } from '../../../types/paroisseIntentions';
import { formatDateShort } from '../../../utils/formatDate';
import { formatFcfa } from '../../../utils/formatCurrency';

interface CreneauIntentionsCardProps {
  creneau: CreneauIntentions;
  onView: (creneau: CreneauIntentions) => void;
}

export function CreneauIntentionsCard({ creneau, onView }: CreneauIntentionsCardProps) {
  const placesLabel =
    creneau.capacite_max != null
      ? `${creneau.places_reservees}/${creneau.capacite_max} places`
      : `${creneau.intentions_count} intention${creneau.intentions_count > 1 ? 's' : ''}`;

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{creneau.titre}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDateShort(creneau.date)} · {creneau.heure.slice(0, 5)}
          </p>
        </div>
        {creneau.paiements_especes_en_attente > 0 ? (
          <span className="shrink-0 rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-semibold text-amber-dark">
            {creneau.paiements_especes_en_attente} espèce{creneau.paiements_especes_en_attente > 1 ? 's' : ''}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-teal-light/40 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-500">Intentions</p>
          <p className="text-lg font-semibold text-teal">{creneau.intentions_count}</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-500">Collecté</p>
          <p className="text-lg font-semibold text-gray-900">{formatFcfa(creneau.montant_collecte)}</p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1 text-xs text-gray-500">
        <Users className="h-3.5 w-3.5" />
        {placesLabel}
      </p>

      <button
        type="button"
        onClick={() => onView(creneau)}
        className="mt-4 w-full min-h-touch rounded-xl border border-teal/20 text-sm font-semibold text-teal hover:bg-teal-light/30 active:scale-[0.99]"
      >
        Voir les intentions
        <ChevronRight className="inline h-4 w-4 ml-0.5 align-[-2px]" />
      </button>
    </article>
  );
}
