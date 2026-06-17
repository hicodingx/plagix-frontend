import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      {/* Spinner animé */}
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <div className="absolute h-6 w-6 rounded-full bg-blue-500/10 animate-ping" />
      </div>

      {/* Texte informatif */}
      <div className="text-center space-y-1">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Chargement des données...
        </h3>
        <p className="text-xs text-slate-500">
          Interrogation des services en tâche de fond.
        </p>
      </div>
    </div>
  );
}
