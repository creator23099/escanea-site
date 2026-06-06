"use client";

import { useEffect } from "react";

const HIDE_STYLE_ID = "campaign-hide-next-dev-indicator";

export function HideDevIndicator() {
  useEffect(() => {
    if (document.getElementById(HIDE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = HIDE_STYLE_ID;
    style.textContent = `
      [id="__next-build-watcher"],
      [data-nextjs-portal],
      button[aria-label="Open Next.js Dev Tools"],
      [data-nextjs-dev-tools-button],
      nextjs-portal {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  return null;
}
