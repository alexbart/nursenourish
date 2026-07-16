import { twMerge } from "tailwind-merge";

export function Skeleton({ className }: { className?: string }) {
  return <div className={twMerge("animate-pulse rounded-lg bg-border", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2 mt-1" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 flex flex-col items-center gap-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
