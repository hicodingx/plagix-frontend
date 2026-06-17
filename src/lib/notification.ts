/**
 * Demande la permission d'afficher des notifications système
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn(
      "Ce navigateur ne prend pas en charge les notifications de l'API Web.",
    );
    return false;
  }

  if (Notification.permission === "granted") return true;

  // On demande la permission de manière standard
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

/**
 * Déclenche une notification système via le Service Worker (Recommandé pour l'asynchrone / WebSockets)
 */
export async function triggerWebNotification(
  title: string,
  options?: NotificationOptions,
) {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  try {
    // 1. On récupère le Service Worker actif de l'application Next.js
    const registration = await navigator.serviceWorker.ready;

    // 2. On pousse la notification à travers lui (Passe outre les blocages asynchrones)
    registration.showNotification(title, {
      icon: "/bell-icon.png",
      badge: "/bell-icon.png", // Petit icône pour la barre de statut sur mobile
      ...options,
    });
  } catch (error) {
    // Fallback : Si le Service Worker n'est pas encore prêt, on tente l'ancienne méthode
    console.warn(
      "[Notification] Échec Service Worker, tentative méthode classique",
      error,
    );
    try {
      new Notification(title, {
        icon: "/bell-icon.png",
        ...options,
      });
    } catch (e) {
      console.error(
        "[Notification] Le navigateur a bloqué l'affichage de la notification :",
        e,
      );
    }
  }
}
