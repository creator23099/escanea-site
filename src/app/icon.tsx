import { ImageResponse } from "next/og";

// PNG favicon generated at build time via next/og.
//
// Why PNG (not SVG): Safari has well-documented gaps with SVG favicons -
// some versions silently fall back to /favicon.ico, others fail to refresh
// from a previously cached icon. A PNG is the universally-supported format
// and removes ambiguity. The asset is statically optimized: rendered once
// at build time and cached by Vercel's edge.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Fetch the brand font (DM Serif Display Italic) at build time so the
// monogram echoes the italic-serif accents on the homepage. next/og's
// bundled satori only ships Inter Regular, so without providing a font
// `fontStyle: italic` would be silently ignored.
//
// We fetch the raw TTF from the Google Fonts GitHub mirror (stable URL,
// no CSS parsing, no User-Agent dance). satori does NOT accept woff2 -
// hitting fonts.googleapis.com with a modern UA returns woff2 and breaks
// the build with "Unsupported OpenType signature wOF2".
const FONT_TTF_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/dmserifdisplay/DMSerifDisplay-Italic.ttf";

async function loadBrandFont(): Promise<ArrayBuffer> {
  const res = await fetch(FONT_TTF_URL);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch brand favicon font: ${res.status} ${res.statusText}`,
    );
  }
  return await res.arrayBuffer();
}

export default async function Icon() {
  const fontData = await loadBrandFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1A4FD6",
          // ~22% corner radius - 7px on a 32px canvas. Matches the iOS /
          // Linear / Notion app icon convention.
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontFamily: "DM Serif Display",
          fontStyle: "italic",
          fontSize: 26,
          // Vertical optical compensation: serif caps render slightly low
          // relative to satori's default text baseline.
          lineHeight: 1,
          paddingBottom: 2,
        }}
      >
        E
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "DM Serif Display",
          data: fontData,
          style: "italic",
          weight: 400,
        },
      ],
    },
  );
}
