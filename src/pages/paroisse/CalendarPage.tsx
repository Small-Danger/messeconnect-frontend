import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { MesseDetailModal } from '../../components/modals/MesseDetailModal';
import { CalendarDayPanel } from '../../components/paroisse/calendar/CalendarDayPanel';
import {
  ParoissePlanningCalendar,
  type CalendarView,
} from '../../components/paroisse/calendar/ParoissePlanningCalendar';
import { ScheduleMassDrawer } from '../../components/drawers/ScheduleMassDrawer';
import type { ParoisseMesse } from '../../services/mockApi/paroisse/data';
import { useCalendarStore } from '../../stores/calendarStore';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import type { CreneauIntentions } from '../../types/paroisseIntentions';

function toMesse(creneau: CreneauIntentions): ParoisseMesse {
  return {
    id: creneau.id,
    titre: creneau.titre,
    date: creneau.date,
    heure: creneau.heure,
    pretre: '—',
    lieu: 'Église paroisse',
    intentions: [],
    participants: creneau.places_reservees,
    capacite_max: creneau.capacite_max,
    statut: creneau.statut === 'celebree' ? 'celebree' : creneau.statut === 'annulee' ? 'annulee' : 'planifiee',
  };
}

export default function CalendarPage() {
  const { openScheduleDrawer } = useCalendarStore();
  const { calendarCreneaux, calendarPlanningLoading, loadCalendarPlanning, loadPlanningIntentions } =
    useParoisseAppStore();

  const [view, setView] = useState<CalendarView>('dayGridMonth');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCreneau, setSelectedCreneau] = useState<CreneauIntentions | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDatesSet = useCallback(
    (from: string, to: string) => {
      void loadCalendarPlanning(from, to);
    },
    [loadCalendarPlanning],
  );

  const openCreneau = (creneau: CreneauIntentions) => {
    setSelectedCreneau(creneau);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Calendrier des messes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cliquez sur une date pour voir les créneaux — ou sur une messe pour la feuille d&apos;intentions.
          </p>
        </div>
        <div className="flex gap-2">
          {(['dayGridMonth', 'timeGridWeek', 'timeGridDay'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={[
                'px-3 py-2 rounded-lg text-xs font-medium min-h-touch',
                view === v ? 'bg-teal text-white' : 'bg-white border border-gray-200 text-gray-600',
              ].join(' ')}
            >
              {v === 'dayGridMonth' ? 'Mois' : v === 'timeGridWeek' ? 'Semaine' : 'Jour'}
            </button>
          ))}
          <button
            type="button"
            onClick={openScheduleDrawer}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-amber text-white text-sm font-medium min-h-touch"
          >
            <Plus className="h-4 w-4" /> Programmer
          </button>
        </div>
      </div>

      {calendarPlanningLoading ? (
        <p className="text-xs text-teal animate-pulse">Chargement du planning…</p>
      ) : null}

      <ParoissePlanningCalendar
        creneaux={calendarCreneaux}
        view={view}
        onDatesSet={handleDatesSet}
        onDateClick={setSelectedDate}
        onCreneauClick={openCreneau}
      />

      <CalendarDayPanel
        date={selectedDate}
        creneaux={calendarCreneaux}
        onClose={() => setSelectedDate(null)}
        onViewCreneau={openCreneau}
      />

      <MesseDetailModal
        open={modalOpen && !!selectedCreneau}
        onClose={() => {
          setModalOpen(false);
          setSelectedCreneau(null);
        }}
        messe={selectedCreneau ? toMesse(selectedCreneau) : null}
        onCelebrated={() => {
          const range = useParoisseAppStore.getState().lastCalendarRange;
          void loadPlanningIntentions();
          if (range) void loadCalendarPlanning(range.from, range.to);
        }}
        onUpdated={() => {
          const range = useParoisseAppStore.getState().lastCalendarRange;
          void loadPlanningIntentions();
          if (range) void loadCalendarPlanning(range.from, range.to);
        }}
        onDeleted={() => {
          const range = useParoisseAppStore.getState().lastCalendarRange;
          void loadPlanningIntentions();
          if (range) void loadCalendarPlanning(range.from, range.to);
        }}
        onCancelled={() => {
          const range = useParoisseAppStore.getState().lastCalendarRange;
          void loadPlanningIntentions();
          if (range) void loadCalendarPlanning(range.from, range.to);
        }}
      />

      <ScheduleMassDrawer />
    </div>
  );
}
