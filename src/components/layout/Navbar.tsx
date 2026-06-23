"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { ROUTES } from "@/lib/routes";
import { T } from "@/lib/tokens";

/** Returns all focusable elements inside `root`, in DOM order. */
function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
    )
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobOpen, setMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(false);

  // Throttled scroll listener — owns the frosted-glass `scrolled` flag.
  // Moved from the old SPA App root in Phase 3; layout-level mount means
  // it survives every route transition (Navbar lives in layout.tsx).
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

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobOpen);
    return () => document.body.classList.remove("nav-open");
  }, [mobOpen]);

  const closeMenu = useCallback(() => setMobOpen(false), []);

  // Close the mobile dialog on browser back/forward. Each Link inside
  // the menu already calls closeMenu in its onClick, so the popstate
  // listener only catches history navigation (not in-app clicks).
  // This drives the prevOpenRef -> hamburger focus-restore effect.
  useEffect(() => {
    const handler = () => setMobOpen(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Keyboard: Escape closes, Tab/Shift+Tab cycles focus inside the dialog
  useEffect(() => {
    if (!mobOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable(dialogRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobOpen]);

  // Focus management: focus first item on open, restore to hamburger on close
  useEffect(() => {
    if (mobOpen) {
      const focusable = getFocusable(dialogRef.current);
      focusable[0]?.focus();
    } else if (prevOpenRef.current) {
      hamburgerRef.current?.focus();
    }
    prevOpenRef.current = mobOpen;
  }, [mobOpen]);

  return (
    <>
      <nav
        aria-label="Navegación principal"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          height: 60,
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(247,245,241,0.95)" : T.ivory,
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none", // Safari support
          borderBottom: `1.5px solid ${scrolled ? T.stone : "transparent"}`,
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <Link
          href="/"
          scroll={false}
          aria-label="Escanea — ir al inicio"
          // Preserve SPA affordance: clicking the logo while on `/` still
          // scrolls to top. Same-pathname Link clicks don't fire ScrollManager.
          onClick={() => {
            if (pathname === "/") window.scrollTo(0, 0);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Serif Display',serif",
            // Larger wordmark so the brand reads clearly in the navbar
            // mark reads as intentional vs. footnote in the navbar
            // without pushing into "startup oversized" territory.
            fontSize: "1.42rem",
            // Brand cobalt (matches --c-cobalt / T.cobalt used on
            // .btn-primary, italic headline accents, focus rings,
            // and the active nav state). Reinforces brand identity
            // in the top-left vs. the previous near-black ink.
            color: T.cobalt,
            letterSpacing: "0.02em",
            padding: "0.25rem 0",
            textDecoration: "none",
          }}
        >
          Escanea
        </Link>

        {/* Desktop nav */}
        <div className="hide-mobile nav-desktop-row">
          {NAV_ITEMS.map((x) => (
            <Link
              key={x.href}
              href={x.href}
              scroll={false}
              className={`nav-link ${pathname === x.href ? "active" : ""}`}
              aria-current={pathname === x.href ? "page" : undefined}
            >
              {x.l}
            </Link>
          ))}
          <Link
            href={ROUTES.marcas}
            scroll={false}
            className="btn btn-primary"
            style={{ padding: "0.55rem 1.1rem" }}
          >
            Anunciar
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          onClick={() => setMobOpen((v) => !v)}
          aria-expanded={mobOpen}
          aria-controls="mobile-menu"
          aria-label={mobOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px 4px",
          }}
          id="mob-btn"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} aria-hidden="true" style={{ width: 22, height: 2, background: T.ink, borderRadius: 2 }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobOpen && (
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 299,
            background: T.ivory,
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            animation: "slideDown 0.25s ease",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {NAV_ITEMS.map((x) => (
            <Link
              key={x.href}
              href={x.href}
              scroll={false}
              onClick={closeMenu}
              aria-current={pathname === x.href ? "page" : undefined}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "1.1rem",
                fontWeight: pathname === x.href ? 700 : 400,
                color: pathname === x.href ? T.cobalt : T.ink,
                textDecoration: "none",
              }}
            >
              {x.l}
            </Link>
          ))}
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              href={ROUTES.marcas}
              scroll={false}
              onClick={closeMenu}
              className="btn btn-primary btn-full"
            >
              Anunciar mi marca
            </Link>
            <Link
              href={ROUTES.conductores}
              scroll={false}
              onClick={closeMenu}
              className="btn btn-outline btn-full"
            >
              Conducir con Escanea
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
