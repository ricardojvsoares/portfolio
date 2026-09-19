"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

export function ContactForm({ email }: { email: string }) {
  const t = useTranslations("Contact");
  const [opened, setOpened] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = encodeURIComponent(
      name ? `Portfolio contact — ${name}` : "Portfolio contact",
    );
    const body = encodeURIComponent(
      [name && `Name: ${name}`, from && `Email: ${from}`, "", message]
        .filter(Boolean)
        .join("\n"),
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setOpened(true);
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
            className="w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-foreground/70 focus-visible:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" className="rounded-md">
            {t("send")}
          </Button>
          <a
            href={`mailto:${email}`}
            className="text-sm text-foreground transition-colors duration-200 hover:text-primary"
          >
            {t("orEmail")}
          </a>
        </div>

        <p aria-live="polite" className="min-h-5 text-sm text-foreground">
          {opened ? t("sent") : null}
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
  spellCheck,
  inputMode,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
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
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-foreground/70 focus-visible:border-primary"
      />
    </div>
  );
}
