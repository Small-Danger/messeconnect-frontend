import { addDays, addMonths, addWeeks, format, parseISO, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import type {
  HistoriquePeriodPreset,
  IntentionsPeriodPreset,
  PlanningFilters,
} from '../types/paroisseIntentions';

function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getUpcomingPeriodRange(preset: IntentionsPeriodPreset): { from: string; to: string } {
  const today = new Date();
  const from = toIsoDate(today);

  switch (preset) {
    case 'week':
      return { from, to: toIsoDate(addDays(today, 7)) };
    case 'month':
      return { from, to: toIsoDate(addMonths(today, 1)) };
    case 'quarter':
      return { from, to: toIsoDate(addMonths(today, 3)) };
    case 'all':
    default:
      return { from, to: toIsoDate(addWeeks(today, 12)) };
  }
}

export function getHistoriquePeriodRange(preset: HistoriquePeriodPreset): { from: string; to: string } {
  const today = new Date();
  const to = toIsoDate(today);

  switch (preset) {
    case 'month':
      return { from: toIsoDate(addMonths(today, -1)), to };
    case 'quarter':
      return { from: toIsoDate(addMonths(today, -3)), to };
    case 'year':
      return { from: toIsoDate(addMonths(today, -12)), to };
    case 'all':
    default:
      return { from: toIsoDate(addMonths(today, -24)), to };
  }
}

export function buildUpcomingPlanningFilters(
  preset: IntentionsPeriodPreset,
  q?: string,
): PlanningFilters {
  const { from, to } = getUpcomingPeriodRange(preset);
  return { scope: 'upcoming', from, to, q: q?.trim() || undefined };
}

export function buildHistoriquePlanningFilters(
  preset: HistoriquePeriodPreset,
  q?: string,
): PlanningFilters {
  const { from, to } = getHistoriquePeriodRange(preset);
  return { scope: 'past', from, to, q: q?.trim() || undefined };
}

export function groupByWeek<T extends { date: string }>(items: T[]) {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const weekStart = startOfWeek(parseISO(item.date), { weekStartsOn: 1 });
    const key = toIsoDate(weekStart);
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }

  return Array.from(groups.entries()).map(([weekStart, groupItems]) => ({
    weekStart,
    label: `Semaine du ${format(parseISO(weekStart), 'd MMMM yyyy', { locale: fr })}`,
    items: groupItems,
  }));
}

export function groupByMonth<T extends { date: string }>(items: T[]) {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = item.date.slice(0, 7);
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }

  return Array.from(groups.entries()).map(([monthKey, groupItems]) => ({
    monthKey,
    label: format(parseISO(`${monthKey}-01`), 'MMMM yyyy', { locale: fr }),
    items: groupItems,
  }));
}
