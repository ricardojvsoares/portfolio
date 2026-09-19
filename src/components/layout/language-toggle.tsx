"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { localeCookieName, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${localeCookieName}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Locale");
  const [pending, startTransition] = useTransition();

  const nextLocale: Locale = locale === "pt-PT" ? "en-EN" : "pt-PT";
  const label = nextLocale === "en-EN" ? t("switchToEn") : t("switchToPt");
  const short = nextLocale === "en-EN" ? "PT" : "EN";

  function switchLocale() {
    setLocaleCookie(nextLocale);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      aria-label={label}
      title={label}
      className={cn(
        "locale-toggle rounded-md px-2 py-1.5 font-mono text-xs tracking-wide text-foreground transition-[color,opacity,transform] duration-200 hover:text-foreground",
        pending && "opacity-60",
      )}
    >
      <span className="locale-toggle-label">{short}</span>
    </button>
  );
}
