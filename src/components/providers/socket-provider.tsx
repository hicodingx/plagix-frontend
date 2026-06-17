"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner"; 
import { useRouter } from "next/navigation";
import { triggerWebNotification } from "@/lib/notification"; 

export function SocketListener() {
  const router = useRouter();
  useEffect(() => {
    // 1. Gestion de la session anonyme persistante dans le sessionStorage
    let anonymousSessionId = sessionStorage.getItem("scraping_session_id");

    if (!anonymousSessionId) {
      anonymousSessionId = `client_${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem("scraping_session_id", anonymousSessionId);
    }

    // 2. Connexion au serveur Backend Express (Port 5000)
    const socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("connect", () => {
      console.log(
        "Connecté au serveur WebSocket, enregistrement de la session...",
      );
      // Joindre la chambre privée portant l'ID de session
      socket.emit("joinSession", anonymousSessionId);
    });

  // Écoute du succès
    socket.on("scraping-finished", (data: { sourceId: string; collectedCount: number; message: string }) => {
      toast.success(data.message, {
        description: `${data.collectedCount} nouvelles thèses ajoutées à la base de données.`,
        duration: 6000,
      });

      // 2.  VRAIE NOTIFICATION WEB (Système)
      triggerWebNotification("Scraping Terminé ! ", {
        body: `${data.collectedCount} nouvelles thèses ont été extraites avec succès depuis OATD.`,
        tag: `scrape-success-${data.sourceId}`, // Évite les notifications doublons si plusieurs arrivent en même temps
        requireInteraction: true, // La notification reste à l'écran tant que l'utilisateur ne clique pas ou ne la ferme pas
      });
     
      router.refresh();
    }
    );

    // 4. Écoute de l'événement d'échec
    socket.on(
      "scraping-failed",
      (data: { reason: string; message: string }) => {
        toast.error("Échec du scraping", {
          description: data.reason,
          duration: 5000,
        });

        // Notification Web en cas d'échec
        triggerWebNotification("🚨 Échec du Scraping", {
          body: `Le robot a rencontré une erreur : ${data.reason}`,
        });
      }
    );

    // Nettoyage de la connexion lorsque le composant est démonté
    return () => {
      socket.disconnect();
    };
  }, [router]);

  return null; // Ce composant n'altère pas le visuel, c'est un "écouteur fantôme"
}
