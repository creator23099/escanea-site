"use client";
import { T } from "@/lib/tokens";
import type { SetPage } from "@/lib/types";
import { NAV_ITEMS } from "@/components/layout/Navbar";

export function Footer({ setPage }: { setPage: SetPage }) {
  return (
    <footer style={{ background: T.navy, padding: "3rem 1.25rem 2rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "1.3rem",
                color: "#fff",
                marginBottom: "0.4rem",
              }}
            >
              Escanea
            </div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              Transformando el tráfico<br />en atención medible.
            </div>
          </div>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <nav aria-label="Enlaces del sitio">
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "0.9rem",
                }}
              >
                Plataforma
              </div>
              {NAV_ITEMS.map(({ l, p }) => (
                <button
                  key={p}
                  type="button"
                  className="footer-link"
                  onClick={() => setPage(p)}
                >
                  {l}
                </button>
              ))}
            </nav>
            <address style={{ fontStyle: "normal" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "0.9rem",
                }}
              >
                Contacto
              </div>
              <a
                href="mailto:contacto@escanea.co"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  marginBottom: "0.6rem",
                }}
              >
                contacto@escanea.co
              </a>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>www.escanea.co</div>
            </address>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>© 2025 Escanea. Colombia.</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>Media urbana en movimiento.</div>
        </div>
      </div>
    </footer>
  );
}
