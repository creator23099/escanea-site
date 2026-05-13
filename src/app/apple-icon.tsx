import { ImageResponse } from "next/og";

// 180x180 PNG that Safari, iOS Safari, and the iOS home-screen all expect
// at /apple-icon. Same letterform and palette as /icon, scaled up so the
// rounded-square mark stays crisp on Retina home-screen tiles.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// See src/app/icon.tsx for the rationale behind this URL.
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

export default async function AppleIcon() {
  const fontData = await loadBrandFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1A4FD6",
          // ~22% radius - 40px on a 180px canvas.
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontFamily: "DM Serif Display",
          fontStyle: "italic",
          fontSize: 150,
          lineHeight: 1,
          paddingBottom: 12,
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
