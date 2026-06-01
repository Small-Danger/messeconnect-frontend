interface MobileCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
}

export function MobileCard({ title, subtitle, badge, onClick }: MobileCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border border-gray-100 bg-white p-4 min-h-touch active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{title}</p>
          {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {badge ? (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-light text-teal-800">
              {badge}
            </span>
          ) : null}
          <span className="text-gray-400">›</span>
        </div>
      </div>
    </button>
  );
}
