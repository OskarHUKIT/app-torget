"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import Footer from "@/components/Footer";

type AppChromeProps = {
  children: React.ReactNode;
};

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isSiteGatePage = pathname === "/site-gate";

  if (isSiteGatePage) {
    return <main className="relative flex-1">{children}</main>;
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-nytti-pink/20 via-nytti-pink/5 to-transparent"
        aria-hidden
      />
      <Navbar />
      <main className="relative flex-1">{children}</main>
      <Footer />
      <BottomNav />
      <InstallPrompt />
    </>
  );
}
