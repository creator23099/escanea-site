import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const GA_MEASUREMENT_ID = "G-EWRN6MJRRB";

export default function MainSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Navbar />
      <ScrollManager />
      <main id="main-content" className="w-full min-w-0 flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
