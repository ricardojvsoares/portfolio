import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { ProjectRow } from "@/components/projects/project-row";
import type { Project } from "@/lib/content";

export function ProjectList({ projects }: { projects: Project[] }) {
  const t = useTranslations("Work");

  return (
    <ul>
      {projects.map((project, index) => (
        <Reveal
          key={project.slug}
          as="li"
          delayMs={index * 60}
          className="border-b border-border first:border-t"
        >
          <ProjectRow project={project} />
        </Reveal>
      ))}
    </ul>
  );
}
