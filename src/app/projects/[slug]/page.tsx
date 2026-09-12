import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProjectDetail } from "@/components/projects/project-detail";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    const meta = await getTranslations("Meta");
    return { title: meta("projectFallback") };
  }
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
