import Link from "next/link";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/content";

export function AboutTeaser({ profile }: { profile: Profile }) {
  const t = useTranslations("Home");

  return (
    <section className="border-t border-border">
      <Reveal className="site-container grid gap-8 py-16 sm:grid-cols-[1.4fr_auto] sm:items-end sm:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("about")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
            {profile.shortBio}
          </p>
        </div>
        <Button
          render={<Link href="/about" />}
          variant="outline"
          className="w-fit rounded-md border-foreground/20 bg-card/60"
        >
          {t("readMore")}
        </Button>
      </Reveal>
    </section>
  );
}
