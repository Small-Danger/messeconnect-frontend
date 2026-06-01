import { Skeleton, SkeletonText } from '../Skeleton';

export function ParishCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        'block shrink-0 overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-sm',
        compact ? 'min-w-[272px]' : 'w-full',
      ].join(' ')}
      aria-hidden
    >
      <Skeleton className={compact ? 'h-[148px] w-full' : 'h-44 w-full'} rounded="none" />
      <div className={compact ? 'space-y-2 p-3.5' : 'space-y-2 p-4'}>
        <Skeleton className="h-4 w-3/4" rounded="md" />
        <div className="flex justify-between gap-2">
          <Skeleton className="h-3 w-1/2" rounded="md" />
          <Skeleton className="h-5 w-16" rounded="full" />
        </div>
      </div>
    </div>
  );
}

export function CampagneHighlightSkeleton() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-sm" aria-hidden>
      <Skeleton className="h-44 w-full" rounded="none" />
      <div className="relative -mt-6 mx-4 space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-10 w-1/3" rounded="md" />
          <Skeleton className="h-10 w-1/3" rounded="md" />
        </div>
        <Skeleton className="h-2.5 w-full" rounded="full" />
        <Skeleton className="h-4 w-2/5" rounded="md" />
      </div>
      <div className="h-4" />
    </div>
  );
}

export function CampagneCardSkeleton() {
  return (
    <article className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm" aria-hidden>
      <Skeleton className="w-full h-40" rounded="none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-4/5" rounded="md" />
        <div className="flex justify-between gap-2">
          <Skeleton className="h-3 w-1/3" rounded="md" />
          <Skeleton className="h-3 w-1/3" rounded="md" />
        </div>
        <Skeleton className="h-2.5 w-full" rounded="full" />
        <Skeleton className="h-3 w-1/4" rounded="md" />
        <Skeleton className="h-12 w-full" rounded="xl" />
      </div>
    </article>
  );
}

export function PublicationCardSkeleton() {
  return (
    <article className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm" aria-hidden>
      <Skeleton className="w-full aspect-[16/10]" rounded="none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/4" rounded="md" />
        <Skeleton className="h-5 w-3/4" rounded="md" />
        <SkeletonText lines={2} />
      </div>
    </article>
  );
}

export function ParishDetailSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <Skeleton className="h-60 w-full" rounded="none" />
      <div className="px-4 space-y-3">
        <SkeletonText lines={3} />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16" rounded="xl" />
          <Skeleton className="h-16" rounded="xl" />
          <Skeleton className="h-16" rounded="xl" />
        </div>
        <Skeleton className="h-32 w-full" rounded="2xl" />
      </div>
    </div>
  );
}

export function HomeFeedSkeleton() {
  return (
    <div className="space-y-7" aria-hidden>
      <div>
        <Skeleton className="mb-3 h-5 w-40" rounded="md" />
        <CampagneHighlightSkeleton />
      </div>
      <div>
        <Skeleton className="mb-3 h-5 w-44" rounded="md" />
        <div className="-mx-4 flex gap-3 overflow-hidden px-4">
          <ParishCardSkeleton compact />
          <ParishCardSkeleton compact />
          <ParishCardSkeleton compact />
        </div>
      </div>
    </div>
  );
}

export function MesseSlotSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white border border-gray-100 p-4" aria-hidden>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" rounded="md" />
        <Skeleton className="h-3 w-1/3" rounded="md" />
      </div>
      <Skeleton className="h-10 w-24" rounded="xl" />
    </div>
  );
}

export function CampagneDonSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <article className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
        <Skeleton className="w-full h-36" rounded="none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" rounded="md" />
          <div className="flex justify-between gap-2">
            <Skeleton className="h-3 w-1/3" rounded="md" />
            <Skeleton className="h-3 w-1/3" rounded="md" />
          </div>
          <Skeleton className="h-2.5 w-full" rounded="full" />
        </div>
      </article>
      <Skeleton className="h-5 w-32" rounded="md" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-12" rounded="xl" />
        <Skeleton className="h-12" rounded="xl" />
        <Skeleton className="h-12" rounded="xl" />
      </div>
      <Skeleton className="h-12 w-full" rounded="xl" />
    </div>
  );
}

export function DemandeCardSkeleton() {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-4 min-h-[88px]"
      aria-hidden
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" rounded="full" />
          <Skeleton className="h-3 w-28" rounded="md" />
        </div>
        <Skeleton className="h-4 w-3/4" rounded="md" />
        <Skeleton className="h-3 w-1/2" rounded="md" />
        <Skeleton className="h-3 w-2/5" rounded="md" />
      </div>
      <div className="space-y-2 shrink-0">
        <Skeleton className="h-4 w-16 ml-auto" rounded="md" />
        <Skeleton className="h-5 w-5 ml-auto" rounded="md" />
      </div>
    </div>
  );
}

export function PaiementCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4" aria-hidden>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" rounded="md" />
          <Skeleton className="h-3 w-40" rounded="md" />
          <Skeleton className="h-3 w-24" rounded="md" />
        </div>
        <div className="space-y-2 shrink-0 text-right">
          <Skeleton className="h-5 w-20 ml-auto" rounded="md" />
          <Skeleton className="h-5 w-14 ml-auto" rounded="full" />
        </div>
      </div>
    </div>
  );
}

export function PaymentMethodSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4" aria-hidden>
      <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-100 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded-md bg-gray-100 animate-pulse" />
        <div className="h-3 w-48 rounded-md bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

export function DemandeListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <DemandeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PaiementListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <PaiementCardSkeleton key={i} />
      ))}
    </div>
  );
}
