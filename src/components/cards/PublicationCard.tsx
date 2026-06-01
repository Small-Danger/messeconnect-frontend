import type { MockPublication } from '../../services/mockApi/data';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SafeImage } from '../common/SafeImage';

interface PublicationCardProps {
  publication: MockPublication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const images =
    publication.images && publication.images.length > 0
      ? publication.images
      : publication.image
        ? [publication.image]
        : [];

  return (
    <article className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
      {images.length > 1 ? (
        <div className="flex gap-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {images.map((src) => (
            <SafeImage
              key={src}
              src={src}
              alt={publication.titre}
              className="w-full min-w-full aspect-[16/10] snap-center"
              width={400}
              height={250}
              fallbackLabel={publication.titre}
            />
          ))}
        </div>
      ) : (
        <SafeImage
          src={images[0]}
          alt={publication.titre}
          className="w-full aspect-[16/10]"
          width={400}
          height={250}
          fallbackLabel={publication.titre}
        />
      )}
      <div className="p-4">
        <p className="text-xs text-gray-400">
          {format(parseISO(publication.datePublication), 'd MMMM yyyy', { locale: fr })}
        </p>
        <h3 className="font-semibold text-gray-900 mt-1">{publication.titre}</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">{publication.description}</p>
      </div>
    </article>
  );
}
