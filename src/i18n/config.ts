export const locales = ["pt-PT", "en-EN"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-PT";

export const localeCookieName = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(value: string | undefined | null): Locale {
  if (value === "en") return "en-EN";
  if (isLocale(value)) return value;
  return defaultLocale;
}
