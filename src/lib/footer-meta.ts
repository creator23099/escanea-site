/** Legal lines shown in site footer; append NIT via `extra` before join. */
export const FOOTER_LEGAL_META = [
  "Escanea S.A.S.",
  "Matrícula Mercantil 851684-12",
  "Medellín, Colombia",
] as const;

export function formatFooterLegalMeta(extra: readonly string[] = []): string {
  return [...FOOTER_LEGAL_META, ...extra].join(" · ");
}
