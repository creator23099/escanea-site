"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { T } from "@/lib/tokens";
import type { NavItem, Page, SetPage } from "@/lib/types";

/**
 * Exported because Footer also renders the same list in its "Plataforma"
 * column. Single source of truth for the top-level navigation entries.
 */
export const NAV_ITEMS: NavItem[] = [
  { l: "Inicio",       p: "home" },
  { l: "Marcas",      p: "brands" },
  { l: "Conductores", p: "drivers" },
  { l: "Por Qué Ahora", p: "why" },
];

interface NavbarProps {
  page: Page;
  setPage: SetPage;
  scrolled: boolean;
}

/** Returns all focusable elements inside `root`, in DOM order. */
function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
    )
  );
}

export function Navbar({ page, setPage, scrolled }: NavbarProps) {
  const [mobOpen, setMobOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(false);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobOpen);
    return () => document.body.classList.remove("nav-open");
  }, [mobOpen]);

  const navigate = useCallback(
    (p: Page) => {
      setPage(p);
      setMobOpen(false);
    },
    [setPage]
  );

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
        <button
          type="button"
          onClick={() => navigate("home")}
          aria-label="Escanea — ir al inicio"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Serif Display',serif",
            fontSize: "1.15rem",
            color: T.ink,
            letterSpacing: "0.02em",
            padding: "0.25rem 0",
          }}
        >
          Escanea
        </button>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
          {NAV_ITEMS.map((x) => (
            <button
              key={x.p}
              type="button"
              className={`nav-link ${page === x.p ? "active" : ""}`}
              onClick={() => setPage(x.p)}
              aria-current={page === x.p ? "page" : undefined}
            >
              {x.l}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: "0.55rem 1.1rem" }}
            onClick={() => setPage("brands")}
          >
            Anunciar
          </button>
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
            display: "none", // shown via media query class below
            flexDirection: "column",
            gap: 5,
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
            <button
              key={x.p}
              type="button"
              onClick={() => navigate(x.p)}
              aria-current={page === x.p ? "page" : undefined}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "1.1rem",
                fontWeight: page === x.p ? 700 : 400,
                color: page === x.p ? T.cobalt : T.ink,
              }}
            >
              {x.l}
            </button>
          ))}
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => navigate("brands")}
            >
              Anunciar mi marca
            </button>
            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={() => navigate("drivers")}
            >
              Conducir con Escanea
            </button>
          </div>
        </div>
      )}
    </>
  );
}
