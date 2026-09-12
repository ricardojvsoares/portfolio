"use client";

import { useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "sent";

export function ContactForm({ email }: { email: string }) {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("sent");
    }, 600);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 max-w-lg space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground"
        >
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          spellCheck={false}
          placeholder={t("namePlaceholder")}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          spellCheck={false}
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          autoComplete="off"
          placeholder={t("messagePlaceholder")}
          className="w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md"
        >
          {status === "submitting" ? t("sending") : t("send")}
        </Button>
        <a
          href={`mailto:${email}`}
          className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
        >
          {t("orEmail")}
        </a>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {status === "sent" ? t("sent") : null}
      </p>
    </form>
  );
}
