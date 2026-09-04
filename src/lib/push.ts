/* Web push client helpers — one layer over the Push API and the
 * api/push-subscribe store. Deliberately free of React so it can be reused
 * from anywhere; every function degrades to a clean failure when the
 * browser does not support push. */

export const pushSupported = () =>
  typeof navigator !== 'undefined' &&
  'serviceWorker' in navigator &&
  typeof window !== 'undefined' &&
  'PushManager' in window;

/** the VAPID public key arrives base64url; the Push API wants an ArrayBuffer */
const urlBase64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
};

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

export type PushResult = { ok: true } | { ok: false; reason: 'unsupported' | 'denied' | 'error' };

export async function subscribeToPush(): Promise<PushResult> {
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };
  try {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) return { ok: true };

    const keyRes = await fetch('/api/push-subscribe');
    if (!keyRes.ok) return { ok: false, reason: 'error' };
    const { vapidPublicKey } = await keyRes.json();

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    const res = await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    });
    if (!res.ok) {
      await subscription.unsubscribe().catch(() => false);
      return { ok: false, reason: 'error' };
    }
    return { ok: true };
  } catch {
    const denied = typeof Notification !== 'undefined' && Notification.permission === 'denied';
    return { ok: false, reason: denied ? 'denied' : 'error' };
  }
}

export async function unsubscribeFromPush(): Promise<PushResult> {
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };
  try {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      const response = await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unsubscribe: true, endpoint }),
      });
      if (!response.ok) return { ok: false, reason: 'error' };
      const removed = await subscription.unsubscribe();
      if (!removed) return { ok: false, reason: 'error' };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
