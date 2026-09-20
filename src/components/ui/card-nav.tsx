"use client";

import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type CardNavLink = {
  label: string;
  href: string;
};

export type CardNavItem = {
  label: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  /** Rendered in the top bar (e.g. <BrandLink />). Centered on desktop. */
  brand: ReactNode;
  items: CardNavItem[];
  /** Language / theme toggles. Replaces the old "Get Started" button. */
  controls?: ReactNode;
  navLabel?: string;
  openLabel?: string;
  closeLabel?: string;
  className?: string;
  ease?: string;
}

const CardNav = ({
  brand,
  items,
  controls,
  navLabel = "Primary",
  openLabel = "Open menu",
  closeLabel = "Close menu",
  className,
  ease = "power3.out",
}: CardNavProps) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const openMenu = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    setIsHamburgerOpen(true);
    setIsExpanded(true);
    tl.play(0);
  }, []);

  const closeMenu = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    setIsHamburgerOpen(false);
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
    tl.reverse();
  }, []);

  // Escape closes the menu
  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, closeMenu]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={cn(
        "card-nav-container fixed left-1/2 top-3 z-[99] w-[90%] max-w-[800px] -translate-x-1/2 md:top-5",
        className,
      )}
    >
      <nav
        ref={navRef}
        aria-label={navLabel}
        className="card-nav relative block h-[60px] overflow-hidden rounded-xl border border-border bg-background/85 p-0 shadow-md backdrop-blur-md will-change-[height]"
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] flex h-[60px] items-center justify-between p-2 pl-[1.1rem]">
          <button
            type="button"
            onClick={isExpanded ? closeMenu : openMenu}
            aria-label={isExpanded ? closeLabel : openLabel}
            aria-expanded={isExpanded}
            className="hamburger-menu group order-3 flex h-full cursor-pointer flex-col items-center justify-center gap-[6px] rounded-md px-1 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:order-none"
          >
            <span
              className={cn(
                "hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] group-hover:opacity-75",
                isHamburgerOpen && "translate-y-[4px] rotate-45",
              )}
            />
            <span
              className={cn(
                "hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] group-hover:opacity-75",
                isHamburgerOpen && "-translate-y-[4px] -rotate-45",
              )}
            />
          </button>

          <div className="logo-container order-1 flex items-center md:absolute md:left-1/2 md:top-1/2 md:order-none md:-translate-x-1/2 md:-translate-y-1/2">
            {brand}
          </div>

          {controls ? (
            <div className="card-nav-controls order-2 ml-auto mr-1 flex items-center gap-0.5 md:order-none md:ml-0 md:mr-0">
              {controls}
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "card-nav-content absolute inset-x-0 bottom-0 top-[60px] z-[1] flex flex-col items-stretch justify-start gap-2 p-2 md:flex-row md:items-end md:gap-3",
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none",
          )}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              ref={setCardRef(idx)}
              className="nav-card relative flex min-h-[60px] min-w-0 flex-[1_1_auto] select-none flex-col gap-2 rounded-lg border border-border/60 bg-card p-[12px_16px] text-card-foreground md:h-full md:min-h-0 md:flex-[1_1_0%]"
            >
              <div className="nav-card-label text-[18px] font-normal tracking-[-0.5px] md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="nav-card-link inline-flex cursor-pointer items-center gap-[6px] text-[15px] no-underline transition-opacity duration-300 hover:opacity-75 focus-visible:opacity-75 md:text-[16px]"
                  >
                    <ArrowUpRight
                      className="nav-card-link-icon size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
