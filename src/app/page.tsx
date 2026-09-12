import { AboutTeaser } from "@/components/home/about-teaser";
import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { getFeaturedProjects, getProfile } from "@/lib/content";

export default async function HomePage() {
  const profile = await getProfile();
  const featured = await getFeaturedProjects();

  return (
    <>
      <Hero profile={profile} />
      <SelectedWork projects={featured} />
      <AboutTeaser profile={profile} />
    </>
  );
}
