"use client";

import { useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

type StatusPayload = {
  ok: boolean;
  uptimeSec: number;
  db: "up" | "down" | "unconfigured";
  latencyMs: number;
  version: string;
};

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "err"; text: string };

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const COMMAND = "curl -s /api/status";

export function StatusTerminal() {
  const t = useTranslations("Terminal");
  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );
  const [typed, setTyped] = useState(prefersReduced ? COMMAND : "");
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function run() {
      if (!prefersReduced) {
        for (let i = 0; i <= COMMAND.length; i += 1) {
          setTyped(COMMAND.slice(0, i));
          await wait(28 + (i % 3) * 8);
        }
      } else {
        setTyped(COMMAND);
      }

      setBusy(true);
      setLines([{ kind: "cmd", text: COMMAND }]);
      const startedAt = performance.now();

      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const latencyMs = Math.round(performance.now() - startedAt);
        const data = (await res.json()) as StatusPayload;

        if (!res.ok) {
          setLines((prev) => [
            ...prev,
            {
              kind: "err",
              text: `HTTP ${res.status} · ${latencyMs}ms · ${t("error")}`,
            },
          ]);
        } else {
          setLines((prev) => [
            ...prev,
            {
              kind: "out",
              text: JSON.stringify(
                {
                  ok: data.ok,
                  db: data.db,
                  uptimeSec: data.uptimeSec,
                  latencyMs: data.latencyMs ?? latencyMs,
                  version: data.version,
                },
                null,
                2
              ),
            },
            {
              kind: "out",
              text: `← ${res.status} · ${latencyMs}ms`,
            },
          ]);
        }
      } catch {
        setLines((prev) => [
          ...prev,
          { kind: "err", text: t("unreachable") },
        ]);
      } finally {
        setBusy(false);
        setDone(true);
      }
    }

    void run();
  }, [prefersReduced, t]);

  return (
    <div className="animate-rise-delay-2 w-full max-w-xl overflow-hidden rounded-md border border-border bg-card/80 shadow-[inset_0_1px_0_rgb(255_255_255/4%)]">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="live-dot" aria-hidden="true" />
        <p className="font-mono text-xs text-muted-foreground">{t("title")}</p>
      </div>
      <div
        className="min-h-[11rem] space-y-2 p-4 font-mono text-xs leading-relaxed sm:text-sm"
        aria-live="polite"
        aria-busy={busy}
      >
        {!done ? (
          <p className="text-foreground">
            <span className="text-phosphor">$</span> {typed}
            {!prefersReduced && typed.length < COMMAND.length ? (
              <span className="terminal-cursor" aria-hidden="true" />
            ) : null}
          </p>
        ) : null}
        {lines.map((line, index) => (
          <pre
            key={`${line.kind}-${index}`}
            className={
              line.kind === "err"
                ? "whitespace-pre-wrap text-destructive"
                : line.kind === "cmd"
                  ? "whitespace-pre-wrap text-foreground"
                  : "whitespace-pre-wrap text-muted-foreground"
            }
          >
            {line.kind === "cmd" ? (
              <>
                <span className="text-phosphor">$</span> {line.text}
              </>
            ) : (
              line.text
            )}
          </pre>
        ))}
        {busy ? (
          <p className="text-muted-foreground">{t("loading")}</p>
        ) : null}
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
