"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

import type { NavItem } from "@/lib/content";
import { cn } from "@/lib/utils";

export function MobileNav({ items }: { items: NavItem[] }) {
  const t = useTranslations("Nav");
  const panelId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color] duration-200 hover:bg-muted hover:text-foreground"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
        ) : (
          <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
        )}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "fixed inset-x-0 top-14 z-40 border-b border-border bg-background/95 backdrop-blur-md",
          "overscroll-contain"
        )}
      >
        <nav aria-label={t("primary")} className="site-container flex flex-col gap-1 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base text-foreground transition-colors duration-200 hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {open ? (
        <button
          type="button"
          aria-label={t("closeMenu")}
          className="fixed inset-0 top-14 z-30 bg-void/40"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
