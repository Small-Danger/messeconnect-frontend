import { Church, Heart, MapPin, Navigation, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../common/SafeImage';
import type { MockParoisse } from '../../services/mockApi/data';

interface ParishCardProps {
  paroisse: MockParoisse;
  onToggleFavori?: (id: string) => void;
  compact?: boolean;
  featured?: boolean;
}

function dioceseLabel(diocese: string) {
  return diocese.replace('Archidiocèse de ', '').replace('Diocèse de ', '');
}

export function ParishCard({
  paroisse,
  onToggleFavori,
  compact = false,
  featured = false,
}: ParishCardProps) {
  const isCompact = compact || featured;
  const shortDiocese = dioceseLabel(paroisse.diocese);

  return (
    <Link
      to={`/paroisses/${paroisse.id}`}
      className={[
        'group relative block overflow-hidden rounded-[22px] border border-gray-100/80 bg-white',
        'shadow-[0_14px_36px_-14px_rgba(15,110,86,0.22)] active:scale-[0.98] transition-all duration-200',
        isCompact ? 'min-w-[272px] snap-start shrink-0' : 'w-full',
      ].join(' ')}
    >
      <div className={`relative overflow-hidden ${isCompact ? 'h-[148px]' : 'h-44'}`}>
        <SafeImage
          src={paroisse.image}
          alt={paroisse.nom}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-active:scale-105"
          width={400}
          height={176}
          fallbackLabel={paroisse.nom}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#032821]/95 via-[#04342c]/35 to-transparent" />

        {onToggleFavori ? (
          <button
            type="button"
            aria-label={paroisse.estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavori(paroisse.id);
            }}
            className={[
              'absolute right-3 top-3 flex min-h-touch min-w-touch items-center justify-center rounded-full border backdrop-blur-md transition-all active:scale-95',
              paroisse.estFavori
                ? 'border-red-200/50 bg-white/95 shadow-sm'
                : 'border-white/30 bg-white/15',
            ].join(' ')}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${paroisse.estFavori ? 'fill-red-400 text-red-400' : 'text-white/90'}`}
            />
          </button>
        ) : null}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="inline-flex max-w-[70%] items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md truncate">
            {shortDiocese}
          </span>
          {!isCompact ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              Ouverte
            </span>
          ) : null}
        </div>
      </div>

      <div className={isCompact ? 'p-3.5' : 'p-4'}>
        <h3
          className={`font-bold text-gray-900 leading-snug ${isCompact ? 'text-[15px] line-clamp-2' : 'text-base line-clamp-2'}`}
        >
          {paroisse.nom}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-teal" />
            <span className="truncate">{paroisse.ville}</span>
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-light px-2.5 py-1 text-[11px] font-bold text-teal">
            <Navigation className="h-3 w-3" />
            {paroisse.distance}
          </span>
        </div>

        {!isCompact ? (
          <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-teal">
              <Church className="h-3.5 w-3.5" />
              Demander une messe
            </span>
            <span className="text-xs font-semibold text-gray-400 transition-colors group-hover:text-teal">
              Voir →
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
