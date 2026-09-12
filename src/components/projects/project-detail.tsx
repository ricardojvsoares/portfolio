import Link from "next/link";
import { useTranslations } from "next-intl";

import type { Project } from "@/lib/content";

export function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations("Work");
  const paragraphs = project.body.split(/\n\n+/).filter(Boolean);

  return (
    <article className="site-container py-14 sm:py-20">
      <p className="font-mono text-sm text-primary tabular-nums">{project.year}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{project.summary}</p>

      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-muted-foreground">
        {project.tags.map((tag) => (
          <li key={tag} translate="no">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-4">
        {project.links.live ? (
          <Link
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary transition-colors duration-200 hover:text-foreground"
          >
            {t("live")}
          </Link>
        ) : null}
        {project.links.repo ? (
          <Link
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary transition-colors duration-200 hover:text-foreground"
          >
            {t("repo")}
          </Link>
        ) : null}
      </div>

      <div className="mt-12 max-w-2xl space-y-5 border-t border-border pt-10 text-base leading-relaxed text-foreground/90">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-14">
        <Link
          href="/projects"
          className="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
        >
          {t("back")}
        </Link>
      </p>
    </article>
  );
}
