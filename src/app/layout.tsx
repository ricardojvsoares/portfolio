import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Syne } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { LanguageToggle } from "@/components/layout/language-toggle";
import { Providers } from "@/components/layout/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getProfile } from "@/lib/content";
import { cn } from "@/lib/utils";

import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: {
      default: `${profile.name} — ${profile.role}`,
      template: `%s — ${profile.name}`,
    },
    description: profile.headline,
    other: {
      "theme-color": "#0A0F14",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full",
        syne.variable,
        ibmPlexSans.variable,
        ibmPlexMono.variable,
        "font-sans",
      )}
    >
      <body className="signal-grid flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <SkipLink />
            <SiteHeader
              controls={
                <>
                  <LanguageToggle />
                  <ThemeToggle />
                </>
              }
            />
            <main id="main" className="flex flex-1 flex-col">
              {children}
            </main>
            <SiteFooter />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
