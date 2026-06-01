const LOGO_SRC = '/images/messeconnect-logo.svg';

const sizeMap = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-10',
} as const;

interface MesseConnectLogoProps {
  className?: string;
  showText?: boolean;
  size?: keyof typeof sizeMap;
  /** Conservé pour compatibilité — le logo officiel garde ses couleurs sur fond clair ou foncé */
  variant?: 'default' | 'light';
}

export function MesseConnectLogo({
  className = '',
  showText = true,
  size = 'md',
}: MesseConnectLogoProps) {
  if (!showText) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 40"
          fill="none"
          className={`${sizeMap[size]} w-auto shrink-0`}
          aria-hidden
        >
          <g stroke="#0F6E56" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8V6.5M14.25 6.5h3.5" />
            <path d="M6 17 16 9l10 8" />
            <path d="M9 17v12.5h14V17" />
            <path d="M13.25 29.5v-5.5a2.75 2.75 0 0 1 5.5 0v5.5" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={LOGO_SRC}
        alt="MesseConnect"
        className={`${sizeMap[size]} w-auto shrink-0`}
        draggable={false}
      />
    </div>
  );
}
