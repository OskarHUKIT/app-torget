import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nytti - Kultur og samfunnsnyttig innhold",
  description: "Utforsk dikt, kunstverk, apper og spill – Norges mest engasjerende kulturplattform",
  manifest: "/manifest.json",
  themeColor: "#E93B8A",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nytti",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="relative flex min-h-screen flex-col bg-background">
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-nytti-pink/20 via-nytti-pink/5 to-transparent" aria-hidden />
        <Navbar />
        <main className="relative flex-1">{children}</main>
        <Footer />
        <BottomNav />
        <InstallPrompt />
      </body>
    </html>
  );
}
