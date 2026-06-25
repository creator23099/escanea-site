import type { Icons } from "next/dist/lib/metadata/types/metadata-types";

/** Shared favicon declarations — keep in sync with root layout metadata.icons. */
export const SITE_ICONS = {
  icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
  shortcut: ["/icon"],
  apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
} satisfies Icons;
