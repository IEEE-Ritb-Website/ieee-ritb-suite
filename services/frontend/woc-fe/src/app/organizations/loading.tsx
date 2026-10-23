export default function OrganizationsLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading organizations"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="h-4 w-40 animate-pulse bg-zinc-900/10 dark:bg-zinc-100/10" />
      <div className="mt-4 h-12 w-72 animate-pulse bg-zinc-900/10 dark:bg-zinc-100/10" />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="h-32 animate-pulse border border-zinc-900/10 dark:border-zinc-100/10"
          />
        ))}
      </div>
    </div>
  );
}
