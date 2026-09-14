import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ApiPlayground } from "@/components/lab/api-playground";
import { AuthDemo } from "@/components/lab/auth-demo";
import { Guestbook } from "@/components/lab/guestbook";
import { MetricsWidget } from "@/components/lab/metrics-widget";
import { PresenceWidget } from "@/components/lab/presence-widget";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lab");
  const meta = await getTranslations("Meta");
  return {
    title: t("title"),
    description: meta("labDescription"),
  };
}

export default async function LabPage() {
  const t = await getTranslations("Lab");

  return (
    <div className="site-container py-14 sm:py-20">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t("intro")}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <PresenceWidget />
        </Reveal>
        <Reveal delayMs={80}>
          <MetricsWidget />
        </Reveal>
      </div>

      <Reveal className="mt-6" delayMs={100}>
        <ApiPlayground />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal delayMs={120}>
          <AuthDemo />
        </Reveal>
        <Reveal delayMs={140}>
          <Guestbook />
        </Reveal>
      </div>
    </div>
  );
}
