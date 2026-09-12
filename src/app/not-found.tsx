import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="site-container flex flex-1 flex-col items-start justify-center py-24">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-foreground">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<Link href="/" />} className="rounded-md">
          {t("home")}
        </Button>
        <Button
          render={<Link href="/projects" />}
          variant="outline"
          className="rounded-md border-foreground/20 bg-card/60"
        >
          {t("work")}
        </Button>
      </div>
    </div>
  );
}
