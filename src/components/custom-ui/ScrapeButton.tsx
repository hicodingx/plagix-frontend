"use client";

import { useEffect, useState } from "react";
import { Play, Loader2, Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestNotificationPermission, triggerWebNotification } from "@/lib/notification";
import { toast } from "sonner";

interface ScrapeButtonProps {
  sourceId: string;
}


export function ScrapeButton({ sourceId}: ScrapeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  let timer: any;

  useEffect(() => {
    if (isLoading) {
      timer = setTimeout(() => {
        setShowModal(true);
      }, 5000);
    }

    return clearTimeout(timer);
  }, [isLoading]);

  const startCrapping = async () => {
    try {
      // Récupération de l'ID session anonyme stocké
      const clientSessionId = sessionStorage.getItem("scraping_session_id");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sources/${sourceId}/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Strictement obligatoire pour du JSON
            Accept: "application/json",
          },
          body: JSON.stringify({ clientSessionId }),
        },
      );

      /* on peut arriver ici sans que le worker n'ait finit son job */
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erreur inconnue");
      toast.success("Scrapping started successfully!");
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleModalAction = async (notificationAllowed = false) => {
    setShowModal(false);

    if (notificationAllowed) {
      await requestNotificationPermission();
    }

    /* après l'interraction */
    startCrapping();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
          "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer",
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {isLoading ? "Plannification..." : "Lancer le Scraping"}
      </button>
      {/* Pop-up Modal d'abonnement aux notifications temps réel */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
            {/* Bouton de fermeture en haut à droite */}
            <button
              onClick={() => handleModalAction()}
              className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-mdtransition-colors border-[1px] border-slate-400 p-[2px] rounded-sm"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Contenu de la modal */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <Bell className="h-5 w-5 animate-bounce" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Suivi en temps réel
              </h3>
            </div>

            <div className="text-center space-y-3">
              <div className="text-sm text-slate-300">
                Le processus d'extraction a commencé sur les serveurs d'OATD.
              </div>
              <div className="text-xs text-slate-400">
                Souhaitez-vous être notifié dès que la collecte est terminée ?
              </div>
            </div>

            {/* Actions de la modal */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleModalAction(true)}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
              >
                Oui, m'alerter
              </button>
              <button
                onClick={() => handleModalAction()}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
