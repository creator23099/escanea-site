import { T } from "@/lib/tokens";

// Report metrics. Each row is prefixed with a serif numeral 01-06 that
// mirrors the "Cómo funciona" section on HomeContent, so the same brand
// system carries through (DM Serif Display + cobalt @ 55% opacity).
// Emoji icons were removed in the premium-refinement pass; numerals read
// more "Stripe / Linear" than "growth-hack startup".
const REPORT_ITEMS = [
  { label: "Kilómetros activos",          desc: "Distancia total recorrida durante la campaña" },
  { label: "Zonas recorridas",            desc: "Barrios y sectores cubiertos por la flota" },
  { label: "Escaneos QR",                 desc: "Interacciones directas con tu código QR" },
  { label: "Conversaciones WhatsApp",     desc: "Contactos iniciados a través de campaña" },
  { label: "Fotografías de verificación", desc: "Evidencia visual de la campaña activa" },
  { label: "Resumen semanal",             desc: "Informe consolidado de cada semana de campaña" },
];

export function ReportList({ showDesc = false }: { showDesc?: boolean }) {
  return (
    <div
      style={{
        background: T.ivoryDk,
        borderRadius: 16,
        border: `1.5px solid ${T.stone}`,
        overflow: "hidden",
      }}
    >
      {REPORT_ITEMS.map((r, i) => (
        <div
          key={r.label}
          style={{
            display: "flex",
            alignItems: showDesc ? "flex-start" : "center",
            gap: showDesc ? "1rem" : "0.85rem",
            padding: showDesc ? "1rem 1.25rem" : "0.85rem 1.25rem",
            borderBottom: i < REPORT_ITEMS.length - 1 ? `1px solid ${T.stone}` : "none",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              fontFamily: "'DM Serif Display',serif",
              fontSize: showDesc ? "1.15rem" : "0.95rem",
              color: T.cobalt,
              opacity: 0.55,
              lineHeight: 1,
              minWidth: showDesc ? "1.6rem" : "1.4rem",
              paddingTop: showDesc ? "2px" : "0",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <div>
            <div style={{ fontWeight: showDesc ? 600 : 500, fontSize: "0.88rem", color: T.ink }}>{r.label}</div>
            {showDesc && (
              <div style={{ fontSize: "0.8rem", color: T.inkLt, marginTop: "0.1rem" }}>{r.desc}</div>
            )}
          </div>
          {!showDesc && (
            <div
              aria-hidden="true"
              style={{
                marginLeft: "auto",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.cobalt,
                opacity: 0.6,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
