import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { HideDevIndicator } from "@/components/campaign/HideDevIndicator";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-campaign-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-campaign-serif",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CampaignRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      id="main-content"
      className={`${inter.variable} ${playfair.variable} w-full font-[family-name:var(--font-campaign-sans)]`}
    >
      <HideDevIndicator />
      {children}
    </main>
  );
}
