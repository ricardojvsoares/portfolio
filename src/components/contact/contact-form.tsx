"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ApiErrorBody } from "@/lib/api/response";

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm({ email }: { email: string }) {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setFields({});
    setFormError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
        setFields(body?.fields ?? {});
        setFormError(body?.error ?? t("error"));
        setStatus("error");
        const firstInvalid = form.querySelector<HTMLElement>("[aria-invalid='true']");
        firstInvalid?.focus();
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setFormError(t("error"));
      setStatus("error");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-10 max-w-lg space-y-5"
        noValidate
      >
        <Field
          id="name"
          name="name"
          label={t("name")}
          type="text"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          errors={fields.name}
          spellCheck={false}
        />
        <Field
          id="email"
          name="email"
          label={t("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          errors={fields.email}
          spellCheck={false}
        />
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
            aria-invalid={Boolean(fields.message)}
            aria-describedby={fields.message ? "message-error" : undefined}
            className="w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary"
          />
          {fields.message ? (
            <p id="message-error" className="text-sm text-destructive">
              {fields.message.join(" ")}
            </p>
          ) : null}
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
          {status === "error" && formError ? (
            <span className="text-destructive">{formError}</span>
          ) : null}
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  type,
  autoComplete,
  placeholder,
  errors,
  spellCheck,
  inputMode,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  errors?: string[];
  spellCheck?: boolean;
  inputMode?: "email";
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required
        spellCheck={spellCheck}
        placeholder={placeholder}
        aria-invalid={Boolean(errors)}
        aria-describedby={errors ? `${id}-error` : undefined}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary"
      />
      {errors ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}
