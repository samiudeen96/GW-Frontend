/**
 * Purpose: SSR-safe scroll-triggered reveal wrapper for editorial homepage sections.
 * Users: marketing pages (homepage sections, editorial bands).
 * Key actions: fade/rise content once it enters the viewport. Server output is always
 *   fully visible (data-armed="false"), so crawlers and no-JS visitors see everything;
 *   the hidden state is armed in a layout effect, before the first client paint.
 * Integration points: presentation only — no data or business logic.
 */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  /** Stagger in ms applied as a transition delay. */
  delay?: number;
  /** Motion register: rise (default), fade, or a drawing hairline. */
  variant?: "rise" | "fade" | "rule";
  as?: ElementType;
  className?: string;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  as,
  className,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") return;

    // Anything already on screen animates in immediately; the rest waits for scroll.
    const rect = el.getBoundingClientRect();
    setArmed(true);
    if (rect.top < window.innerHeight * 0.95) {
      requestAnimationFrame(() => setShown(true));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      data-armed={armed ? "true" : "false"}
      data-shown={shown ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
