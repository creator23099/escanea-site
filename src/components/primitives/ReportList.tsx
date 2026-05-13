import { T } from "@/lib/tokens";

const REPORT_ITEMS = [
  { icon: "📍", label: "Kilómetros activos",                  desc: "Distancia total recorrida durante la campaña" },
  { icon: "🗺",  label: "Zonas recorridas",                   desc: "Barrios y sectores cubiertos por la flota" },
  { icon: "📱", label: "Escaneos QR",                         desc: "Interacciones directas con tu código QR" },
  { icon: "💬", label: "Conversaciones WhatsApp",             desc: "Contactos iniciados a través de campaña" },
  { icon: "📷", label: "Fotografías de verificación",         desc: "Evidencia visual de la instalación activa" },
  { icon: "📊", label: "Resumen semanal",                     desc: "Informe consolidado de cada semana de campaña" },
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
            alignItems: "center",
            gap: showDesc ? "0.9rem" : "0.85rem",
            padding: showDesc ? "1rem 1.25rem" : "0.85rem 1.25rem",
            borderBottom: i < REPORT_ITEMS.length - 1 ? `1px solid ${T.stone}` : "none",
          }}
        >
          <div style={{ fontSize: "1.1rem", flexShrink: 0 }} aria-hidden="true">{r.icon}</div>
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
