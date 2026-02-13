import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import InstallPrompt from "@/components/InstallPrompt";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nytti - Kultur og samfunnsnyttig innhold",
  description: "Utforsk dikt, kunstverk,apper og spill – samfunnsnyttig innhold for Norge",
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
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <InstallPrompt />
      </body>
    </html>
  );
}
