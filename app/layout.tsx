import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import AppChrome from "@/components/AppChrome";

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
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
