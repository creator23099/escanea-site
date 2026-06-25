import type { Icons } from "next/dist/lib/metadata/types/metadata-types";
import { SITE_ICONS } from "@/lib/site-icons";

const MOBILE_MEDIA = "(max-width: 768px)";
const DESKTOP_MEDIA = "(min-width: 769px)";

/** Media-scoped LCP preloads merged with site favicons (page icons replace layout icons). */
export function heroLcpPreload(mobileSrc: string, desktopSrc: string): Icons {
  return {
    icon: SITE_ICONS.icon,
    shortcut: SITE_ICONS.shortcut,
    apple: SITE_ICONS.apple,
    other: [
      {
        rel: "preload",
        url: mobileSrc,
        type: "image/webp",
        media: MOBILE_MEDIA,
        fetchPriority: "high",
      },
      {
        rel: "preload",
        url: desktopSrc,
        type: "image/webp",
        media: DESKTOP_MEDIA,
        fetchPriority: "high",
      },
    ],
  };
}
