import Link from "next/link";

import { getProfile, getSocials } from "@/lib/content";

export async function SiteFooter() {
  const profile = await getProfile();
  const socials = (await getSocials()).filter((social) => social.id !== "email");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="site-container flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span translate="no">{profile.name}</span>
          {" · "}
          <span className="tabular-nums">{year}</span>
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
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
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              {profile.email}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
