import Link from "next/link";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { ProjectList } from "@/components/projects/project-list";
import type { Project } from "@/lib/content";

export function SelectedWork({ projects }: { projects: Project[] }) {
  const t = useTranslations("Home");

  return (
    <section className="border-t border-border bg-card/70">
      <div className="site-container py-16 sm:py-20">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("selectedWork")}
          </h2>
          <Link
            href="/projects"
            className="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
          >
            {t("allProjects")}
          </Link>
        </Reveal>
        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
