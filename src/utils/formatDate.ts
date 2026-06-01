import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/** Parse une date API (YYYY-MM-DD ou ISO) sans erreur silencieuse. */
export function parseApiDate(value: string): Date {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return parseISO(trimmed);
  }
  return parseISO(trimmed);
}

export function formatDateLabel(value: string): string {
  if (!value) return '—';
  return format(parseApiDate(value), 'd MMMM yyyy', { locale: fr });
}

export function formatDateShort(value: string): string {
  if (!value) return '—';
  return format(parseApiDate(value), 'd MMM yyyy', { locale: fr });
}

export function formatMesseDay(value: string): string {
  if (!value) return '—';
  return format(parseApiDate(value), 'd', { locale: fr });
}

export function formatMesseMonth(value: string): string {
  if (!value) return '';
  return format(parseApiDate(value), 'MMM', { locale: fr });
}

export function formatActivityTimestamp(dateValue: string, timeValue?: string): string {
  if (!dateValue) return '—';
  const date = parseApiDate(dateValue);
  const time = timeValue?.slice(0, 5);
  if (isToday(date)) {
    return time ? `Aujourd'hui · ${time}` : "Aujourd'hui";
  }
  if (isYesterday(date)) {
    return time ? `Hier · ${time}` : 'Hier';
  }
  const base = format(date, 'd MMM yyyy', { locale: fr });
  return time ? `${base} · ${time}` : base;
}

export function formatRelativeFromNow(value: string): string {
  if (!value) return '—';
  return formatDistanceToNow(parseApiDate(value), { addSuffix: true, locale: fr });
}
