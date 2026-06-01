import { Search } from 'lucide-react';
import type { HistoriquePeriodPreset, HistoriqueVue } from '../../../types/paroisseIntentions';

const periodOptions: { value: HistoriquePeriodPreset; label: string }[] = [
  { value: 'month', label: '1 mois' },
  { value: 'quarter', label: '3 mois' },
  { value: 'year', label: '1 an' },
  { value: 'all', label: 'Tout' },
];

const vueOptions: { value: HistoriqueVue; label: string }[] = [
  { value: 'historique', label: 'Toutes' },
  { value: 'celebre', label: 'Célébrées' },
  { value: 'annulee', label: 'Annulées' },
];

interface HistoriqueFiltersBarProps {
  period: HistoriquePeriodPreset;
  onPeriodChange: (period: HistoriquePeriodPreset) => void;
  vue: HistoriqueVue;
  onVueChange: (vue: HistoriqueVue) => void;
  query: string;
  onQueryChange: (query: string) => void;
  resultCount?: number;
}

export function HistoriqueFiltersBar({
  period,
  onPeriodChange,
  vue,
  onVueChange,
  query,
  onQueryChange,
  resultCount,
}: HistoriqueFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onPeriodChange(option.value)}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-medium min-h-touch',
              period === option.value
                ? 'bg-teal text-white'
                : 'bg-gray-50 text-gray-600 border border-gray-200',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
        {resultCount != null ? (
          <span className="ml-auto text-xs text-gray-500">
            {resultCount} intention{resultCount > 1 ? 's' : ''}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {vueOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onVueChange(option.value)}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-medium min-h-touch',
              vue === option.value
                ? 'bg-gray-800 text-white'
                : 'bg-gray-50 text-gray-600 border border-gray-200',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Référence, fidèle, intention…"
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
      </label>
    </div>
  );
}
