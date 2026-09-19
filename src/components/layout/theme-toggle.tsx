"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const order = ["light", "dark"] as const;

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Theme");
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const current = (theme as (typeof order)[number] | undefined) ?? "dark";
  const next = order[(order.indexOf(current) + 1) % order.length];

  const labelMap = {
    light: t("toLight"),
    dark: t("toDark"),
  } as const;

  const Icon = current === "dark" ? Moon : current === "light" ? Sun : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={mounted ? labelMap[next] : t("label")}
      title={mounted ? labelMap[next] : t("label")}
      className={cn(
        "theme-toggle inline-flex size-8 items-center justify-center rounded-md text-foreground transition-[color,transform,opacity] duration-200 hover:text-foreground",
      )}
    >
      <Icon
        aria-hidden="true"
        className="theme-toggle-icon size-4"
        strokeWidth={1.75}
      />
      <span className="sr-only" aria-live="polite">
        {mounted ? t(current) : t("label")}
      </span>
    </button>
  );
}
