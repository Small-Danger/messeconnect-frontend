import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlurReveal } from '../../components/common/BlurReveal';
import { MesseSlotSkeleton } from '../../components/common/skeletons/FideleSkeletons';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import type { MockMesse } from '../../services/mockApi/data';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import { useDemandeFlowStore } from '../../stores/demandeFlowStore';

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function placesLabel(messe: MockMesse): string {
  if (messe.placesRestantes <= 0) return 'Complet';
  if (messe.capacite > 0 && messe.placesRestantes >= messe.capacite) {
    return `${messe.placesRestantes} places disponibles`;
  }
  return `${messe.placesRestantes} place${messe.placesRestantes > 1 ? 's' : ''} restante${messe.placesRestantes > 1 ? 's' : ''}`;
}

export default function AvailableMassesPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  const setMesses = useDemandeFlowStore((s) => s.setMesses);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [allMesses, setAllMesses] = useState<MockMesse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    const cached = useDemandeFlowStore.getState().messesByParoisse[id];
    if (cached?.length) {
      setAllMesses(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    setError(null);
    fideleService
      .getMesses(id, undefined, token)
      .then((items) => {
        if (cancelled) return;
        setAllMesses(items);
        setMesses(id, items);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Impossible de charger les messes disponibles.');
        setAllMesses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, token, setMesses]);

  const messesByDate = useMemo(() => {
    const map = new Map<string, MockMesse[]>();
    for (const messe of allMesses) {
      const list = map.get(messe.date) ?? [];
      list.push(messe);
      map.set(messe.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.heure.localeCompare(b.heure));
    }
    return map;
  }, [allMesses]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const messesInMonth = useMemo(
    () => allMesses.filter((m) => isSameMonth(parseISO(m.date), currentMonth)),
    [allMesses, currentMonth],
  );

  useEffect(() => {
    const monthPrefix = format(currentMonth, 'yyyy-MM');
    if (selectedDate.startsWith(monthPrefix)) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    if (today.startsWith(monthPrefix)) {
      setSelectedDate(today);
      return;
    }

    const firstWithMass = [...messesByDate.keys()]
      .filter((date) => date.startsWith(monthPrefix))
      .sort()[0];
    setSelectedDate(firstWithMass ?? format(startOfMonth(currentMonth), 'yyyy-MM-dd'));
  }, [currentMonth, messesByDate, selectedDate]);

  const messes = messesByDate.get(selectedDate) ?? [];

  const nextAvailableDate = useMemo(() => {
    if (messes.length > 0) return null;
    const next = allMesses
      .filter((m) => m.date >= selectedDate)
      .sort((a, b) => `${a.date}${a.heure}`.localeCompare(`${b.date}${b.heure}`))[0];
    return next?.date ?? null;
  }, [allMesses, messes.length, selectedDate]);

  return (
    <MobileLayout header={<PageHeader title="Messes disponibles" backTo={`/paroisses/${id}`} />} showBottomNav={false}>
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-teal-light/40 px-3 py-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="min-h-touch min-w-touch flex items-center justify-center rounded-xl active:bg-white/60"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-5 w-5 text-teal" />
          </button>
          <div className="text-center">
            <p className="font-semibold capitalize text-gray-900">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</p>
            {!loading ? (
              <p className="text-xs text-teal">
                {messesInMonth.length} messe{messesInMonth.length > 1 ? 's' : ''} ce mois
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="min-h-touch min-w-touch flex items-center justify-center rounded-xl active:bg-white/60"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-5 w-5 text-teal" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="py-1 text-center text-[10px] font-semibold uppercase text-gray-400">
              {label}
            </div>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const inMonth = isSameMonth(day, currentMonth);
            const isSelected = dateStr === selectedDate;
            const isToday = isSameDay(day, new Date());
            const dayMesses = messesByDate.get(dateStr) ?? [];
            const hasSlots = dayMesses.length > 0;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={[
                  'relative flex min-h-[3.25rem] flex-col items-center justify-start rounded-xl border px-0.5 pb-1 pt-1.5 text-sm font-medium transition-all active:scale-95',
                  isSelected
                    ? 'border-teal bg-teal text-white shadow-sm'
                    : hasSlots && inMonth
                      ? 'border-teal/20 bg-teal-light/70 text-teal-900'
                      : inMonth
                        ? 'border-gray-100 bg-white text-gray-700'
                        : 'border-transparent bg-gray-50/80 text-gray-300',
                  isToday && !isSelected ? 'ring-2 ring-teal/30' : '',
                ].join(' ')}
              >
                <span className="leading-none">{format(day, 'd')}</span>
                {hasSlots ? (
                  <span
                    className={[
                      'mt-1 rounded-full px-1.5 text-[9px] font-bold leading-4',
                      isSelected ? 'bg-white/20 text-white' : 'bg-teal text-white',
                    ].join(' ')}
                  >
                    {dayMesses.length}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <h3 className="mb-3 text-base font-semibold text-gray-900">
          Créneaux du {format(parseISO(selectedDate), 'd MMMM', { locale: fr })}
        </h3>

        {error ? (
          <p className="rounded-2xl border border-red-100 bg-red-50 py-6 text-center text-sm text-red-700">{error}</p>
        ) : null}

        <div className="space-y-3">
          {loading && messes.length === 0 ? (
            [1, 2, 3].map((i) => <MesseSlotSkeleton key={i} />)
          ) : messes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-700">Aucune messe disponible ce jour.</p>
              {nextAvailableDate ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(nextAvailableDate);
                    setCurrentMonth(startOfMonth(parseISO(nextAvailableDate)));
                  }}
                  className="mt-3 text-sm font-semibold text-teal hover:underline"
                >
                  Voir le {format(parseISO(nextAvailableDate), 'd MMMM', { locale: fr })}
                </button>
              ) : null}
            </div>
          ) : (
            messes.map((messe, index) => {
              const complet = messe.placesRestantes <= 0;

              return (
                <BlurReveal key={messe.id} delay={index * 0.04}>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-lg font-bold text-teal">{messe.heure.slice(0, 5)}</p>
                      <p className="font-medium text-gray-900">{messe.titre}</p>
                      <p className={`mt-1 text-sm ${complet ? 'font-medium text-red-600' : 'text-gray-500'}`}>
                        {placesLabel(messe)}
                      </p>
                    </div>
                    {complet ? (
                      <span className="shrink-0 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400">
                        Complet
                      </span>
                    ) : (
                      <Link
                        to={`/demande/${id}`}
                        state={{ messeId: messe.id, messeDate: messe.date, messeHeure: messe.heure }}
                        className="min-h-touch shrink-0 rounded-xl bg-teal px-4 text-sm font-semibold text-white flex items-center active:scale-95 shadow-sm"
                      >
                        Réserver
                      </Link>
                    )}
                  </div>
                </BlurReveal>
              );
            })
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
