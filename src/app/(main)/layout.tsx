import "../globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default function MainSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
