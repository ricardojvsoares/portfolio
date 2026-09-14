import Link from "next/link";

import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid grid-cols-1 items-baseline gap-2 py-5 transition-[padding] duration-200 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:gap-6 sm:hover:pl-2"
    >
      <div className="min-w-0">
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-2xl">
          <span className="underline-offset-4 group-hover:underline">
            {project.title}
          </span>
        </h3>
        <p className="mt-1 line-clamp-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {project.summary}
        </p>
      </div>
      <ul className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground sm:text-sm">
        {project.tags.map((tag) => (
          <li key={tag} translate="no">
            {tag}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
        <span className="tabular-nums">{project.year}</span>
        <span
          aria-hidden="true"
          className={cn(
            "text-primary transition-transform duration-200",
            "group-hover:translate-x-1"
          )}
        >
          ›
        </span>
      </div>
    </Link>
  );
}
