import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("Nav");

  return (
    <a
      href="#main"
      className="bg-foreground text-background absolute top-3 left-3 z-50 -translate-y-16 rounded-md px-4 py-2 text-sm font-medium transition-transform duration-200 focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {t("skip")}
    </a>
  );
}

export function BrandLink({ name }: { name: string }) {
  return (
    <Link
      href="/"
      translate="no"
      className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-primary"
    >
      {name}
    </Link>
  );
}
