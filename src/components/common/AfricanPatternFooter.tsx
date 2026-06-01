export function AfricanPatternFooter() {
  return (
    <div className="h-8 w-full overflow-hidden" aria-hidden>
      <svg viewBox="0 0 400 32" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="africanPattern" x="0" y="0" width="40" height="32" patternUnits="userSpaceOnUse">
            <rect width="40" height="32" fill="#0F6E56" />
            <path d="M0 16 L20 0 L40 16 L20 32 Z" fill="#BA7517" opacity="0.85" />
            <circle cx="20" cy="16" r="4" fill="#E1F5EE" opacity="0.9" />
            <path d="M10 8 L30 8 L20 24 Z" fill="#085041" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="32" fill="url(#africanPattern)" />
      </svg>
    </div>
  );
}
