import { Church } from 'lucide-react';
import { useState } from 'react';
import { resolveAssetUrl } from '../../lib/images';
import { Skeleton } from './Skeleton';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  width,
  height,
  fallbackLabel = 'Photo indisponible',
}: SafeImageProps) {
  const resolvedSrc = resolveAssetUrl(src);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!resolvedSrc) {
    return (
      <div
        className={['flex flex-col items-center justify-center bg-teal-light text-teal-800', className].join(' ')}
        role="img"
        aria-label={alt}
      >
        <Church className="h-10 w-10 opacity-60" strokeWidth={1.5} />
        <span className="text-xs mt-2 px-3 text-center opacity-80">{fallbackLabel}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={['flex flex-col items-center justify-center bg-teal-light text-teal-800', className].join(' ')}
        role="img"
        aria-label={alt}
      >
        <Church className="h-10 w-10 opacity-60" strokeWidth={1.5} />
        <span className="text-xs mt-2 px-3 text-center opacity-80">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <div className={['relative overflow-hidden', className].join(' ')}>
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
          'h-full w-full object-cover transition-all duration-500 ease-out',
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-[1.02]',
        ].join(' ')}
      />
    </div>
  );
}
