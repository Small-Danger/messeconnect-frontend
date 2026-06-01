import { Bell, ChevronRight, HeadphonesIcon, ListOrdered, Wallet } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import { useSupportStore } from '../../stores/supportStore';

interface ParoisseAlert {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: typeof Bell;
}

export function ParoisseNotificationMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const cashPending = useParoisseAppStore((s) => s.cashPending);
  const dashboard = useParoisseAppStore((s) => s.dashboard);
  const loadCashPending = useParoisseAppStore((s) => s.loadCashPending);
  const loadDashboard = useParoisseAppStore((s) => s.loadDashboard);

  const allTickets = useSupportStore((s) => s.allTickets);
  const loadTickets = useSupportStore((s) => s.loadTickets);

  useEffect(() => {
    void loadCashPending();
    void loadDashboard();
    void loadTickets();
  }, [loadCashPending, loadDashboard, loadTickets]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const alerts = useMemo(() => {
    const items: ParoisseAlert[] = [];

    if (cashPending.length > 0) {
      items.push({
        id: 'cash-pending',
        title: `${cashPending.length} paiement${cashPending.length > 1 ? 's' : ''} espèces`,
        description: 'À confirmer avant la célébration',
        to: '/paroisse/intentions?tab=especes',
        icon: Wallet,
      });
    }

    const pendingIntentions = dashboard?.demandesUrgentes?.length ?? 0;
    if (pendingIntentions > 0) {
      items.push({
        id: 'intentions-pending',
        title: `${pendingIntentions} intention${pendingIntentions > 1 ? 's' : ''} en attente`,
        description: 'Demandes à valider ou traiter',
        to: '/paroisse/intentions',
        icon: ListOrdered,
      });
    }

    const openTickets = allTickets.filter((t) => t.statut === 'ouvert' || t.statut === 'en_cours').length;
    if (openTickets > 0) {
      items.push({
        id: 'support-open',
        title: `${openTickets} demande${openTickets > 1 ? 's' : ''} MesseConnect`,
        description: 'Suivi auprès du support technique',
        to: '/paroisse/support',
        icon: HeadphonesIcon,
      });
    }

    return items;
  }, [cashPending.length, dashboard?.demandesUrgentes, allTickets]);

  const count = alerts.length;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={count > 0 ? `${count} notification${count > 1 ? 's' : ''}` : 'Notifications'}
        aria-expanded={open}
        className={[
          'relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors',
          open ? 'border-teal/30 bg-teal-light text-teal' : 'border-gray-200 bg-white text-gray-600 hover:border-teal/20 hover:bg-teal-light/40 hover:text-teal',
        ].join(' ')}
      >
        <Bell className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            <p className="text-xs text-gray-500 mt-0.5">Actions à traiter au secrétariat</p>
          </div>

          {alerts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto h-6 w-6 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-700">Rien à signaler</p>
              <p className="mt-1 text-xs text-gray-500">Vous êtes à jour pour le moment.</p>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <li key={alert.id}>
                    <Link
                      to={alert.to}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-gray-900">{alert.title}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">{alert.description}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-2" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
