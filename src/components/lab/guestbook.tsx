"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ApiErrorBody } from "@/lib/api/response";

type Entry = {
  id: string;
  displayName: string;
  body: string;
  createdAt: string;
};

type LoadState = "loading" | "ready" | "error" | "empty";

export function Guestbook() {
  const t = useTranslations("Lab");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    try {
      const [bookRes, authRes] = await Promise.all([
        fetch("/api/guestbook", { cache: "no-store" }),
        fetch("/api/auth/session", { cache: "no-store" }),
      ]);
      const auth = (await authRes.json()) as { authenticated?: boolean };
      setAuthed(Boolean(auth.authenticated));

      if (!bookRes.ok) {
        setState("error");
        return;
      }
      const data = (await bookRes.json()) as { entries: Entry[] };
      setEntries(data.entries ?? []);
      setState((data.entries?.length ?? 0) === 0 ? "empty" : "ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    const onAuth = () => void load();
    window.addEventListener("focus", onFocus);
    window.addEventListener("portfolio:auth", onAuth);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("portfolio:auth", onAuth);
    };
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: String(data.get("body") ?? "") }),
      });
      const body = (await res.json().catch(() => null)) as
        | (ApiErrorBody & { entry?: Entry })
        | null;
      if (!res.ok) {
        setError(body?.error ?? "Could not post");
        return;
      }
      form.reset();
      await load();
    } catch {
      setError("Could not post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-md border border-border bg-card/60 p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {t("guestbookTitle")}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("guestbookIntro")}</p>

      {state === "loading" ? (
        <div className="mt-4 space-y-2" aria-busy="true">
          <div className="skeleton h-12 rounded-md" />
          <div className="skeleton h-12 rounded-md" />
          <p className="sr-only">{t("guestbookLoading")}</p>
        </div>
      ) : null}

      {state === "error" ? (
        <p className="mt-4 text-sm text-destructive">{t("guestbookError")}</p>
      ) : null}

      {state === "empty" ? (
        <p className="mt-4 text-sm text-muted-foreground">{t("guestbookEmpty")}</p>
      ) : null}

      {state === "ready" ? (
        <ul className="mt-4 space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-md border border-border/70 bg-background/50 px-3 py-2"
            >
              <p className="font-mono text-xs text-phosphor">{entry.displayName}</p>
              <p className="mt-1 break-words text-sm text-foreground">{entry.body}</p>
              <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground tabular-nums">
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(entry.createdAt))}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {authed ? (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div className="space-y-2">
            <label
              htmlFor="guestbook-body"
              className="block text-sm font-medium text-foreground"
            >
              {t("guestbookBody")}
            </label>
            <textarea
              id="guestbook-body"
              name="body"
              required
              rows={3}
              maxLength={280}
              autoComplete="off"
              placeholder={t("guestbookPlaceholder")}
              className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" disabled={busy} className="rounded-md">
            {busy ? t("guestbookSubmitting") : t("guestbookSubmit")}
          </Button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{t("authIntro")}</p>
      )}

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-destructive">
        {error}
      </p>
    </section>
  );
}
