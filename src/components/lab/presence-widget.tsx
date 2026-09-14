"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type State =
  | { status: "loading" }
  | { status: "live"; count: number }
  | { status: "error" };

export function PresenceWidget() {
  const t = useTranslations("Lab");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const source = new EventSource("/api/presence/stream");

    source.addEventListener("presence", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data) as {
          count: number;
        };
        setState({ status: "live", count: data.count });
      } catch {
        setState({ status: "error" });
      }
    });

    source.onerror = () => {
      setState({ status: "error" });
      source.close();
    };

    return () => source.close();
  }, []);

  return (
    <section className="rounded-md border border-border bg-card/60 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="live-dot" aria-hidden="true" />
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {t("presenceTitle")}
        </h2>
      </div>

      <div className="mt-4 min-h-8" aria-live="polite">
        {state.status === "loading" ? (
          <p className="text-sm text-muted-foreground">{t("presenceLoading")}</p>
        ) : null}
        {state.status === "error" ? (
          <p className="text-sm text-destructive">{t("presenceError")}</p>
        ) : null}
        {state.status === "live" ? (
          <p className="font-mono text-2xl text-foreground tabular-nums">
            {t("presenceCount", { count: state.count })}
          </p>
        ) : null}
      </div>
    </section>
  );
}
