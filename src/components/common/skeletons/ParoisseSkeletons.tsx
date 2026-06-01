import { Skeleton } from '../Skeleton';

export function ParoisseDashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl" aria-busy="true" aria-label="Chargement du tableau de bord">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" rounded="md" />
        <Skeleton className="h-4 w-64" rounded="md" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" rounded="2xl" />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 lg:col-span-2" rounded="2xl" />
        <Skeleton className="h-64" rounded="2xl" />
      </div>

      <Skeleton className="h-40" rounded="2xl" />
    </div>
  );
}
