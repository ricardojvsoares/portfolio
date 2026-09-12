import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  const meta = await getTranslations("Meta");
  return {
    title: t("title"),
    description: meta("aboutDescription"),
  };
}

export default async function AboutPage() {
  const profile = await getProfile();
  const t = await getTranslations("About");

  return (
    <div className="site-container py-14 sm:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 font-mono text-sm text-primary">{profile.role}</p>
      <p className="mt-2 font-mono text-sm text-muted-foreground">{profile.location}</p>

      <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
        <p>{profile.bio}</p>
        <p>
          {t.rich("replaceHint", {
            path: () => (
              <code translate="no" className="font-mono text-sm text-foreground">
                src/data/[locale]/profile.json
              </code>
            ),
          })}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button render={<Link href="/contact" />} className="rounded-md">
          {t("contact")}
        </Button>
        {profile.resumeUrl ? (
          <Button
            render={<a href={profile.resumeUrl} />}
            variant="outline"
            className="rounded-md border-foreground/20 bg-card/60"
          >
            {t("resume")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
