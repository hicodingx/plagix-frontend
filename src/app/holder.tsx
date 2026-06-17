import { ScrapeButton } from "@/components/custom-ui/ScrapeButton";
import { Server, Database, Calendar, Eye, Activity } from "lucide-react";

interface ScrapingSource {
  id: string;
  name: string;
  url: string;
  status: "ACTIVE" | "INACTIVE";
  collectedCount: number;
  lastRunAt: string | null;
}

async function getSources(): Promise<ScrapingSource[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sources`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Impossible de récupérer les sources de scraping");
    }

    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error("Erreur de fetch des sources :", error);
    return [];
  }
}

export default async function DashboardPage() {
  const sources = await getSources();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <div className="space-y-2">
        <div className="flex items-center gap-x-3">
          <div className="h-8 w-8 rounded border-2 border-slate-950 flex items-center justify-center bg-slate-50">
            <div className="h-4 w-4 rounded-sm border-2 border-slate-950 bg-slate-950"></div>
          </div>
          <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">
            Dashboard
          </h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Gérez vos sources d'extraction et suivez la collecte de données en
          temps réel.
        </p>
      </div>

      {/* 2. TABLEAU DES SOURCES */}
      {sources.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center text-sm font-medium text-slate-400 bg-slate-50">
          Aucune source de scraping n'a été trouvée en base de données.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Source</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6 text-right">Thèses</th>
                  <th className="py-4 px-6">Dernier Run</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
                {sources.map((source) => (
                  <tr
                    key={source.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Colonne Nom & URL */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                          <Server className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-950">
                            {source.name}
                          </div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-slate-600 transition-colors block max-w-xs truncate"
                          >
                            {source.url}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Colonne Statut Badge Minimaliste */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          source.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${source.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        {source.status === "ACTIVE" ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    {/* Colonne Compteur */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-950">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Database className="h-3.5 w-3.5 text-slate-400" />
                        {source.collectedCount.toLocaleString()}
                      </div>
                    </td>

                    {/* Colonne Date */}
                    <td className="py-4 px-6 text-slate-500 font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {source.lastRunAt
                          ? new Date(source.lastRunAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "Jamais"}
                      </div>
                    </td>

                    {/* Colonne Boutons d'action */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-x-2">
                        <a
                          href={`/sources/${source.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg transition-all shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Consulter la bibliothèque
                        </a>

                        {/* Ton bouton client géré par BullMQ */}
                        <ScrapeButton sourceId={source.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BARRE DE PAGINATION INJECTÉE EN BAS DU TABLEAU */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs font-medium text-slate-500">
            <div>
              Affichage de{" "}
              <span className="font-semibold text-slate-900">
                {sources.length}
              </span>{" "}
              sur{" "}
              <span className="font-semibold text-slate-900">
                {sources.length}
              </span>{" "}
              sources
            </div>
            <div className="flex items-center gap-x-2">
              <button
                disabled
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-300 cursor-not-allowed font-bold"
              >
                Précédent
              </button>
              <button
                disabled
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-300 cursor-not-allowed font-bold"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
