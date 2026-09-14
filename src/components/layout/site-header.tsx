import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { BrandLink } from "@/components/layout/skip-link";
import { getNav, getProfile } from "@/lib/content";

export async function SiteHeader({ controls }: { controls?: ReactNode }) {
  const profile = await getProfile();
  const nav = await getNav();
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="site-container flex h-14 items-center justify-between gap-4">
        <BrandLink name={profile.name} />
        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            aria-label={t("primary")}
            className="hidden items-center gap-1 md:flex sm:gap-2"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <MobileNav items={nav} />
          {controls ? (
            <div className="ml-1 flex items-center gap-0.5 border-l border-border pl-2 sm:ml-2 sm:pl-3">
              {controls}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
