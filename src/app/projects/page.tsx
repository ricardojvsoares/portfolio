import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectList } from "@/components/projects/project-list";
import { getProjects } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Work");
  const meta = await getTranslations("Meta");
  return {
    title: t("title"),
    description: meta("workDescription"),
  };
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const t = await getTranslations("Work");

  return (
    <div className="site-container py-14 sm:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        {t.rich("intro", {
          path: () => (
            <code translate="no" className="font-mono text-sm text-foreground">
              src/data/[locale]/projects.json
            </code>
          ),
        })}
      </p>
      <div className="mt-12">
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}
