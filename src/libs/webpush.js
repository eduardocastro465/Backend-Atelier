import webpush from 'web-push';
import { VAPID_CONTACT_EMAIL,VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } from "../config.js";

webpush.setVapidDetails(
  // "mailto:20221136@uthh.edu.mx",
  VAPID_CONTACT_EMAIL,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
);

// Función para enviar notificaciones push
export const enviarNotificacion = async (pushSubscription, payload) => {
  try {
    const notificationPayload = JSON.stringify(payload);
    const response = await webpush.sendNotification(pushSubscription, notificationPayload);
    console.log("Notificación enviada:", response);
  } catch (err) {
    console.error("Error al enviar la notificación:", err);
    throw new Error("Error al enviar la notificación");
  }
}; 