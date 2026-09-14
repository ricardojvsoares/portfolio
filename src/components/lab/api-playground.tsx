"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

const ENDPOINTS = [
  { method: "GET", path: "/api/status", body: "" },
  { method: "GET", path: "/api/metrics", body: "" },
  { method: "GET", path: "/api/presence", body: "" },
  { method: "GET", path: "/api/guestbook", body: "" },
  { method: "GET", path: "/api/playground/echo?message=hello", body: "" },
  {
    method: "POST",
    path: "/api/playground/echo",
    body: '{\n  "message": "hello from playground"\n}',
  },
] as const;

type Result = {
  status: number;
  latencyMs: number;
  body: string;
};

export function ApiPlayground() {
  const t = useTranslations("Lab");
  const [index, setIndex] = useState(0);
  const selected = ENDPOINTS[index]!;
  const [method, setMethod] = useState<string>(selected.method);
  const [path, setPath] = useState<string>(selected.path);
  const [body, setBody] = useState<string>(selected.body);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const needsBody = useMemo(() => method === "POST", [method]);

  function onPick(next: number) {
    const endpoint = ENDPOINTS[next]!;
    setIndex(next);
    setMethod(endpoint.method);
    setPath(endpoint.path);
    setBody(endpoint.body);
    setResult(null);
    setError(null);
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const started = performance.now();

    try {
      const res = await fetch(path, {
        method,
        headers: needsBody ? { "Content-Type": "application/json" } : undefined,
        body: needsBody && body.trim() ? body : undefined,
        cache: "no-store",
      });
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // keep raw
      }
      setResult({
        status: res.status,
        latencyMs: Math.round(performance.now() - started),
        body: pretty,
      });
    } catch {
      setError("Request failed");
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-md border border-border bg-card/60 p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {t("playgroundTitle")}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("playgroundIntro")}
      </p>

      <form onSubmit={send} className="mt-5 space-y-4">
        <div className="space-y-2">
          <label htmlFor="endpoint" className="block text-sm font-medium">
            {t("playgroundPath")}
          </label>
          <select
            id="endpoint"
            value={index}
            onChange={(event) => onPick(Number(event.target.value))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
          >
            {ENDPOINTS.map((endpoint, i) => (
              <option key={`${endpoint.method}-${endpoint.path}`} value={i}>
                {endpoint.method} {endpoint.path}
              </option>
            ))}
          </select>
        </div>

        {needsBody ? (
          <div className="space-y-2">
            <label htmlFor="body" className="block text-sm font-medium">
              {t("playgroundBody")}
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={5}
              spellCheck={false}
              autoComplete="off"
              className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-xs sm:text-sm"
            />
          </div>
        ) : null}

        <Button type="submit" disabled={busy} className="rounded-md">
          {busy ? t("playgroundSending") : t("playgroundSend")}
        </Button>
      </form>

      <div className="mt-5" aria-live="polite">
        <p className="text-sm font-medium">{t("playgroundResponse")}</p>
        {error ? (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        ) : null}
        {result ? (
          <div className="mt-2 overflow-x-auto rounded-md border border-border bg-background p-3">
            <p className="font-mono text-xs text-phosphor tabular-nums">
              HTTP {result.status} · {result.latencyMs}ms
            </p>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-muted-foreground">
              {result.body}
            </pre>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">…</p>
        )}
      </div>
    </section>
  );
}
