"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ApiErrorBody } from "@/lib/api/response";

type SessionState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; displayName: string }
  | { status: "error"; message: string };

export function AuthDemo() {
  const t = useTranslations("Lab");
  const [session, setSession] = useState<SessionState>({ status: "loading" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await res.json()) as {
        authenticated?: boolean;
        displayName?: string;
        error?: string;
      };
      if (!res.ok) {
        setSession({ status: "error", message: data.error ?? "Unavailable" });
        return;
      }
      if (data.authenticated && data.displayName) {
        setSession({ status: "authenticated", displayName: data.displayName });
      } else {
        setSession({ status: "anonymous" });
      }
    } catch {
      setSession({ status: "error", message: "Unavailable" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: String(data.get("displayName") ?? "") }),
      });
      const body = (await res.json().catch(() => null)) as
        | (ApiErrorBody & { displayName?: string })
        | null;
      if (!res.ok) {
        setError(body?.error ?? "Sign-in failed");
        return;
      }
      form.reset();
      await refresh();
      window.dispatchEvent(new Event("portfolio:auth"));
    } catch {
      setError("Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      await refresh();
      window.dispatchEvent(new Event("portfolio:auth"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-md border border-border bg-card/60 p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {t("authTitle")}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("authIntro")}</p>

      {session.status === "loading" ? (
        <div className="skeleton mt-4 h-10 w-48 rounded-md" aria-hidden="true" />
      ) : null}

      {session.status === "authenticated" ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="font-mono text-sm text-phosphor">
            {t("authSignedIn", { name: session.displayName })}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-md"
            disabled={busy}
            onClick={() => void signOut()}
          >
            {t("authSignOut")}
          </Button>
        </div>
      ) : null}

      {session.status === "anonymous" || session.status === "error" ? (
        <form onSubmit={signIn} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1 space-y-2">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-foreground"
            >
              {t("authName")}
            </label>
            <input
              id="displayName"
              name="displayName"
              required
              minLength={2}
              maxLength={80}
              autoComplete="nickname"
              spellCheck={false}
              placeholder={t("authPlaceholder")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" disabled={busy} className="rounded-md">
            {busy ? t("authSigningIn") : t("authSignIn")}
          </Button>
        </form>
      ) : null}

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-destructive">
        {error ?? (session.status === "error" ? session.message : null)}
      </p>
    </section>
  );
}
