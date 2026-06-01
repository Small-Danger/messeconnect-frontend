import { CardSkeleton } from './CardSkeleton';

export function PageSkeleton() {
  return (
    <div className="space-y-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
