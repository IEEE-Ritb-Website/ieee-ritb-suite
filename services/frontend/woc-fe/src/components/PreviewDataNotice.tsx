/**
 * Notice banner shown whenever a page renders development preview data
 * instead of live backend content.
 */

export default function PreviewDataNotice({ resource }: { resource: string }) {
  return (
    <div
      role="status"
      aria-label="Preview data notice"
      className="border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
    >
      Preview {resource} shown — the backend API is not connected yet. Set{" "}
      <code className="bg-amber-100 px-1 font-mono text-[0.85em] dark:bg-amber-900">
        NEXT_PUBLIC_WOC_API_BASE_URL
      </code>{" "}
      to load live data.
    </div>
  );
}
