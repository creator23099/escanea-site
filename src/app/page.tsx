"use client";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BrandsContent } from "@/components/pages/BrandsContent";
import { DriversContent } from "@/components/pages/DriversContent";
import { HomeContent } from "@/components/pages/HomeContent";
import { WhyContent } from "@/components/pages/WhyContent";
import type { Page, SetPage } from "@/lib/types";

/**
 * SPA App root. Owns the current "page" state and a throttled scroll
 * listener for Navbar's frosted-glass state. Phase 3 of the migration
 * will replace this state machine with App Router segments and remove
 * this file's logic in favor of layout.tsx + per-route page.tsx.
 */
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [scrolled, setScrolled] = useState(false);

  // Throttled scroll handler (rAF gate, passive)
  useEffect(() => {
    let ticking = false;
    const h = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const changePage = useCallback<SetPage>((p) => {
    setPage(p);
    // Positional scrollTo(x, y) is always instant - bypasses html { scroll-behavior: smooth; }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar page={page} setPage={changePage} scrolled={scrolled} />
      <main id="main-content">
        {page === "home"    && <HomeContent    setPage={changePage} />}
        {page === "brands"  && <BrandsContent  setPage={changePage} />}
        {page === "drivers" && <DriversContent setPage={changePage} />}
        {page === "why"     && <WhyContent     setPage={changePage} />}
      </main>
    </>
  );
}
