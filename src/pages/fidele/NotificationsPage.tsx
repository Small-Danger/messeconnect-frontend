import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, CheckCircle2, CreditCard, ListOrdered } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { fideleService } from '../../services/fideleService';
import { useAuthStore } from '../../stores/authStore';
import type { FideleNotification } from '../../types/fidele';

const typeIcons: Record<string, typeof Bell> = {
  confirmation: ListOrdered,
  paiement: CreditCard,
  statut: CheckCircle2,
};

function NotificationSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2">
          <Skeleton className="h-4 w-2/3" rounded="md" />
          <Skeleton className="h-3 w-full" rounded="md" />
          <Skeleton className="h-3 w-1/3" rounded="md" />
        </div>
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: FideleNotification;
  onOpen: (notification: FideleNotification) => void;
}) {
  const Icon = typeIcons[notification.type] ?? Bell;
  const isUnread = notification.statut !== 'lue';
  const dateLabel = format(parseISO(notification.dateEnvoi), 'd MMM yyyy · HH:mm', { locale: fr });

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={[
        'w-full text-left rounded-2xl border p-4 transition-colors active:scale-[0.99]',
        isUnread
          ? 'border-teal/20 bg-teal-light/40 shadow-sm'
          : 'border-gray-100 bg-white',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            isUnread ? 'bg-teal text-white' : 'bg-gray-100 text-gray-500',
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-gray-900 text-sm leading-snug">{notification.titre}</p>
            {isUnread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal" aria-hidden /> : null}
          </div>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">{notification.contenu}</p>
          <p className="mt-2 text-xs text-gray-400">{dateLabel}</p>
        </div>
      </div>
    </button>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [notifications, setNotifications] = useState<FideleNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fideleService
      .getNotifications(token)
      .then((items) => {
        if (!cancelled) setNotifications(items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filtered = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => n.statut !== 'lue');
    }
    return notifications;
  }, [filter, notifications]);

  const unreadCount = notifications.filter((n) => n.statut !== 'lue').length;

  const handleOpen = async (notification: FideleNotification) => {
    if (notification.statut !== 'lue' && token) {
      try {
        const updated = await fideleService.markNotificationRead(token, notification.id);
        setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } catch {
        /* navigation possible même si marquage échoue */
      }
    }

    if (notification.demandeMesseId) {
      navigate(`/demandes/${notification.demandeMesseId}`);
    }
  };

  return (
    <MobileLayout header={<PageHeader title="Notifications" backTo="/profile" />}>
      <div className="px-4 py-4">
        {!token ? (
          <EmptyState
            title="Connectez-vous"
            description="Vos alertes de demandes et paiements apparaîtront ici."
            action={
              <Link to="/auth/login" className="text-sm font-semibold text-teal">
                Se connecter
              </Link>
            }
          />
        ) : (
          <>
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium min-h-touch',
                  filter === 'all' ? 'bg-teal text-white' : 'bg-white border border-gray-200 text-gray-600',
                ].join(' ')}
              >
                Toutes
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium min-h-touch',
                  filter === 'unread' ? 'bg-teal text-white' : 'bg-white border border-gray-200 text-gray-600',
                ].join(' ')}
              >
                Non lues {unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
            </div>

            {loading ? (
              <NotificationSkeleton />
            ) : filtered.length === 0 ? (
              <EmptyState
                title={filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                description={
                  filter === 'unread'
                    ? 'Vous êtes à jour.'
                    : 'Les mises à jour de vos demandes et paiements s\'afficheront ici.'
                }
              />
            ) : (
              <div className="space-y-3">
                {filtered.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onOpen={handleOpen} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
}
