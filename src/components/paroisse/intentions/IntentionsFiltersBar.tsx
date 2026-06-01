import { LayoutGrid, List, Search } from 'lucide-react';
import type { IntentionsPeriodPreset, IntentionsViewMode } from '../../../types/paroisseIntentions';

const periodOptions: { value: IntentionsPeriodPreset; label: string }[] = [
  { value: 'week', label: '7 jours' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: '3 mois' },
  { value: 'all', label: 'Tout' },
];

interface IntentionsFiltersBarProps {
  period: IntentionsPeriodPreset;
  onPeriodChange: (period: IntentionsPeriodPreset) => void;
  query: string;
  onQueryChange: (query: string) => void;
  viewMode: IntentionsViewMode;
  onViewModeChange: (mode: IntentionsViewMode) => void;
  resultCount?: number;
}

export function IntentionsFiltersBar({
  period,
  onPeriodChange,
  query,
  onQueryChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: IntentionsFiltersBarProps) {
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
            {resultCount} créneau{resultCount > 1 ? 'x' : ''}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher messe, fidèle, référence…"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </label>
        <div className="flex rounded-xl border border-gray-200 p-1 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('cards')}
            className={[
              'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium min-h-touch',
              viewMode === 'cards' ? 'bg-teal-light text-teal' : 'text-gray-500',
            ].join(' ')}
            aria-pressed={viewMode === 'cards'}
          >
            <LayoutGrid className="h-4 w-4" />
            Cartes
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={[
              'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium min-h-touch',
              viewMode === 'list' ? 'bg-teal-light text-teal' : 'text-gray-500',
            ].join(' ')}
            aria-pressed={viewMode === 'list'}
          >
            <List className="h-4 w-4" />
            Liste
          </button>
        </div>
      </div>
    </div>
  );
}
