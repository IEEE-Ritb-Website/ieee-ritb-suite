import type { Organization } from "@/lib/woc-types";

interface OrganizationCardProps {
  organization: Organization;
  projectCount?: number;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default function OrganizationCard({
  organization,
  projectCount,
}: OrganizationCardProps) {
  return (
    <article className="flex items-start gap-4 border border-zinc-900/10 bg-white p-6 dark:border-zinc-100/10 dark:bg-zinc-950">
      {organization.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={organization.imageUrl}
          alt={`${organization.name} logo`}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 border border-zinc-900/10 object-cover dark:border-zinc-100/10"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center bg-zinc-900 font-mono text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          {getInitials(organization.name)}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {organization.name}
        </h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {organization.tagline}
        </p>
        {typeof projectCount === "number" && (
          <p className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {projectCount} problem statement{projectCount === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </article>
  );
}
