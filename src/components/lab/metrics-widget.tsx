"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Metrics = {
  count: number;
  p50: number;
  p95: number;
  uptimeSec: number;
  routes: { route: string; count: number }[];
};

type State =
  | { status: "loading" }
  | { status: "ready"; data: Metrics }
  | { status: "empty" }
  | { status: "error" };

export function MetricsWidget() {
  const t = useTranslations("Lab");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/metrics", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setState({ status: "error" });
          return;
        }
        const data = (await res.json()) as Metrics;
        if (cancelled) return;
        if (data.count === 0) setState({ status: "empty" });
        else setState({ status: "ready", data });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    void load();
    const id = window.setInterval(() => void load(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <section className="rounded-md border border-border bg-card/60 p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {t("metricsTitle")}
      </h2>

      <div className="mt-4" aria-live="polite">
        {state.status === "loading" ? (
          <div className="space-y-2">
            <div className="skeleton h-8 w-40 rounded-md" />
            <p className="sr-only">{t("metricsLoading")}</p>
          </div>
        ) : null}
        {state.status === "error" ? (
          <p className="text-sm text-destructive">{t("metricsError")}</p>
        ) : null}
        {state.status === "empty" ? (
          <p className="text-sm text-muted-foreground">{t("metricsEmpty")}</p>
        ) : null}
        {state.status === "ready" ? (
          <dl className="grid grid-cols-3 gap-3">
            <Stat label={t("metricsRequests")} value={String(state.data.count)} />
            <Stat label={t("metricsP50")} value={`${state.data.p50}ms`} />
            <Stat label={t("metricsP95")} value={`${state.data.p95}ms`} />
          </dl>
        ) : null}
      </div>

      {state.status === "ready" && state.data.routes.length > 0 ? (
        <ul className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
          {state.data.routes.map((row) => (
            <li key={row.route} className="flex justify-between gap-3">
              <span className="min-w-0 truncate" translate="no">
                {row.route}
              </span>
              <span className="tabular-nums">{row.count}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/70 bg-background/40 px-3 py-2">
      <dt className="text-[0.7rem] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-lg text-foreground tabular-nums">{value}</dd>
    </div>
  );
}
