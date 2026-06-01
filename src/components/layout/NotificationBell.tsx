interface NotificationBellProps {
  count?: number;
}

export function NotificationBell({ count = 0 }: NotificationBellProps) {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative min-h-touch min-w-touch flex items-center justify-center text-white active:scale-95 transition-transform"
    >
      🔔
      {count > 0 ? (
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber" />
      ) : null}
    </button>
  );
}
