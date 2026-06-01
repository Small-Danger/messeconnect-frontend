import { Church } from 'lucide-react';
import { useState } from 'react';
import { resolveAssetUrl } from '../../lib/images';
import { Skeleton } from './Skeleton';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Remplit le parent `relative` avec hauteur ou `aspect-ratio` définis. */
  fill?: boolean;
  width?: number;
  height?: number;
  fallbackLabel?: string;
}

function ImageFallback({
  className,
  alt,
  fallbackLabel,
}: {
  className: string;
  alt: string;
  fallbackLabel: string;
}) {
  return (
    <div
      className={['flex h-full w-full flex-col items-center justify-center bg-teal-light text-teal-800', className].join(
        ' ',
      )}
      role="img"
      aria-label={alt}
    >
      <Church className="h-10 w-10 opacity-60" strokeWidth={1.5} />
      <span className="mt-2 px-3 text-center text-xs opacity-80">{fallbackLabel}</span>
    </div>
  );
}

export function SafeImage({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  fallbackLabel = 'Photo indisponible',
}: SafeImageProps) {
  const resolvedSrc = resolveAssetUrl(src);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const containerClass = fill
    ? ['absolute inset-0 overflow-hidden', className].join(' ')
    : ['relative overflow-hidden', className].join(' ');

  if (!resolvedSrc || error) {
    return <ImageFallback className={fill ? 'absolute inset-0' : className} alt={alt} fallbackLabel={fallbackLabel} />;
  }

  return (
    <div className={containerClass}>
      {!loaded ? <Skeleton className="absolute inset-0 h-full w-full" rounded="none" aria-hidden /> : null}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={[
          'h-full w-full object-cover object-center transition-all duration-500 ease-out',
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-[1.02]',
        ].join(' ')}
      />
    </div>
  );
}
