"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";

const THEME_COLORS = {
  light: "#E6EDF3",
  dark: "#0A0F14",
} as const;

function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color =
      resolvedTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);
  }, [resolvedTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeColorMeta />
      {children}
    </ThemeProvider>
  );
}
