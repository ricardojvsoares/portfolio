import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ContactForm } from "@/components/contact/contact-form";
import { getProfile, getSocials } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  const meta = await getTranslations("Meta");
  return {
    title: t("title"),
    description: meta("contactDescription"),
  };
}

export default async function ContactPage() {
  const profile = await getProfile();
  const socials = (await getSocials()).filter((social) => social.id !== "email");
  const t = await getTranslations("Contact");

  return (
    <div className="site-container py-14 sm:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("intro")}</p>

      <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
        <li>
          <a
            href={`mailto:${profile.email}`}
            className="text-sm font-medium text-primary transition-colors duration-200 hover:text-foreground"
          >
            {profile.email}
          </a>
        </li>
        {socials.map((social) => (
          <li key={social.id}>
            <Link
              href={social.href}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
              {...(social.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <span translate="no">{social.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ContactForm email={profile.email} />
    </div>
  );
}
