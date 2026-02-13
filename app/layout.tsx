import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "Nytti - Kultur og samfunnsnyttig innhold",
  description: "Utforsk dikt, kunstverk,apper og spill – samfunnsnyttig innhold for Norge",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
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
      <body>
        <Navbar />
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
