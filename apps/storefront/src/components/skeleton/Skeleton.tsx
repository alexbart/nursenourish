import { twMerge } from "tailwind-merge";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "animate-pulse rounded-xl bg-secondary/20",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-border">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-6 text-center border border-border">
      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
      <Skeleton className="h-5 w-2/3 mx-auto" />
    </div>
  );
}