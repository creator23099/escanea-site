"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { T } from "@/lib/tokens";

export function HomeFinalCtaSection() {
  return (
    <section
      aria-label="Llamado a la acción"
      style={{
        background: `linear-gradient(135deg, ${T.cobalt} 0%, #0A2FA0 100%)`,
        padding: "4rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: "1rem",
          }}
        >
          ¿Listo para<br />activar tu campaña?
        </h2>
        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", marginBottom: "2rem", lineHeight: 1.7 }}>
          Nuestro equipo te contacta en menos de 24 horas.
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "rgba(150,180,255,1)",
            lineHeight: 1.6,
            marginTop: "-1.25rem",
            marginBottom: "0.75rem",
          }}
        >
          Espacios limitados para marcas fundadoras.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href={ROUTES.marcas}
            scroll={false}
            className="btn"
            style={{
              background: "#fff",
              color: T.cobalt,
              padding: "0.9rem 1.6rem",
              fontSize: "0.78rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderRadius: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.ivory;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
            }}
          >
            Anunciar mi marca
          </Link>
          <Link
            href={ROUTES.conductores}
            scroll={false}
            className="btn"
            style={{
              background: "transparent",
              color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.35)",
              padding: "0.9rem 1.6rem",
              fontSize: "0.78rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderRadius: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
            }}
          >
            Conducir con Escanea
          </Link>
        </div>
      </div>
    </section>
  );
}
