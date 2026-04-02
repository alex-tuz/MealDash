import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <section className="flex min-h-[calc(100dvh-12rem)] items-center justify-center">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </section>
  );
};
