/* Тот же проект Firebase, что у страницы экономики. Конфиг веб-приложения не секретный.
   Вынесен из index.html: политика безопасности (CSP) запрещает встроенные скрипты. */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBkbA5B_Tb9lxYhuahRYT4wnwAqPx8nzdc",
  authDomain: "kentucky-economy.firebaseapp.com",
  projectId: "kentucky-economy",
  storageBucket: "kentucky-economy.firebasestorage.app",
  messagingSenderId: "238727156509",
  appId: "1:238727156509:web:ae68581d3bc6277cf507f4"
};
/* Пуш, когда сайт закрыт: Firebase Console → Project settings → Cloud Messaging → Web Push certificates →
   Generate key pair, вставь сюда открытый ключ (он не секретный) и задеплой функцию из functions/. Пусто — пуш выключен,
   уведомления на сайте и в открытой вкладке работают и так. */
const VAPID_KEY = "";
