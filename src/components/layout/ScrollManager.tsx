"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Mirrors the SPA's instant scroll-to-top behavior across real App Router
 * route changes. Uses positional scrollTo(x, y) so it bypasses
 * `html { scroll-behavior: smooth }` (matches the previous changePage
 * handler that lived in src/app/page.tsx pre-Phase-3).
 *
 * `<Link scroll={false}>` is used on every navigation in the app so
 * Next.js does not run its own scroll heuristic. This component is the
 * single source of truth for post-navigation scroll position.
 *
 * Skips the first effect run so we do not stomp on:
 *   - the browser's initial scroll position on hard load,
 *   - browser scroll restoration on reload.
 */
export function ScrollManager() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
