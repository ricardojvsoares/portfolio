import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { BrandLink } from "@/components/layout/skip-link";
import CardNav from "@/components/ui/card-nav";
import { getNav, getProfile } from "@/lib/content";

const GROUPS = [
  { labelKey: "explore", hrefs: ["/", "/about"] },
  { labelKey: "work", hrefs: ["/projects", "/writing"] },
  { labelKey: "connect", hrefs: ["/contact"] },
] as const;

export async function SiteHeader({ controls }: { controls?: ReactNode }) {
  const profile = await getProfile();
  const nav = await getNav();
  const t = await getTranslations("Nav");

  const items = GROUPS.map(({ labelKey, hrefs }) => ({
    label: t(`groups.${labelKey}`),
    links: nav.filter((item) =>
      (hrefs as readonly string[]).includes(item.href),
    ),
  })).filter((group) => group.links.length > 0);

  return (
    <header className="py-4">
      <div className="container mx-auto">
        <CardNav
          brand={<BrandLink name={profile.name} />}
          items={items}
          controls={controls}
          navLabel={t("primary")}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
        />
      </div>
    </header>
  );
}
