import type { ParoisseDemande } from '../../../services/mockApi/paroisse/data';
import { DemandeStatutBadge } from '../DemandeStatutBadge';
import { formatDateShort } from '../../../utils/formatDate';
import { formatFcfa } from '../../../utils/formatCurrency';

interface HistoriqueIntentionRowProps {
  demande: ParoisseDemande;
  onSelect?: (demande: ParoisseDemande) => void;
}

export function HistoriqueIntentionRow({ demande, onSelect }: HistoriqueIntentionRowProps) {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-teal truncate">{demande.reference}</p>
        <p className="text-sm font-medium text-gray-900 mt-1 truncate">{demande.fideleNom}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{demande.intention}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-900">{formatFcfa(demande.montant)}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDateShort(demande.date)}</p>
      </div>
      <DemandeStatutBadge statut={demande.statut} />
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(demande)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 border-b border-gray-50 last:border-0"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
      {content}
    </div>
  );
}
