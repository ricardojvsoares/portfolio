"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "li" | "section";
};

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );
  const [visible, setVisible] = useState(false);
  const show = prefersReduced || visible;

  useEffect(() => {
    if (prefersReduced) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", show && "reveal-visible", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
