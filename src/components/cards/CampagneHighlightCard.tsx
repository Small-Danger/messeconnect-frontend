import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../common/SafeImage';
import type { MockCampagne } from '../../services/mockApi/data';
import { formatFcfa } from '../../utils/formatCurrency';

interface CampagneHighlightCardProps {
  campagne: MockCampagne;
}

export function CampagneHighlightCard({ campagne }: CampagneHighlightCardProps) {
  const progress = Math.min(100, Math.round((campagne.collecte / campagne.objectif) * 100));

  return (
    <Link
      to={`/campagnes/${campagne.id}/don`}
      className="group relative block overflow-hidden rounded-[22px] border border-gray-100/80 bg-white shadow-[0_16px_40px_-16px_rgba(15,110,86,0.25)] active:scale-[0.99] transition-transform"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-teal-light">
        <SafeImage src={campagne.image} alt={campagne.titre} fill fallbackLabel={campagne.titre} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#032821] via-[#04342c]/35 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-[#E67E22] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
          Collecte active
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">{campagne.titre}</h3>
        </div>
      </div>

      <div className="relative -mt-6 mx-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Collecté</p>
            <p className="text-lg font-bold text-teal">{formatFcfa(campagne.collecte)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Objectif</p>
            <p className="text-sm font-semibold text-gray-700">{formatFcfa(campagne.objectif)}</p>
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-teal-light">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal via-teal-mid to-[#E67E22] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-teal">{progress}% atteint</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal group-active:gap-2 transition-all">
            Contribuer
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="h-4" aria-hidden />
    </Link>
  );
}
