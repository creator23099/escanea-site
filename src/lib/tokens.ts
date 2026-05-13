import type { CSSProperties } from "react";

/**
 * Brand palette. Mirrors the --c-* CSS custom properties in globals.css.
 * When adding a color, update both this object and globals.css, or pick from
 * existing tokens.
 */
export const T = {
  ivory:    "#F7F5F1",
  ivoryDk:  "#EFEDE8",
  stone:    "#E2DED8",
  stoneMd:  "#C8C2B8",
  cobalt:   "#1A4FD6",
  cobaltLt: "#2D6BFF",
  cobaltBg: "rgba(26,79,214,0.07)",
  navy:     "#0D1B2A",
  navyMd:   "#1C2E42",
  navyLt:   "#374B62",
  ink:      "#1A2332",
  inkMd:    "#3D4E62",
  inkLt:    "#6B7A8D",
  white:    "#FFFFFF",
} as const;

/** Shared form-label style; hoisted to avoid per-render re-creation. */
export const FL: CSSProperties = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: T.inkLt,
  display: "block",
  marginBottom: "0.5rem",
};
