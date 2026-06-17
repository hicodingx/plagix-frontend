import React from 'react'

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-800 py-6 px-8 text-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-y-4 text-xs font-medium">
        {/* Section gauche : Copyright & Marque */}
        <div className="flex items-center gap-x-2 select-none">
          <span className="font-bold uppercase tracking-wider text-2xl px-1.5 py-0.5 rounded">
            Lahalex
          </span>
          <span>© {new Date().getFullYear()} — Tous droits réservés.</span>
        </div>

        {/* Section droite : Liens techniques indicatifs */}
        <div className="flex items-center gap-x-6">
          <span className="flex items-center gap-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Scrapping Hub
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-lg px-2 py-0.5 rounded ">
            v1.0.0-demo
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer