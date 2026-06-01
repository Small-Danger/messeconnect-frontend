import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MesseSlotSkeleton } from '../common/skeletons/FideleSkeletons';
import type { MockMesse } from '../../services/mockApi/data';

interface MessePickerProps {
  messes: MockMesse[];
  loading?: boolean;
  selectedMesseId?: string;
  onSelect: (messe: MockMesse) => void;
}

function placesTone(remaining: number, capacity: number) {
  const ratio = capacity > 0 ? remaining / capacity : 0;
  if (remaining <= 0) return 'bg-red-400';
  if (ratio <= 0.25) return 'bg-amber-400';
  return 'bg-teal';
}

export function MessePicker({ messes, loading = false, selectedMesseId, onSelect }: MessePickerProps) {
  const datesWithMesses = useMemo(() => {
    const map = new Map<string, MockMesse[]>();
    for (const messe of messes) {
      const list = map.get(messe.date) ?? [];
      list.push(messe);
      map.set(messe.date, list);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, slots]) => ({
        date,
        slots: slots.sort((a, b) => a.heure.localeCompare(b.heure)),
      }));
  }, [messes]);

  const [selectedDate, setSelectedDate] = useState(datesWithMesses[0]?.date ?? '');

  useEffect(() => {
    if (!datesWithMesses.length) {
      setSelectedDate('');
      return;
    }
    const stillValid = datesWithMesses.some((d) => d.date === selectedDate);
    if (!stillValid) {
      setSelectedDate(datesWithMesses[0].date);
    }
  }, [datesWithMesses, selectedDate]);

  const slotsForDate = datesWithMesses.find((d) => d.date === selectedDate)?.slots ?? [];

  if (loading && messes.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-14 shrink-0 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
        {[1, 2].map((i) => (
          <MesseSlotSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (messes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-700">Aucune messe disponible</p>
        <p className="mt-1 text-xs text-gray-500">Revenez plus tard ou contactez la paroisse.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Choisir une date</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {datesWithMesses.map(({ date, slots }) => {
            const day = parseISO(date);
            const isSelected = date === selectedDate;
            return (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={[
                  'shrink-0 min-w-[4.5rem] rounded-xl border px-3 py-2.5 text-center transition-all active:scale-95',
                  isSelected
                    ? 'border-teal bg-teal text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700',
                ].join(' ')}
              >
                <span className="block text-[10px] uppercase tracking-wide opacity-80">
                  {format(day, 'EEE', { locale: fr })}
                </span>
                <span className="block text-lg font-semibold leading-tight">{format(day, 'd')}</span>
                <span className="block text-[10px] opacity-80">{slots.length} créneau{slots.length > 1 ? 'x' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <Clock className="h-4 w-4 text-teal" />
          Créneaux du {selectedDate ? format(parseISO(selectedDate), 'd MMMM', { locale: fr }) : '—'}
        </p>
        <div className="space-y-2">
          {slotsForDate.map((messe) => {
            const selected = selectedMesseId === messe.id;
            const capacity = messe.capacite || Math.max(messe.placesRestantes, 1);
            const filled = Math.max(0, capacity - messe.placesRestantes);
            const fillPercent = Math.min(100, Math.round((filled / capacity) * 100));

            return (
              <button
                key={messe.id}
                type="button"
                onClick={() => onSelect(messe)}
                className={[
                  'w-full rounded-2xl border p-4 text-left transition-all active:scale-[0.99]',
                  selected
                    ? 'border-teal bg-teal-light ring-2 ring-teal/20 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-teal/30',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      'shrink-0 rounded-xl px-3 py-2 text-center min-w-[4.5rem]',
                      selected ? 'bg-teal text-white' : 'bg-gray-100 text-gray-800',
                    ].join(' ')}
                  >
                    <span className="block text-lg font-bold leading-none">{messe.heure.slice(0, 5)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{messe.titre}</p>
                    <p className="mt-1 text-xs text-gray-500">{messe.placesRestantes} places restantes</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all ${placesTone(messe.placesRestantes, capacity)}`}
                        style={{ width: `${100 - fillPercent}%` }}
                      />
                    </div>
                  </div>
                  <div
                    className={[
                      'mt-1 h-5 w-5 shrink-0 rounded-full border-2',
                      selected ? 'border-teal bg-teal' : 'border-gray-300 bg-white',
                    ].join(' ')}
                    aria-hidden
                  >
                    {selected ? (
                      <span className="flex h-full w-full items-center justify-center text-[10px] text-white">✓</span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
