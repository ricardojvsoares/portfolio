import { getLocale } from "next-intl/server";

import enNav from "@/data/en-EN/nav.json";
import enProfile from "@/data/en-EN/profile.json";
import enProjects from "@/data/en-EN/projects.json";
import enSocials from "@/data/en-EN/socials.json";
import ptNav from "@/data/pt-PT/nav.json";
import ptProfile from "@/data/pt-PT/profile.json";
import ptProjects from "@/data/pt-PT/projects.json";
import ptSocials from "@/data/pt-PT/socials.json";
import { defaultLocale, type Locale, resolveLocale } from "@/i18n/config";

export type Profile = typeof enProfile;

export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  external: boolean;
};

export type ProjectLinks = {
  live?: string;
  repo?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  tags: string[];
  featured: boolean;
  links: ProjectLinks;
  body: string;
};

const catalog = {
  "en-EN": {
    profile: enProfile,
    nav: enNav as NavItem[],
    projects: enProjects as Project[],
    socials: enSocials as SocialLink[],
  },
  "pt-PT": {
    profile: ptProfile,
    nav: ptNav as NavItem[],
    projects: ptProjects as Project[],
    socials: ptSocials as SocialLink[],
  },
} as const;

async function localeOr(locale?: Locale): Promise<Locale> {
  if (locale) return locale;
  return resolveLocale(await getLocale());
}

export async function getProfile(locale?: Locale): Promise<Profile> {
  const resolved = await localeOr(locale);
  return catalog[resolved].profile;
}

export async function getNav(locale?: Locale): Promise<NavItem[]> {
  const resolved = await localeOr(locale);
  return catalog[resolved].nav;
}

export async function getSocials(locale?: Locale): Promise<SocialLink[]> {
  const resolved = await localeOr(locale);
  return catalog[resolved].socials;
}

export async function getProjects(locale?: Locale): Promise<Project[]> {
  const resolved = await localeOr(locale);
  return [...catalog[resolved].projects].sort((a, b) => b.year - a.year);
}

export async function getFeaturedProjects(locale?: Locale): Promise<Project[]> {
  const projects = await getProjects(locale);
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlug(
  slug: string,
  locale?: Locale
): Promise<Project | undefined> {
  const projects = await getProjects(locale);
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return catalog[defaultLocale].projects.map((project) => project.slug);
}
