interface ChartPlaceholderProps {
  title?: string;
}

export function ChartPlaceholder({ title = 'Graphique à venir' }: ChartPlaceholderProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <div className="mt-4 h-40 rounded-lg bg-gray-100 animate-pulse" />
    </div>
  );
}
