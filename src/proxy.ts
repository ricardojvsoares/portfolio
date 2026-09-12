import { NextResponse, type NextRequest } from "next/server";

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "@/i18n/config";

function matchAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number(q.split("=")[1]) || 0 : 1;
      return { tag: tag.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of candidates) {
    if (tag === "pt-pt" || tag === "pt") return "pt-PT";
    if (tag === "en" || tag.startsWith("en-")) return "en-EN";
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const existing = request.cookies.get(localeCookieName)?.value;
  if (isLocale(existing)) {
    return NextResponse.next();
  }

  const locale =
    existing === "en"
      ? "en-EN"
      : matchAcceptLanguage(request.headers.get("accept-language"));
  const response = NextResponse.next();
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
