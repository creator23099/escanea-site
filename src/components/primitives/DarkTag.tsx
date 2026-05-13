import type { ReactNode } from "react";

export function DarkTag({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 20,
        padding: "0.3rem 0.85rem",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(150,185,255,0.9)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {children}
    </div>
  );
}
