interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label = 'ou continuer avec' }: AuthDividerProps) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
