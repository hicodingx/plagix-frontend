import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner"; 
import { SocketListener } from "@/components/providers/socket-provider"; 
import "./globals.css";
import { Menu, Search } from "lucide-react";
import Footer from "@/components/custom-ui/footer";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Scraping OATD",
  description: "Test technique d'extraction de thèses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={roboto.className}>
      <body className="min-h-screen flex flex-col bg-white">
        <SocketListener />
        <Toaster />

        {/* BARRE DE NAVIGATION */}
        <nav className="py-4 px-6 border-b border-slate-200 flex justify-between items-center bg-white">
          {/* 1. LOGO (À gauche) */}
          <div className="text-2xl font-black text-slate-950 uppercase tracking-wider select-none">
            Plagix
          </div>

          {/* 2. SEARCH BAR (Au centre) */}
          <div className="w-full max-w-md mx-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </span>
              <input
                type="search"
                placeholder="Rechercher des thèses (ex: afrique)..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* 3. MENU ICON (À droite) */}
          <button className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none flex items-center justify-center">
            <Menu className="w-6 h-6" />
          </button>
        </nav>

        <main className="flex-1 p-8">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
