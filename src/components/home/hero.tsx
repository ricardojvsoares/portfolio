import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/content";

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("Hero");

  return (
    <section className="site-container flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-16 sm:py-24">
      <p
        translate="no"
        className="font-display animate-rise text-5xl leading-none font-semibold tracking-tight text-foreground sm:text-7xl md:text-8xl"
      >
        {profile.name}
      </p>
      <p className="animate-rise-delay mt-5 font-mono text-sm tracking-wide text-primary sm:text-base">
        {profile.role}
      </p>
      <p className="animate-rise-delay-2 mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
        {profile.headline}
      </p>
      <div className="animate-rise-delay-3 mt-10 flex flex-wrap gap-3">
        <Button
          render={<Link href="/projects" />}
          size="lg"
          className="rounded-md"
        >
          {t("viewWork")}
        </Button>
        <Button
          render={<Link href="/contact" />}
          variant="outline"
          size="lg"
          className="rounded-md border-foreground/20 bg-card/60"
        >
          {t("contact")}
        </Button>
      </div>
    </section>
  );
}
