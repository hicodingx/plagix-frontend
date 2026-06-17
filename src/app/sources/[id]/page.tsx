import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CollectedDocument {
  id: string;
  title: string;
  author: string;
  university: string;
  sourceUrl: string;
  publicationDate: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface ApiResponse {
  success: boolean;
  data: CollectedDocument[];
  pagination: PaginationMeta;
}

async function getSourceDocuments(
  sourceId: string,
  page: number,
): Promise<ApiResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sources/${sourceId}/documents?page=${page}&limit=8`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok)
      throw new Error("Erreur lors de la récupération des documents");
    return await res.json();
  } catch (error) {
    console.error("Erreur fetch documents:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function SourceDocumentsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);

  const apiData = await getSourceDocuments(id, currentPage);

  if (!apiData || !apiData.success) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg py-3 px-4 inline-block">
          Impossible de charger la bibliothèque pour cette source.
        </p>
        <div>
          <Link
            href="/"
            className="text-sm font-bold text-slate-700 hover:text-slate-950 inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const { data: documents, pagination } = apiData;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 1. EN-TÊTE ÉPURÉ & FIL D'ARIANE */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-lg text-blue-600 underline hover:text-slate-600 inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Tableaux de bord
              </Link>
            </div>
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
              Bibliothèque des Documents
            </h1>
          </div>
        </div>
      </div>

      {/* 2. ETAT VIDE / LISTE DES THÈSES */}
      {documents.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-16 text-center space-y-4 shadow-sm">
          <div className="h-12 w-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mx-auto text-slate-400">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-950 uppercase tracking-tight">
              Aucun document collecté
            </h3>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
              Lancez un processus de scraping depuis la page d'accueil pour
              commencer à alimenter cette bibliothèque.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* LE TABLEAU BLANC DES DOCUMENTS */}
          <div className="bg-white border border-slate-200  overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6 w-1/2">Titre de la thèse</th>
                    <th className="py-4 px-6">Auteur</th>
                    <th className="py-4 px-6">Université / Éditeur</th>
                    <th className="py-4 px-6 text-right">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Titre */}
                      <td className="py-4 px-6 text-slate-700 group-hover:text-slate-800 transition-colors line-clamp-2 cell-fix">
                        {doc.title}
                      </td>

                      {/* Auteur */}
                      <td className="py-4 px-6 text-slate-500">{doc.author}</td>

                      {/* Université */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
                          {doc.university}
                        </span>
                      </td>

                      {/* Actions de lien externe */}
                      <td className="py-4 px-6 text-right">
                        <a
                          href={doc.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-950 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all shadow-sm"
                          title="Ouvrir la source originale"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BARRE DE PAGINATION INTÉGRÉE AU CADRE */}
            <div className="flex items-center justify-between bg-slate-50 border-t border-slate-200 px-6 py-4">
              <p className="text-xs font-medium text-slate-500">
                Page{" "}
                <span className="font-bold text-slate-950">
                  {pagination.currentPage}
                </span>{" "}
                sur{" "}
                <span className="font-bold text-slate-950">
                  {pagination.totalPages}
                </span>{" "}
                —{" "}
                <span className="font-mono text-xs font-bold text-slate-600">
                  {pagination.totalItems}
                </span>{" "}
                documents extraits
              </p>

              <div className="flex items-center gap-2">
                {/* Bouton Précédent */}
                <Link
                  href={`/sources/${id}?page=${pagination.currentPage - 1}`}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm ${
                    pagination.currentPage > 1
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      : "bg-white border-slate-100 text-slate-300 cursor-not-allowed pointer-events-none shadow-none"
                  }`}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Précédent
                </Link>

                {/* Bouton Suivant */}
                <Link
                  href={`/sources/${id}?page=${pagination.currentPage + 1}`}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm ${
                    pagination.currentPage < pagination.totalPages
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      : "bg-white border-slate-100 text-slate-300 cursor-not-allowed pointer-events-none shadow-none"
                  }`}
                >
                  Suivant
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
