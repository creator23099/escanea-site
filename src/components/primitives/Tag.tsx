import type { ReactNode } from "react";
import { T } from "@/lib/tokens";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: T.cobaltBg,
        border: "1px solid rgba(26,79,214,0.18)",
        borderRadius: 20,
        padding: "0.3rem 0.85rem",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: T.cobalt,
      }}
    >
      {children}
    </div>
  );
}
