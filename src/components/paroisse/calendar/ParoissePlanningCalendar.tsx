import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CreneauIntentions } from '../../../types/paroisseIntentions';

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MAX_MONTH_CELL_EVENTS = 5;

interface ParoissePlanningCalendarProps {
  creneaux: CreneauIntentions[];
  view: CalendarView;
  onDatesSet: (from: string, to: string) => void;
  onDateClick: (date: string) => void;
  onCreneauClick: (creneau: CreneauIntentions) => void;
}

function creneauColor(creneau: CreneauIntentions): string {
  if (creneau.statut === 'celebree') return 'bg-gray-500 border-gray-600';
  if (creneau.capacite_max != null && creneau.places_reservees >= creneau.capacite_max) {
    return 'bg-amber-600 border-amber-700';
  }
  return 'bg-teal border-teal-800';
}

function sortCreneaux(items: CreneauIntentions[]) {
  return [...items].sort((a, b) => `${a.date}${a.heure}`.localeCompare(`${b.date}${b.heure}`));
}

export function ParoissePlanningCalendar({
  creneaux,
  view,
  onDatesSet,
  onDateClick,
  onCreneauClick,
}: ParoissePlanningCalendarProps) {
  const [focusDate, setFocusDate] = useState(() => new Date());

  useEffect(() => {
    setFocusDate(new Date());
  }, [view]);

  const range = useMemo(() => {
    if (view === 'timeGridDay') {
      const day = format(focusDate, 'yyyy-MM-dd');
      return { from: day, to: day, label: format(focusDate, 'EEEE d MMMM yyyy', { locale: fr }) };
    }

    if (view === 'timeGridWeek') {
      const start = startOfWeek(focusDate, { weekStartsOn: 1 });
      const end = endOfWeek(focusDate, { weekStartsOn: 1 });
      return {
        from: format(start, 'yyyy-MM-dd'),
        to: format(end, 'yyyy-MM-dd'),
        label: `Semaine du ${format(start, 'd MMM', { locale: fr })} au ${format(end, 'd MMM yyyy', { locale: fr })}`,
      };
    }

    const monthStart = startOfMonth(focusDate);
    const monthEnd = endOfMonth(focusDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return {
      from: format(gridStart, 'yyyy-MM-dd'),
      to: format(gridEnd, 'yyyy-MM-dd'),
      label: format(focusDate, 'MMMM yyyy', { locale: fr }),
    };
  }, [focusDate, view]);

  useEffect(() => {
    onDatesSet(range.from, range.to);
  }, [range.from, range.to, onDatesSet]);

  const creneauxByDate = useMemo(() => {
    const map = new Map<string, CreneauIntentions[]>();
    for (const c of creneaux) {
      const list = map.get(c.date);
      if (list) list.push(c);
      else map.set(c.date, [c]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.heure.localeCompare(b.heure));
    }
    return map;
  }, [creneaux]);

  const dayStats = useMemo(() => {
    const map = new Map<string, { count: number; especes: number }>();
    for (const c of creneaux) {
      const prev = map.get(c.date) ?? { count: 0, especes: 0 };
      map.set(c.date, {
        count: prev.count + c.intentions_count,
        especes: prev.especes + c.paiements_especes_en_attente,
      });
    }
    return map;
  }, [creneaux]);

  const navigatePrev = () => {
    if (view === 'timeGridDay') setFocusDate((d) => addDays(d, -1));
    else if (view === 'timeGridWeek') setFocusDate((d) => subWeeks(d, 1));
    else setFocusDate((d) => subMonths(d, 1));
  };

  const navigateNext = () => {
    if (view === 'timeGridDay') setFocusDate((d) => addDays(d, 1));
    else if (view === 'timeGridWeek') setFocusDate((d) => addWeeks(d, 1));
    else setFocusDate((d) => addMonths(d, 1));
  };

  const goToday = () => setFocusDate(new Date());

  const monthDays = useMemo(() => {
    if (view !== 'dayGridMonth') return [];
    const monthStart = startOfMonth(focusDate);
    const monthEnd = endOfMonth(focusDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [focusDate, view]);

  const weekDays = useMemo(() => {
    if (view !== 'timeGridWeek') return [];
    const start = startOfWeek(focusDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [focusDate, view]);

  const dayCreneaux = useMemo(() => {
    if (view !== 'timeGridDay') return [];
    const key = format(focusDate, 'yyyy-MM-dd');
    return sortCreneaux(creneauxByDate.get(key) ?? []);
  }, [creneauxByDate, focusDate, view]);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-3 shadow-sm min-h-[420px]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={navigatePrev}
            className="min-h-touch min-w-touch flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            aria-label="Période précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={navigateNext}
            className="min-h-touch min-w-touch flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            aria-label="Période suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="ml-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 min-h-touch"
          >
            Aujourd&apos;hui
          </button>
        </div>
        <h2 className="text-sm font-semibold capitalize text-gray-900">{range.label}</h2>
      </div>

      {view === 'dayGridMonth' ? (
        <>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-center text-[10px] font-semibold uppercase text-gray-400 py-1">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 [grid-auto-rows:minmax(5.5rem,auto)]">
            {monthDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const inMonth = isSameMonth(day, focusDate);
              const isToday = isSameDay(day, new Date());
              const stats = dayStats.get(dateKey);
              const dayItems = creneauxByDate.get(dateKey) ?? [];
              const hiddenCount = Math.max(0, dayItems.length - MAX_MONTH_CELL_EVENTS);

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => onDateClick(dateKey)}
                  className={[
                    'min-h-[5.5rem] h-full rounded-xl border p-1.5 text-left transition-colors active:scale-[0.98]',
                    inMonth ? 'bg-white border-gray-100 hover:border-teal/30' : 'bg-gray-50/80 border-transparent text-gray-300',
                    isToday ? 'ring-2 ring-teal/40' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className={['text-xs font-semibold', inMonth ? 'text-gray-800' : 'text-gray-300'].join(' ')}>
                      {format(day, 'd')}
                    </span>
                    {stats && stats.count > 0 ? (
                      <span className="rounded-full bg-teal-light px-1.5 text-[9px] font-bold text-teal leading-4">
                        {stats.count}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {dayItems.slice(0, MAX_MONTH_CELL_EVENTS).map((c) => (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreneauClick(c);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            onCreneauClick(c);
                          }
                        }}
                        className={[
                          'truncate rounded px-1 py-0.5 text-[9px] font-medium text-white border',
                          creneauColor(c),
                        ].join(' ')}
                      >
                        {c.heure.slice(0, 5)} {c.titre}
                      </div>
                    ))}
                    {hiddenCount > 0 ? (
                      <p className="text-[9px] text-gray-400 px-0.5">+{hiddenCount} autre{hiddenCount > 1 ? 's' : ''}</p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {view === 'timeGridWeek' ? (
        <div className="space-y-3">
          {weekDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const items = sortCreneaux(creneauxByDate.get(dateKey) ?? []);
            const isToday = isSameDay(day, new Date());

            return (
              <div key={dateKey} className="rounded-xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => onDateClick(dateKey)}
                  className={[
                    'w-full flex items-center justify-between px-3 py-2 text-left',
                    isToday ? 'bg-teal-light/40' : 'bg-gray-50',
                  ].join(' ')}
                >
                  <span className="text-sm font-semibold capitalize text-gray-900">
                    {format(day, 'EEEE d MMM', { locale: fr })}
                  </span>
                  <span className="text-xs text-gray-500">{items.length} créneau{items.length > 1 ? 'x' : ''}</span>
                </button>
                {items.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-gray-400">Aucun créneau</p>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {items.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => onCreneauClick(c)}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-gray-50 min-h-touch"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{c.titre}</p>
                            <p className="text-xs text-gray-500">{c.heure.slice(0, 5)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-semibold text-teal">{c.intentions_count} int.</p>
                            {c.paiements_especes_en_attente > 0 ? (
                              <p className="text-[10px] text-amber-700">{c.paiements_especes_en_attente} esp.</p>
                            ) : null}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {view === 'timeGridDay' ? (
        <div>
          <button
            type="button"
            onClick={() => onDateClick(format(focusDate, 'yyyy-MM-dd'))}
            className="mb-3 text-xs font-medium text-teal hover:underline"
          >
            Voir le panneau détaillé du jour
          </button>
          {dayCreneaux.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">Aucun créneau ce jour-là.</p>
          ) : (
            <ul className="space-y-2">
              {dayCreneaux.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onCreneauClick(c)}
                    className={[
                      'w-full rounded-xl border px-4 py-3 text-left text-white shadow-sm min-h-touch active:scale-[0.99]',
                      creneauColor(c),
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{c.titre}</p>
                        <p className="text-sm opacity-90">{c.heure.slice(0, 5)}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>{c.intentions_count} intention{c.intentions_count > 1 ? 's' : ''}</p>
                        {c.paiements_especes_en_attente > 0 ? (
                          <p className="text-xs opacity-90">{c.paiements_especes_en_attente} espèces</p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
