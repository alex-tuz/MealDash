interface ShopsSidebarSkeletonProps {
  items?: number;
}

interface ProductsGridSkeletonProps {
  items?: number;
}

export const ShopsSidebarSkeleton = ({ items = 8 }: ShopsSidebarSkeletonProps) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4 min-h-[calc(100dvh-10rem)]">
      <div className="mb-3 h-4 w-20 rounded bg-slate-200 animate-pulse" />

      <div className="mb-3 h-9 w-full rounded-lg bg-slate-200 animate-pulse" />

      <div className="border-t border-slate-200 pt-3">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="h-[44px] rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    </aside>
  );
};

export const ProductsGridSkeleton = ({ items = 6 }: ProductsGridSkeletonProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, index) => (
        <article key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-40 w-full rounded-xl bg-slate-200 animate-pulse" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-14 rounded bg-slate-200 animate-pulse" />
              <div className="h-9 w-24 rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
