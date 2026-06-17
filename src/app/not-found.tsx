import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto text-center space-y-6 px-4">
      {/* Icône d'erreur stylisée */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-amber-500">
        <HelpCircle className="h-12 w-12 stroke-[1.5]" />
      </div>

      {/* Message d'erreur */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Page introuvable
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          La ressource que vous recherchez n'existe pas ou a été déplacée par le
          robot de scraping.
        </p>
      </div>

      {/* Bouton de secours vers le tableau de bord */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-medium text-white transition-all shadow-md group"
      >
        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
        Retour au tableau de bord
      </Link>
    </div>
  );
}
