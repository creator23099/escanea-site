/** Legal lines shown in site footer; append entries via `extra` before join. */
export const FOOTER_LEGAL_META = [
  "Escanea S.A.S.",
  "NIT 902.082.671-5",
  "Matrícula Mercantil 851684-12",
  "Medellín, Colombia",
] as const;

export function formatFooterLegalMeta(extra: readonly string[] = []): string {
  return [...FOOTER_LEGAL_META, ...extra].join(" · ");
}
