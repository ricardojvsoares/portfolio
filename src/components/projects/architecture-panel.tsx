"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import type { ArchitectureLayer } from "@/lib/content";

export function ArchitecturePanel({ layers }: { layers: ArchitectureLayer[] }) {
  const t = useTranslations("Work");
  const panelId = useId();
  const [open, setOpen] = useState(false);

  if (layers.length === 0) return null;

  return (
    <div className="mt-10 border-t border-border pt-8">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-md text-left transition-colors duration-200 hover:text-phosphor"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="font-display text-xl font-semibold tracking-tight">
          {t("architecture")}
        </span>
        <span className="font-mono text-sm text-foreground" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      <div id={panelId} hidden={!open} className="mt-5">
        <ol className="space-y-3">
          {layers.map((layer, index) => (
            <li
              key={`${layer.label}-${index}`}
              className="grid gap-1 border-l-2 border-phosphor/40 pl-4 sm:grid-cols-[10rem_1fr] sm:gap-4"
            >
              <span className="font-mono text-xs text-phosphor sm:text-sm">
                {layer.label}
              </span>
              <span className="text-sm text-foreground">{layer.detail}</span>
            </li>
          ))}
        </ol>
        <div
          className="mt-6 overflow-x-auto rounded-md border border-border bg-card/50 p-4 font-mono text-xs text-foreground"
          aria-hidden="true"
        >
          <pre className="whitespace-pre">{renderAscii(layers)}</pre>
        </div>
      </div>
    </div>
  );
}

function renderAscii(layers: ArchitectureLayer[]) {
  return layers
    .map((layer, index) => {
      const line = `[${layer.label}]`;
      if (index === layers.length - 1) return line;
      return `${line}\n    |\n    v`;
    })
    .join("\n");
}
