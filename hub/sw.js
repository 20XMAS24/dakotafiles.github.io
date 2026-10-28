/* Service worker Kentucky Hub: показывает уведомления и по клику открывает задачу.
   Пуш, когда сайт закрыт, приходит через Firebase Cloud Messaging (функция hubPush в functions/). */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBkbA5B_Tb9lxYhuahRYT4wnwAqPx8nzdc",
  authDomain: "kentucky-economy.firebaseapp.com",
  projectId: "kentucky-economy",
  storageBucket: "kentucky-economy.firebasestorage.app",
  messagingSenderId: "238727156509",
  appId: "1:238727156509:web:ae68581d3bc6277cf507f4"
};

/* клик по уведомлению: открытую вкладку хаба выводим вперёд и открываем в ней задачу, иначе открываем новую */
self.addEventListener('notificationclick', e => {
  const data = e.notification.data || {};
  const id = data.task || (data.FCM_MSG && data.FCM_MSG.data && data.FCM_MSG.data.task) || '';
  e.notification.close();
  const url = new URL(id ? '#/task/'+encodeURIComponent(id) : './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    const c = list.find(w => w.url.startsWith(self.registration.scope));
    if (c) { c.postMessage({hubOpen:id}); return c.focus(); }
    return clients.openWindow(url);
  }));
});
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
  firebase.initializeApp(FIREBASE_CONFIG);
  /* функция шлёт только data — показываем сами, с тем же tag, что и вкладка: одно уведомление не придёт дважды */
  firebase.messaging().onBackgroundMessage(p => {
    const d = p.data || {};
    return self.registration.showNotification(d.title || 'Kentucky Hub', {body:d.body || '', tag:d.tag || undefined, icon:'favicon.svg', badge:'favicon.svg', data:{task:d.task || ''}});
  });
} catch (e) { /* без пуша уведомления всё равно показываются из открытой вкладки */ }
