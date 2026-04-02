interface CouponsGridSkeletonProps {
  items?: number;
}

export const CouponsGridSkeleton = ({ items = 6 }: CouponsGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, index) => (
        <article key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 h-36 w-full rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
          <div className="mt-2 h-6 w-2/3 rounded bg-slate-200 animate-pulse" />
          <div className="mt-2 h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
          <div className="mt-3 h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
        </article>
      ))}
    </div>
  );
};
