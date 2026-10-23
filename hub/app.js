/* Kentucky Hub — общее рабочее место команды.
   Данные — Firestore (коллекции hub_*), вход — Firebase Auth, всё обновляется у всех сразу. */
(() => {
'use strict';

/* ── иконки Lucide (ISC), встроены только нужные ── */
const ICONS = {
  ArrowDown:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  ArrowRight:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  ArrowUp:'<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  BookOpen:'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  Bug:'<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  Car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  ChartColumn:'<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  Check:'<path d="M20 6 9 17l-5-5"/>',
  CircleAlert:'<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  CircleCheck:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  CircleDot:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  Code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  Coins:'<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
  Copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  Dice5:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/>',
  ExternalLink:'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  Eye:'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  EyeOff:'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  Flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  FlaskConical:'<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
  Gauge:'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  Gem:'<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
  Hammer:'<path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>',
  Hand:'<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  Headphones:'<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  Inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  KeyRound:'<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  LayoutGrid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  Leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  Lightbulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  ListChecks:'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  ListOrdered:'<path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  Lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  LogIn:'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
  LogOut:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  MapPin:'<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  Megaphone:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  Menu:'<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  MessageSquare:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  Monitor:'<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  Palette:'<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  PartyPopper:'<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
  Pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  Plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  Rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  RotateCcw:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  Save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  Scale:'<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  ScrollText:'<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
  Search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  Settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  Shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  SkipForward:'<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',
  Sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  Star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  Sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  SunMoon:'<path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
  Table:'<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>',
  Target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  Trash2:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  TrendingUp:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  User:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  UserCheck:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
  UserPlus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  Users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  Vote:'<path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/>',
  X:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  Paperclip:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  Bot:'<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  Calendar:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  Clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  Download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  Send:'<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  MessagesSquare:'<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  Zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
};
const ic = (n, cls) => `<svg class="ic${cls?' '+cls:''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ── утилиты ────────────────────────────────── */
const $ = (s,r=document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now = () => Date.now();
const clip = (s,n) => { s = String(s ?? '').trim(); return s.length>n ? s.slice(0,n) : s; };
const safeColor = c => /^#[0-9a-f]{6}$/i.test(c||'') ? c : '#6B55B8';
const safeUrl = u => /^https?:\/\/[^\s"'<>]+$/i.test(u||'') ? u : '';
const byOrder = (a,b) => (a.order ?? a.createdAt ?? 0) - (b.order ?? b.createdAt ?? 0);
function dayKey(t){ const d = new Date(t); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function ago(t){
  if (!t) return 'давно';
  const d = now()-t;
  if (d < 60e3) return 'только что';
  if (d < 3600e3) return Math.round(d/60e3)+' мин назад';
  if (d < 86400e3) return Math.round(d/3600e3)+' ч назад';
  return Math.round(d/86400e3)+' дн назад';
}
const mmss = ms => { const s = Math.max(0, Math.round(ms/1000)); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); };
function plural(n, one, few, many){ const m10 = n%10, m100 = n%100; return n+' '+(m10===1&&m100!==11?one:m10>=2&&m10<=4&&(m100<10||m100>=20)?few:many); }

/* ── справочники ────────────────────────────── */
const COLS = [['inbox','Входящие','var(--muted)'],['todo','К работе','var(--info)'],['doing','В работе','var(--warn)'],['review','Ревью','var(--violet)'],['done','Готово','var(--ok)']];
const COL_TONE = {inbox:'muted', todo:'info', doing:'warn', review:'violet', done:'ok'};
const colName = id => (COLS.find(c=>c[0]===id)||[,id])[1];
const SIZES = {S:'≤ 15 мин', M:'≈ 1–2 ч', L:'полдня+'};
const XP_BY_SIZE = {S:10, M:20, L:40};
const WEEK_GOAL = 10;
const ONLINE_MS = 150e3;
const PERSON_COLORS = ['#7C5CE6','#4C6FB8','#A0558F','#A86A3C','#3F8466','#6B55B8','#8E7A2E','#3B7F95','#9C4D4D','#5E6AD2'];

const DEPTS = [
  {id:'dev', name:'Разработка', icon:'Code', color:'#8DB6F8', tldr:'Серверная часть на C# (RAGE MP). Задачи по коду и реестры: remote-события, конфиги, таблицы БД. Фронт и геймдизайн смотрят сюда, чтобы знать, что уже есть.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['events','Remote-события'],['configs','Конфиги'],['db','База данных'],['adr','Архитектура']]},
  {id:'cef', name:'Фронт CEF', icon:'Monitor', color:'#7DD3E8', tldr:'Интерфейсы в игре (CEF). Каждый экран связан с макетом и с событиями сервера. Перед вёрсткой экрана проверь, что макет утверждён.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['screens','Экраны'],['components','Компоненты']]},
  {id:'design', name:'UI/UX-дизайн', icon:'Palette', color:'#F0A6CA', tldr:'Макеты, UI-кит и передача в разработку. Макет считается готовым после статуса «Утверждён» и пройденного чеклиста передачи.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['mockups','Макеты'],['kit','UI-кит'],['handoff','Передача']]},
  {id:'art3d', name:'3D и маппинг', icon:'Car', color:'#F5B98A', tldr:'Машины, одежда, интерьеры (MLO) и маппинг. В реестре видны размер стрима и лицензия каждого ассета, чтобы не превысить лимиты.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['assets','Ассеты'],['limits','Лимиты']]},
  {id:'gd', name:'Геймдизайн', icon:'Dice5', color:'#B9A3FF', tldr:'Механики, работы, квесты и фракции. Каждая механика описана карточкой: зачем, как работает, связанные параметры экономики.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['mechanics','Механики'],['jobs','Работы'],['factions','Фракции']]},
  {id:'econ', name:'Экономика', icon:'Coins', color:'#86D9B0', tldr:'Полное рабочее место экономистов: план, параметры, баги, этапы, решения и журнал. Те же данные, что на старой странице /economy/ — правки видны в обеих.',
    tabs:[['overview','Обзор'],['plan','План'],['params','Параметры'],['bugs','Баги'],['stages','Этапы'],['edec','Решения'],['elog','Журнал'],['tasks','Задачи']]},
  {id:'qa', name:'QA', icon:'FlaskConical', color:'#F49A9A', tldr:'Баги, тест-кейсы и чеклист перед релизом. Критичный баг блокирует релиз, пока не исправлен или не принято решение.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['bugs','Баги'],['cases','Тест-кейсы'],['checklist','Чеклист релиза']]},
  {id:'release', name:'Релизы', icon:'Rocket', color:'#7FD8C9', tldr:'Версии сервера, changelog для игроков и статус деплоя. Релиз выходит, когда чеклист QA закрыт.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['versions','Версии'],['changelog','Changelog'],['deploy','Деплой']]},
  {id:'admin', name:'Администрация', icon:'Shield', color:'#B8DD8A', tldr:'Правила сервера и фидбек игроков. Предложения игроков голосуются и при поддержке становятся задачами.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['rules','Правила'],['feedback','Фидбек игроков']]},
  {id:'smm', name:'SMM', icon:'Megaphone', color:'#E3A6F0', tldr:'Контент-план и анонсы. Каждый анонс привязан к релизу, чтобы не анонсировать то, что ещё не готово.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['plan','Контент-план'],['posts','Анонсы']]},
  {id:'donate', name:'Донат', icon:'Gem', color:'#F2CF7E', tldr:'Позиции доната, цены и акции. Курс и лимиты конвертации согласуются с экономикой: одна валюта, один курс.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['items','Позиции'],['promos','Акции']]},
  {id:'analytics', name:'Аналитика', icon:'ChartColumn', color:'#A5B0F7', tldr:'Метрики сервера: онлайн, удержание, денежная масса. Цели по метрикам задаются здесь.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['metrics','Метрики'],['reports','Отчёты']]}
];
const D = Object.fromEntries(DEPTS.map(d=>[d.id,d]));

/* ── реестры отделов: схема полей ───────────── */
const fName = l => ({k:'name', l, t:'text', req:true});
const fTldr = {k:'tldr', l:'Суть в одном предложении', t:'text'};
const fDetails = {k:'details', l:'Подробности', t:'textarea'};
const fText = (k, l, mono) => ({k, l, t:'text', mono});
const fWho = l => ({k:'who', l:l||'Ответственный', t:'person'});
const fStatus = o => ({k:'status', l:'Статус', t:'select', o});
const S_CARD = [['Черновик','muted'],['Обсуждается','info'],['Принято','ok'],['Отменено','red']];
const REGS = {
  'dev/events':   {type:'table', noun:'событие', fields:[fName('Событие'), {k:'dir', l:'Направление', t:'select', o:[['CEF → сервер','info'],['сервер → CEF','violet']]}, fText('args','Аргументы',true), fText('where','Где в коде',true), fStatus([['Планируется','muted'],['В работе','warn'],['Готово','ok'],['Переделать','red']]), fDetails]},
  'dev/configs':  {type:'table', noun:'конфиг', fields:[fName('Файл'), fText('what','Что внутри'), fWho('Владелец'), fStatus([['Стабильно','ok'],['Меняется','warn'],['Новый','info']]), fDetails]},
  'dev/db':       {type:'table', noun:'таблицу', fields:[fName('Таблица'), fText('what','Назначение'), fText('migration','Миграция',true), fStatus([['Стабильно','ok'],['Новая','info'],['Проблема','red']]), fDetails]},
  'dev/adr':      {type:'cards', noun:'решение', fields:[fName('Решение'), fTldr, fStatus(S_CARD), fDetails]},
  'cef/screens':  {type:'table', noun:'экран', fields:[fName('Экран'), fText('path','Путь',true), fText('events','События',true), fText('mockup','Макет'), fStatus([['Ждёт макет','muted'],['Вёрстка','warn'],['Готово','ok'],['Переделать','red']]), fDetails]},
  'cef/components':{type:'cards', noun:'компонент', fields:[fName('Компонент'), fTldr, fStatus([['Планируется','muted'],['В работе','warn'],['Готово','ok']]), fDetails]},
  'design/mockups':{type:'mockups', noun:'макет', fields:[fName('Макет'), fTldr, {k:'link', l:'Ссылка на макет (Figma и т.п.)', t:'url'}, fWho('Дизайнер'), fStatus([['Черновик','muted'],['В работе','warn'],['На ревью','violet'],['Утверждён','ok']]), fDetails]},
  'design/handoff':{type:'checklist', noun:'пункт', fields:[fName('Пункт')]},
  'art3d/assets': {type:'table', noun:'ассет', fields:[fName('Ассет'), {k:'kind', l:'Тип', t:'select', o:[['Машина','info'],['Одежда','violet'],['MLO','warn'],['Маппинг','ok'],['Другое','muted']]}, fWho('Автор'), fText('size','Стрим, МБ',true), fText('license','Лицензия'), fStatus([['Идея','muted'],['В работе','warn'],['Готово','ok'],['Превышен лимит','red']]), fDetails]},
  'art3d/limits': {type:'metrics', noun:'лимит', fields:[fName('Показатель'), fText('value','Значение'), fText('note','Комментарий / цель'), {k:'series', l:'История (числа через запятую)', t:'text', mono:true}]},
  'gd/mechanics': {type:'cards', noun:'механику', fields:[fName('Механика'), fTldr, fStatus([['Черновик','muted'],['Обсуждается','info'],['Описано','ok'],['Переделать','red']]), fDetails]},
  'gd/jobs':      {type:'table', noun:'работу', fields:[fName('Работа'), fText('target','Цель, $/ч'), fText('now','Сейчас'), fStatus([['В норме','ok'],['Пересчитать','warn'],['Сломано','red']]), fDetails]},
  'gd/factions':  {type:'table', noun:'фракцию', fields:[fName('Фракция'), {k:'kind', l:'Тип', t:'select', o:[['Гос.','info'],['Банда','warn'],['Мафия','violet'],['Другое','muted']]}, fText('income','Доход'), fStatus([['Черновик','muted'],['Описано','ok']]), fDetails]},
  'qa/bugs':      {type:'table', noun:'баг', fields:[fName('Баг'), {k:'sev', l:'Важность', t:'select', o:[['Критично','red'],['Высокая','warn'],['Средняя','info'],['Низкая','muted']]}, fText('where','Где',true), fWho(), fStatus([['Открыт','red'],['В работе','warn'],['На ревью','violet'],['Исправлен','ok'],['Не будем','muted']]), fDetails]},
  'qa/cases':     {type:'table', noun:'тест-кейс', fields:[fName('Кейс'), fText('steps','Шаги'), fText('expected','Ожидаемо'), fStatus([['Не проверен','muted'],['Проходит','ok'],['Падает','red']]), fDetails]},
  'qa/checklist': {type:'checklist', noun:'пункт', fields:[fName('Пункт')]},
  'release/versions':{type:'timeline', noun:'версию', fields:[fName('Версия'), fTldr, fStatus([['Готовится','warn'],['Вышла','ok'],['Отменена','muted']]), fDetails]},
  'release/changelog':{type:'cards', noun:'changelog', fields:[fName('Заголовок'), fTldr, fStatus([['Черновик','muted'],['Опубликован','ok']]), fDetails]},
  'release/deploy':{type:'table', noun:'деплой', fields:[fName('Окружение'), fText('version','Версия',true), fText('when','Когда'), fWho('Кто'), fStatus([['Работает','ok'],['Тестируется','warn'],['Упал','red']]), fDetails]},
  'admin/rules':  {type:'cards', noun:'правило', fields:[fName('Правило'), fTldr, fStatus(S_CARD), fDetails]},
  'admin/feedback':{type:'table', noun:'предложение', fields:[fName('Предложение'), fText('source','Откуда'), fText('votes','Голоса игроков'), fStatus([['Новое','muted'],['Обсуждается','info'],['Взяли в работу','ok'],['Отклонено','red']]), fDetails]},
  'smm/plan':     {type:'table', noun:'публикацию', fields:[fName('Тема'), fText('date','Дата'), fText('channel','Канал'), fText('release','Релиз'), fStatus([['Идея','muted'],['Готовится','warn'],['Готово','ok'],['Опубликовано','violet']]), fDetails]},
  'smm/posts':    {type:'cards', noun:'анонс', fields:[fName('Анонс'), fTldr, fStatus([['Идея','muted'],['Готовится','warn'],['Готово','ok']]), fDetails]},
  'donate/items': {type:'table', noun:'позицию', fields:[fName('Позиция'), fText('price','Цена, RB',true), fText('rub','≈ ₽',true), fStatus([['Активна','ok'],['Пересчитать','warn'],['Ждёт решения','info'],['Снята','muted']]), fDetails]},
  'donate/promos':{type:'cards', noun:'акцию', fields:[fName('Акция'), fTldr, fStatus([['Черновик','muted'],['Согласована','ok'],['Идёт','violet'],['Прошла','muted']]), fDetails]},
  'analytics/metrics':{type:'metrics', noun:'метрику', fields:[fName('Метрика'), fText('value','Значение'), fText('note','Комментарий / цель'), {k:'series', l:'История (числа через запятую)', t:'text', mono:true}]},
  'analytics/reports':{type:'cards', noun:'отчёт', fields:[fName('Отчёт'), fTldr, fStatus([['Черновик','muted'],['Готов','ok']]), fDetails]}
};
const tableFields = r => r.fields.filter(f=>f.t!=='textarea');
const toneOf = (f, v) => ((f.o||[]).find(o=>o[0]===v)||[,'muted'])[1];

/* ── стартовое наполнение: только факты со страницы экономики и шаблоны ── */
const SEED = {
  tasks:[
    {id:'t1', title:'Убрать умножение reds × 1000 в донате', tldr:'Одна валюта: 1 ₽ = 1 RB. Убрать множитель и поделить цены.', details:'MoneySystem/Donations.cs:181 — reds * 1000.\nЦены, рассчитанные под ×1000, разделить на 1000. Цены VIP уже в рублёвой шкале.', dept:'dev', status:'todo', size:'M', links:['d1','t9'], sub:[{t:'Найти все места с ×1000',done:false},{t:'Поменять цены в каталоге',done:false},{t:'Проверить на тестовом сервере',done:false}]},
    {id:'t2', title:'Emit / Burn / Transfer с категориями', tldr:'Все начисления от сервера — только через Emit, чтобы считать эмиссию.', details:'Новый класс MoneySystem/Economy.cs. Пишет в ra3_mainlogs.economy_hourly раз в час.', dept:'dev', status:'todo', size:'L', links:['t10'], sub:[{t:'Класс Economy',done:false},{t:'Перевести такси и пособие',done:false},{t:'Перевести работы',done:false},{t:'Почасовая запись',done:false}]},
    {id:'t3', title:'Вернуть списание товара в takeProd', tldr:'Бизнесы сейчас ничего не тратят: склад бесконечный.', details:'Core/Businesses.cs:1960-1961.', dept:'dev', status:'todo', size:'S', links:[], sub:[]},
    {id:'t4', title:'Экран банкомата: показать комиссию', tldr:'Комиссия 5% видна до подтверждения операции.', details:'', dept:'cef', status:'inbox', size:'M', links:['t5'], sub:[]},
    {id:'t5', title:'Макет меню бизнеса: заказ товара', tldr:'Владелец видит оптовую цену, доставку и маржу при розничной цене.', details:'Розница — в коридоре 95–175% от базы. Нужен ползунок и подсказка «маржа N%».', dept:'design', status:'inbox', size:'L', links:['t3'], sub:[]},
    {id:'t7', title:'Описать механику отмыва денег', tldr:'Комиссия отмыва 3% → 20–30%, иначе грязные деньги не отличаются от чистых.', details:'Связано с криминальной цепочкой и доходом с точек.', dept:'gd', status:'inbox', size:'M', links:['d2'], sub:[]},
    {id:'t8', title:'Стартовые деньги: 500 млн → 1,5 млн', tldr:'Старт 500 млн обнуляет прогрессию: новичок сразу покупает люкс.', details:'settings/moneySettings.json → CreateCharMoney.', dept:'econ', status:'todo', size:'S', links:['d1'], sub:[]},
    {id:'t9', title:'F2-магазин: перевести на общий путь списания RB', tldr:'Магазин пишет RedBucks в БД напрямую — нужно через UpdateData.RedBucks с проверкой и логом.', details:'GUI/GameUI.cs.', dept:'donate', status:'inbox', size:'M', links:['t1'], sub:[]},
    {id:'t10', title:'Дашборд эмиссии и стоков', tldr:'Неделя на одном графике: сколько денег напечатали и сожгли.', details:'Источник — economy_hourly. Цель: стоки / эмиссия 0,8–1,0.', dept:'analytics', status:'inbox', size:'M', links:['t2'], sub:[]},
    {id:'t11', title:'Анонс денежной реформы', tldr:'Объяснить игрокам, зачем реформа и что будет с их деньгами.', details:'Выходит вместе с реформой. Без цифр до утверждения.', dept:'smm', status:'inbox', size:'M', links:[], sub:[]},
    {id:'t12', title:'Лимит на админскую выдачу денег', tldr:'Только с причиной и суточным лимитом: в логах 84,8 млрд выдано админами.', details:'', dept:'admin', status:'inbox', size:'S', links:[], sub:[]}
  ],
  decisions:[
    {id:'d1', q:'Курс RB → $ и лимит конвертации', dept:'donate', tldr:'Без лимита донат снова печатает миллиарды. Нужен один курс и потолок в неделю.', options:[{t:'Как сейчас, без лимита',d:'Ничего не меняем'},{t:'Один курс + лимит в неделю',d:'Донат ускоряет, но не ломает экономику'},{t:'Плавающий курс от денежной массы',d:'Сложно объяснить игрокам'}], rec:1},
    {id:'d2', q:'Комиссия отмыва денег', dept:'gd', tldr:'Сейчас 3%. Предлагают 20–30%, чтобы у криминала была цена.', options:[{t:'20%',d:'Мягко, проще принять игрокам'},{t:'25%',d:'Середина'},{t:'30%',d:'Жёстко, но честно для риска'}], rec:1},
    {id:'d3', q:'Автосалоны — бизнесы игроков или государство?', dept:'econ', tldr:'Продажа машин государством сейчас — главный реальный сток денег.', options:[{t:'Оставить государству',d:'Сток сохраняется'},{t:'Бизнесы с комиссией владельцу 5%',d:'Игрокам интересно, сток почти сохраняется'}], rec:-1}
  ],
  reg:[
    ['dev/configs',{name:'settings/moneySettings.json', what:'Стартовые деньги и RB', status:'Меняется'}],
    ['dev/configs',{name:'settings/pricesSettings.json', what:'Пособие новичку, цены услуг', status:'Меняется'}],
    ['dev/configs',{name:'settings/economy.json', what:'Общий конфиг экономики: якорь, налоги, комиссии, донат', status:'Новый'}],
    ['dev/db',{name:'ra3_main.economy', what:'Параметры экономики', status:'Проблема', details:'В таблице «классическая» шкала, а Core/Economy.cs → ResetToDefault() — «миллионная». Если строка не распарсится, сервер молча переключится на другую шкалу.'}],
    ['dev/db',{name:'ra3_mainlogs.economy_hourly', what:'Эмиссия и стоки по часам', status:'Новая'}],
    ['dev/adr',{name:'Все суммы денег — long', tldr:'Суммы казны, фракций и организаций не влезают в int: без Convert.ToInt32.', status:'Обсуждается'}],
    ['dev/adr',{name:'Начисления от сервера — только через Emit', tldr:'Любое начисление — эмиссия с категорией, любое списание в никуда — сток с категорией.', status:'Обсуждается'}],
    ['dev/adr',{name:'Числа экономики — в одном конфиге', tldr:'settings/economy.json, без пересборки сервера.', status:'Обсуждается'}],
    ['gd/jobs',{name:'Такси с NPC', target:'2,5–3,5 млн', now:'75 млн за поездку (≈ 2,1 млрд/ч)', status:'Сломано'}],
    ['gd/jobs',{name:'Электрик', target:'2,5–3,5 млн', now:'600 000 × (1,0–2,0) (≈ 87 млн/ч)', status:'Сломано'}],
    ['gd/jobs',{name:'Дальнобой', target:'3,5–5 млн', now:'16–52 млн за рейс', status:'Пересчитать'}],
    ['gd/jobs',{name:'Шахтёр', target:'2,5–3,5 млн', now:'≈ 3 млн за удар', status:'Пересчитать'}],
    ['gd/jobs',{name:'Лесоруб', target:'2,5–3,5 млн', now:'6–19 $ за бревно', status:'Пересчитать'}],
    ['gd/jobs',{name:'Автобус', target:'2,5–3,5 млн', now:'15–18 $ за остановку', status:'Пересчитать'}],
    ['gd/mechanics',{name:'Бизнесы игроков', tldr:'Оптом 60% от базы, розница 95–175%. Склад конечный, налог с продаж 10%.', status:'Обсуждается'}],
    ['gd/mechanics',{name:'Отмыв денег', tldr:'Комиссия 20–30% вместо 3%.', status:'Обсуждается'}],
    ['gd/mechanics',{name:'Казна штата', tldr:'Базовая зарплата от сервера, премии из казны. Мэр двигает налоги ±30%.', status:'Обсуждается'}],
    ['gd/mechanics',{name:'Криминальная цепочка', tldr:'Лаборатория 50 000 → закладчик 100–150 тыс. Крафт оружия на 20–30% дешевле магазина.', status:'Обсуждается'}],
    ['analytics/metrics',{name:'Денежная масса', value:'≈ 13,6 трлн $', note:'снимок базы, активность до 29.11.2025'}],
    ['analytics/metrics',{name:'Медианный персонаж', value:'461 млн $', note:'P10 — 38 млн, P90 — 1,51 млрд'}],
    ['analytics/metrics',{name:'Доля топ-1% в наличности', value:'61,5%', note:'цель < 20%'}],
    ['analytics/metrics',{name:'Персонажей на 0 уровне', value:'1815 из 3601', note:'≈ 190 лежат ровно со стартовыми 500 млн'}],
    ['analytics/reports',{name:'Снимок денежной массы', tldr:'≈ 13,6 трлн $ в обороте, медиана 461 млн, топ-1% держит 61,5% наличности.', status:'Готов'}],
    ['design/handoff',{name:'Все состояния: пусто, загрузка, ошибка'}],['design/handoff',{name:'Тексты вычитаны'}],['design/handoff',{name:'Размеры под 1080p и 1440p'}],
    ['design/handoff',{name:'Иконки выгружены в SVG'}],['design/handoff',{name:'События сервера согласованы с разработкой'}],['design/handoff',{name:'Ссылка на макет есть в карточке экрана CEF'}],
    ['qa/checklist',{name:'Нет открытых критичных багов'}],['qa/checklist',{name:'Тест-кейсы по деньгам пройдены'}],['qa/checklist',{name:'Конфиги в репозитории совпадают с сервером'}],
    ['qa/checklist',{name:'Бэкап базы сделан'}],['qa/checklist',{name:'Changelog для игроков готов'}],['qa/checklist',{name:'Анонс согласован с SMM'}]
  ],
  wiki:[
    {title:'С чего начать новичку', tldr:'Заполни профиль, открой свой отдел и возьми задачу размера S.', body:'1. Нажми на шестерёнку и заполни профиль: роль и свои отделы.\n2. Открой свой отдел в боковой панели и прочитай «Суть раздела».\n3. Возьми задачу «≤ 15 мин» — так проще влиться.\n4. Мысль пришла не по теме — жми Q и записывай во «Входящие». Разберёшь потом.'},
    {title:'Как принимаем решения', tldr:'Спорное — в «Решения». Каждый голосует, итог фиксирует кнопка «Принять».', body:'Решение без итога висит у всех в «Моём дне» в блоке «Ждут твоего голоса», пока ты не проголосуешь.'},
    {title:'Как устроен сервер', tldr:'RAGE MP + C#, база MySQL (ra3_main, ra3_mainlogs), интерфейсы — CEF.', body:'Сервер: Core/, MoneySystem/, GUI/.\nКонфиги: settings/*.json.\nФронт: src_cef/.'},
    {title:'Правила оформления задач', tldr:'Название — действие. Суть — одно предложение «зачем». Размер обязателен.', body:'Хорошо: «Вернуть списание товара в takeProd».\nПлохо: «Бизнесы».\n\nРазмеры: S — до 15 минут, M — час-два, L — полдня и больше. Большую задачу лучше разбить на шаги.'}
  ]
};

/* ── состояние ──────────────────────────────── */
/* allTasks — задачи, пришедшие из базы (только свои отделы, см. listenTasks), tasks — они же после applyVis */
const S = {me:null, people:{}, tdept:{}, allTasks:[], tasks:[], decisions:[], inbox:[], log:[], reg:[], wiki:[], files:[], chats:[], msgs:[], claude:[], up:{}, E:null, loaded:new Set(), errs:{}};
const UI = {route:'today', tab:null, chat:null, chatDraft:{}, cday:0, filt:{dept:'all', small:false, mine:false}, drawer:null, edit:false, pal:null, ef:{status:'all', group:'all', q:'', hideFixed:false, hideDone:false}, eDraft:''};
const PREFS_KEY = 'kyHubPrefs';
const P = Object.assign({theme:'auto', calm:false, fs:'m', density:'normal', hidden:[]}, (() => { try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; } })());
const savePrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(P)); } catch (e) {} };

const task = id => S.tasks.find(t=>t.id===id);
const dec = id => S.decisions.find(d=>d.id===id);
const regItem = id => S.reg.find(r=>r.id===id);
const wikiItem = id => S.wiki.find(w=>w.id===id);
const me = () => S.people[S.me] || {};
const myDepts = () => (me().depts||[]).filter(id=>D[id]);
const canSee = dept => myDepts().includes(dept);
const seesAll = () => DEPTS.every(d=>canSee(d.id));
/* отделы назначает руководитель (поле admin в hub_people); сами участники их не меняют */
const isAdmin = () => me().admin === true;
const adminNames = () => Object.values(S.people).filter(p=>p.admin===true).map(p=>p.name).join(', ');
/* задача может относиться к нескольким отделам: dept — основной, depts — все (с основным) */
const tDepts = t => [...new Set([t.dept, ...(Array.isArray(t.depts)?t.depts:[])])].filter(x=>D[x]);
const inDept = (t, d) => tDepts(t).includes(d);
const seeTask = t => tDepts(t).some(canSee);
const dchips = t => tDepts(t).map(dchip).join('');
function applyVis(){ S.tasks = S.allTasks.filter(seeTask); }
const pname = id => !id ? 'Не назначен' : (S.people[id] && S.people[id].name) || 'Участник';
const isOnline = id => id===S.me || !!(S.people[id] && S.people[id].seen > now()-ONLINE_MS);
const focusOf = id => { const f = S.people[id] && S.people[id].focus; return f && f.until > now() ? f : null; };
function initials(name){ return String(name||'?').split(/\s+/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?'; }
function av(id, size){
  const s = size ? `width:${size}px;height:${size}px;` : '';
  if (!id || !S.people[id]) return `<span class="av" style="${s}background:var(--panel-3);color:var(--muted)" title="${esc(pname(id))}">${id?'?':'—'}</span>`;
  const p = S.people[id];
  const cls = focusOf(id) ? 'av on focus' : isOnline(id) ? 'av on' : 'av';
  return `<span class="${cls}" style="${s}background:${safeColor(p.color)}" title="${esc(p.name)}">${esc(initials(p.name))}</span>`;
}
const dchip = id => { const d = D[id]; return d ? `<span class="dchip" role="link" tabindex="0" style="--dc:${d.color}" data-go="d/${d.id}">${ic(d.icon)} ${esc(d.name)}</span>` : ''; };
const chip = (label, tone) => `<span class="chip dot t-${tone||'muted'}">${esc(label)}</span>`;
const level = () => Math.floor((me().xp||0)/100)+1;
function streak(){
  const set = new Set(me().days||[]); let n = 0;
  for (let i=0;;i++) { const k = dayKey(now()-i*86400e3); if (set.has(k)) n++; else if (i>0) break; }
  return n;
}
const weekDone = () => S.tasks.filter(t=>t.status==='done' && t.doneBy===S.me && (t.doneAt||0) > now()-7*86400e3).length;

/* ── база ───────────────────────────────────── */
let AUTH = null, DB = null, UNSUB = [];
const col = n => DB.collection(n);
const FV = () => firebase.firestore.FieldValue;
const stamp = () => ({updatedAt:now(), updatedBy:S.me});
function errText(e){
  const c = e && e.code;
  if (c==='permission-denied') return 'нет доступа — проверь правила Firestore';
  if (c==='unavailable') return 'нет связи с базой';
  return (e && (c || e.message)) || 'ошибка';
}
async function write(fn){
  try { await fn(); return true; }
  catch (e) { console.error(e); toast(ic('CircleAlert')+' Не сохранилось: '+esc(errText(e))); return false; }
}
function log(act, title, dept){ col('hub_log').add({by:S.me, at:now(), act, title:clip(title,200), dept:dept||null}).catch(()=>{}); }
function gain(xp, text){
  toast(text, P.calm ? '' : '+'+xp+' XP');
  col('hub_people').doc(S.me).update({xp:FV().increment(xp), days:FV().arrayUnion(dayKey(now()))}).catch(()=>{});
}
function patchMe(patch){ return write(()=>col('hub_people').doc(S.me).update(patch)); }

/* ── геймификация ───────────────────────────── */
function confetti(x, y, n=28){
  if (P.calm || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#A98BFA','#C7B5FF','#7C5CE6','#ECE6FF','#F0A6CA','#8DB6F8'];
  for (let i=0;i<n;i++){
    const el = document.createElement('i'); el.className = 'confetti';
    const a = Math.random()*Math.PI*2, r = 60+Math.random()*140;
    el.style.cssText = `left:${x}px;top:${y}px;background:${colors[i%colors.length]};--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r+120}px;--r:${Math.random()*720-360}deg`;
    document.body.appendChild(el); setTimeout(()=>el.remove(), 1200);
  }
}
function toast(html, xp){
  const el = document.createElement('div'); el.className = 'toast';
  el.innerHTML = `<span>${html}</span>${xp?`<span class="xp">${esc(xp)}</span>`:''}`;
  $('#toasts').appendChild(el); setTimeout(()=>el.remove(), 3400);
}

/* ── маршрутизация ──────────────────────────── */
function readHash(){
  const p = (location.hash||'').replace(/^#\/?/,'').split('/');
  if (p[0]==='d' && D[p[1]]) { UI.route = 'd/'+p[1]; UI.tab = p[2] || 'overview'; }
  else { UI.route = ['today','tasks','decisions','inbox','log','people','wiki','chats','claude'].includes(p[0]) ? p[0] : 'today'; UI.tab = null; }
  UI.chat = UI.route==='chats' && p[1] ? decodeURIComponent(p[1]) : null;
}
const go = path => { location.hash = '#/'+path; };
addEventListener('hashchange', () => { readHash(); if (UI.route==='d/econ') eSyncName(); closeDrawer(); document.body.classList.remove('nav-open'); paint(); scrollTo(0,0); });

/* ── боковая панель ─────────────────────────── */
function sidebar(){
  const r = UI.route, m = me();
  const openDec = S.decisions.filter(d=>d.chosen==null && (d.votes||{})[S.me]==null).length;
  const myTop = (m.top3||[]).map(task).filter(t=>t && t.status!=='done').length;
  const link = (path, icon, name, n, color, hot) =>
    `<a href="#/${path}" ${r===path?'aria-current="page"':''} style="--dc:${color}"><span class="ico">${ic(icon)}</span>${esc(name)}${n?`<span class="n${hot?' hot':''}">${n}</span>`:''}</a>`;
  const xpIn = (m.xp||0) % 100;
  return `
  <div class="brand"><span class="mark">KS</span><div><b>Kentucky Hub</b><small>рабочее место команды</small></div></div>
  <nav class="nav">
    ${link('today','Sun','Мой день', myTop, '#F5B971')}
    ${link('inbox','Inbox','Входящие', S.inbox.length, '#A9A8B6')}
    ${link('tasks','LayoutGrid','Задачи', S.tasks.filter(t=>t.status!=='done').length, '#8DB6F8')}
    ${link('decisions','Scale','Решения', openDec, '#B9A3FF', openDec>0)}
    ${link('log','ScrollText','Журнал', 0, '#A9A8B6')}
    ${link('people','Users','Люди', Object.keys(S.people).filter(isOnline).length, '#86D9B0')}
    ${link('chats','MessagesSquare','Чаты', unreadChats(), '#7DD3E8', unreadChats()>0)}
    ${link('wiki','BookOpen','Вики', 0, '#F5B98A')}
    ${(b => link('claude','Bot','Claude', b ? (b.by===S.me ? 'ты' : 'занят') : '', '#E8B07D', !!b && b.by!==S.me))(claudeAt(now()))}
  </nav>
  <div class="nav-h">Отделы <button data-action="settings" title="Показать или скрыть отделы">настроить</button></div>
  <nav class="nav">
    ${DEPTS.filter(d=>!P.hidden.includes(d.id)).map(d => link('d/'+d.id, d.icon, d.name, S.tasks.filter(t=>inDept(t,d.id) && t.status!=='done').length || '', d.color)).join('')}
  </nav>
  <div class="me-card">
    <div class="me-row">${av(S.me,30)}<div style="min-width:0;flex:1"><b style="font-size:14px">${esc(m.name||'')}</b><br><small>${esc(m.role || '@'+(m.login||''))}</small></div><span class="streak" title="Дней подряд с действием">${ic('Flame')} ${streak()}</span><button class="icon-btn" data-action="logout" title="Выйти" aria-label="Выйти" style="width:30px;height:30px">${ic('LogOut')}</button></div>
    <div class="me-row"><span class="lvl">Ур. ${level()}</span><div class="xpbar" style="flex:1"><i style="width:${xpIn}%"></i></div><small class="mono">${xpIn}/100</small></div>
    <small>Неделя: ${weekDone()} из ${WEEK_GOAL} задач закрыто</small>
  </div>`;
}

/* ── верхняя полоса ─────────────────────────── */
function topbar(){
  const online = Object.keys(S.people).filter(id=>id!==S.me && isOnline(id));
  const f = focusOf(S.me), cb = claudeAt(now());
  return `
  <button class="icon-btn burger" data-action="open-nav" aria-label="Меню">${ic('Menu')}</button>
  <button class="search" data-action="palette">${ic('Search')}<span>Найти или сделать что угодно…</span><kbd>Ctrl K</kbd></button>
  <span class="tb-sp"></span>
  ${cb && cb.by!==S.me ? `<a class="claude-pill hide-sm" href="#/claude" title="${esc(cb.note||'')}">${ic('Bot')} Claude: ${esc(pname(cb.by).split(' ')[0])} до ${hhmm(cb.end)}</a>` : ''}
  ${f && f.claude ? `<button class="focus-pill" data-action="claude-focus" title="Открыть фокус-режим Claude">${ic('Bot')} <span class="mono" id="focus-left">${mmss(f.until-now())}</span><span class="lbl">Claude</span></button>`
  : f ? `<button class="focus-pill" data-action="focus-stop" title="Остановить фокус">${ic('Headphones')} <span class="mono" id="focus-left">${mmss(f.until-now())}</span><span class="lbl">${esc(clip(task(f.task)?.title||'Фокус',28))}</span> ${ic('X')}</button>`
      : `<button class="btn sm hide-sm" data-action="focus-start" data-id="${esc(me().last||'')}" title="25 минут фокуса — коллеги увидят, что вы работаете">${ic('Headphones')} Фокус 25 мин</button>`}
  <a class="faces" href="#/people" title="Сейчас онлайн: ${online.length}">${online.slice(0,5).map(id=>av(id)).join('')}</a>
  <button class="icon-btn" data-action="settings" aria-label="Настройки и профиль" title="Настройки и профиль">${ic('Settings')}</button>`;
}

/* ── «Мой день» ─────────────────────────────── */
function hello(){ const h = new Date().getHours(); return h<5?'Доброй ночи':h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер'; }
function taskItem(t, opts={}){
  const d = D[t.dept] || DEPTS[0];
  const done = t.status==='done';
  const sub = t.sub||[], sd = sub.filter(s=>s.done).length;
  return `<div class="item" tabindex="0" data-open="task:${esc(t.id)}" style="--dc:${d.color}">
    <button class="check${done?' on':''}" data-action="toggle-done" data-id="${esc(t.id)}" aria-label="${done?'Вернуть в работу':'Готово'}">${ic('Check')}</button>
    <div class="bd">
      <div class="tt" style="${done?'text-decoration:line-through;color:var(--muted)':''}">${esc(t.title)}</div>
      ${t.tldr ? `<div class="ds">${esc(t.tldr)}</div>`:''}
      <div class="mt">${dchips(t)}<span class="size" title="${SIZES[t.size]||''}">${esc(t.size||'M')}</span>${opts.status?chip(colName(t.status), COL_TONE[t.status]):''}${sub.length?`<small style="color:var(--muted)">${ic('ListChecks')} ${sd}/${sub.length}</small>`:''}</div>
    </div>
    ${av(t.who)}
  </div>`;
}
function heatmap(){
  const days = Array.from({length:14},(_,i)=>dayKey(now()-(13-i)*86400e3));
  const nums = Array.from({length:14},(_,i)=>new Date(now()-(13-i)*86400e3).getDate());
  const counts = {};
  for (const l of S.log) { if (!l.dept) continue; const k = dayKey(l.at); const i = days.indexOf(k); if (i<0) continue; (counts[l.dept] = counts[l.dept] || Array(14).fill(0))[i]++; }
  const rows = DEPTS.filter(d=>!P.hidden.includes(d.id)).sort((a,b)=>(counts[b.id]||[]).reduce((x,y)=>x+y,0)-(counts[a.id]||[]).reduce((x,y)=>x+y,0)).slice(0,6);
  const lv = n => n>=6?3:n>=3?2:n>=1?1:0;
  return `<section class="panel"><div class="panel-h"><h2><span class="hi">${ic('TrendingUp')}</span>Активность команды</h2><a class="btn sm ghost" href="#/log">Журнал</a></div>
  <div class="legend"><span><i style="opacity:.3"></i>Тишина</span><span><i style="opacity:.55"></i>1–2</span><span><i style="opacity:.8"></i>3–5</span><span><i></i>6+ действий</span></div>
  <div class="heat">${rows.map(d=>`<span class="rl" title="${esc(d.name)}">${ic(d.icon)} ${esc(d.name)}</span>`+(counts[d.id]||Array(14).fill(0)).map((n,i)=>`<span class="cell l${lv(n)}" title="${esc(d.name)}: ${n} · ${nums[i]}"></span>`).join('')).join('')}<span></span>${nums.map(n=>`<span class="cl">${n}</span>`).join('')}</div></section>`;
}
function viewToday(){
  const m = me();
  const top = (m.top3||[]).map(task).filter(Boolean);
  const left = top.filter(t=>t.status!=='done').length;
  const wd = weekDone(), pct = Math.min(100, Math.round(wd/WEEK_GOAL*100));
  const last = m.last && task(m.last);
  const pendingVotes = S.decisions.filter(d=>d.chosen==null && (d.votes||{})[S.me]==null);
  const quick = S.tasks.filter(t=>t.size==='S' && t.status!=='done' && (!t.who || t.who===S.me) && !(m.top3||[]).includes(t.id)).slice(0,3);
  const online = Object.keys(S.people).filter(id=>id!==S.me && isOnline(id));
  return `
  <section class="hero">
    <div><h1>${hello()}, ${esc((m.name||'').split(' ')[0])}! ${ic('Hand')}</h1><p>${top.length ? (left ? `На сегодня ${left} из ${top.length} главных задач. Начни с самой маленькой.` : 'Главные задачи закрыты. Можно выдохнуть.') : 'Выбери до трёх главных задач на сегодня — кнопка «В день» в карточке задачи.'}</p></div>
    <div class="hero-stats">
      <div class="ring" style="--p:${pct}" title="Цель недели"><span>${pct}%</span></div>
      <div class="hs"><b>${wd}/${WEEK_GOAL}</b><small>задач за неделю</small></div>
      <div class="hs"><b>${ic('Flame')} ${streak()}</b><small>дней подряд</small></div>
      <div class="hs"><b>Ур. ${level()}</b><small>${m.xp||0} XP</small></div>
    </div>
  </section>
  ${last && last.status!=='done' ? `<div class="resume">${ic('MapPin')}<div class="bd"><small>Ты остановился здесь</small><b>${esc(last.title)}</b></div><button class="btn sm" data-open="task:${esc(last.id)}">Открыть</button><button class="btn sm primary" data-action="focus-start" data-id="${esc(last.id)}">${ic('Headphones')} Продолжить 25 мин</button></div>`:''}
  <div class="today-grid">
    <div class="col">
      <section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('Target')}</span>Три главные на сегодня</h2><span class="sub">не больше трёх — так проще начать</span></div>
        <div class="list">${top.map(t=>taskItem(t,{status:true})).join('') || `<div class="empty"><b>Пока пусто</b>Открой любую задачу и нажми «${ic('Star')} В день».<a class="btn sm" href="#/tasks">Открыть задачи</a></div>`}</div>
      </section>
      ${pendingVotes.length ? `<section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('Scale')}</span>Ждут твоего голоса</h2><a class="btn sm ghost" href="#/decisions">Все решения</a></div>
        <div class="list">${pendingVotes.map(d=>`<div class="item" tabindex="0" data-go="decisions"><div class="bd"><div class="tt">${esc(d.q)}</div><div class="ds">${esc(d.tldr)}</div><div class="mt">${dchip(d.dept)}<small style="color:var(--muted)">${plural(Object.keys(d.votes||{}).length,'голос','голоса','голосов')}</small></div></div></div>`).join('')}</div>
      </section>`:''}
      <section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('Zap')}</span>Если сил мало: задачи на 15 минут</h2></div>
        <div class="list">${quick.map(t=>taskItem(t)).join('') || '<div class="empty">Быстрых свободных задач нет.</div>'}</div>
      </section>
      ${heatmap()}
    </div>
    <div class="col">
      <section class="panel glow">
        <div class="panel-h"><h2><span class="hi">${ic('Headphones')}</span>Работают рядом</h2><span class="sub">${online.length} онлайн</span></div>
        ${online.map(id => { const f = focusOf(id), p = S.people[id];
          return `<div class="person">${av(id,32)}<div class="bd"><div class="nm">${esc(p.name)}</div><div class="st${f?' f':''}">${f ? `в фокусе ещё <span class="mono" data-until="${f.until}">${mmss(f.until-now())}</span> · ${esc(task(f.task)?.title||'')}` : esc(p.role||'онлайн')}</div></div></div>`; }).join('') || '<div style="color:var(--text-2);font-size:13.5px">Сейчас никого. Включи фокус — когда кто-то зайдёт, увидит, что ты работаешь.</div>'}
        ${focusOf(S.me) ? '' : `<button class="btn" data-action="focus-start" data-id="${esc(m.last||'')}">${ic('Headphones')} 25 минут фокуса</button>`}
      </section>
      <section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('Inbox')}</span>Входящие</h2><a class="btn sm ghost" href="#/inbox">Разобрать</a></div>
        <div style="color:var(--text-2);font-size:13.5px">${S.inbox.length ? `${plural(S.inbox.length,'мысль ждёт','мысли ждут','мыслей ждут')} разбора. Пара минут: в задачу или в корзину.` : 'Пусто. Мысль пришла — жми <kbd>Q</kbd>.'}</div>
      </section>
      <section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('ScrollText')}</span>Только что</h2><a class="btn sm ghost" href="#/log">Журнал</a></div>
        <div class="log">${S.log.slice(0,5).map(logEntry).join('') || '<div style="color:var(--text-2);font-size:13.5px">Пока тихо.</div>'}</div>
      </section>
    </div>
  </div>`;
}

/* ── задачи: доска ──────────────────────────── */
function filteredTasks(dept){
  const top = me().top3||[];
  return S.tasks.filter(t => (dept ? inDept(t,dept) : UI.filt.dept==='all' || inDept(t,UI.filt.dept)) && (!UI.filt.small || t.size==='S') && (!UI.filt.mine || t.who===S.me || top.includes(t.id)));
}
function card(t){
  const d = D[t.dept] || DEPTS[0]; const sub = t.sub||[], sd = sub.filter(s=>s.done).length;
  return `<div class="card" tabindex="0" draggable="true" data-id="${esc(t.id)}" data-open="task:${esc(t.id)}" style="--dc:${d.color}">
    <div class="tt">${esc(t.title)}</div>
    ${t.tldr?`<div class="tl">${esc(t.tldr)}</div>`:''}
    ${sub.length?`<div class="mini-bar"><i style="width:${Math.round(sd/sub.length*100)}%"></i></div>`:''}
    <div class="mt">${tDepts(t).map(x=>D[x]).map(x=>`<span class="dchip" style="--dc:${x.color}" title="${esc(x.name)}">${ic(x.icon)}</span>`).join('')}<span class="size">${esc(t.size||'M')}</span>${(me().top3||[]).includes(t.id)?`<span title="В «Моём дне»" style="color:var(--warn)">${ic('Sun')}</span>`:''}<span class="sp"></span>${(n => n?`<small style="color:var(--muted)">${ic('Paperclip')} ${n}</small>`:'')(S.files.filter(f=>f.task===t.id).length)}${(t.comments||[]).length?`<small style="color:var(--muted)">${ic('MessageSquare')} ${t.comments.length}</small>`:''}${av(t.who,22)}</div>
  </div>`;
}
function board(dept){
  const list = filteredTasks(dept).sort(byOrder);
  return `<div class="board">${COLS.map(([id,name,color]) => { const items = list.filter(t=>t.status===id);
    return `<div class="colm" data-col="${id}"><div class="colm-h"><span class="dot" style="background:${color}"></span>${name}<span class="n">${items.length}</span></div>${items.map(card).join('')}
    ${id==='inbox'||id==='todo' ? `<button class="btn sm ghost" data-action="new-task" data-status="${id}" data-dept="${dept||''}">${ic('Plus')} Задача</button>`:''}</div>`; }).join('')}</div>`;
}
function filters(withDept){
  const f = UI.filt;
  return `<div class="toolbar">
    ${withDept ? `<select class="select" data-action="filt-dept" aria-label="Отдел"><option value="all">${seesAll()?'Все отделы':'Все мои отделы'}</option>${DEPTS.filter(d=>canSee(d.id)).map(d=>`<option value="${d.id}" ${f.dept===d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select>`:''}
    <div class="seg"><button data-action="filt-small" aria-pressed="${f.small}">${ic('Zap')} Только ≤ 15 мин</button><button data-action="filt-mine" aria-pressed="${f.mine}">${ic('Sun')} Только мои</button></div>
    <small style="color:var(--muted)">Перетаскивайте карточки между колонками</small>
  </div>`;
}
/* задачи отдела видят только те, у кого этот отдел отмечен в профиле */
const askAdmin = () => isAdmin() ? `<a class="btn sm" href="#/people">${ic('Users')} Назначить отделы</a>`
  : `<small style="color:var(--muted)">Отделы назначает руководитель${adminNames() ? ': '+esc(adminNames()) : ''}.</small>`;
const noRoleHint = d => `<div class="empty"><b>${ic('Lock')} ${d ? 'Задачи отдела «'+esc(d.name)+'» видят только его участники' : 'У тебя пока нет ролей'}</b>${d ? 'Если ты работаешь в этом отделе, попроси руководителя добавить тебя в него — задачи появятся сразу.' : 'Руководитель назначает каждому отделы: разработчик видит задачи разработки, дизайнер — дизайна, у кого все отделы — видит всё.'}${askAdmin()}</div>`;
function viewTasks(){
  const mine = myDepts();
  if (UI.filt.dept!=='all' && !canSee(UI.filt.dept)) UI.filt.dept = 'all';
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#8DB6F8">${ic('LayoutGrid')}</span><div><h1>Задачи</h1><p>${!mine.length ? 'Задачи видны по ролям — выбери свои отделы.' : seesAll() ? 'У тебя все роли — видны задачи всех отделов.' : 'Видны задачи твоих отделов: '+esc(mine.map(id=>D[id].name).join(', '))+'.'}</p></div></div><button class="btn primary" data-action="new-task" data-status="todo">${ic('Plus')} Задача</button></div>
  ${mine.length ? filters(mine.length>1) + board(null) : noRoleHint(null)}`;
}

/* ── решения ────────────────────────────────── */
function decisionCard(d){
  const votes = d.votes||{}, mine = votes[S.me];
  return `<article class="decision">
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap"><h3>${esc(d.q)}</h3><div style="display:flex;gap:6px;align-items:center">${dchip(d.dept)}${d.chosen!=null?chip('Принято','ok'):chip('Голосуем','info')}<button class="mini-x" data-action="dec-del" data-id="${esc(d.id)}" title="Удалить решение" aria-label="Удалить решение" style="margin:0">${ic('Trash2')}</button></div></div>
    ${d.tldr?`<div class="tldr"><b>Суть</b>${esc(d.tldr)}</div>`:''}
    <div class="list">${(d.options||[]).map((o,i)=>`<div class="opt${d.chosen===i?' chosen':''}${mine===i?' mine':''}">
      <div><div class="l">${esc(o.t)} ${d.rec===i?'<span class="chip t-violet" style="margin-left:4px">рекомендуем</span>':''}</div>${o.d?`<div class="d">${esc(o.d)}</div>`:''}</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="votes">${Object.entries(votes).filter(([,v])=>v===i).map(([u])=>av(u,24)).join('')}</span>
      ${d.chosen==null ? `<button class="btn sm${mine===i?' primary':''}" data-action="vote" data-id="${esc(d.id)}" data-i="${i}">${mine===i?ic('Check')+' Мой голос':'Голосовать'}</button>
      <button class="btn sm ghost" data-action="accept" data-id="${esc(d.id)}" data-i="${i}" title="Зафиксировать итог">Принять</button>`:''}</div></div>`).join('')}</div>
    ${d.chosen!=null?`<div class="meta-line" style="font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center">Итог зафиксировал(а) ${esc(pname(d.chosenBy))} · ${ago(d.chosenAt)} <button class="btn sm ghost" data-action="reopen" data-id="${esc(d.id)}">${ic('RotateCcw')} Переоткрыть</button></div>`:''}
  </article>`;
}
function viewDecisions(dept){
  const list = S.decisions.filter(d=>!dept||d.dept===dept).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  const open = list.filter(d=>d.chosen==null), closed = list.filter(d=>d.chosen!=null);
  return `${dept?'':`<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#B9A3FF">${ic('Scale')}</span><div><h1>Решения</h1><p>Спорные вопросы: варианты, голоса, итог. Принятое не теряется в чатах.</p></div></div><button class="btn primary" data-action="new-decision">${ic('Plus')} Решение</button></div>`}
  ${open.length?`<h2 class="sub-h">Голосуем · ${open.length}</h2>${open.map(decisionCard).join('')}`:''}
  ${closed.length?`<h2 class="sub-h">Принято · ${closed.length}</h2>${closed.map(decisionCard).join('')}`:''}
  ${!list.length?`<div class="empty"><b>Решений пока нет</b>Спорный вопрос? Вынеси его на голосование.<button class="btn sm" data-action="new-decision" data-dept="${dept||''}">${ic('Plus')} Решение</button></div>`:''}`;
}

/* ── входящие ───────────────────────────────── */
function viewInbox(){
  const list = [...S.inbox].sort((a,b)=>b.at-a.at);
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#A9A8B6">${ic('Inbox')}</span><div><h1>Входящие</h1><p>Твои личные заметки: всё, что записано через <kbd>Q</kbd>. Видишь их только ты. Разбирай раз в день.</p></div></div><button class="btn primary" data-action="capture">${ic('Plus')} Записать мысль</button></div>
  <div class="list">${list.map(i=>`<div class="item" style="cursor:default">${ic('Lightbulb')}<div class="bd"><div class="tt">${esc(i.text)}</div><div class="mt"><small style="color:var(--muted)">${ago(i.at)}</small>${i.dept?dchip(i.dept):''}</div></div>
    <button class="btn sm" data-action="inbox-task" data-id="${esc(i.id)}">${ic('ArrowRight')} В задачу</button><button class="icon-btn" data-action="inbox-del" data-id="${esc(i.id)}" aria-label="Удалить" title="Удалить">${ic('Trash2')}</button></div>`).join('') || `<div class="empty"><b>Всё разобрано ${ic('Sparkles')}</b>Голова свободна. Новая мысль — <kbd>Q</kbd>.</div>`}</div>`;
}

/* ── журнал ─────────────────────────────────── */
function logEntry(l){ return `<div class="entry">${av(l.by,24)}<div><b>${esc(pname(l.by))}</b> ${esc(l.act)} ${l.title?`<q>${esc(l.title)}</q>`:''} ${l.dept?dchip(l.dept):''}</div><span class="when">${ago(l.at)}</span></div>`; }
function viewLog(){
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#A9A8B6">${ic('ScrollText')}</span><div><h1>Журнал</h1><p>Последние 300 изменений команды.</p></div></div></div>
  <section class="panel"><div class="log">${S.log.map(logEntry).join('') || '<div style="color:var(--text-2)">Пока пусто.</div>'}</div></section>`;
}

/* ── люди ───────────────────────────────────── */
function viewPeople(){
  const ids = Object.keys(S.people).sort((a,b)=>(isOnline(b)-isOnline(a)) || String(S.people[a].name).localeCompare(String(S.people[b].name)));
  const adm = isAdmin();
  const roles = (id, p) => adm
    ? `<div class="dpick roles" role="group" aria-label="Отделы: ${esc(p.name)}">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="set-dept" data-uid="${esc(id)}" data-d="${d.id}" aria-pressed="${(p.depts||[]).includes(d.id)}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm ghost" data-action="set-all-depts" data-uid="${esc(id)}" data-v="1">Все отделы</button><button class="btn sm ghost" data-action="set-all-depts" data-uid="${esc(id)}" data-v="0">Снять все</button>
      <button class="btn sm${p.admin===true?' primary':''}" data-action="set-admin" data-uid="${esc(id)}" title="Руководитель назначает отделы">${ic('Shield')} ${p.admin===true?'Руководитель':'Сделать руководителем'}</button></div>`
    : `<div class="links">${(p.depts||[]).map(dchip).join('') || '<small style="color:var(--muted)">Отделы не назначены</small>'}</div>`;
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#86D9B0">${ic('Users')}</span><div><h1>Люди</h1><p>${adm ? 'Ты руководитель: отмечай каждому его отделы — человек сразу увидит задачи этих отделов.' : 'Кто за что отвечает и кто сейчас онлайн. Отделы назначает руководитель'+(adminNames()?' ('+esc(adminNames())+')':'')+'.'}</p></div></div><button class="btn" data-action="settings">${ic('Pencil')} Мой профиль</button></div>
  <div class="g3">${ids.map(id => { const p = S.people[id]; const f = focusOf(id); const open = S.tasks.filter(t=>t.who===id && t.status!=='done').length;
    return `<section class="panel"><div class="person">${av(id,40)}<div class="bd"><div class="nm">${esc(p.name)}${id===S.me?' <small style="color:var(--muted)">(вы)</small>':''}${p.admin===true?` <span class="chip t-violet" title="Назначает отделы">${ic('Shield')} руководитель</span>`:''}</div><div class="st">${esc(p.role || '@'+(p.login||''))}</div></div></div>
    <div class="st" style="font-size:13px;color:${f?'var(--acc)':'var(--text-2)'}">${f?`${ic('Headphones')} В фокусе ещё <span class="mono" data-until="${f.until}">${mmss(f.until-now())}</span>`: isOnline(id)?`${ic('CircleDot')} Онлайн`:'Был(а) '+ago(p.seen)}</div>
    ${roles(id, p)}<small style="color:var(--muted)">Открытых задач: ${open}</small></section>`; }).join('')}</div>`;
}

/* ── вики ───────────────────────────────────── */
function viewWiki(){
  const list = [...S.wiki].sort(byOrder);
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#F5B98A">${ic('BookOpen')}</span><div><h1>Вики</h1><p>Как всё устроено. Суть сверху — подробности по клику. Текст статей понимает Markdown.</p></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn" title="Открыть файл .md с компьютера в читалке">${ic('BookOpen')} Открыть .md<input type="file" hidden accept=".md,.markdown,.mdown,.mkd,.txt,text/markdown,text/plain" data-action="md-local"></label><button class="btn primary" data-action="wiki-new">${ic('Plus')} Статья</button></div></div>
  <div class="g2">${list.map(w=>`<section class="panel"><div class="panel-h"><h2>${esc(w.title)}</h2><button class="icon-btn" data-open="wiki:${esc(w.id)}" aria-label="Открыть" title="Открыть и изменить">${ic('Pencil')}</button></div>${w.tldr?`<div class="tldr"><b>Суть</b>${esc(w.tldr)}</div>`:''}${w.body?`<details class="more"><summary>Подробнее</summary><div class="body md">${md(w.body)}</div></details>`:''}</section>`).join('') || '<div class="empty"><b>Статей пока нет</b></div>'}</div>`;
}

/* ── вложения ───────────────────────────────────
   Файл хранится в Firestore: метаданные в hub_files, содержимое — кусками base64 по ~700 КБ
   в hub_fileparts (документ Firestore не больше 1 МБ). Firebase Storage не нужен. */
const FILE_MAX = 8*1024*1024, PART = 700000, THUMB_MAX = 1.5*1024*1024;
const fsize = n => n<1024 ? n+' Б' : n<1048576 ? Math.round(n/1024)+' КБ' : (n/1048576).toFixed(1).replace('.',',')+' МБ';
const isImg = f => /^image\/(png|jpe?g|gif|webp)$/i.test(f.type||'');
const THUMBS = {};
function b64(buf){ const u = new Uint8Array(buf); let s = ''; for (let i=0;i<u.length;i+=0x8000) s += String.fromCharCode.apply(null, u.subarray(i,i+0x8000)); return btoa(s); }
async function fileBlob(f){
  const sn = await col('hub_fileparts').where('file','==',f.id).get();
  const data = sn.docs.map(d=>d.data()).sort((a,b)=>a.i-b.i).map(p=>p.data).join('');
  const bin = atob(data), u = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], {type:f.type||'application/octet-stream'});
}
async function uploadFiles(list, target){
  const key = target.task ? 'task:'+target.task : 'chat:'+target.chat, ids = [];
  for (const file of list) {
    if (file.size > FILE_MAX) { toast(ic('CircleAlert')+' «'+esc(file.name)+'» больше '+fsize(FILE_MAX)+' — положи его в облако и прикрепи ссылку'); continue; }
    S.up[key] = {name:file.name, pct:0}; schedule();
    try {
      const data = b64(await file.arrayBuffer()), ref = col('hub_files').doc(), parts = Math.max(1, Math.ceil(data.length/PART));
      for (let i=0;i<parts;i++) { await col('hub_fileparts').doc(ref.id+'_'+i).set({file:ref.id, i, data:data.slice(i*PART, (i+1)*PART)}); S.up[key].pct = Math.round((i+1)/parts*100); schedule(); }
      await ref.set(Object.assign({name:clip(file.name,160), type:clip(file.type,100), size:file.size, parts, by:S.me, at:now()}, target));
      ids.push(ref.id);
    } catch (e) { console.error(e); toast(ic('CircleAlert')+' «'+esc(file.name)+'» не загрузился: '+esc(errText(e))); }
  }
  delete S.up[key]; schedule();
  return ids;
}
async function downloadFile(id){
  const f = S.files.find(x=>x.id===id); if (!f) return;
  try {
    const url = URL.createObjectURL(await fileBlob(f));
    const a = document.createElement('a'); a.href = url; a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 60e3);
  } catch (e) { console.error(e); toast(ic('CircleAlert')+' Не скачалось: '+esc(errText(e))); }
}
async function deleteFiles(ids){
  for (const id of ids) {
    const sn = await col('hub_fileparts').where('file','==',id).get();
    const b = DB.batch(); sn.docs.forEach(d=>b.delete(d.ref)); b.delete(col('hub_files').doc(id)); await b.commit();
  }
}
function thumb(f){
  if (THUMBS[f.id]) return THUMBS[f.id]==='…' ? '' : THUMBS[f.id];
  THUMBS[f.id] = '…';
  fileBlob(f).then(b => { THUMBS[f.id] = URL.createObjectURL(b); schedule(); }).catch(() => { THUMBS[f.id] = ''; });
  return '';
}
function fileChip(f, big){
  if (!f) return '';
  const del = f.by===S.me ? `<button class="mini-x" data-action="file-del" data-id="${esc(f.id)}" aria-label="Удалить файл" title="Удалить файл">${ic('X')}</button>` : '';
  const src = big && isImg(f) && f.size <= THUMB_MAX ? thumb(f) : '';
  if (src) return `<span class="fimg"><img src="${src}" alt="${esc(f.name)}" data-action="file-get" data-id="${esc(f.id)}" title="${esc(f.name)} · скачать">${del}</span>`;
  if (isMd(f)) return `<span class="file"><button class="file-b" data-action="file-md" data-id="${esc(f.id)}" title="Открыть в читалке">${ic('BookOpen')}<span class="nm">${esc(f.name)}</span><small>${fsize(f.size)}</small></button><button class="mini-x" data-action="file-get" data-id="${esc(f.id)}" aria-label="Скачать" title="Скачать">${ic('Download')}</button>${del}</span>`;
  return `<span class="file"><button class="file-b" data-action="file-get" data-id="${esc(f.id)}" title="Скачать">${ic(isImg(f)?'Eye':'Paperclip')}<span class="nm">${esc(f.name)}</span><small>${fsize(f.size)}</small></button>${del}</span>`;
}
/* ── markdown ───────────────────────────────────
   Свой небольшой рендер: сначала экранируем весь текст, потом размечаем.
   HTML и скрипты из файла не выполняются, ссылки — только http(s). */
const MD_LIST = /^(\s*)([-*+•]|\d+[.)])\s+(.*)$/;
function mdInline(s){
  const code = [];
  s = String(s).replace(/`+([^`]+?)`+/g, (_,c) => { code.push(c); return '\u0000'+(code.length-1)+'\u0000'; });
  s = esc(s);
  const url = u => safeUrl(u.replace(/&amp;/g,'&'));
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;.*?&quot;)?\)/g, (m,a,u) => url(u) ? '<img src="'+esc(url(u))+'" alt="'+a+'" loading="lazy">' : a);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;.*?&quot;)?\)/g, (m,t,u) => url(u) ? '<a href="'+esc(url(u))+'" target="_blank" rel="noopener noreferrer">'+t+'</a>' : t);
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,:;!?)])/g, (m,p,u) => p+'<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+'</a>');
  s = s.replace(/\*\*(.+?)\*\*|__(.+?)__/g, (m,a,b) => '<b>'+(a||b)+'</b>');
  s = s.replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<i>$2</i>').replace(/(^|[^_\wа-яё])_(?!\s)(.+?)_(?![\wа-яё])/gi, '$1<i>$2</i>');
  s = s.replace(/~~(.+?)~~/g, '<s>$1</s>');
  return s.replace(/\u0000(\d+)\u0000/g, (_,i) => '<code>'+esc(code[i])+'</code>');
}
function mdList(L, i){
  const ind = L[i].match(/^\s*/)[0].length, ord = /^\s*\d/.test(L[i]), items = [];
  while (i < L.length) {
    const l = L[i], m = l.match(MD_LIST);
    if (!l.trim()) { const n = L[i+1]; if (n && MD_LIST.test(n) && n.match(/^\s*/)[0].length >= ind) { i++; continue; } break; }
    if (m && m[1].length === ind) { if (/\d/.test(m[2]) !== ord) break; items.push({t:m[3], sub:''}); i++; continue; }
    if (m && m[1].length > ind && items.length) { const r = mdList(L, i); items[items.length-1].sub += r.html; i = r.i; continue; }
    if (!m && /^\s/.test(l) && items.length) { items[items.length-1].t += '\n'+l.trim(); i++; continue; }
    break;
  }
  const tag = ord ? 'ol' : 'ul';
  return {i, html:'<'+tag+'>'+items.map(it => { const c = it.t.match(/^\[([ xX])\]\s+([\s\S]*)$/);
    return '<li'+(c?' class="task"':'')+'>'+(c?'<input type="checkbox" disabled'+(c[1]!==' '?' checked':'')+'> ':'')+(c?c[2]:it.t).split('\n').map(mdInline).join('<br>')+it.sub+'</li>'; }).join('')+'</'+tag+'>'};
}
function md(src, compact){
  let L = String(src||'').replace(/\r\n?/g,'\n').split('\n'), i = 0, out = '';
  if (L[0].trim()==='---') { const e = L.indexOf('---', 1); if (e > 0 && e < 40) L = L.slice(e+1); } // YAML-шапка
  const isRow = l => !!l && l.includes('|') && !!l.trim();
  const isSep = l => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l||'');
  const starts = l => /^(#{1,6}\s|\s*(```|~~~)|\s*>|\s*(-{3,}|\*{3,}|_{3,})\s*$)/.test(l) || MD_LIST.test(l);
  while (i < L.length) {
    const l = L[i]; let m;
    if (!l.trim()) { i++; continue; }
    if ((m = l.match(/^\s*(```|~~~)\s*([\w+#.-]*)/))) { const buf = []; i++; while (i < L.length && !L[i].trim().startsWith(m[1])) buf.push(L[i++]); i++;
      out += '<pre'+(m[2]?' data-lang="'+esc(m[2])+'"':'')+'><code>'+esc(buf.join('\n'))+'</code></pre>'; continue; }
    if ((m = l.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/))) { const h = compact ? (m[1].length<=2 ? 3 : 4) : m[1].length; out += '<h'+h+'>'+mdInline(m[2])+'</h'+h+'>'; i++; continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) { out += '<hr>'; i++; continue; }
    if (/^\s*>/.test(l)) { const buf = []; while (i < L.length && /^\s*>/.test(L[i])) buf.push(L[i++].replace(/^\s*>\s?/,'')); out += '<blockquote>'+md(buf.join('\n'), compact)+'</blockquote>'; continue; }
    if (isRow(l) && isSep(L[i+1])) {
      const cells = r => r.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(c=>c.trim());
      const al = cells(L[i+1]).map(c => c.startsWith(':')&&c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : '');
      const td = (t,c,j) => '<'+t+(al[j]?' style="text-align:'+al[j]+'"':'')+'>'+mdInline(c)+'</'+t+'>';
      const head = cells(l), rows = []; i += 2; while (i < L.length && isRow(L[i])) rows.push(cells(L[i++]));
      out += '<div class="md-table"><table><thead><tr>'+head.map((c,j)=>td('th',c,j)).join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+head.map((_,j)=>td('td',r[j]||'',j)).join('')+'</tr>').join('')+'</tbody></table></div>'; continue;
    }
    if (MD_LIST.test(l)) { const r = mdList(L, i); out += r.html; i = r.i; continue; }
    const buf = [l]; i++; while (i < L.length && L[i].trim() && !starts(L[i]) && !(isRow(L[i]) && isSep(L[i+1]))) buf.push(L[i++]);
    out += '<p>'+buf.map(x=>mdInline(x.trim())).join('<br>')+'</p>';
  }
  return out;
}
/* читалка: вложения .md и файлы с компьютера */
const MD_MAX = 2*1024*1024;
const isMd = f => /\.(md|markdown|mdown|mkd)$/i.test(f.name||'') || /markdown/i.test(f.type||'');
let MDR = null;
function mdReader(){
  const r = MDR; if (!r) return;
  const n = (r.text.match(/\S+/g)||[]).length;
  overlay('<div class="pal mdr" role="dialog" aria-label="'+esc(r.name)+'"><div class="mdr-h"><span class="ph-ico">'+ic('BookOpen')+'</span><div class="bd"><b>'+esc(r.name)+'</b><small>'+plural(n,'слово','слова','слов')+' · ~'+Math.max(1, Math.round(n/180))+' мин чтения</small></div>'
    +'<div class="seg" role="group" aria-label="Вид"><button type="button" data-action="md-mode" data-v="" aria-pressed="'+!r.raw+'">Текст</button><button type="button" data-action="md-mode" data-v="1" aria-pressed="'+!!r.raw+'">Исходник</button></div>'
    +'<button class="icon-btn" data-action="md-wiki" title="Сделать статьёй в вики" aria-label="Сделать статьёй в вики">'+ic('Plus')+'</button>'
    +(r.file?'<button class="icon-btn" data-action="file-dl" data-id="'+esc(r.file)+'" title="Скачать" aria-label="Скачать">'+ic('Download')+'</button>':'')
    +'<button class="icon-btn" data-action="close-overlay" aria-label="Закрыть">'+ic('X')+'</button></div>'
    +'<div class="mdr-b">'+(r.raw ? '<pre class="md-src">'+esc(r.text)+'</pre>' : '<article class="md">'+(md(r.text)||'<p style="color:var(--muted)">Файл пустой.</p>')+'</article>')+'</div></div>');
}
function openMd(name, text, file){ MDR = {name, text, file:file||null, raw:false}; mdReader(); }
async function openMdFile(id){
  const f = S.files.find(x=>x.id===id); if (!f) return;
  if (f.size > MD_MAX) { toast(ic('CircleAlert')+' Файл больше '+fsize(MD_MAX)+' — скачиваю'); downloadFile(id); return; }
  try { openMd(f.name, await (await fileBlob(f)).text(), id); } catch (e) { console.error(e); toast(ic('CircleAlert')+' Не открылось: '+esc(errText(e))); }
}
const mdTitle = (text, name) => { const m = String(text).match(/^#{1,2}\s+(.+?)\s*#*\s*$/m); return clip(m ? m[1].replace(/[*_`]/g,'') : name.replace(/\.[^.]+$/,''), 120); };
const upBar = key => S.up[key] ? `<div class="upbar"><span class="spin"></span> Загружаем «${esc(clip(S.up[key].name,40))}» · ${S.up[key].pct}%</div>` : '';
const attachBtn = (action, id, label) => `<label class="btn sm" title="До ${fsize(FILE_MAX)} на файл">${ic('Paperclip')}${label?' '+label:''}<input type="file" multiple hidden data-action="${action}" data-id="${esc(id)}"></label>`;

/* ── чаты ───────────────────────────────────────
   Общие для всей команды. Чат задачи создаётся кнопкой в карточке задачи и доступен всем. */
const chat = id => S.chats.find(c=>c.id===id);
const READ_AT = {};
const chatUnread = c => !!c.lastAt && c.lastBy!==S.me && c.lastAt > Math.max((me().reads||{})[c.id]||0, READ_AT[c.id]||0);
function markRead(id){
  const c = chat(id); if (!c || !chatUnread(c) || document.hidden) return;
  READ_AT[id] = c.lastAt; col('hub_people').doc(S.me).update({['reads.'+id]:c.lastAt}).catch(()=>{});
}
const unreadChats = () => S.chats.filter(chatUnread).length;
function chatItem(c){
  const t = c.task && S.allTasks.find(x=>x.id===c.task), d = D[t ? t.dept : c.dept] || null;
  return `<a class="chat-i${UI.chat===c.id?' on':''}" href="#/chats/${esc(c.id)}" style="--dc:${d?d.color:'var(--acc)'}">
    <span class="ph-ico">${ic(c.task ? (d?d.icon:'LayoutGrid') : 'MessagesSquare')}</span>
    <span class="bd"><b>${esc(c.title)}</b><small>${c.lastText ? esc(pname(c.lastBy).split(' ')[0])+': '+esc(clip(c.lastText,60)) : 'Пока без сообщений'}</small></span>
    <span class="r"><small>${c.lastAt?ago(c.lastAt).replace(' назад',''):''}</small>${chatUnread(c)?'<i class="udot" aria-label="Есть новые"></i>':''}</span></a>`;
}
function msgHtml(m, prev){
  const same = prev && prev.by===m.by && m.at-prev.at < 5*60e3;
  const files = (m.files||[]).map(id=>fileChip(S.files.find(f=>f.id===id), true)).join('');
  return `<div class="msg${m.by===S.me?' me':''}${same?' cont':''}">${same?'<span class="av-sp"></span>':av(m.by,30)}<div class="bd">
    ${same?'':`<div class="mh"><b>${esc(pname(m.by))}</b><small>${dtf.format(m.at)}</small></div>`}
    ${m.text?`<div class="tx">${esc(m.text)}</div>`:''}${files?`<div class="mf">${files}</div>`:''}</div>
    ${m.by===S.me?`<button class="mini-x" data-action="msg-del" data-id="${esc(m.id)}" aria-label="Удалить сообщение" title="Удалить">${ic('Trash2')}</button>`:''}</div>`;
}
function viewChats(){
  const list = [...S.chats].sort((a,b)=>(b.lastAt||b.createdAt||0)-(a.lastAt||a.createdAt||0));
  const c = UI.chat && chat(UI.chat);
  listenChat(c ? c.id : null);
  if (c) markRead(c.id);
  const t = c && c.task && S.allTasks.find(x=>x.id===c.task);
  let main = `<div class="empty" style="margin:auto"><b>${ic('MessagesSquare')} Выбери чат слева</b>Или создай новый — его увидит вся команда. Чат задачи создаётся кнопкой в карточке задачи.</div>`;
  if (UI.chat && !c && S.loaded.has('hub_chats')) main = `<div class="empty" style="margin:auto"><b>Чат не найден</b>Возможно, его удалили.<a class="btn sm" href="#/chats">К списку</a></div>`;
  if (c) {
    const msgs = S.msgs;
    main = `<div class="chat-h"><a class="icon-btn chat-back" href="#/chats" aria-label="К списку чатов">${ic('ArrowRight')}</a><div class="bd"><b>${esc(c.title)}</b>
      <small>${t ? (seeTask(t) ? `<span class="lnk" data-open="task:${esc(t.id)}">${ic('LayoutGrid')} Открыть задачу</span> · `:'')+dchips(t) : c.task ? (c.dept && !canSee(c.dept) ? 'Задача отдела '+dchip(c.dept) : 'Задача удалена') : 'Создал(а) '+esc(pname(c.by))}</small></div>
      ${c.by===S.me?`<button class="icon-btn" data-action="chat-del" data-id="${esc(c.id)}" title="Удалить чат" aria-label="Удалить чат">${ic('Trash2')}</button>`:''}</div>
      <div class="msgs" id="msgs">${!S.loaded.has('hub_msgs') ? '<div class="loading"><span class="spin"></span>Загружаем сообщения…</div>' : msgs.map((m,i)=>msgHtml(m, msgs[i-1])).join('') || '<div class="empty" style="margin:auto">Здесь пока тихо. Напиши первым.</div>'}</div>
      ${upBar('chat:'+c.id)}
      <form class="composer" data-form="msg" data-id="${esc(c.id)}">${attachBtn('chat-attach', c.id)}
        <textarea class="input" id="chat-in" name="m" rows="1" maxlength="4000" placeholder="Сообщение… Enter — отправить, Shift+Enter — новая строка. Картинку можно вставить из буфера.">${esc(UI.chatDraft[c.id]||'')}</textarea>
        <button class="btn primary" aria-label="Отправить">${ic('Send')}</button></form>`;
  }
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#7DD3E8">${ic('MessagesSquare')}</span><div><h1>Чаты</h1><p>Общие для всей команды. У каждой задачи может быть свой чат.</p></div></div><button class="btn primary" data-action="chat-new">${ic('Plus')} Чат</button></div>
  <div class="chats${c?' open':''}"><aside class="chat-list">${list.map(chatItem).join('') || '<div class="empty">Чатов пока нет.</div>'}</aside><section class="chat-main">${main}</section></div>`;
}
async function openTaskChat(id){
  const t = task(id); if (!t) return;
  const ex = S.chats.find(c=>c.task===id); if (ex) { go('chats/'+ex.id); return; }
  const ref = col('hub_chats').doc();
  const ok = await write(()=>ref.set({title:clip(t.title,120), task:id, dept:t.dept, by:S.me, createdAt:now(), lastAt:null, lastBy:null, lastText:''}));
  if (ok) { log('создал(а) чат задачи', t.title, t.dept); go('chats/'+ref.id); }
}
async function sendMsg(chatId, text, files){
  text = clip(text,4000); files = files||[];
  if (!text && !files.length) return false;
  const c = chat(chatId); if (!c) return false;
  const ok = await write(async () => {
    const b = DB.batch();
    b.set(col('hub_msgs').doc(), {chat:chatId, by:S.me, text, files, at:now()});
    b.update(col('hub_chats').doc(chatId), {lastAt:now(), lastBy:S.me, lastText:text || ('📎 '+plural(files.length,'файл','файла','файлов'))});
    await b.commit();
  });
  if (ok) READ_AT[chatId] = now();
  return ok;
}

/* ── Claude: бронирование и фокус-режим ─────────
   Один общий Claude на команду. Бронь — отрезок времени [start, end) в hub_claude,
   пересечения не допускаются. Фокус-режим — полноэкранный таймер своей текущей брони. */
const SLOT = 30*60e3, CLAUDE_MAX = 4*3600e3;
const hhmm = t => dtf.format(t);
const dayAt = off => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+off); return d.getTime(); };
const nextDay = t => { const d = new Date(t); d.setDate(d.getDate()+1); return d.getTime(); };
const bookings = () => S.claude.filter(b=>b.end>b.start).sort((a,b)=>a.start-b.start);
const claudeAt = t => bookings().find(b=>b.start<=t && b.end>t);
const claudeFree = (s, e, except) => !bookings().some(b=>b.id!==except && b.start<e && b.end>s);
const myClaude = () => { const b = claudeAt(now()); return b && b.by===S.me ? b : null; };
const nowMin = () => now();
const floorSlot = t => { const d = new Date(t); d.setMinutes(d.getMinutes()<30?0:30, 0, 0); return d.getTime(); };
async function bookClaude(start, end, note){
  start = Math.max(start, nowMin());
  if (end <= start) { toast('Это время уже прошло'); return false; }
  if (end-start > CLAUDE_MAX) { toast('Одна бронь — не больше 4 часов. Дай поработать и другим 🙂'); return false; }
  if (!claudeFree(start, end)) { toast(ic('CircleAlert')+' Это время уже занято — выбери другое'); return false; }
  const ok = await write(()=>col('hub_claude').add({by:S.me, start, end, note:clip(note,140), createdAt:now()}));
  if (ok) { log('забронировал(а) Claude', dayf.format(start)+', '+hhmm(start)+'–'+hhmm(end)); gain(2, ic('Bot')+' Claude забронирован: '+hhmm(start)+'–'+hhmm(end)); }
  return ok;
}
function claudeFocus(){
  const b = myClaude(); if (!b) return;
  if (!focusOf(S.me) || !(me().focus||{}).claude || me().focus.until!==b.end) patchMe({focus:{task:null, claude:true, until:b.end}});
  overlay(`<div class="cfocus" role="dialog" aria-label="Фокус-режим Claude"><div class="cf-in">
    <span class="cf-badge">${ic('Bot')} Фокус-режим Claude</span>
    <div class="cf-time mono" data-until="${b.end}">${mmss(b.end-now())}</div>
    <p class="cf-note">${esc(b.note || 'Без цели — просто работаю с Claude')}</p>
    <small>Бронь ${hhmm(b.start)}–${hhmm(b.end)}. Команда видит, что Claude занят, а ты в фокусе.</small>
    <div class="cf-act"><button class="btn" data-action="claude-extend" data-id="${esc(b.id)}">${ic('Plus')} Ещё 30 мин</button><button class="btn" data-action="close-overlay">Свернуть</button><button class="btn danger" data-action="claude-end" data-id="${esc(b.id)}">${ic('Check')} Закончить и освободить</button></div>
  </div></div>`);
}
function claudeBookForm(){
  const days = Array.from({length:7},(_,i)=>[i, i===0?'Сегодня':i===1?'Завтра':dayf.format(dayAt(i))]);
  overlay(`<form class="pal" data-form="claude-book"><div class="cap"><h2>${ic('Calendar')} Забронировать Claude</h2>
    <div class="fld-row">${inSelect('day','День',days,UI.cday)}${inSelect('from','С',claudeTimes(UI.cday),'')}</div>
    ${inSelect('dur','Сколько',[[SLOT,'30 минут'],[2*SLOT,'1 час'],[3*SLOT,'1,5 часа'],[4*SLOT,'2 часа'],[6*SLOT,'3 часа'],[8*SLOT,'4 часа']],2*SLOT)}
    ${inText('note','Зачем — коротко, чтобы другие понимали','','maxlength="140" placeholder="Например: рефакторинг Economy.cs"')}
    <div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn ghost" data-action="close-overlay">Отмена</button><button class="btn primary">${ic('Check')} Забронировать</button></div></div></form>`);
}
function claudeTimes(off){
  const out = [], d0 = dayAt(off), d1 = nextDay(d0), from = Math.max(d0, floorSlot(now()));
  for (let t=from; t<d1; t+=SLOT) out.push([t, hhmm(t)+(claudeAt(t)?' — занято':'')]);
  return out.length ? out : [['', 'на сегодня всё прошло']];
}
function claudeDay(off){
  const d0 = dayAt(off), d1 = nextDay(d0), t = now();
  const list = bookings().filter(b=>b.end>d0 && b.start<d1);
  const seg = b => { const s = Math.max(b.start,d0), e = Math.min(b.end,d1); const p = S.people[b.by];
    return `<i class="cseg" style="left:${(s-d0)/(d1-d0)*100}%;width:${(e-s)/(d1-d0)*100}%;background:${safeColor(p&&p.color)}" title="${esc(pname(b.by))} · ${hhmm(b.start)}–${hhmm(b.end)}${b.note?' · '+esc(b.note):''}"></i>`; };
  const bar = `<div class="cbar">${list.map(seg).join('')}${t>=d0&&t<d1?`<b class="cnow" style="left:${(t-d0)/(d1-d0)*100}%" title="Сейчас"></b>`:''}</div>
    <div class="cbar-l">${[0,3,6,9,12,15,18,21,24].map(h=>`<span style="left:${h/24*100}%">${String(h).padStart(2,'0')}</span>`).join('')}</div>`;
  const rows = [];
  for (let s=d0; s<d1; s=s+3600e3) {
    const e = s+3600e3, past = e<=t, cur = s<=t && t<e;
    if (past && off===0 && !UI.cpast) continue;
    const here = list.filter(b=>b.start<e && b.end>s);
    const who = here.map(b=>`<span class="who-pick">${av(b.by,22)} <span>${esc(pname(b.by))}</span> <small class="mono" style="color:var(--muted)">${hhmm(b.start)}–${hhmm(b.end)}</small></span>`).join('<br>');
    const note = here.map(b=>esc(b.note||'—')).join('<br>');
    const mine = here.filter(b=>b.by===S.me && b.end>t);
    const act = past ? '' : mine.length ? mine.map(b=>`<button class="btn sm ghost" data-action="claude-cancel" data-id="${esc(b.id)}">${ic('X')} ${b.start<=t?'Освободить':'Отменить'}</button>`).join('')
      : claudeFree(Math.max(s, nowMin()), e) ? `<button class="btn sm" data-action="claude-slot" data-s="${s}">${ic('Plus')} Занять</button>` : '';
    rows.push(`<tr class="${past?'past':''}${cur?' cur':''}${here.length?' busy':''}"><td class="m">${hhmm(s)}–${hhmm(e)}</td><td>${who || (past?'':'<span style="color:var(--ok)">свободно</span>')}</td><td>${note}</td><td style="text-align:right">${act}</td></tr>`);
  }
  return {bar, rows:rows.join(''), count:list.length};
}
function claudeStats(){
  const from = dayAt(-6), to = nextDay(dayAt(0)), hours = {};
  for (const b of bookings()) { const s = Math.max(b.start, from), e = Math.min(b.end, Math.min(to, now())); if (e>s) hours[b.by] = (hours[b.by]||0) + (e-s)/3600e3; }
  const rows = Object.entries(hours).sort((a,b)=>b[1]-a[1]), max = Math.max(1, ...rows.map(r=>r[1]));
  return rows.map(([id,h])=>`<div class="cstat">${av(id,24)}<span class="nm">${esc(pname(id))}</span><span class="bar"><i style="width:${h/max*100}%;background:${safeColor(S.people[id]&&S.people[id].color)}"></i></span><b class="mono">${h.toFixed(1).replace('.',',')} ч</b></div>`).join('') || '<small style="color:var(--muted)">За неделю Claude ещё никто не использовал.</small>';
}
function viewClaude(){
  const t = now(), cur = claudeAt(t), mine = myClaude();
  const next = bookings().find(b=>b.start>t);
  const day = claudeDay(UI.cday);
  const days = Array.from({length:7},(_,i)=>`<button data-action="claude-day" data-v="${i}" aria-pressed="${UI.cday===i}">${i===0?'Сегодня':i===1?'Завтра':dayf.format(dayAt(i))}</button>`).join('');
  const freeNow = n => claudeFree(nowMin(), nowMin()+n*SLOT);
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#E8B07D">${ic('Bot')}</span><div><h1>Claude</h1><p>Общий Claude на команду. Бронируй время, чтобы не мешать друг другу.</p></div></div>${mine?`<button class="btn primary" data-action="claude-focus">${ic('Headphones')} Фокус-режим</button>`:''}</div>
  <section class="panel cstatus ${cur?'busy':'free'}">
    <div class="person">${cur?av(cur.by,40):`<span class="ph-ico" style="--dc:var(--ok)">${ic('CircleCheck')}</span>`}<div class="bd">
      <div class="nm">${cur ? (mine ? 'Claude у тебя' : 'Claude занят: '+esc(pname(cur.by))) : 'Claude свободен'}</div>
      <div class="st">${cur ? `до ${hhmm(cur.end)} · осталось <span class="mono" data-until="${cur.end}">${mmss(cur.end-t)}</span>${cur.note?' · '+esc(cur.note):''}` : next ? `Следующая бронь: ${esc(pname(next.by))}, ${next.start-dayAt(0)<86400e3?'сегодня':dayf.format(next.start)} в ${hhmm(next.start)}` : 'Броней впереди нет'}</div></div></div>
  </section>
  <section class="panel">
    <div class="panel-h"><h2><span class="hi">${ic('Calendar')}</span>График использования</h2><span class="sub">${plural(day.count,'бронь','брони','броней')}</span></div>
    <div class="seg cdays">${days}</div>
    ${day.bar}
    ${UI.cday===0 ? `<button class="btn sm ghost" style="align-self:flex-start" data-action="claude-past">${ic("Clock")} ${UI.cpast?"Скрыть прошедшие часы":"Показать прошедшие часы"}</button>`:""}<div class="tbl-wrap"><table class="grid ctable"><thead><tr><th>Время</th><th>Кто забронировал</th><th>Зачем</th><th></th></tr></thead><tbody>${day.rows}</tbody></table></div>
    <div class="cbook">
      <button class="btn primary" data-action="claude-book">${ic('Calendar')} Забронировать время…</button>
      ${cur ? '' : `<span class="sub">Сейчас:</span>${[[1,'30 мин'],[2,'1 час'],[4,'2 часа']].map(([n,l])=>`<button class="btn" data-action="claude-now" data-n="${n}" ${freeNow(n)?'':'disabled'}>${ic('Zap')} ${l}</button>`).join('')}`}
      ${mine ? `<button class="btn" data-action="claude-focus">${ic('Headphones')} Фокус-режим</button>` : cur ? '' : `<button class="btn" data-action="claude-now" data-n="2" data-focus="1" ${freeNow(2)?'':'disabled'}>${ic('Headphones')} Фокус-режим на 1 час</button>`}
    </div>
  </section>
  <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('ChartColumn')}</span>Кто сколько работал с Claude</h2><span class="sub">последние 7 дней</span></div>${claudeStats()}</section>`;
}

/* ── отдел ──────────────────────────────────── */
function spark(data, color){
  if (data.length < 2) return '';
  const w = 200, h = 36, mn = Math.min(...data), mx = Math.max(...data), r = mx-mn || 1;
  const pts = data.map((v,i)=>`${(i/(data.length-1)*w).toFixed(1)},${(h-3-(v-mn)/r*(h-6)).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
const series = s => String(s||'').split(/[;,\s]+/).map(x=>Number(x.replace(',','.'))).filter(x=>isFinite(x));
function cell(f, v){
  if (f.t==='select') return v ? chip(v, toneOf(f,v)) : '<span style="color:var(--muted)">—</span>';
  if (f.t==='person') return v ? `<span class="who-pick">${av(v,22)} ${esc(pname(v))}</span>` : '<span style="color:var(--muted)">—</span>';
  if (f.t==='url') return safeUrl(v) ? `<a class="ext" href="${esc(v)}" target="_blank" rel="noopener">${ic('ExternalLink')} открыть</a>` : '';
  return esc(v||'');
}
function registry(key, d){
  if (key==='design/kit') return kit();
  const r = REGS[key]; if (!r) return '<div class="empty">Скоро.</div>';
  const items = S.reg.filter(x=>x.key===key).sort(byOrder);
  const tools = `<div class="reg-tools"><small>${plural(items.length,'запись','записи','записей')}</small><span class="sp"></span><button class="btn sm primary" data-open="regnew:${key}">${ic('Plus')} Добавить ${esc(r.noun)}</button></div>`;
  if (!items.length) return tools + `<div class="empty"><b>Пока пусто</b>Добавь первую запись — её увидит вся команда.</div>`;
  if (r.type==='table') { const fs = tableFields(r);
    return tools + `<div class="tbl-wrap"><table class="grid"><thead><tr>${fs.map(f=>`<th>${esc(f.l)}</th>`).join('')}</tr></thead><tbody>${items.map(it=>`<tr tabindex="0" data-open="reg:${esc(it.id)}">${fs.map((f,j)=>`<td class="${j===0?'b':f.mono?'m':''}">${cell(f, it[f.k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
  const stF = r.fields.find(f=>f.k==='status');
  const st = it => stF && it.status ? chip(it.status, toneOf(stF, it.status)) : '';
  if (r.type==='cards') return tools + `<div class="tiles">${items.map(it=>`<button class="tile" data-open="reg:${esc(it.id)}"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h3>${esc(it.name)}</h3>${st(it)}</div>${it.tldr?`<div class="s">${esc(it.tldr)}</div>`:''}</button>`).join('')}</div>`;
  if (r.type==='mockups') return tools + `<div class="tiles">${items.map(it=>`<button class="tile" data-open="reg:${esc(it.id)}" style="--dc:${d.color}"><div class="thumb"><div class="ui"></div></div><div style="display:flex;justify-content:space-between;gap:8px"><h3>${esc(it.name)}</h3>${st(it)}</div>${it.tldr?`<div class="s">${esc(it.tldr)}</div>`:''}<div style="display:flex;gap:8px;align-items:center">${it.who?av(it.who,22)+`<small style="color:var(--text-2)">${esc(pname(it.who))}</small>`:''}${safeUrl(it.link)?`<small style="color:var(--acc);margin-left:auto">${ic('ExternalLink')} есть ссылка</small>`:''}</div></button>`).join('')}</div>`;
  if (r.type==='metrics') return tools + `<div class="tiles">${items.map(it=>`<button class="tile" data-open="reg:${esc(it.id)}"><span class="k">${esc(it.name)}</span><span class="v">${esc(it.value||'—')}</span>${spark(series(it.series), d.color)}<span class="s">${esc(it.note||'')}</span></button>`).join('')}</div>`;
  if (r.type==='timeline') return tools + `<section class="panel"><div class="timeline" style="--dc:${d.color}">${items.slice().reverse().map(it=>`<div class="tl-i${it.status==='Готовится'?' cur':''}" data-open="reg:${esc(it.id)}" style="cursor:pointer"><h3>${esc(it.name)} ${st(it)}</h3>${it.tldr?`<p>${esc(it.tldr)}</p>`:''}</div>`).join('')}</div></section>`;
  if (r.type==='checklist') { const n = items.filter(i=>i.done).length;
    return tools + `<section class="panel"><div class="panel-h"><h2>Готово ${n} из ${items.length}</h2>${n===items.length?chip('Всё готово','ok'):`<button class="btn sm ghost" data-action="check-reset" data-key="${key}">${ic('RotateCcw')} Сбросить</button>`}</div><div class="mini-bar"><i style="width:${Math.round(n/items.length*100)}%"></i></div>
    <div class="cl">${items.map(it=>`<div class="row"><label class="${it.done?'done':''}"><input type="checkbox" data-action="check" data-id="${esc(it.id)}" ${it.done?'checked':''}><span>${esc(it.name)}</span></label><button class="mini-x" data-open="reg:${esc(it.id)}" aria-label="Изменить пункт" title="Изменить">${ic('Pencil')}</button></div>`).join('')}</div></section>`; }
  return '';
}
function kit(){
  const sw = [['Акцент','#A98BFA'],['Светлый акцент','#C7B5FF'],['Глубокий акцент','#7C5CE6'],['Фон','#141417'],['Карточка','#1F1F24'],['Успех','#7DD3A8'],['Внимание','#F5B971'],['Ошибка','#F97066']];
  return `<section class="panel"><div class="panel-h"><h2>Цвета хаба</h2><span class="sub">для примера — замените на палитру игрового UI</span></div><div class="swatches">${sw.map(s=>`<div class="sw"><div style="background:${s[1]}"></div><p>${s[0]}<span>${s[1]}</span></p></div>`).join('')}</div></section>
  <section class="panel"><div class="panel-h"><h2>Шрифты</h2></div><div style="font:800 24px var(--f-display);letter-spacing:-.02em">Manrope 800 — заголовки</div><div style="font:500 16px var(--f-body)">Manrope 500 — основной текст</div><div style="font:600 14px var(--f-mono)">JetBrains Mono — 3 000 000 $</div></section>`;
}
function deptOverview(d){
  const tasks = S.tasks.filter(t=>inDept(t,d.id));
  const open = tasks.filter(t=>t.status!=='done');
  const decs = S.decisions.filter(x=>x.dept===d.id && x.chosen==null);
  const people = Object.keys(S.people).filter(id=>(S.people[id].depts||[]).includes(d.id));
  const doing = open.filter(t=>t.status==='doing'||t.status==='review');
  const next = open.filter(t=>t.status==='todo'||t.status==='inbox').slice(0,4);
  return `
  ${d.id==='econ' ? econOverview(d) : ''}
  <div class="tiles">
    <div class="tile" style="cursor:default"><span class="k">Открыто задач</span><span class="v">${open.length}</span><span class="s">${doing.length} в работе</span></div>
    <div class="tile" style="cursor:default"><span class="k">Закрыто</span><span class="v">${tasks.length-open.length}</span><span class="s">всего в отделе</span></div>
    <div class="tile" style="cursor:default"><span class="k">Решения</span><span class="v">${decs.length}</span><span class="s">ждут итога</span></div>
    <div class="tile" style="cursor:default"><span class="k">Люди</span><span class="v">${people.length}</span><span class="s">${people.filter(isOnline).length} онлайн</span></div>
  </div>
  ${!canSee(d.id) ? noRoleHint(d) : `<div class="g2">
    <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('Hammer')}</span>Сейчас в работе</h2></div><div class="list">${doing.map(t=>taskItem(t,{status:true})).join('')||'<div class="empty">Ничего не в работе.</div>'}</div></section>
    <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('SkipForward')}</span>Следующие</h2><a class="btn sm ghost" href="#/d/${d.id}/tasks">Все задачи</a></div><div class="list">${next.map(t=>taskItem(t)).join('')||'<div class="empty">Очередь пуста.</div>'}</div></section>
  </div>`}
  ${decs.length?`<h2 class="sub-h">Решения отдела</h2>${decs.map(decisionCard).join('')}`:''}
  <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('Users')}</span>Кто в отделе</h2>${isAdmin()?`<a class="btn sm ghost" href="#/people">Назначить отделы</a>`:''}</div><div class="g3">${people.map(id=>`<div class="person">${av(id,32)}<div class="bd"><div class="nm">${esc(S.people[id].name)}</div><div class="st">${esc(S.people[id].role||'')}</div></div></div>`).join('') || '<small style="color:var(--muted)">Пока никто не отметил этот отдел в профиле.</small>'}</div></section>`;
}
function viewDept(){
  const d = D[UI.route.slice(2)];
  const tab = d.tabs.some(t=>t[0]===UI.tab) ? UI.tab : 'overview';
  const body = tab==='overview' ? deptOverview(d) : tab==='tasks' ? (canSee(d.id) ? filters(false) + board(d.id) : noRoleHint(d)) : d.id==='econ' ? econView(tab) : registry(d.id+'/'+tab, d);
  const count = id => id==='tasks' ? S.tasks.filter(t=>inDept(t,d.id) && t.status!=='done').length : id==='overview' ? 0 : d.id==='econ' ? econCount(id) : S.reg.filter(x=>x.key===d.id+'/'+id).length;
  const people = Object.keys(S.people).filter(id=>(S.people[id].depts||[]).includes(d.id)).map(id=>S.people[id].name);
  return `<div style="--dc:${d.color};display:contents">
  <div class="ph"><div class="ph-l"><span class="ph-ico">${ic(d.icon)}</span><div><h1>${esc(d.name)}</h1><p>${people.length?esc(people.join(', ')):'В отделе пока никого'}</p></div></div>
  <button class="btn primary" data-action="new-task" data-status="todo" data-dept="${d.id}">${ic('Plus')} Задача</button></div>
  <div class="tldr"><b>Суть раздела</b>${esc(d.tldr)}</div>
  <nav class="tabs" role="tablist">${d.tabs.map(([id,name])=>`<a class="tab" role="tab" href="#/d/${d.id}/${id}" aria-selected="${tab===id}">${esc(name)}${count(id)?`<span class="c">${count(id)}</span>`:''}</a>`).join('')}</nav>
  ${body}</div>`;
}

/* ── экономика ─────────────────────────────────
   Полное рабочее место экономистов внутри хаба. Работает на тех же коллекциях, что /economy/
   (sections, params, bugs, stages, decisions, log, meta/settings), поэтому обе страницы
   всегда показывают одно и то же. Журнал пишется в формате старой страницы. */
const PARAM_STATUS = [['idea','Идея'],['proposed','Предложено'],['agreed','Согласовано'],['done','Внедрено'],['rejected','Отклонено']];
const BUG_SEV = [['critical','Критично'],['high','Высокая'],['medium','Средняя'],['low','Низкая']];
const BUG_STATUS = [['open','Открыт'],['progress','В работе'],['fixed','Исправлен'],['wontfix','Не будем']];
const STAGE_STATUS = [['todo','Не начат'],['progress','В работе'],['blocked','Заблокирован'],['done','Готов']];
const ETONE = {idea:'muted',proposed:'info',agreed:'violet',done:'ok',rejected:'red',critical:'red',high:'warn',medium:'info',low:'muted',open:'red',progress:'warn',fixed:'ok',wontfix:'muted',todo:'muted',blocked:'red'};
const SEV_VAR = {critical:'var(--red)',high:'var(--warn)',medium:'var(--info)',low:'var(--muted)'};
const lab = (list,v) => (list.find(x=>x[0]===v)||[,v||'—'])[1];
const ECOLLS = ['sections','params','bugs','stages','decisions'];
const ENOUN = {
  sections:{n:'раздел',a:'добавлен',c:'изменён',d:'удалён',r:'восстановлен'}, params:{n:'параметр',a:'добавлен',c:'изменён',d:'удалён',r:'восстановлен'},
  bugs:{n:'баг',a:'добавлен',c:'изменён',d:'удалён',r:'восстановлен'}, stages:{n:'этап',a:'добавлен',c:'изменён',d:'удалён',r:'восстановлен'},
  decisions:{n:'решение',a:'добавлено',c:'изменено',d:'удалено',r:'восстановлено'}, meta:{n:'якорь',a:'задан',c:'изменён',d:'удалён',r:'восстановлен'}
};
const ESCHEMA = {
  sections:{label:'раздел', title:d=>d.title||'Без названия', fields:[
    {k:'title',t:'text',l:'Заголовок',req:true},
    {k:'body',t:'textarea',l:'Текст',rows:16,hint:'Разметка: **жирный**, `код`, строки «- » — список, «1. » — нумерованный, строки через | — таблица, «### » — подзаголовок.'}]},
  params:{label:'параметр', title:d=>d.name||'Без названия', fields:[
    {k:'name',t:'text',l:'Параметр',req:true}, {k:'group',t:'group',l:'Группа',req:true}, {k:'where',t:'text',l:'Где в коде или БД',mono:true},
    {k:'current',t:'textarea',l:'Сейчас',rows:2,mono:true,half:true}, {k:'proposed',t:'textarea',l:'Предлагаю',rows:2,mono:true,half:true},
    {k:'status',t:'select',l:'Статус',o:PARAM_STATUS,half:true}, {k:'assignee',t:'person',l:'Ответственный',half:true}, {k:'note',t:'textarea',l:'Заметка',rows:3}]},
  bugs:{label:'баг', title:d=>d.title||'Без названия', fields:[
    {k:'title',t:'text',l:'Проблема',req:true}, {k:'where',t:'text',l:'Где',mono:true}, {k:'impact',t:'textarea',l:'Что происходит',rows:3},
    {k:'severity',t:'select',l:'Важность',o:BUG_SEV,half:true}, {k:'status',t:'select',l:'Статус',o:BUG_STATUS,half:true},
    {k:'assignee',t:'person',l:'Ответственный'}, {k:'note',t:'textarea',l:'Заметка',rows:2}]},
  stages:{label:'этап', title:d=>d.title||'Без названия', fields:[
    {k:'title',t:'text',l:'Этап',req:true}, {k:'details',t:'textarea',l:'Что делаем',rows:4},
    {k:'depends',t:'text',l:'Зависит от',half:true}, {k:'status',t:'select',l:'Статус',o:STAGE_STATUS,half:true},
    {k:'assignee',t:'person',l:'Ответственный'}, {k:'note',t:'textarea',l:'Заметка',rows:2}]},
  decisions:{label:'вопрос', title:d=>d.question||'Без названия', fields:[
    {k:'question',t:'text',l:'Вопрос',req:true}, {k:'options',t:'options',l:'Варианты',rows:6,req:true,hint:'Один вариант на строку: «Название — пояснение».'},
    {k:'recommended',t:'number',l:'Рекомендуемый вариант (номер строки, 0 — нет)'}, {k:'note',t:'textarea',l:'Заметка',rows:3}]}
};
const EDEFAULTS = {params:{status:'proposed'}, bugs:{severity:'medium', status:'open'}, stages:{status:'todo'}, decisions:{recommended:0}, sections:{}};
const efind = (c,id) => S.E && (S.E[c]||[]).find(x=>x.id===id);
const nfmt = new Intl.NumberFormat('ru-RU');
const dtf = new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'});
const dayf = new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',weekday:'short'});

function epname(id){
  if (!id) return 'Не назначен';
  if (id==='claude') return 'Claude';
  if (S.people[id]) return S.people[id].name || 'Участник';
  const p = S.E && S.E.people[id]; return (p && p.name) || 'Участник';
}
function eav(id, size){
  if (!id || S.people[id]) return av(id, size);
  const s = size ? `width:${size}px;height:${size}px;` : '';
  let h = 7; for (const c of String(id)) h = (h*31 + c.charCodeAt(0)) >>> 0;
  const bg = id==='claude' ? 'linear-gradient(135deg,var(--acc-2),var(--acc-deep))' : `hsl(${h%360} 45% 42%)`;
  return `<span class="av" style="${s}background:${bg}" title="${esc(epname(id))}">${esc(id==='claude'?'C':initials(epname(id)))}</span>`;
}
const ewho = id => id ? `<span class="who-pick">${eav(id,22)} <span>${esc(epname(id))}</span></span>` : '<span style="color:var(--muted);font-size:13px">не назначен</span>';
function ePeopleOpts(cur){
  const ids = new Set(Object.keys(S.people));
  if (S.E) for (const [id,p] of Object.entries(S.E.people)) if (p && p.name) ids.add(id);
  if (cur) ids.add(cur);
  return [['','Не назначен'], ...[...ids].sort((a,b)=>epname(a).localeCompare(epname(b))).map(id=>[id, epname(id)+(id===S.me?' (вы)':'')])];
}
const eStamp = () => ({updatedAt:now(), updatedBy:S.me});
function elog(entry, hubAct){
  DB.collection('log').add(Object.assign({at:now(), by:S.me}, entry)).catch(()=>{});
  if (hubAct) log(hubAct, entry.title||'', 'econ');
}
async function ewrite(fn){
  try { await fn(); return true; }
  catch (e) {
    if (e && e.code==='unavailable') { await new Promise(r=>setTimeout(r, 500+Math.random()*700)); try { await fn(); return true; } catch (e2) { e = e2; } }
    console.error(e); toast(ic('CircleAlert')+' Не сохранилось: '+esc(errText(e))); return false;
  }
}
/* имя из хаба видно и на старой странице /economy/ */
function eSyncName(){ if (S.me && me().name && DB) DB.collection('people').doc(S.me).set({name:me().name, lastSeen:now(), tab:'hub', editing:null}, {merge:true}).catch(()=>{}); }

function parseMoney(s){
  s = String(s ?? '').replace(/[  ]/g,' ');
  if (/[%×]/.test(s)) return null;
  const m = s.match(/(\d[\d ]*(?:[.,]\d+)*)\s*(трлн|млрд|млн|тыс)?/i);
  if (!m) return null;
  const raw = m[1].trim().replace(/ /g,'');
  const v = /^\d{1,3}([.,]\d{3})+$/.test(raw) ? Number(raw.replace(/[.,]/g,'')) : Number(raw.replace(',','.'));
  if (!isFinite(v)) return null;
  return v * ({трлн:1e12,млрд:1e9,млн:1e6,тыс:1e3}[(m[2]||'').toLowerCase()] || 1);
}
function workTime(v){
  const h = v / ((S.E && S.E.anchor) || 3e6);
  if (h < 1/60) return 'меньше минуты работы';
  if (h < 1) return '≈ '+Math.round(h*60)+' мин работы';
  if (h < 10) return '≈ '+nfmt.format(Math.round(h*10)/10)+' ч работы';
  return '≈ '+nfmt.format(Math.round(h))+' ч работы';
}

/* markdown — общий рендер md() выше; inline — для ячеек таблиц экономики */
const inline = mdInline;
const isNumCell = v => { v = String(v ?? '').trim(); return /\d/.test(v) && /^[-−+≈~]?\s?[\d\s.,]+\s?(%|\$|₽|RB|тыс|млн|млрд|трлн)?$/.test(v); };
function tableHtml(s){
  const cols = Array.isArray(s.columns) ? s.columns : [], rows = Array.isArray(s.rowOrder) ? s.rowOrder : [], cells = s.cells || {};
  if (!cols.length) return '<p style="margin:0;color:var(--muted)">Таблица пустая.</p>';
  const cell = (r,c) => (cells[r] || {})[c.id] || '';
  const num = cols.map(c => { const vals = rows.map(r => cell(r,c)).filter(v => String(v).trim()); return vals.length > 0 && vals.every(isNumCell); });
  const cls = i => num[i] ? ' class="num"' : '';
  return `<div class="md-table"><table><thead><tr>${cols.map((c,i)=>`<th${cls(i)}>${inline(c.name||'')}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map((c,i)=>`<td${cls(i)}>${inline(cell(r,c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/* подписка на данные экономики */
function econListen(){
  if (S.E || !DB) return;
  const E = S.E = {sections:[], params:[], bugs:[], stages:[], decisions:[], log:[], people:{}, anchor:3e6, meta:{}, loaded:new Set()};
  const docs = sn => sn.docs.filter(d=>d.exists).map(d=>Object.assign({id:d.id}, d.data()));
  const onErr = c => e => { console.error(c, e); S.errs[c] = errText(e); E.loaded.add(c); schedule(); };
  for (const c of ECOLLS) UNSUB.push(DB.collection(c).onSnapshot(sn => { E[c] = docs(sn); E.loaded.add(c); schedule(); }, onErr(c)));
  UNSUB.push(DB.collection('log').orderBy('at','desc').limit(300).onSnapshot(sn => { E.log = docs(sn); schedule(); }, onErr('log')));
  UNSUB.push(DB.doc('meta/settings').onSnapshot(d => { if (d.exists) { E.meta = d.data(); E.anchor = Number(E.meta.anchor) || 3e6; } schedule(); }, onErr('meta')));
  UNSUB.push(DB.collection('people').onSnapshot(sn => { const p = {}; sn.docs.forEach(d => { p[d.id] = d.data(); }); E.people = p; schedule(); }, () => {}));
}
const eReady = () => S.E && ECOLLS.every(c=>S.E.loaded.has(c));

const ETAB_ICON = {plan:'BookOpen', params:'Gauge', bugs:'Bug', stages:'ListOrdered', edec:'Scale', elog:'ScrollText'};
function econOverview(d){
  const E = S.E;
  if (!eReady()) return '<div class="loading"><span class="spin"></span>Загружаем экономику…</div>';
  const P = E.params, pc = s => P.filter(p=>p.status===s).length, live = P.length - pc('rejected');
  const openB = E.bugs.filter(b=>b.status==='open'||b.status==='progress'), crit = openB.filter(b=>b.severity==='critical').length;
  const doneSt = E.stages.filter(s=>s.status==='done').length, curSt = [...E.stages].sort(byOrder).find(s=>s.status!=='done');
  const decided = E.decisions.filter(x=>x.chosen!=null && x.chosen!=='').length;
  const bar = parts => `<div class="sbar">${parts.map(([n,c])=>n?`<i style="flex:${n};background:${c}"></i>`:'').join('')}</div>`;
  return `<section class="panel glow" style="--dc:${d.color}">
    <div class="panel-h"><h2><span class="hi">${ic('Coins')}</span>Экономика сейчас</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-action="e-copy">${ic('Copy')} Markdown для репозитория</button><a class="btn sm ghost" href="../economy/" target="_blank" rel="noopener">${ic('ExternalLink')} Старая страница</a></div></div>
    <div class="tiles">
      <a class="tile" href="#/d/econ/params"><span class="k">Параметры</span><span class="v">${pc('agreed')+pc('done')} <small>/ ${live}</small></span>${bar([[pc('done'),'var(--ok)'],[pc('agreed'),'var(--violet)'],[pc('proposed'),'var(--info)'],[pc('idea'),'var(--muted)']])}<span class="s">согласовано · ${pc('done')} внедрено · ${pc('proposed')} ждут</span></a>
      <a class="tile" href="#/d/econ/bugs"><span class="k">Баги</span><span class="v">${openB.length}</span>${bar([[crit,'var(--red)'],[openB.length-crit,'var(--warn)']])}<span class="s">открыто · ${crit ? plural(crit,'критичный','критичных','критичных') : 'критичных нет'}</span></a>
      <a class="tile" href="#/d/econ/stages"><span class="k">Этапы</span><span class="v">${doneSt} <small>/ ${E.stages.length}</small></span>${bar([[doneSt,'var(--ok)'],[E.stages.length-doneSt,'var(--panel-3)']])}<span class="s">${curSt ? 'сейчас: '+esc(clip(curSt.title,48)) : 'все готовы'}</span></a>
      <a class="tile" href="#/d/econ/edec"><span class="k">Решения</span><span class="v">${decided} <small>/ ${E.decisions.length}</small></span>${bar([[decided,'var(--ok)'],[E.decisions.length-decided,'var(--panel-3)']])}<span class="s">${E.decisions.length-decided ? (E.decisions.length-decided)+' ждут решения' : 'все приняты'}</span></a>
      <div class="tile" style="cursor:default"><span class="k">Якорь</span><span class="v mono" style="font-size:20px">${nfmt.format(E.anchor)} $</span><span class="s">= 1 час работы новичка. От него считается «≈ N ч работы».</span><button class="btn sm" data-action="e-anchor" style="align-self:flex-start">${ic('Pencil')} Изменить</button></div>
    </div></section>`;
}
function eActions(coll, id, movable){
  return `<div class="eact">${movable?`<button class="icon-btn" data-action="e-move" data-dir="-1" data-coll="${coll}" data-id="${esc(id)}" aria-label="Выше" title="Выше">${ic('ArrowUp')}</button><button class="icon-btn" data-action="e-move" data-dir="1" data-coll="${coll}" data-id="${esc(id)}" aria-label="Ниже" title="Ниже">${ic('ArrowDown')}</button>`:''}<button class="icon-btn" data-open="${coll==='sections'&&efind('sections',id)?.kind==='table'?'etable:'+esc(id):'eedit:'+coll+':'+esc(id)}" aria-label="Изменить" title="Изменить">${ic('Pencil')}</button></div>`;
}
const eMeta = x => x.updatedAt ? `<div class="emeta">Изменено: ${esc(epname(x.updatedBy||'claude'))}, ${ago(x.updatedAt)}</div>` : '';
function eStatusSelect(coll, x, opts){
  const v = x.status || opts[0][0];
  return `<select class="chip-select t-${ETONE[v]||'muted'}" data-action="e-status" data-coll="${coll}" data-id="${esc(x.id)}" aria-label="Статус">${opts.map(([k,l])=>`<option value="${k}"${k===v?' selected':''}>${l}</option>`).join('')}</select>`;
}
const eEmpty = (title, text, coll, btn) => `<div class="empty"><b>${title}</b>${text}<button class="btn sm primary" data-open="enew:${coll}">${ic('Plus')} ${btn}</button></div>`;

function ePlan(){
  const list = [...S.E.sections].sort(byOrder);
  const tools = `<div class="reg-tools"><small>${plural(list.length,'раздел','раздела','разделов')} плана</small><span class="sp"></span><button class="btn sm" data-action="e-copy">${ic('Copy')} Markdown</button><button class="btn sm" data-open="etable:">${ic('Table')} Таблица</button><button class="btn sm primary" data-open="enew:sections">${ic('Plus')} Раздел</button></div>`;
  if (!list.length) return tools + '<div class="empty"><b>В плане пока нет разделов</b>Раздел — текст плана, таблица — сетка строк и столбцов.</div>';
  return tools + list.map(s => `<section class="panel"><div class="panel-h"><h2>${esc(s.title)}</h2>${eActions('sections', s.id, true)}</div>
    ${s.kind==='table' ? tableHtml(s) + (s.note ? `<div class="md">${md(s.note, true)}</div>` : '') : `<div class="md">${md(s.body, true)}</div>`}${eMeta(s)}</section>`).join('');
}
function eGroups(){
  const g = new Map();
  for (const p of [...S.E.params].sort(byOrder)) { const k = p.group || 'Без группы'; if (!g.has(k)) g.set(k, []); g.get(k).push(p); }
  return g;
}
function eParams(){
  const all = S.E.params, F = UI.ef;
  if (!all.length) return eEmpty('Параметров пока нет','Параметр — одна настройка экономики: где она в коде, сколько сейчас, сколько предлагаем.','params','Добавить параметр');
  const g = eGroups(), q = F.q.trim().toLowerCase(), cnt = s => all.filter(p=>p.status===s).length;
  let rows = '', shown = 0;
  for (const [name, items] of g) {
    if (F.group!=='all' && F.group!==name) continue;
    const vis = items.filter(p => (F.status==='all' || p.status===F.status) && (!q || [p.name,p.where,p.current,p.proposed,p.note].join(' ').toLowerCase().includes(q)));
    if (!vis.length) continue; shown += vis.length;
    rows += `<tr class="grp"><td colspan="6">${esc(name)}<span>${vis.length}</span></td></tr>` + vis.map(p => {
      const pv = parseMoney(p.proposed);
      return `<tr class="${p.status==='rejected'?'rej':''}">
        <td><div class="pname">${esc(p.name)}</div>${p.where?`<div class="where mono">${esc(p.where)}</div>`:''}${p.note?`<div class="pnote">${esc(p.note)}</div>`:''}</td>
        <td><div class="val cur">${esc(p.current||'—')}</div></td>
        <td><div class="val">${esc(p.proposed||'—')}</div>${pv && pv >= 1000 ? `<span class="hours">${workTime(pv)}</span>` : ''}</td>
        <td>${eStatusSelect('params', p, PARAM_STATUS)}</td><td>${ewho(p.assignee)}</td>
        <td style="width:44px"><button class="icon-btn" data-open="eedit:params:${esc(p.id)}" aria-label="Изменить" title="Изменить">${ic('Pencil')}</button></td></tr>`; }).join('');
  }
  return `<div class="toolbar"><div class="seg" role="group" aria-label="Фильтр по статусу">${[['all','Все',all.length], ...PARAM_STATUS.map(([k,l])=>[k,l,cnt(k)])].map(([k,l,n])=>`<button data-action="e-fstatus" data-v="${k}" aria-pressed="${F.status===k}">${l} <span class="mono" style="color:var(--muted)">${n}</span></button>`).join('')}</div></div>
    <div class="toolbar"><select class="select" id="e-group" aria-label="Группа"><option value="all">Все группы</option>${[...g.keys()].map(k=>`<option${F.group===k?' selected':''}>${esc(k)}</option>`).join('')}</select>
      <input class="input" id="e-q" type="search" placeholder="Поиск: название, файл, значение" value="${esc(F.q)}" aria-label="Поиск по параметрам" style="flex:1 1 220px;width:auto;border-radius:99px">
      <button class="btn primary" data-open="enew:params">${ic('Plus')} Параметр</button></div>
    ${shown ? `<div class="tbl-wrap"><table class="grid etable"><thead><tr><th>Параметр</th><th>Сейчас</th><th>Предлагаю</th><th>Статус</th><th>Ответственный</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`
      : `<div class="empty"><b>Ничего не нашлось</b>Под фильтр не подходит ни один параметр.<button class="btn sm" data-action="e-freset">Сбросить фильтры</button></div>`}`;
}
const sevRank = {critical:0,high:1,medium:2,low:3}, bStRank = {progress:0,open:1,fixed:2,wontfix:3};
function eBugs(){
  const all = S.E.bugs;
  if (!all.length) return eEmpty('Багов пока нет','Ошибки и эксплойты, которые влияют на экономику.','bugs','Добавить баг');
  const closed = all.filter(b=>b.status==='fixed'||b.status==='wontfix').length;
  const list = [...all].sort((a,b)=>(bStRank[a.status]??1)-(bStRank[b.status]??1) || (sevRank[a.severity]??2)-(sevRank[b.severity]??2) || byOrder(a,b)).filter(b => !UI.ef.hideFixed || (b.status!=='fixed' && b.status!=='wontfix'));
  return `<div class="reg-tools"><div class="seg"><button data-action="e-toggle" data-k="hideFixed" aria-pressed="${UI.ef.hideFixed}">Скрыть закрытые <span class="mono" style="color:var(--muted)">${closed}</span></button></div><span class="sp"></span><button class="btn primary" data-open="enew:bugs">${ic('Plus')} Баг</button></div>
  <div class="list">${list.map(b => `<article class="erow sev ${b.status==='fixed'||b.status==='wontfix'?'done':''}" style="--sev:${SEV_VAR[b.severity]||'var(--muted)'}">
    <div class="body"><h3>${esc(b.title)}</h3>${b.where?`<div class="where mono">${esc(b.where)}</div>`:''}${b.impact?`<div class="txt">${esc(b.impact)}</div>`:''}${b.note?`<div class="txt"><b>Заметка:</b> ${esc(b.note)}</div>`:''}${eMeta(b)}</div>
    <div class="side">${chip(lab(BUG_SEV,b.severity), ETONE[b.severity])}${eStatusSelect('bugs', b, BUG_STATUS)}${ewho(b.assignee)}${eActions('bugs', b.id, false)}</div></article>`).join('')}</div>`;
}
function eStages(){
  const all = [...S.E.stages].sort(byOrder);
  if (!all.length) return eEmpty('Этапов пока нет','Этап — шаг плана работ: что делаем, от чего зависит, кто ведёт.','stages','Добавить этап');
  const done = all.filter(s=>s.status==='done').length;
  const list = all.map((s,i)=>[s,i+1]).filter(([s]) => !UI.ef.hideDone || s.status!=='done');
  return `<div class="reg-tools"><div class="seg"><button data-action="e-toggle" data-k="hideDone" aria-pressed="${UI.ef.hideDone}">Скрыть готовые <span class="mono" style="color:var(--muted)">${done}</span></button></div><span class="sp"></span><button class="btn primary" data-open="enew:stages">${ic('Plus')} Этап</button></div>
  <div class="list">${list.map(([s,n]) => `<article class="erow ${s.status==='done'?'done':''}">
    <div class="body"><h3><span class="stage-n">${n}</span>${esc(s.title)}</h3>${s.details?`<div class="txt">${esc(s.details)}</div>`:''}${s.depends?`<div class="txt"><b>Зависит от:</b> ${esc(s.depends)}</div>`:''}${s.note?`<div class="txt"><b>Заметка:</b> ${esc(s.note)}</div>`:''}${eMeta(s)}</div>
    <div class="side">${eStatusSelect('stages', s, STAGE_STATUS)}${ewho(s.assignee)}${eActions('stages', s.id, true)}</div></article>`).join('')}</div>`;
}
function eDecisions(){
  const all = [...S.E.decisions].sort(byOrder);
  if (!all.length) return eEmpty('Вопросов пока нет','Вопрос с вариантами: каждый голосует, потом фиксируете итог.','decisions','Добавить вопрос');
  return `<div class="reg-tools"><small>Голосуйте за вариант, затем зафиксируйте итог кнопкой «Принять».</small><span class="sp"></span><button class="btn primary" data-open="enew:decisions">${ic('Plus')} Вопрос</button></div>
  ${all.map(x => {
    const opts = Array.isArray(x.options) ? x.options : [], votes = x.votes || {};
    const chosen = (x.chosen===null||x.chosen===undefined||x.chosen==='') ? null : Number(x.chosen), rec = Number(x.recommended)||0;
    return `<article class="decision"><div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-start"><h3>${esc(x.question)}</h3>${eActions('decisions', x.id, true)}</div>
      <div>${chosen!=null && opts[chosen] ? chip('Принято: '+opts[chosen].label,'ok') : chip('Ждёт решения','warn')}</div>
      <div class="list">${opts.map((o,i) => { const voters = Object.keys(votes).filter(k => votes[k]===i), mine = votes[S.me]===i;
        return `<div class="opt ${chosen===i?'chosen':''} ${mine?'mine':''}"><div><div class="l">${i+1}. ${esc(o.label)} ${rec===i+1?'<span class="chip t-violet">рекомендовано</span>':''}</div>${o.desc?`<div class="d">${esc(o.desc)}</div>`:''}</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="votes" title="${esc(voters.map(epname).join(', '))}">${voters.map(v=>eav(v,24)).join('')}</span>
          <button class="btn sm${mine?' primary':''}" data-action="e-vote" data-id="${esc(x.id)}" data-i="${i}">${mine?ic('Check')+' Мой голос':'Голосую'}</button>
          <button class="btn sm ghost" data-action="e-choose" data-id="${esc(x.id)}" data-i="${chosen===i?'':i}">${chosen===i?'Отменить итог':'Принять'}</button></div></div>`; }).join('')}</div>
      ${x.note?`<div style="color:var(--text-2);font-size:13.5px;white-space:pre-wrap"><b style="color:var(--text)">Заметка:</b> ${esc(x.note)}</div>`:''}${eMeta(x)}</article>`; }).join('')}`;
}
function eLogText(l){
  const N = ENOUN[l.coll] || {n:'запись',a:'добавлена',c:'изменена',d:'удалена',r:'восстановлена'};
  const t = l.title ? ` <q>${esc(clip(l.title,90))}</q>` : '';
  switch (l.action) {
    case 'create': return `${N.a} ${N.n}${t}`; case 'update': return `${N.c} ${N.n}${t}`; case 'delete': return `${N.d} ${N.n}${t}`;
    case 'restore': return `${N.r} ${N.n}${t}`; case 'status': return `статус: ${N.n}${t}`; case 'vote': return `голос в решении${t}`;
    case 'choose': return `итог решения${t}`; case 'note': return 'заметка'; default: return esc(l.action||'');
  }
}
function eLog(){
  const comp = `<section class="panel"><form class="form" data-form="e-note"><label class="fld"><span>Заметка для команды</span><textarea class="input" name="t" rows="3" placeholder="Что обсудили, что проверили в игре, какие цифры получили" maxlength="4000">${esc(UI.eDraft||'')}</textarea></label><div style="display:flex;justify-content:flex-end"><button class="btn primary">${ic('Plus')} Добавить заметку</button></div></form></section>`;
  const list = S.E.log; if (!list.length) return comp + '<div class="empty"><b>Журнал пуст</b>Здесь появится каждое изменение и заметки команды.</div>';
  let out = '', lastDay = '';
  for (const l of list) {
    const dt = new Date(l.at||0), day = dayf.format(dt);
    if (day !== lastDay) { out += `<div class="day">${esc(day)}</div>`; lastDay = day; }
    const diff = Array.isArray(l.diff) && l.diff.length ? `<ul class="diff">${l.diff.map(x=>`<li><span class="f">${esc(x.f)}:</span> <del>${esc(x.from||'—')}</del> → <ins>${esc(x.to||'—')}</ins></li>`).join('')}</ul>` : '';
    const canRestore = l.action==='delete' && l.snapshot && ECOLLS.includes(l.coll) && !efind(l.coll, l.docId);
    out += `<div class="entry">${eav(l.by||'claude',24)}<div><b>${esc(epname(l.by||'claude'))}</b> — ${eLogText(l)}${l.text?`<div class="note-text">${esc(l.text)}</div>`:''}${diff}${canRestore?`<div style="margin-top:6px"><button class="btn sm" data-action="e-restore" data-id="${esc(l.id)}">${ic('RotateCcw')} Восстановить</button></div>`:''}</div><span class="when">${esc(dtf.format(dt))}</span></div>`;
  }
  return comp + `<section class="panel"><div class="log">${out}</div></section>`;
}
function econView(tab){
  if (!eReady()) return '<div class="loading"><span class="spin"></span>Загружаем экономику…</div>';
  if (tab==='plan') return ePlan();
  if (tab==='params') return eParams();
  if (tab==='bugs') return eBugs();
  if (tab==='stages') return eStages();
  if (tab==='edec') return eDecisions();
  if (tab==='elog') return eLog();
  return '';
}
function econCount(tab){
  if (!S.E) return 0; const E = S.E;
  return {plan:E.sections.length, params:E.params.length, bugs:E.bugs.filter(b=>b.status==='open'||b.status==='progress').length, stages:E.stages.length, edec:E.decisions.filter(x=>x.chosen==null||x.chosen==='').length}[tab] || 0;
}

/* формы записей экономики (в шторке) */
const optionsToText = o => (Array.isArray(o)?o:[]).map(x => x.desc ? `${x.label} — ${x.desc}` : x.label).join('\n');
const textToOptions = t => String(t||'').split('\n').map(s=>s.trim()).filter(Boolean).map(s => { const m = s.split(/\s+[—–-]\s+/); return {label:clip(m[0],160), desc:clip(m.slice(1).join(' — '),400)}; });
function eFieldHtml(f, v){
  const hint = f.hint ? `<small style="color:var(--muted);font-size:12px">${esc(f.hint)}</small>` : '';
  const mono = f.mono ? ' style="font-family:var(--f-mono);font-size:13px"' : '';
  let ctl;
  switch (f.t) {
    case 'textarea': ctl = `<textarea class="input" name="${f.k}" rows="${f.rows||3}"${mono}>${esc(v ?? '')}</textarea>`; break;
    case 'options': ctl = `<textarea class="input" name="${f.k}" rows="${f.rows||5}">${esc(optionsToText(v))}</textarea>`; break;
    case 'number': ctl = `<input class="input" name="${f.k}" type="number" inputmode="numeric" value="${esc(v ?? '')}">`; break;
    case 'select': ctl = `<select class="input" name="${f.k}">${f.o.map(([k,l])=>`<option value="${k}"${k===v?' selected':''}>${l}</option>`).join('')}</select>`; break;
    case 'person': ctl = `<select class="input" name="${f.k}">${ePeopleOpts(v).map(([k,l])=>`<option value="${esc(k)}"${k===(v||'')?' selected':''}>${esc(l)}</option>`).join('')}</select>`; break;
    case 'group': { const gs = [...new Set(S.E.params.map(p=>p.group).filter(Boolean))]; ctl = `<input class="input" name="${f.k}" list="e-groups" value="${esc(v ?? '')}" autocomplete="off"><datalist id="e-groups">${gs.map(g=>`<option value="${esc(g)}">`).join('')}</datalist>`; break; }
    default: ctl = `<input class="input" name="${f.k}" value="${esc(v ?? '')}" autocomplete="off"${mono}>`;
  }
  return `<label class="fld"><span>${esc(f.l)}${f.req?' *':''}</span>${ctl}${hint}</label>`;
}
function eForm(coll, id){
  const sch = ESCHEMA[coll], cur = id ? efind(coll, id) : null;
  if (id && !cur) return null;
  const v = cur || Object.assign({}, EDEFAULTS[coll], coll==='params' && UI.ef.group!=='all' ? {group:UI.ef.group} : {});
  let body = '', buf = [];
  const flush = () => { if (buf.length) { body += buf.length===2 ? `<div class="fld-row">${buf.join('')}</div>` : buf.join(''); buf = []; } };
  for (const f of sch.fields) { const h = eFieldHtml(f, v[f.k]); if (f.half) { buf.push(h); if (buf.length===2) flush(); } else { flush(); body += h; } }
  flush();
  return drawerHead(D.econ, cur ? sch.title(cur) : 'Новый '+sch.label) + `<form class="dr-b form" data-form="e-save" data-coll="${coll}" data-id="${cur?esc(cur.id):''}">
    ${body}<div class="gate-err" role="alert"></div>
    <div class="form-foot"><button class="btn primary">${ic('Save')} ${cur?'Сохранить':'Добавить'}</button><button type="button" class="btn ghost" data-action="close-drawer">Отмена</button><span class="sp"></span>${cur?`<button type="button" class="btn danger" data-action="e-del" data-coll="${coll}" data-id="${esc(cur.id)}">${ic('Trash2')} Удалить</button>`:''}</div>
    ${cur?eMeta(cur):''}</form>`;
}
function eReadForm(f, sch){
  const v = {};
  for (const fl of sch.fields) {
    const el = f.elements[fl.k]; if (!el) continue;
    if (fl.t==='options') v[fl.k] = textToOptions(el.value);
    else if (fl.t==='number') v[fl.k] = el.value==='' ? null : Number(el.value);
    else if (fl.t==='person') v[fl.k] = el.value || null;
    else v[fl.k] = (fl.t==='text'||fl.t==='group') ? clip(el.value, 400) : String(el.value).replace(/\s+$/,'').slice(0, 20000);
  }
  return v;
}
const eShow = (f,x) => f.t==='options' ? optionsToText(x).replace(/\n/g,' · ') : f.t==='select' ? lab(f.o,x) : f.t==='person' ? (x?epname(x):'') : String(x ?? '');
function eDiff(sch, cur, v){
  const out = [];
  for (const f of sch.fields) {
    const a = cur[f.k] ?? (f.t==='options'?[]:f.t==='number'||f.t==='person'?null:''), b = v[f.k];
    if (JSON.stringify(a) !== JSON.stringify(b)) out.push({k:f.k, f:f.l, from:clip(eShow(f,a),160), to:clip(eShow(f,b),160)});
  }
  return out;
}
async function eSave(f){
  const coll = f.dataset.coll, id = f.dataset.id, sch = ESCHEMA[coll], err = f.querySelector('.gate-err'); err.textContent = '';
  const v = eReadForm(f, sch);
  for (const fl of sch.fields) { const x = v[fl.k]; if (fl.req && (x==null || (Array.isArray(x)?!x.length:String(x).trim()===''))) { err.textContent = `Заполни поле «${fl.l}».`; return; } }
  if (coll==='decisions') { const n = v.recommended||0; if (n<0 || n>v.options.length) { err.textContent = `Номер рекомендуемого варианта — от 0 до ${v.options.length}.`; return; } }
  if (!id) {
    const order = S.E[coll].reduce((m,x)=>Math.max(m, typeof x.order==='number'?x.order:0), 0) + 1;
    const body = Object.assign({}, v, {order, createdAt:now(), createdBy:S.me}, eStamp());
    if (coll==='decisions') { body.votes = {}; body.chosen = null; }
    const ref = DB.collection(coll).doc();
    if (await ewrite(()=>ref.set(body))) { elog({action:'create', coll, docId:ref.id, title:sch.title(body)}, 'добавил(а) в экономику'); closeDrawer(); toast(ic('Check')+' Добавлено'); }
    return;
  }
  const cur = efind(coll, id); if (!cur) { err.textContent = 'Эту запись уже удалили.'; return; }
  const diff = eDiff(sch, cur, v); if (!diff.length) { closeDrawer(); return; }
  const patch = eStamp(); diff.forEach(x => patch[x.k] = v[x.k]);
  if (coll==='decisions' && patch.options && cur.chosen!=null && cur.chosen>=patch.options.length) patch.chosen = null;
  if (await ewrite(()=>DB.collection(coll).doc(id).update(patch))) { elog({action:'update', coll, docId:id, title:sch.title(Object.assign({},cur,v)), diff:diff.map(({f,from,to})=>({f,from,to})).slice(0,8)}, 'изменил(а) в экономике'); closeDrawer(); toast(ic('Check')+' Сохранено'); }
}

/* редактор таблиц плана: строки, столбцы, вставка из Excel / Google Таблиц */
let TE = null;
const teId = p => p + Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2,7);
function eTableForm(id){
  const cur = id ? efind('sections', id) : null;
  if (id && !cur) return null;
  if (!TE || TE.id !== (id||'')) TE = cur ? {id, columns:(cur.columns||[]).map(c=>({id:c.id, name:c.name||''})), rowOrder:[...(cur.rowOrder||[])], cells:JSON.parse(JSON.stringify(cur.cells||{}))}
                                         : {id:'', columns:[teId('c'),teId('c'),teId('c')].map(c=>({id:c, name:''})), rowOrder:[teId('r'),teId('r'),teId('r')], cells:{}};
  return drawerHead(D.econ, cur ? cur.title : 'Новая таблица') + `<form class="dr-b form" data-form="e-table" data-id="${cur?esc(cur.id):''}">
    <label class="fld"><span>Заголовок</span><input class="input" name="title" value="${esc(cur?cur.title:'')}" placeholder="Например: Выплаты работ в час" autocomplete="off"></label>
    <div class="fld"><span style="font-size:12.5px;font-weight:700;color:var(--text-2)">Таблица</span><div id="te-grid"></div></div>
    <div class="te-actions"><button class="btn sm" type="button" data-te="row-add">${ic('Plus')} Строка</button><button class="btn sm" type="button" data-te="col-add">${ic('Plus')} Столбец</button><small style="color:var(--muted)">Enter — на строку ниже. Можно вставить диапазон из Excel: встань в ячейку и нажми Ctrl+V.</small></div>
    <label class="fld"><span>Пояснение под таблицей</span><textarea class="input" name="note" rows="2">${esc(cur?cur.note||'':'')}</textarea></label>
    <div class="gate-err" role="alert"></div>
    <div class="form-foot"><button class="btn primary">${ic('Save')} ${cur?'Сохранить':'Добавить'}</button><button type="button" class="btn ghost" data-action="close-drawer">Отмена</button><span class="sp"></span>${cur?`<button type="button" class="btn danger" data-action="e-del" data-coll="sections" data-id="${esc(cur.id)}">${ic('Trash2')} Удалить</button>`:''}</div>
    ${cur?eMeta(cur):''}</form>`;
}
function renderTE(focus){
  const g = $('#te-grid'); if (!g || !TE) return;
  const {columns:cols, rowOrder:rows, cells} = TE, nc = cols.length, nr = rows.length;
  g.innerHTML = `<div class="te-wrap"><table class="te"><thead><tr><th class="te-rowctl te-corner"></th>${cols.map((c,ci) => `<th>
      <div class="te-colctl"><button type="button" class="te-mini" data-te="col-left" data-i="${ci}" ${ci===0?'disabled':''} aria-label="Столбец левее">‹</button><button type="button" class="te-mini" data-te="col-right" data-i="${ci}" ${ci===nc-1?'disabled':''} aria-label="Столбец правее">›</button><button type="button" class="te-mini del" data-te="col-del" data-i="${ci}" ${nc<=1?'disabled':''} aria-label="Удалить столбец">×</button></div>
      <input class="te-in te-head" data-tc="${ci}" value="${esc(c.name)}" placeholder="Столбец ${ci+1}" aria-label="Название столбца ${ci+1}" autocomplete="off"></th>`).join('')}</tr></thead>
    <tbody>${rows.map((r,ri) => `<tr><th class="te-rowctl"><span class="te-n">${ri+1}</span><button type="button" class="te-mini" data-te="row-up" data-i="${ri}" ${ri===0?'disabled':''} aria-label="Строку выше">↑</button><button type="button" class="te-mini" data-te="row-down" data-i="${ri}" ${ri===nr-1?'disabled':''} aria-label="Строку ниже">↓</button><button type="button" class="te-mini del" data-te="row-del" data-i="${ri}" aria-label="Удалить строку">×</button></th>${cols.map((c,ci) => `<td><input class="te-in" data-r="${ri}" data-c="${ci}" value="${esc((cells[r]||{})[c.id] ?? '')}" aria-label="Строка ${ri+1}, столбец ${ci+1}" autocomplete="off"></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (focus) { const el = g.querySelector(focus); if (el) { el.focus(); if (el.select) el.select(); } }
}
function teSet(ri, ci, v){ const r = TE.rowOrder[ri], c = TE.columns[ci]; if (r && c) (TE.cells[r] = TE.cells[r] || {})[c.id] = v; }
function teOp(op, i){
  const T = TE; i = Number(i); const swap = (a,x,y) => { const t = a[x]; a[x] = a[y]; a[y] = t; };
  switch (op) {
    case 'row-add': T.rowOrder.push(teId('r')); return renderTE(`[data-r="${T.rowOrder.length-1}"][data-c="0"]`);
    case 'col-add': T.columns.push({id:teId('c'), name:''}); return renderTE(`[data-tc="${T.columns.length-1}"]`);
    case 'row-del': { const r = T.rowOrder.splice(i,1)[0]; delete T.cells[r]; break; }
    case 'col-del': if (T.columns.length > 1) T.columns.splice(i,1); break;
    case 'row-up': if (i > 0) swap(T.rowOrder, i, i-1); break;
    case 'row-down': if (i < T.rowOrder.length-1) swap(T.rowOrder, i, i+1); break;
    case 'col-left': if (i > 0) swap(T.columns, i, i-1); break;
    case 'col-right': if (i < T.columns.length-1) swap(T.columns, i, i+1); break;
  }
  renderTE();
}
function tableBody(f){
  const columns = TE.columns.map((c,i) => ({id:c.id, name:(c.name||'').trim() || `Столбец ${i+1}`}));
  const cells = {};
  for (const r of TE.rowOrder) { const row = TE.cells[r] || {}, out = {}; for (const c of columns) { const v = String(row[c.id] ?? '').trim(); if (v) out[c.id] = clip(v, 2000); } if (Object.keys(out).length) cells[r] = out; }
  const rowOrder = [...TE.rowOrder]; while (rowOrder.length > 1 && !cells[rowOrder[rowOrder.length-1]]) rowOrder.pop();
  return {kind:'table', title:clip(f.title.value,200) || 'Таблица', note:String(f.note.value||'').replace(/\s+$/,''), columns, rowOrder, cells};
}
function tableDiff(a, b){
  const out = [], ac = a.columns||[], ar = a.rowOrder||[];
  if ((a.title||'') !== b.title) out.push({f:'Заголовок', from:clip(a.title,160), to:clip(b.title,160)});
  const addR = b.rowOrder.filter(r => !ar.includes(r)).length, remR = ar.filter(r => !b.rowOrder.includes(r)).length;
  if (addR || remR) out.push({f:'Строки', from:String(ar.length), to:`${b.rowOrder.length}${addR?` (+${addR})`:''}${remR?` (−${remR})`:''}`});
  else if (JSON.stringify(ar) !== JSON.stringify(b.rowOrder)) out.push({f:'Порядок строк', from:'', to:'изменён'});
  const an = ac.map(c=>c.name).join(' · '), bn = b.columns.map(c=>c.name).join(' · ');
  if (an !== bn) out.push({f:'Столбцы', from:clip(an,160), to:clip(bn,160)});
  let changed = 0; const bc = new Set(b.columns.map(c=>c.id));
  for (const r of ar) if (b.rowOrder.includes(r)) for (const c of ac) if (bc.has(c.id) && (((a.cells||{})[r]||{})[c.id]||'') !== ((b.cells[r]||{})[c.id]||'')) changed++;
  if (changed) out.push({f:'Ячейки', from:'', to:`изменено: ${changed}`});
  if ((a.note||'') !== b.note) out.push({f:'Пояснение', from:clip(a.note,160), to:clip(b.note,160)});
  return out;
}
async function eSaveTable(f){
  const body = tableBody(f), id = f.dataset.id, err = f.querySelector('.gate-err');
  if (!body.columns.length) { err.textContent = 'Добавь хотя бы один столбец.'; return; }
  if (!id) {
    const order = S.E.sections.reduce((m,x)=>Math.max(m, typeof x.order==='number'?x.order:0), 0) + 1, ref = DB.collection('sections').doc();
    if (await ewrite(()=>ref.set(Object.assign({}, body, {order, createdAt:now(), createdBy:S.me}, eStamp())))) { elog({action:'create', coll:'sections', docId:ref.id, title:body.title}, 'добавил(а) таблицу в план'); TE = null; closeDrawer(); toast(ic('Check')+' Таблица добавлена'); }
    return;
  }
  const cur = efind('sections', id); if (!cur) { err.textContent = 'Эту таблицу уже удалили.'; return; }
  const diff = tableDiff(cur, body); if (!diff.length) { TE = null; closeDrawer(); return; }
  if (await ewrite(()=>DB.collection('sections').doc(id).update(Object.assign({}, body, eStamp())))) { elog({action:'update', coll:'sections', docId:id, title:body.title, diff:diff.slice(0,8)}, 'изменил(а) таблицу плана'); TE = null; closeDrawer(); toast(ic('Check')+' Сохранено'); }
}

/* Markdown для docs/ECONOMY_PLAN.md */
function econMarkdown(){
  const E = S.E, L = [], cell = s => String(s ?? '').replace(/\|/g,'\\|').replace(/\n+/g,' ');
  L.push('# План экономики Kentucky RolePlay','',`Выгружено из Kentucky Hub ${new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date())}. Якорь: ${nfmt.format(E.anchor)} $ за час работы новичка.`,'');
  for (const s of [...E.sections].sort(byOrder)) {
    if (s.kind !== 'table') { L.push('## '+s.title,'',String(s.body||'').trim(),''); continue; }
    const cols = s.columns || []; L.push('## '+s.title,'');
    if (cols.length) { L.push('| '+cols.map(c=>cell(c.name)).join(' | ')+' |', '|'+cols.map(()=>'---').join('|')+'|'); for (const r of (s.rowOrder||[])) L.push('| '+cols.map(c=>cell(((s.cells||{})[r]||{})[c.id])).join(' | ')+' |'); }
    if (s.note) L.push('', String(s.note).trim()); L.push('');
  }
  L.push('## Параметры','');
  for (const [g, items] of eGroups()) {
    L.push('### '+g,'','| Параметр | Где | Сейчас | Предлагаю | Статус | Ответственный |','|---|---|---|---|---|---|');
    for (const p of items) L.push(`| ${cell(p.name)}${p.note?' — '+cell(p.note):''} | ${p.where?'`'+cell(p.where)+'`':''} | ${cell(p.current)} | ${cell(p.proposed)} | ${lab(PARAM_STATUS,p.status)} | ${p.assignee?cell(epname(p.assignee)):''} |`);
    L.push('');
  }
  L.push('## Баги','','| Проблема | Где | Что происходит | Важность | Статус |','|---|---|---|---|---|');
  for (const b of [...E.bugs].sort((a,b)=>(sevRank[a.severity]??2)-(sevRank[b.severity]??2)||byOrder(a,b))) L.push(`| ${cell(b.title)} | ${b.where?'`'+cell(b.where)+'`':''} | ${cell(b.impact)} | ${lab(BUG_SEV,b.severity)} | ${lab(BUG_STATUS,b.status)} |`);
  L.push('','## Этапы','','| # | Этап | Что делаем | Зависит от | Статус |','|---|---|---|---|---|');
  [...E.stages].sort(byOrder).forEach((s,i)=>L.push(`| ${i+1} | ${cell(s.title)} | ${cell(s.details)} | ${cell(s.depends)} | ${lab(STAGE_STATUS,s.status)} |`));
  L.push('','## Решения','');
  [...E.decisions].sort(byOrder).forEach((x,i) => {
    const o = x.options||[], ch = x.chosen;
    L.push(`${i+1}. **${x.question}** — ${ch!=null&&ch!==''&&o[ch] ? 'принято: '+o[ch].label : 'ждёт решения'}`);
    o.forEach((y,k) => { const v = Object.keys(x.votes||{}).filter(u=>x.votes[u]===k).length; L.push(`   - ${y.label}${y.desc?' — '+y.desc:''}${Number(x.recommended)===k+1?' (рекомендовано)':''}${v?` — голосов: ${v}`:''}`); });
    if (x.note) L.push('   - Заметка: '+String(x.note).replace(/\n+/g,' '));
  });
  L.push(''); return L.join('\n');
}
function eCopy(){
  if (!eReady()) return;
  const text = econMarkdown();
  const fallback = () => { overlay(`<div class="pal" role="dialog" aria-label="Markdown" style="width:min(820px,100%)"><div class="cap"><h2>${ic('Copy')} Скопируй текст</h2><small style="color:var(--muted)">Браузер не дал скопировать автоматически. Текст выделен — нажми Ctrl+C.</small><textarea class="input" rows="18" readonly style="font-family:var(--f-mono);font-size:12.5px">${esc(text)}</textarea><div style="display:flex;justify-content:flex-end"><button class="btn" data-action="close-overlay">Готово</button></div></div></div>`); const ta = $('#overlay textarea'); ta.focus(); ta.select(); };
  try { navigator.clipboard.writeText(text).then(()=>toast(ic('Check')+' Скопировано. Можно вставить в docs/ECONOMY_PLAN.md.'), fallback); } catch (e) { fallback(); }
}

/* действия экономики */
async function eMove(coll, id, dir){
  const list = [...S.E[coll]].sort(byOrder), i = list.findIndex(x=>x.id===id), j = i+dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  const needRenum = list.some(x=>typeof x.order !== 'number') || new Set(list.map(x=>x.order)).size !== list.length;
  await ewrite(async () => {
    const b = DB.batch();
    if (needRenum) list.forEach((x,k) => { const want = k===i?j:k===j?i:k; if (x.order !== want) b.update(DB.collection(coll).doc(x.id), {order:want}); });
    else { b.update(DB.collection(coll).doc(list[i].id), {order:list[j].order}); b.update(DB.collection(coll).doc(list[j].id), {order:list[i].order}); }
    await b.commit();
  });
}
document.addEventListener('click', async e => {
  const a = e.target.closest('[data-action^="e-"]');
  const te = e.target.closest('[data-te]');
  if (te && TE && !te.disabled && te.closest('#drawer')) { teOp(te.dataset.te, te.dataset.i); return; }
  if (!a || a.tagName==='SELECT' || document.body.classList.contains('locked')) return;
  const k = a.dataset.action, id = a.dataset.id, coll = a.dataset.coll;
  if (k==='e-copy') eCopy();
  if (k==='e-move') eMove(coll, id, Number(a.dataset.dir));
  if (k==='e-fstatus') { UI.ef.status = a.dataset.v; paint(); }
  if (k==='e-freset') { UI.ef = Object.assign(UI.ef, {status:'all', group:'all', q:''}); paint(); }
  if (k==='e-toggle') { UI.ef[a.dataset.k] = !UI.ef[a.dataset.k]; paint(); }
  if (k==='e-vote') {
    const x = efind('decisions', id); if (!x) return; const i = Number(a.dataset.i), cur = (x.votes||{})[S.me], nv = cur===i ? null : i, o = x.options||[];
    if (await ewrite(()=>DB.collection('decisions').doc(id).update(Object.assign({['votes.'+S.me]:nv}, eStamp())))) { elog({action:'vote', coll:'decisions', docId:id, title:x.question, diff:[{f:'Голос', from:cur!=null&&o[cur]?o[cur].label:'', to:nv!=null&&o[nv]?o[nv].label:'снят'}]}, cur==null?'проголосовал(а) в экономике':null); if (cur==null && nv!=null) gain(5, ic('Vote')+' Голос учтён'); }
  }
  if (k==='e-choose') {
    const x = efind('decisions', id); if (!x) return; const v = a.dataset.i==='' ? null : Number(a.dataset.i), o = x.options||[];
    if (v!=null && !confirm('Зафиксировать «'+(o[v]&&o[v].label)+'» как итог?')) return;
    if (await ewrite(()=>DB.collection('decisions').doc(id).update(Object.assign({chosen:v}, eStamp())))) { elog({action:'choose', coll:'decisions', docId:id, title:x.question, diff:[{f:'Итог', from:x.chosen!=null&&o[x.chosen]?o[x.chosen].label:'', to:v!=null&&o[v]?o[v].label:'отменён'}]}, 'зафиксировал(а) итог в экономике'); if (v!=null) { const r = a.getBoundingClientRect(); confetti(r.left, r.top); gain(10, ic('Scale')+' Решение принято'); } else toast('Итог отменён'); }
  }
  if (k==='e-del') {
    const cur = efind(coll, id); if (!cur || !confirm('Удалить «'+ESCHEMA[coll].title(cur)+'»? Вернуть можно из журнала экономики.')) return;
    if (await ewrite(()=>DB.collection(coll).doc(id).delete())) { const snapshot = Object.assign({}, cur); delete snapshot.id; elog({action:'delete', coll, docId:id, title:ESCHEMA[coll].title(cur), snapshot}, 'удалил(а) из экономики'); TE = null; closeDrawer(); toast(ic('Trash2')+' Удалено. Вернуть можно из журнала.'); }
  }
  if (k==='e-restore') {
    const l = S.E.log.find(x=>x.id===id); if (!l || !l.snapshot || !ECOLLS.includes(l.coll) || efind(l.coll, l.docId)) return;
    const body = Object.assign({}, l.snapshot, eStamp()); delete body.id;
    if (await ewrite(()=>DB.collection(l.coll).doc(l.docId).set(body))) { elog({action:'restore', coll:l.coll, docId:l.docId, title:l.title||''}, 'восстановил(а) в экономике'); toast(ic('RotateCcw')+' Восстановлено'); }
  }
  if (k==='e-anchor') overlay(`<form class="pal" data-form="e-anchor"><div class="cap"><h2>${ic('Coins')} Якорь</h2><label class="fld"><span>Доход за час работы новичка, $</span><input class="input" name="a" type="number" inputmode="numeric" min="1" value="${esc(S.E.anchor)}" required></label><small style="color:var(--muted)">Все пометки «≈ N ч работы» считаются от этого числа — здесь и на старой странице.</small><div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn ghost" data-action="close-overlay">Отмена</button><button class="btn primary">Сохранить</button></div></div></form>`);
});
document.addEventListener('change', async e => {
  const t = e.target;
  if (t.dataset.action==='e-status') {
    const coll = t.dataset.coll, x = efind(coll, t.dataset.id); if (!x || x.status===t.value) return;
    const opts = coll==='params'?PARAM_STATUS:coll==='bugs'?BUG_STATUS:STAGE_STATUS;
    if (await ewrite(()=>DB.collection(coll).doc(x.id).update(Object.assign({status:t.value}, eStamp())))) {
      elog({action:'status', coll, docId:x.id, title:ESCHEMA[coll].title(x), diff:[{f:'Статус', from:lab(opts,x.status), to:lab(opts,t.value)}]}, 'сменил(а) статус в экономике');
      if (['agreed','done','fixed'].includes(t.value)) gain(5, ic('CircleCheck')+' '+esc(lab(opts,t.value)));
    }
  }
  if (t.id==='e-group') { UI.ef.group = t.value; paint(); }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id==='e-q') { UI.ef.q = t.value; paint(); }
  if (t.form && t.form.dataset.form==='e-note') UI.eDraft = t.value;
  if (TE && t.closest && t.closest('#te-grid')) { if (t.dataset.tc !== undefined) TE.columns[Number(t.dataset.tc)].name = t.value; else if (t.dataset.r !== undefined) teSet(Number(t.dataset.r), Number(t.dataset.c), t.value); }
});
document.addEventListener('paste', e => {
  const t = e.target; if (!TE || !t.classList || !t.classList.contains('te-in') || t.dataset.r === undefined) return;
  const text = (e.clipboardData || window.clipboardData).getData('text'); if (!/[\t\n]/.test(text)) return;
  e.preventDefault();
  const lines = text.replace(/\r/g,'').replace(/\n+$/,'').split('\n').map(l => l.split('\t'));
  const r0 = Number(t.dataset.r), c0 = Number(t.dataset.c), width = Math.max(...lines.map(l => l.length));
  while (TE.columns.length < c0 + width) TE.columns.push({id:teId('c'), name:''});
  while (TE.rowOrder.length < r0 + lines.length) TE.rowOrder.push(teId('r'));
  lines.forEach((l, dr) => l.forEach((v, dc) => teSet(r0+dr, c0+dc, v.trim())));
  renderTE(`[data-r="${r0}"][data-c="${c0}"]`); toast(`Вставлено: ${lines.length} × ${width}`);
});
document.addEventListener('keydown', e => {
  const t = e.target; if (!TE || e.key !== 'Enter' || !t.closest || !t.closest('#drawer')) return;
  if (t.name === 'title' && t.form && t.form.dataset.form==='e-table') { e.preventDefault(); const h = $('#te-grid [data-tc="0"]'); if (h) h.focus(); return; }
  if (!t.classList.contains('te-in')) return;
  e.preventDefault();
  if (t.dataset.tc !== undefined) { if (!TE.rowOrder.length) TE.rowOrder.push(teId('r')); renderTE(`[data-r="0"][data-c="${t.dataset.tc}"]`); return; }
  const r = Number(t.dataset.r) + (e.shiftKey ? -1 : 1), c = Number(t.dataset.c); if (r < 0) return;
  if (r >= TE.rowOrder.length) TE.rowOrder.push(teId('r'));
  renderTE(`[data-r="${r}"][data-c="${c}"]`);
});
document.addEventListener('submit', async e => {
  const f = e.target, k = f.dataset.form; if (!k || !k.startsWith('e-')) return;
  e.preventDefault();
  if (k==='e-save') eSave(f);
  if (k==='e-table') eSaveTable(f);
  if (k==='e-note') {
    const text = clip(f.t.value, 4000); if (!text) { toast('Напиши текст заметки.'); return; }
    if (await ewrite(()=>DB.collection('log').add({at:now(), by:S.me, action:'note', text}))) { UI.eDraft = ''; log('оставил(а) заметку в экономике', clip(text,80), 'econ'); gain(3, ic('MessageSquare')+' Заметка добавлена'); paint(); }
  }
  if (k==='e-anchor') {
    const v = Number(f.a.value); if (!(v > 0)) { toast(ic('CircleAlert')+' Якорь — положительное число'); return; }
    const from = S.E.anchor;
    if (await ewrite(()=>DB.doc('meta/settings').set(Object.assign({}, S.E.meta, {anchor:v}, eStamp())))) { elog({action:'update', coll:'meta', title:'Якорь', diff:[{f:'$ за час', from:nfmt.format(from||0), to:nfmt.format(v)}]}, 'изменил(а) якорь экономики'); closeOverlay(); toast(ic('Check')+' Якорь обновлён'); }
  }
});

/* ── формы ──────────────────────────────────── */
const inText = (name, label, val, extra='') => `<label class="fld"><span>${label}</span><input class="input" name="${name}" value="${esc(val??'')}" autocomplete="off" ${extra}></label>`;
const inArea = (name, label, val, rows=4) => `<label class="fld"><span>${label}</span><textarea class="input" name="${name}" rows="${rows}">${esc(val??'')}</textarea></label>`;
const inSelect = (name, label, opts, val) => `<label class="fld"><span>${label}</span><select class="input" name="${name}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(val??'')?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
const peopleOpts = () => [['','Не назначен'], ...Object.entries(S.people).sort((a,b)=>String(a[1].name).localeCompare(String(b[1].name))).map(([id,p])=>[id, (p.name||'Участник')+(id===S.me?' (вы)':'')])];
const deptOpts = () => DEPTS.map(d=>[d.id, d.name]);
/* выбор отделов задачи: первый выбранный — основной (цвет карточки) */
const deptsPick = ds => `<div class="fld"><span>Отделы — можно несколько</span><div class="dpick roles" role="group" aria-label="Отделы задачи">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="pick-depts" data-d="${d.id}" aria-pressed="${ds.includes(d.id)}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div>
  <input type="hidden" name="depts" value="${esc(ds.join(','))}"></div>`;
const formDepts = f => f.depts.value.split(',').filter(x=>D[x]);
const sizeOpts = () => Object.entries(SIZES).map(([k,v])=>[k, k+' · '+v]);

/* ── шторка ─────────────────────────────────── */
function openDrawer(ref, edit){
  UI.drawer = ref; UI.edit = !!edit; UI.openedAt = now();
  if (ref.startsWith('task:') && me().last !== ref.slice(5)) col('hub_people').doc(S.me).update({last:ref.slice(5)}).catch(()=>{});
  paintDrawer();
  const el = $('#drawer'); el.classList.add('open'); el.setAttribute('aria-hidden','false');
}
function closeDrawer(){ UI.drawer = null; UI.edit = false; TE = null; const el = $('#drawer'); el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
const drawerHead = (d, title, extra='') => `<div class="dr-h" style="--dc:${d?d.color:'var(--acc)'}"><span class="ph-ico" style="width:40px;height:40px">${ic(d?d.icon:'BookOpen')}</span><h2>${esc(title)}</h2>${extra}<button class="icon-btn" data-action="close-drawer" aria-label="Закрыть">${ic('X')}</button></div>`;
function linkChip(id, removable){
  const t = task(id), d = dec(id);
  const x = removable ? `<button class="mini-x" data-action="link-del" data-l="${esc(id)}" aria-label="Убрать связь">${ic('X')}</button>` : '';
  if (t) { const dd = D[t.dept]||DEPTS[0]; return `<span class="link" style="--dc:${dd.color}"><span data-open="task:${esc(t.id)}" style="display:inline-flex;gap:6px;align-items:center">${ic(dd.icon)} ${esc(clip(t.title,48))}</span>${x}</span>`; }
  if (d) return `<span class="link"><span data-go="decisions" style="display:inline-flex;gap:6px;align-items:center">${ic('Scale')} ${esc(clip(d.q,48))}</span>${x}</span>`;
  return '';
}
function drawerTask(t){
  const d = D[t.dept] || DEPTS[0];
  if (UI.edit) return drawerHead(d, 'Изменить задачу') + `<form class="dr-b form" data-form="task-edit" data-id="${esc(t.id)}">
    ${inText('title','Название — начни с глагола',t.title,'required maxlength="160"')}
    ${inText('tldr','Суть в одном предложении — зачем',t.tldr,'maxlength="240"')}
    ${deptsPick(tDepts(t))}
    ${inSelect('size','Размер',sizeOpts(),t.size)}
    ${inSelect('who','Ответственный',peopleOpts(),t.who||'')}
    ${inArea('details','Подробности',t.details,6)}
    <div class="form-foot"><button class="btn primary">${ic('Save')} Сохранить</button><button type="button" class="btn ghost" data-action="edit-cancel">Отмена</button><span class="sp"></span><button type="button" class="btn danger" data-action="task-del" data-id="${esc(t.id)}">${ic('Trash2')} Удалить</button></div>
  </form>`;
  const sub = t.sub||[], sd = sub.filter(s=>s.done).length;
  const back = S.tasks.filter(x=>(x.links||[]).includes(t.id)).map(x=>x.id);
  const links = [...new Set([...(t.links||[]), ...back])].filter(id=>task(id)||dec(id));
  const linkable = [...S.tasks.filter(x=>x.id!==t.id && !links.includes(x.id)).map(x=>[x.id,'Задача: '+clip(x.title,60)]), ...S.decisions.filter(x=>!links.includes(x.id)).map(x=>[x.id,'Решение: '+clip(x.q,60)])];
  const top = (me().top3||[]).includes(t.id);
  const files = S.files.filter(f=>f.task===t.id).sort((a,b)=>a.at-b.at);
  return drawerHead(d, t.title, `<button class="icon-btn" data-action="edit" aria-label="Изменить" title="Изменить">${ic('Pencil')}</button>`) + `
  <div class="dr-b">
    ${t.tldr?`<div class="tldr"><b>Суть</b>${esc(t.tldr)}</div>`:''}
    <div class="statusbar" role="group" aria-label="Статус">${COLS.map(([id,n])=>`<button data-action="set-status" data-id="${esc(t.id)}" data-s="${id}" aria-pressed="${t.status===id}">${n}</button>`).join('')}</div>
    <dl class="kv"><dt>${tDepts(t).length>1?'Отделы':'Отдел'}</dt><dd style="display:flex;gap:6px;flex-wrap:wrap">${dchips(t)}</dd>
      <dt>Ответственный</dt><dd style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${av(t.who)} ${esc(pname(t.who))}${t.who!==S.me?`<button class="btn sm ghost" data-action="take" data-id="${esc(t.id)}">${ic('UserCheck')} Взять себе</button>`:''}</dd>
      <dt>Размер</dt><dd><span class="size">${esc(t.size||'M')}</span> <small style="color:var(--muted)">${SIZES[t.size]||''}</small></dd>
      ${t.createdBy?`<dt>Создал(а)</dt><dd style="color:var(--text-2)">${esc(pname(t.createdBy))} · ${ago(t.createdAt)}</dd>`:''}</dl>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn sm primary" data-action="focus-start" data-id="${esc(t.id)}">${ic('Headphones')} Фокус 25 мин</button>
      <button class="btn sm" data-action="toggle-top" data-id="${esc(t.id)}">${top?ic('Star','filled')+' В «Моём дне»':ic('Star')+' В день'}</button>
      <button class="btn sm" data-action="task-chat" data-id="${esc(t.id)}" title="Чат задачи доступен всей команде">${ic('MessagesSquare')} ${S.chats.some(c=>c.task===t.id)?'Открыть чат':'Создать чат'}</button>
    </div>
    <div><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><p class="sub-h" style="margin:0">Файлы${files.length?` · ${files.length}`:''}</p><span style="flex:1"></span>${attachBtn('task-attach', t.id, 'Прикрепить')}</div>
      ${upBar('task:'+t.id)}<div class="files">${files.map(f=>fileChip(f, true)).join('') || '<small style="color:var(--muted)">Макеты, логи, скриншоты — до '+fsize(FILE_MAX)+' на файл.</small>'}</div></div>
    <div><p class="sub-h">Шаги${sub.length?` · ${sd}/${sub.length}`:''}</p>${sub.length?`<div class="mini-bar" style="margin:8px 0"><i style="width:${Math.round(sd/sub.length*100)}%"></i></div>`:''}
      <div class="cl">${sub.map((s,i)=>`<div class="row"><label class="${s.done?'done':''}"><input type="checkbox" data-action="step" data-id="${esc(t.id)}" data-i="${i}" ${s.done?'checked':''}><span>${esc(s.t)}</span></label><button class="mini-x" data-action="step-del" data-id="${esc(t.id)}" data-i="${i}" aria-label="Удалить шаг">${ic('X')}</button></div>`).join('')}</div>
      <form class="inline-add" data-form="step-add" data-id="${esc(t.id)}" style="margin-top:6px"><input class="input" name="s" placeholder="Добавить шаг — маленький и конкретный" autocomplete="off" maxlength="160"><button class="btn sm" aria-label="Добавить шаг">${ic('Plus')}</button></form></div>
    ${t.details?`<details class="more"><summary>Подробности</summary><div class="body">${esc(t.details)}</div></details>`:''}
    <div><p class="sub-h" style="margin-bottom:8px">Связано</p><div class="links">${links.map(id=>linkChip(id, (t.links||[]).includes(id))).join('')}</div>
      ${linkable.length?`<select class="input" data-action="link-add" data-id="${esc(t.id)}" aria-label="Связать" style="margin-top:8px"><option value="">${'＋ Связать с задачей или решением…'}</option>${linkable.map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select>`:''}</div>
    <div><p class="sub-h" style="margin-bottom:8px">Обсуждение</p><div class="list">${(t.comments||[]).map(c=>`<div class="comment">${av(c.by,26)}<div class="bd"><b>${esc(pname(c.by))}</b> <small>${ago(c.at)}</small><div style="white-space:pre-wrap">${esc(c.text)}</div></div></div>`).join('')}</div>
    <form data-form="comment" data-id="${esc(t.id)}" style="display:flex;gap:8px;margin-top:8px"><input class="input" name="c" placeholder="Написать комментарий…" autocomplete="off" maxlength="2000"><button class="btn" aria-label="Отправить">${ic('ArrowRight')}</button></form></div>
  </div>`;
}
function regForm(key, it){
  const r = REGS[key], d = D[key.split('/')[0]];
  const field = f => {
    const v = it ? it[f.k] : (f.k==='status' && f.o ? f.o[0][0] : '');
    if (f.t==='textarea') return inArea(f.k, f.l, v, 5);
    if (f.t==='select') return inSelect(f.k, f.l, [['','—'], ...f.o.map(o=>[o[0],o[0]])], v);
    if (f.t==='person') return inSelect(f.k, f.l, peopleOpts(), v||'');
    if (f.t==='url') return inText(f.k, f.l, v, 'type="url" placeholder="https://"');
    return inText(f.k, f.l, v, (f.req?'required ':'')+'maxlength="300"'+(f.mono?' style="font-family:var(--f-mono);font-size:13px"':''));
  };
  return drawerHead(d, it ? it.name : 'Новая запись: '+r.noun) + `<form class="dr-b form" data-form="reg-save" data-key="${key}" data-id="${it?esc(it.id):''}">
    ${r.fields.map(field).join('')}
    ${it && safeUrl(it.link) ? `<a class="btn" href="${esc(it.link)}" target="_blank" rel="noopener">${ic('ExternalLink')} Открыть макет</a>`:''}
    <div class="form-foot"><button class="btn primary">${ic('Save')} ${it?'Сохранить':'Добавить'}</button><button type="button" class="btn ghost" data-action="close-drawer">Отмена</button><span class="sp"></span>${it?`<button type="button" class="btn danger" data-action="reg-del" data-id="${esc(it.id)}">${ic('Trash2')} Удалить</button>`:''}</div>
    ${it&&it.updatedBy?`<small style="color:var(--muted)">Изменено: ${esc(pname(it.updatedBy))}, ${ago(it.updatedAt)}</small>`:''}
  </form>`;
}
function wikiDrawer(w){
  const pre = (!w && UI.wikiPre) || {};
  if (!w || UI.edit) return drawerHead(null, w ? 'Изменить статью' : 'Новая статья') + `<form class="dr-b form" data-form="wiki-save" data-id="${w?esc(w.id):''}">
    ${inText('title','Заголовок',w ? w.title : pre.title,'required maxlength="120"')}
    ${inText('tldr','Суть в одном предложении',w&&w.tldr,'maxlength="240"')}
    ${inArea('body','Текст — можно Markdown: # заголовок, **жирный**, - список, | таблица |',w ? w.body : pre.body,14)}
    <div class="form-foot"><button class="btn primary">${ic('Save')} Сохранить</button><button type="button" class="btn ghost" data-action="${w?'edit-cancel':'close-drawer'}">Отмена</button><span class="sp"></span>${w?`<button type="button" class="btn danger" data-action="wiki-del" data-id="${esc(w.id)}">${ic('Trash2')} Удалить</button>`:''}</div>
  </form>`;
  return drawerHead(null, w.title, `<button class="icon-btn" data-action="edit" aria-label="Изменить" title="Изменить">${ic('Pencil')}</button>`) + `<div class="dr-b">${w.tldr?`<div class="tldr"><b>Суть</b>${esc(w.tldr)}</div>`:''}<article class="md">${md(w.body||'')}</article>${w.updatedBy?`<small style="color:var(--muted)">Изменено: ${esc(pname(w.updatedBy))}, ${ago(w.updatedAt)}</small>`:''}</div>`;
}
function paintDrawer(){
  const ref = UI.drawer; if (!ref) return;
  const el = $('#drawer'); const [kind, id] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':')+1)];
  /* только что созданная запись может ещё не прийти из базы — ждём пару секунд, потом закрываем */
  const missing = () => { if (now()-UI.openedAt < 4000) { el.innerHTML = '<div class="loading"><span class="spin"></span>Открываем…</div>'; } else closeDrawer(); };
  let html = '';
  if (kind==='task') { const t = task(id); if (!t) return missing(); html = drawerTask(t); }
  else if (kind==='reg') { const it = regItem(id); if (!it) return missing(); html = regForm(it.key, it); }
  else if (kind==='regnew') html = regForm(id, null);
  else if (kind==='wiki') { const w = wikiItem(id); if (!w) return missing(); html = wikiDrawer(w); }
  else if (kind==='wikinew') html = wikiDrawer(null);
  else if (kind==='eedit') { const [c, x] = [id.slice(0, id.indexOf(':')), id.slice(id.indexOf(':')+1)]; html = S.E && eForm(c, x); if (!html) return missing(); }
  else if (kind==='enew') html = S.E ? eForm(id, null) : '';
  else if (kind==='etable') { html = S.E && eTableForm(id); if (!html) return missing(); }
  el.classList.toggle('wide', kind==='etable');
  el.innerHTML = html;
  if (kind==='etable') renderTE();
}
/* обновить шторку при изменениях: недописанный текст и курсор сохраняются; формы правки не трогаем */
function refreshDrawer(){
  if (!UI.drawer) return;
  if ($('#drawer .loading')) return paintDrawer();
  const force = UI.forceDrawer; UI.forceDrawer = false;
  if (!force && (UI.edit || /^(reg|regnew|wikinew|eedit|enew|etable):/.test(UI.drawer))) return;
  const a = document.activeElement, inside = a && $('#drawer').contains(a);
  const form = inside && a.form && a.form.dataset.form, name = inside && a.name, act = inside && a.dataset && a.dataset.action;
  const keep = {}; document.querySelectorAll('#drawer form[data-form] input[name], #drawer form[data-form] textarea[name]').forEach(i => { if (i.value) keep[i.form.dataset.form+'/'+i.name] = i.value; });
  const sel = inside && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null;
  paintDrawer();
  for (const [k,v] of Object.entries(keep)) { const [f,n] = k.split('/'); const i = $(`#drawer form[data-form="${f}"] [name="${n}"]`); if (i && !i.value) i.value = v; }
  const el = form ? $(`#drawer form[data-form="${form}"] [name="${name}"]`) : act ? $(`#drawer [data-action="${act}"]`) : null;
  if (el) { el.focus({preventScroll:true}); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} }
}

/* ── оверлеи: палитра, захват, формы, настройки ── */
function closeOverlay(){ $('#overlay').innerHTML = ''; UI.pal = null; }
function overlay(html){ UI.pal = null; $('#overlay').innerHTML = `<div class="overlay" data-action="overlay-bg">${html}</div>`; const f = $('#overlay input:not([type=hidden]),#overlay textarea'); if (f) f.focus(); }
function capture(){
  const cur = UI.route.startsWith('d/') ? UI.route.slice(2) : '';
  overlay(`<form class="pal" data-form="capture"><div class="cap"><h2><span class="hi">${ic('Lightbulb')}</span> Записать мысль</h2>
    <textarea class="input" name="t" placeholder="Что пришло в голову? Разберёшь потом." maxlength="1000"></textarea>
    <div class="dpick" role="group" aria-label="Отдел (необязательно)">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="pick-dept" data-d="${d.id}" aria-pressed="${d.id===cur}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div>
    <input type="hidden" name="d" value="${cur}">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint"><kbd>Enter</kbd> сохранить · <kbd>Shift</kbd>+<kbd>Enter</kbd> новая строка · <kbd>Esc</kbd> закрыть</span><span style="flex:1"></span><button class="btn primary">Во «Входящие»</button></div></div></form>`);
}
function newTask(status, dept, title, fromInbox){
  dept = dept || (UI.route.startsWith('d/') ? UI.route.slice(2) : (UI.filt.dept!=='all' && UI.filt.dept) || myDepts()[0] || 'dev');
  overlay(`<form class="pal" data-form="task-new" data-status="${status||'todo'}" data-inbox="${esc(fromInbox||'')}"><div class="cap"><h2>${ic('Plus')} Новая задача</h2>
    <input class="input" name="title" placeholder="Что сделать? Начни с глагола: «Починить…», «Добавить…»" value="${esc(title||'')}" required maxlength="160" autocomplete="off">
    <input class="input" name="tldr" placeholder="Суть в одном предложении — зачем это нужно" maxlength="240" autocomplete="off">
    ${deptsPick([dept])}
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <div class="seg" role="radiogroup" aria-label="Размер">${Object.entries(SIZES).map(([k,v])=>`<button type="button" data-action="pick-size" data-v="${k}" aria-pressed="${k==='M'}" title="${v}">${k} · ${v}</button>`).join('')}</div>
      <input type="hidden" name="size" value="M">
    </div>
    <label class="check-row"><input type="checkbox" name="mine" checked> Я ответственный</label>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint"><kbd>Enter</kbd> создать · <kbd>Esc</kbd> закрыть</span><span style="flex:1"></span><button class="btn primary">Создать</button></div></div></form>`);
}
function newDecision(dept){
  dept = dept || (UI.route.startsWith('d/') ? UI.route.slice(2) : 'econ');
  overlay(`<form class="pal" data-form="decision-new" style="max-height:85vh;overflow:auto"><div class="cap"><h2>${ic('Scale')} Новое решение</h2>
    ${inText('q','Вопрос','','required maxlength="200" placeholder="Например: «Комиссия отмыва денег»"')}
    ${inText('tldr','Суть — почему это важно','','maxlength="240"')}
    ${inSelect('dept','Отдел',deptOpts(),dept)}
    ${inArea('options','Варианты — по одному на строку, «Название — пояснение»','',5)}
    ${inText('rec','Рекомендуемый вариант (номер строки, пусто — нет)','','inputmode="numeric" maxlength="2"')}
    <div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn ghost" data-action="close-overlay">Отмена</button><button class="btn primary">Вынести на голосование</button></div></div></form>`);
}
function newChat(){
  overlay(`<form class="pal" data-form="chat-new"><div class="cap"><h2>${ic('MessagesSquare')} Новый чат</h2>
    <input class="input" name="title" placeholder="О чём чат? Например: «Созвон по экономике»" required maxlength="120" autocomplete="off">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint">Чат увидит вся команда · <kbd>Enter</kbd> создать</span><span style="flex:1"></span><button class="btn primary">Создать</button></div></div></form>`);
}
function palItems(q){
  q = q.trim().toLowerCase();
  const cmds = [
    ['Lightbulb','Записать мысль','Q',()=>capture()],
    ['Plus','Новая задача','',()=>newTask('todo')],
    ['Scale','Новое решение','',()=>newDecision()],
    ['Headphones','Фокус 25 минут','',()=>startFocus(me().last)],
    ['MessagesSquare','Новый чат','',()=>newChat()],
    ['Bot','Забронировать Claude','',()=>{ go('claude'); setTimeout(claudeBookForm, 80); }],
    ['SunMoon','Сменить тему','',()=>{ P.theme = {auto:'dark',dark:'light',light:'auto'}[P.theme]; applyPrefs(); savePrefs(); toast('Тема: '+{auto:'как в системе',dark:'тёмная',light:'светлая'}[P.theme]); }],
    ['Leaf','Спокойный режим вкл/выкл','',()=>{ P.calm = !P.calm; applyPrefs(); savePrefs(); toast(P.calm?'Спокойный режим: без конфетти и всплывающих XP':'Спокойный режим выключен'); }],
    ['Settings','Профиль и настройки','',()=>settings()]
  ].map(c=>({g:'Команды', ico:c[0], t:c[1], r:c[2], run:c[3]}));
  const pages = [['today','Sun','Мой день'],['inbox','Inbox','Входящие'],['tasks','LayoutGrid','Задачи'],['decisions','Scale','Решения'],['log','ScrollText','Журнал'],['people','Users','Люди'],['chats','MessagesSquare','Чаты'],['wiki','BookOpen','Вики'],['claude','Bot','Claude — график']]
    .map(p=>({g:'Разделы', ico:p[1], t:p[2], run:()=>go(p[0])}))
    .concat(DEPTS.flatMap(d=>[{g:'Разделы', ico:d.icon, t:d.name, run:()=>go('d/'+d.id)}].concat(d.tabs.slice(1).map(([id,n])=>({g:'Разделы', ico:d.icon, t:d.name+' → '+n, run:()=>go('d/'+d.id+'/'+id)})))));
  const tasks = S.tasks.map(t=>({g:'Задачи', ico:(D[t.dept]||DEPTS[0]).icon, t:t.title, r:colName(t.status), extra:t.tldr, run:()=>openDrawer('task:'+t.id)}));
  const decs = S.decisions.map(d=>({g:'Решения', ico:'Scale', t:d.q, extra:d.tldr, run:()=>go('decisions')}));
  const regs = S.reg.map(r=>({g:'Записи отделов', ico:(D[r.key.split('/')[0]]||DEPTS[0]).icon, t:r.name, extra:r.tldr||r.what||'', run:()=>{ go('d/'+r.key); setTimeout(()=>openDrawer('reg:'+r.id), 120); }}));
  const chats = S.chats.map(c=>({g:'Чаты', ico:'MessagesSquare', t:c.title, extra:c.lastText, run:()=>go('chats/'+c.id)}));
  const wiki = S.wiki.map(w=>({g:'Вики', ico:'BookOpen', t:w.title, extra:w.tldr, run:()=>openDrawer('wiki:'+w.id)}));
  const people = Object.entries(S.people).map(([id,p])=>({g:'Люди', ico:'User', t:p.name, extra:p.role, run:()=>go('people')}));
  const eco = !S.E ? [] : [
    ...S.E.params.map(p=>({g:'Экономика', ico:'Gauge', t:p.name, r:lab(PARAM_STATUS,p.status), extra:[p.where,p.current,p.proposed,p.group].join(' '), run:()=>{ go('d/econ/params'); setTimeout(()=>openDrawer('eedit:params:'+p.id), 120); }})),
    ...S.E.bugs.map(b=>({g:'Экономика', ico:'Bug', t:b.title, r:lab(BUG_STATUS,b.status), extra:b.where, run:()=>{ go('d/econ/bugs'); setTimeout(()=>openDrawer('eedit:bugs:'+b.id), 120); }})),
    ...S.E.stages.map(x=>({g:'Экономика', ico:'ListOrdered', t:x.title, r:lab(STAGE_STATUS,x.status), run:()=>go('d/econ/stages')})),
    ...S.E.sections.map(x=>({g:'Экономика', ico:'BookOpen', t:x.title, extra:x.body, run:()=>go('d/econ/plan')})),
    ...S.E.decisions.map(x=>({g:'Экономика', ico:'Scale', t:x.question, run:()=>go('d/econ/edec')}))];
  if (!q) return [...cmds, ...pages.slice(0,7), ...tasks.filter(t=>true).slice(0,4)];
  return [...cmds, ...pages, ...tasks, ...decs, ...chats, ...regs, ...wiki, ...people, ...eco].filter(x=>(x.t+' '+(x.extra||'')).toLowerCase().includes(q)).slice(0,40);
}
function palette(){
  UI.pal = {q:'', i:0, items:palItems('')};
  $('#overlay').innerHTML = `<div class="overlay" data-action="overlay-bg"><div class="pal" role="dialog" aria-label="Командная палитра"><input id="pal-in" placeholder="Найти задачу, раздел, запись или команду…" autocomplete="off"><div class="pal-list" id="pal-list" role="listbox"></div><div class="pal-f"><span><kbd>↑</kbd><kbd>↓</kbd> выбрать</span><span><kbd>Enter</kbd> открыть</span><span><kbd>Esc</kbd> закрыть</span></div></div></div>`;
  paintPal(); $('#pal-in').focus();
}
function paintPal(){
  const Pp = UI.pal; let g = '', html = '';
  Pp.items.forEach((x,i) => { if (x.g!==g) { g = x.g; html += `<div class="pal-g">${g}</div>`; } html += `<div class="pal-i" role="option" data-pal="${i}" aria-selected="${i===Pp.i}"><span class="ico">${ic(x.ico)}</span><span>${esc(x.t)}</span>${x.r?`<span class="r">${esc(x.r)}</span>`:''}</div>`; });
  $('#pal-list').innerHTML = html || '<div class="pal-g">Ничего не нашлось. Enter — записать как мысль</div>';
  const sel = $('#pal-list [aria-selected="true"]'); if (sel) sel.scrollIntoView({block:'nearest'});
}
function runPal(i){
  const Pp = UI.pal; const x = Pp.items[i];
  if (!x) { const q = Pp.q.trim(); if (q) { closeOverlay(); addInbox(q, null); } return; }
  closeOverlay(); x.run();
}
function settings(){
  const m = me();
  const seg = (k, opts) => `<div class="seg">${opts.map(([v,n])=>`<button data-action="pref" data-k="${k}" data-v="${v}" aria-pressed="${P[k]===v}">${n}</button>`).join('')}</div>`;
  overlay(`<div class="pal settings" role="dialog" aria-label="Профиль и настройки" style="max-height:88vh;overflow:auto"><div class="cap">
    <h2>${ic('User')} Профиль</h2>
    <form class="form" data-form="profile">
      <div class="fld-row">${inText('name','Имя',m.name,'required maxlength="40"')}${inText('role','Роль в команде',m.role,'maxlength="60" placeholder="Например: сервер, C#"')}</div>
      <div class="fld"><span style="font-size:12.5px;font-weight:700;color:var(--text-2)">Мои отделы</span><div class="links">${myDepts().map(dchip).join('') || '<small style="color:var(--muted)">Пока не назначены</small>'}</div>${askAdmin()}</div>
      <div class="fld"><span style="font-size:12.5px;font-weight:700;color:var(--text-2)">Цвет аватарки</span><div class="colors">${PERSON_COLORS.map(c=>`<button type="button" data-action="my-color" data-c="${c}" style="background:${c}" aria-pressed="${safeColor(m.color)===c}" aria-label="Цвет ${c}"></button>`).join('')}</div></div>
      <div style="display:flex;justify-content:flex-end"><button class="btn primary">${ic('Save')} Сохранить профиль</button></div>
    </form>
    <h2 style="margin-top:8px">${ic('Settings')} Отображение</h2>
    <div class="set-row"><div>Тема</div>${seg('theme',[['auto','Авто'],['dark','Тёмная'],['light','Светлая']])}</div>
    <div class="set-row"><div>Размер текста</div>${seg('fs',[['s','S'],['m','M'],['l','L']])}</div>
    <div class="set-row"><div>Плотность</div>${seg('density',[['normal','Свободно'],['compact','Плотно']])}</div>
    <div class="set-row"><div>Спокойный режим<small>Без конфетти и всплывающих XP. Прогресс остаётся.</small></div>${seg('calm',[[false,'Выкл'],[true,'Вкл']])}</div>
    <div><p class="sub-h" style="margin:10px 0 8px">Отделы в боковой панели</p><div class="dpick">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="toggle-dept" data-d="${d.id}" aria-pressed="${!P.hidden.includes(d.id)}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div><small style="color:var(--muted)">Скрой то, чем не занимаешься. Меньше шума. Настройки отображения хранятся в этом браузере.</small></div>
    <div style="display:flex;justify-content:flex-end"><button class="btn" data-action="close-overlay">Готово</button></div></div></div>`);
}
function applyPrefs(){
  const r = document.documentElement;
  if (P.theme==='auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', P.theme);
  r.setAttribute('data-fs', P.fs); r.setAttribute('data-density', P.density); r.setAttribute('data-calm', P.calm?'1':'0');
}

/* ── действия с данными ─────────────────────── */
function setStatus(id, s, x, y){
  const t = task(id); if (!t || t.status===s) return;
  const patch = Object.assign({status:s}, stamp());
  if (s==='done') { patch.doneAt = now(); patch.doneBy = S.me; }
  else if (t.status==='done') { patch.doneAt = FV().delete(); patch.doneBy = FV().delete(); }
  write(()=>col('hub_tasks').doc(id).update(patch)).then(ok => {
    if (!ok) return;
    if (s==='done') { log('закрыл(а) задачу', t.title, t.dept); confetti(x ?? innerWidth/2, y ?? innerHeight/2); gain(XP_BY_SIZE[t.size]||10, ic('CircleCheck')+' Готово: '+esc(t.title)); }
    else log('перевёл(а) в «'+colName(s)+'»', t.title, t.dept);
  });
}
async function createTask(f){
  const title = clip(f.title.value,160); if (!title) return;
  const ref = col('hub_tasks').doc(), depts = formDepts(f), dept = depts[0]; if (!dept) return;
  const ok = await write(()=>ref.set({title, tldr:clip(f.tldr.value,240), details:'', dept, depts, status:f.dataset.status||'todo', size:f.size.value, who:f.mine.checked?S.me:null, links:[], sub:[], comments:[], createdAt:now(), createdBy:S.me, updatedAt:now(), updatedBy:S.me}));
  if (!ok) return;
  if (f.dataset.inbox) col('hub_inbox').doc(f.dataset.inbox).delete().catch(()=>{});
  closeOverlay(); log('создал(а) задачу', title, dept);
  if (!depts.some(canSee)) { gain(3, ic('Plus')+' Задача передана: '+depts.map(x=>'«'+esc(D[x].name)+'»').join(', ')+'. Её видят только участники этих отделов.'); return; }
  gain(3, ic('Plus')+' Задача создана'); openDrawer('task:'+ref.id);
}
function addInbox(text, dept){
  write(()=>col('hub_inbox').add({text:clip(text,1000), at:now(), by:S.me, dept:dept||null})).then(ok => ok && gain(2, ic('Lightbulb')+' Записано во «Входящие»'));
}
function startFocus(id){
  if (!id || !task(id)) { const m = me(); id = (m.top3||[]).find(x=>task(x) && task(x).status!=='done') || (S.tasks.find(t=>t.status!=='done' && t.who===S.me) || S.tasks.find(t=>t.status!=='done') || {}).id || null; }
  patchMe({focus:{task:id, until:now()+25*60e3}, last:id}).then(ok => ok && toast(ic('Headphones')+' Фокус 25 минут. Коллеги видят, что ты работаешь.'));
}
const updTask = (id, patch) => { if (UI.drawer==='task:'+id) UI.forceDrawer = true; return write(()=>col('hub_tasks').doc(id).update(Object.assign(patch, stamp()))); };

document.addEventListener('click', e => {
  if (document.body.classList.contains('locked')) return;
  const a = e.target.closest('[data-action]'), go_ = e.target.closest('[data-go]'), op = e.target.closest('[data-open]'), pi = e.target.closest('[data-pal]');
  if (pi) { runPal(Number(pi.dataset.pal)); return; }
  if (a && a.tagName!=='SELECT') {
    const k = a.dataset.action, id = a.dataset.id;
    if (k==='overlay-bg') { if (e.target===a) closeOverlay(); return; }
    if (k==='check' || k==='step') return; // обрабатываются в change
    e.stopPropagation();
    switch (k) {
      case 'open-nav': document.body.classList.add('nav-open'); break;
      case 'close-nav': document.body.classList.remove('nav-open'); break;
      case 'palette': palette(); break;
      case 'capture': capture(); break;
      case 'settings': settings(); break;
      case 'close-overlay': closeOverlay(); break;
      case 'close-drawer': closeDrawer(); break;
      case 'edit': UI.edit = true; paintDrawer(); break;
      case 'edit-cancel': UI.edit = false; paintDrawer(); break;
      case 'toggle-done': { const t = task(id); const r = a.getBoundingClientRect(); setStatus(id, t.status==='done'?'todo':'done', r.left+11, r.top+11); break; }
      case 'set-status': { const r = a.getBoundingClientRect(); setStatus(id, a.dataset.s, r.left+r.width/2, r.top); break; }
      case 'take': { const t = task(id); updTask(id, {who:S.me}).then(ok => ok && log('взял(а) задачу', t.title, t.dept)); break; }
      case 'toggle-top': { const top = (me().top3||[]).filter(x=>task(x)); const i = top.indexOf(id);
        if (i>=0) top.splice(i,1); else { if (top.filter(x=>task(x).status!=='done').length>=3) { toast('В «Моём дне» максимум 3 задачи. Сначала закрой или убери одну.'); break; } top.push(id); }
        patchMe({top3:top}); break; }
      case 'step-del': { const t = task(id); const sub = (t.sub||[]).filter((_,i)=>i!==Number(a.dataset.i)); updTask(id, {sub}); break; }
      case 'link-del': { const t = task(UI.drawer.slice(5)); if (t) updTask(t.id, {links:(t.links||[]).filter(x=>x!==a.dataset.l)}); break; }
      case 'task-del': { const t = task(id); if (!confirm('Удалить задачу «'+t.title+'»? Это нельзя отменить.')) break; write(()=>col('hub_tasks').doc(id).delete()).then(ok => { if (ok) { log('удалил(а) задачу', t.title, t.dept); closeDrawer(); deleteFiles(S.files.filter(f=>f.task===id).map(f=>f.id)).catch(()=>{}); } }); break; }
      case 'vote': { const d = dec(id); const i = Number(a.dataset.i); const cur = (d.votes||{})[S.me];
        write(()=>col('hub_decisions').doc(id).update({['votes.'+S.me]: cur===i ? FV().delete() : i, updatedAt:now()})).then(ok => { if (ok && cur==null) { log('проголосовал(а) в решении', d.q, d.dept); gain(5, ic('Vote')+' Голос учтён'); } }); break; }
      case 'accept': { const d = dec(id); const i = Number(a.dataset.i); if (!confirm('Зафиксировать «'+d.options[i].t+'» как итог?')) break; const r = a.getBoundingClientRect();
        write(()=>col('hub_decisions').doc(id).update({chosen:i, chosenBy:S.me, chosenAt:now(), updatedAt:now()})).then(ok => { if (ok) { log('принял(а) решение', d.q+' → '+d.options[i].t, d.dept); confetti(r.left, r.top); gain(10, ic('Scale')+' Решение принято'); } }); break; }
      case 'reopen': { const d = dec(id); write(()=>col('hub_decisions').doc(id).update({chosen:null, chosenBy:null, chosenAt:null})).then(ok => ok && log('переоткрыл(а) решение', d.q, d.dept)); break; }
      case 'dec-del': { const d = dec(id); if (!confirm('Удалить решение «'+d.q+'»?')) break; write(()=>col('hub_decisions').doc(id).delete()).then(ok => ok && log('удалил(а) решение', d.q, d.dept)); break; }
      case 'new-task': newTask(a.dataset.status, a.dataset.dept); break;
      case 'new-decision': newDecision(a.dataset.dept); break;
      case 'filt-small': UI.filt.small = !UI.filt.small; paint(); break;
      case 'filt-mine': UI.filt.mine = !UI.filt.mine; paint(); break;
      case 'inbox-del': write(()=>col('hub_inbox').doc(id).delete()); break;
      case 'inbox-task': { const it = S.inbox.find(i=>i.id===id); if (it) newTask('inbox', it.dept, it.text, it.id); break; }
      case 'pick-dept': { const f = a.closest('form'); const was = a.getAttribute('aria-pressed')==='true'; f.querySelectorAll('[data-action="pick-dept"]').forEach(b=>b.setAttribute('aria-pressed','false')); if (!was) a.setAttribute('aria-pressed','true'); f.d.value = was?'':a.dataset.d; f.t.focus(); break; }
      case 'pick-depts': { const f = a.closest('form'); let ds = formDepts(f); const on = ds.includes(a.dataset.d);
        if (on && ds.length===1) { toast(ic('CircleAlert')+' Нужен хотя бы один отдел'); break; }
        ds = on ? ds.filter(x=>x!==a.dataset.d) : [...ds, a.dataset.d]; f.depts.value = ds.join(','); a.setAttribute('aria-pressed', String(!on)); break; }
      case 'pick-size': { const f = a.closest('form'); f.querySelectorAll('[data-action="pick-size"]').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); f.size.value = a.dataset.v; break; }
      case 'pref': { let v = a.dataset.v; if (v==='true') v = true; if (v==='false') v = false; P[a.dataset.k] = v; applyPrefs(); savePrefs(); a.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); break; }
      case 'toggle-dept': { const i = P.hidden.indexOf(a.dataset.d); if (i>=0) P.hidden.splice(i,1); else P.hidden.push(a.dataset.d); savePrefs(); a.setAttribute('aria-pressed', String(i>=0)); paint(); break; }
      case 'set-dept': case 'set-all-depts': { if (!isAdmin()) break; const uid = a.dataset.uid, p = S.people[uid]; if (!p) break;
        let ds; if (k==='set-all-depts') ds = a.dataset.v==='1' ? DEPTS.map(d=>d.id) : [];
        else { const s = new Set(p.depts||[]); s.has(a.dataset.d) ? s.delete(a.dataset.d) : s.add(a.dataset.d); ds = DEPTS.map(d=>d.id).filter(x=>s.has(x)); }
        write(()=>col('hub_people').doc(uid).update({depts:ds})).then(ok => ok && log('назначил(а) отделы: '+(ds.length===DEPTS.length?'все':ds.map(x=>D[x].name).join(', ')||'нет'), p.name)); break; }
      case 'set-admin': { if (!isAdmin()) break; const uid = a.dataset.uid, p = S.people[uid]; if (!p) break; const on = p.admin!==true;
        if (!on && uid===S.me && !confirm('Снять с себя роль руководителя? Вернуть её сможет только другой руководитель.')) break;
        if (!on && Object.values(S.people).filter(x=>x.admin===true).length<=1) { toast(ic('CircleAlert')+' Это последний руководитель — сначала назначь другого'); break; }
        if (on && !confirm('Сделать '+p.name+' руководителем? Он(а) сможет назначать отделы всем.')) break;
        write(()=>col('hub_people').doc(uid).update({admin:on})).then(ok => ok && log(on?'сделал(а) руководителем':'снял(а) роль руководителя', p.name)); break; }
      case 'my-color': { a.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); patchMe({color:a.dataset.c}); break; }
      case 'focus-start': startFocus(id); break;
      case 'focus-stop': patchMe({focus:null}).then(ok => ok && toast('Фокус остановлен')); break;
      case 'reg-del': { const it = regItem(id); if (!confirm('Удалить «'+it.name+'»?')) break; write(()=>col('hub_reg').doc(id).delete()).then(ok => { if (ok) { log('удалил(а) запись', it.name, it.key.split('/')[0]); closeDrawer(); } }); break; }
      case 'check-reset': { const items = S.reg.filter(x=>x.key===a.dataset.key && x.done); if (!confirm('Снять все отметки чеклиста?')) break; const b = DB.batch(); items.forEach(x=>b.update(col('hub_reg').doc(x.id), {done:false})); write(()=>b.commit()); break; }
      case 'wiki-new': UI.wikiPre = null; openDrawer('wikinew:', true); break;
      case 'file-md': openMdFile(id); break;
      case 'file-dl': downloadFile(id); break;
      case 'md-mode': if (MDR) { MDR.raw = !!a.dataset.v; mdReader(); } break;
      case 'md-wiki': if (MDR) { const r = MDR; if (r.text.length > 20000) toast(ic('CircleAlert')+' В статью влезает 20 000 знаков — остальное обрежется');
        UI.wikiPre = {title:mdTitle(r.text, r.name), body:r.text.slice(0, 20000)}; closeOverlay(); go('wiki'); openDrawer('wikinew:', true); } break;
      case 'wiki-del': { const w = wikiItem(id); if (!confirm('Удалить статью «'+w.title+'»?')) break; write(()=>col('hub_wiki').doc(id).delete()).then(ok => { if (ok) { log('удалил(а) статью', w.title); closeDrawer(); } }); break; }
      case 'file-get': downloadFile(id); break;
      case 'file-del': { const f = S.files.find(x=>x.id===id); if (!f || !confirm('Удалить файл «'+f.name+'»?')) break; write(()=>deleteFiles([id])); break; }
      case 'task-chat': openTaskChat(id); break;
      case 'chat-new': newChat(); break;
      case 'chat-del': { const c = chat(id); if (!c || !confirm('Удалить чат «'+c.title+'» со всеми сообщениями?')) break;
        write(async () => { const ms = await col('hub_msgs').where('chat','==',id).get(); const fids = ms.docs.flatMap(d=>d.data().files||[]);
          for (let i=0;i<ms.docs.length;i+=400) { const b = DB.batch(); ms.docs.slice(i,i+400).forEach(d=>b.delete(d.ref)); await b.commit(); }
          await deleteFiles(fids); await col('hub_chats').doc(id).delete(); }).then(ok => { if (ok) { log('удалил(а) чат', c.title); go('chats'); } }); break; }
      case 'msg-del': { const m = S.msgs.find(x=>x.id===id); if (!m || !confirm('Удалить сообщение?')) break; write(async () => { await col('hub_msgs').doc(id).delete(); await deleteFiles(m.files||[]); }); break; }
      case 'claude-past': UI.cpast = !UI.cpast; paint(); break;
      case 'claude-day': UI.cday = Number(a.dataset.v); paint(); break;
      case 'claude-book': claudeBookForm(); break;
      case 'claude-slot': { const s = Number(a.dataset.s); bookClaude(s, s+3600e3, ''); break; }
      case 'claude-now': { const s = nowMin(); bookClaude(s, s+Number(a.dataset.n)*SLOT, a.dataset.focus ? 'Фокус-режим' : '').then(ok => { if (ok && a.dataset.focus) setTimeout(claudeFocus, 400); }); break; }
      case 'claude-focus': claudeFocus(); break;
      case 'claude-cancel': { const b = S.claude.find(x=>x.id===id); if (!b) break; const running = b.start<=now();
        if (!confirm(running ? 'Освободить Claude прямо сейчас?' : 'Отменить бронь '+hhmm(b.start)+'–'+hhmm(b.end)+'?')) break;
        write(()=> running ? col('hub_claude').doc(id).update({end:now()}) : col('hub_claude').doc(id).delete()).then(ok => { if (ok && running && (me().focus||{}).claude) patchMe({focus:null}); }); break; }
      case 'claude-end': write(()=>col('hub_claude').doc(id).update({end:now()})).then(ok => { if (ok) { closeOverlay(); patchMe({focus:null}); log('освободил(а) Claude', ''); toast(ic('Bot')+' Claude свободен. Спасибо!'); } }); break;
      case 'claude-extend': { const b = S.claude.find(x=>x.id===id); if (!b) break; const e = b.end+SLOT;
        if (e-b.start > CLAUDE_MAX) { toast('Одна бронь — не больше 4 часов'); break; }
        if (!claudeFree(b.end, e, id)) { toast(ic('CircleAlert')+' Дальше Claude уже забронирован'); break; }
        write(()=>col('hub_claude').doc(id).update({end:e})).then(ok => { if (ok) { patchMe({focus:{task:null, claude:true, until:e}}); setTimeout(claudeFocus, 300); } }); break; }
      case 'logout': if (confirm('Выйти из аккаунта?')) { patchMe({seen:0}).finally(()=>AUTH.signOut()); } break;
    }
    return;
  }
  if (go_) { e.stopPropagation(); go(go_.dataset.go); return; }
  if (op) { openDrawer(op.dataset.open); return; }
});
document.addEventListener('change', e => {
  const a = e.target;
  if (a.dataset.action==='filt-dept') { UI.filt.dept = a.value; paint(); }
  if (a.dataset.action==='md-local' && a.files.length) { const file = a.files[0]; a.value = '';
    if (file.size > MD_MAX) toast(ic('CircleAlert')+' Файл больше '+fsize(MD_MAX));
    else file.text().then(t => openMd(file.name, t)).catch(e => toast(ic('CircleAlert')+' Не открылось: '+esc(errText(e)))); }
  if (a.dataset.action==='task-attach' && a.files.length) { const id = a.dataset.id, list = [...a.files]; a.value = '';
    uploadFiles(list, {task:id}).then(ids => { if (ids.length) { const t = task(id); if (t) log('прикрепил(а) '+plural(ids.length,'файл','файла','файлов')+' к задаче', t.title, t.dept); toast(ic('Paperclip')+' Прикреплено: '+ids.length); } }); }
  if (a.dataset.action==='chat-attach' && a.files.length) { const id = a.dataset.id, list = [...a.files]; a.value = '';
    uploadFiles(list, {chat:id}).then(ids => { if (ids.length) sendMsg(id, '', ids); }); }
  if (a.name==='day' && a.form && a.form.dataset.form==='claude-book') { a.form.from.innerHTML = claudeTimes(Number(a.value)).map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join(''); }
  if (a.dataset.action==='check') { const it = regItem(a.dataset.id); write(()=>col('hub_reg').doc(a.dataset.id).update({done:a.checked, updatedAt:now(), updatedBy:S.me})).then(ok => { if (ok && a.checked) { log('отметил(а) пункт', it.name, it.key.split('/')[0]); gain(2, ic('ListChecks')+' Отмечено'); } }); }
  if (a.dataset.action==='step') { const t = task(a.dataset.id); const sub = (t.sub||[]).map((s,i)=>i===Number(a.dataset.i)?{t:s.t, done:a.checked}:s); updTask(t.id, {sub}).then(ok => ok && a.checked && gain(2, ic('ListChecks')+' Шаг выполнен')); }
  if (a.dataset.action==='link-add' && a.value) { const t = task(a.dataset.id); updTask(t.id, {links:[...new Set([...(t.links||[]), a.value])]}); }
});
document.addEventListener('submit', async e => {
  const f = e.target; if (!f.dataset.form) return; e.preventDefault();
  const k = f.dataset.form;
  if (k==='capture') { const t = f.t.value.trim(); if (!t) return; closeOverlay(); addInbox(t, f.d.value); }
  if (k==='task-new') createTask(f);
  if (k==='chat-new') { const title = clip(f.title.value,120); if (!title) return; const ref = col('hub_chats').doc();
    const ok = await write(()=>ref.set({title, task:null, by:S.me, createdAt:now(), lastAt:null, lastBy:null, lastText:''}));
    if (ok) { closeOverlay(); log('создал(а) чат', title); go('chats/'+ref.id); } }
  if (k==='msg') { const id = f.dataset.id, text = f.m.value; if (!text.trim()) return; f.m.value = ''; UI.chatDraft[id] = '';
    const ok = await sendMsg(id, text.trim()); if (!ok) { f.m.value = text; UI.chatDraft[id] = text; } const i = $('#chat-in'); if (i) i.focus(); }
  if (k==='claude-book') { const s = Number(f.from.value); if (!s) return; const ok = await bookClaude(s, s+Number(f.dur.value), f.note.value);
    if (ok) { UI.cday = Number(f.day.value); closeOverlay(); paint(); } }
  if (k==='comment') { const t = clip(f.c.value,2000); if (!t) return; const tk = task(f.dataset.id); f.c.value = '';
    updTask(tk.id, {comments:FV().arrayUnion({by:S.me, text:t, at:now()})}).then(ok => { if (ok) { log('прокомментировал(а)', tk.title, tk.dept); gain(3, ic('MessageSquare')+' Комментарий добавлен'); } }); }
  if (k==='step-add') { const t = clip(f.s.value,160); if (!t) return; const tk = task(f.dataset.id); updTask(tk.id, {sub:[...(tk.sub||[]), {t, done:false}]}).then(ok => { if (ok) setTimeout(()=>{ const i = $('#drawer [data-form="step-add"] input'); if (i) i.focus(); }, 60); }); f.s.value = ''; }
  if (k==='task-edit') { const t = task(f.dataset.id); const title = clip(f.title.value,160); if (!title) return;
    const ds = formDepts(f); if (!ds.length) return;
    const ok = await updTask(t.id, {title, tldr:clip(f.tldr.value,240), details:clip(f.details.value,8000), dept:ds[0], depts:ds, size:f.size.value, who:f.who.value||null});
    if (ok) { log('изменил(а) задачу', title, ds[0]); UI.edit = false; if (seeTask({dept:ds[0], depts:ds})) paintDrawer(); else closeDrawer(); } }
  if (k==='decision-new') {
    const q = clip(f.q.value,200); const options = f.options.value.split('\n').map(l=>l.trim()).filter(Boolean).slice(0,8).map(l=>{ const m = l.split(/\s+[—–-]\s+/); return {t:clip(m[0],120), d:clip(m.slice(1).join(' — '),240)}; });
    if (!q) return; if (options.length < 2) { toast(ic('CircleAlert')+' Нужно хотя бы два варианта'); return; }
    const rec = parseInt(f.rec.value,10); const dept = f.dept.value;
    const ok = await write(()=>col('hub_decisions').add({q, tldr:clip(f.tldr.value,240), dept, options, rec:rec>=1&&rec<=options.length?rec-1:-1, votes:{}, chosen:null, createdAt:now(), createdBy:S.me}));
    if (ok) { closeOverlay(); log('вынес(ла) на голосование', q, dept); gain(5, ic('Scale')+' Решение вынесено на голосование'); if (UI.route!=='decisions' && !UI.route.startsWith('d/')) go('decisions'); } }
  if (k==='reg-save') {
    const key = f.dataset.key, r = REGS[key], id = f.dataset.id; const data = {};
    for (const fl of r.fields) data[fl.k] = fl.t==='textarea' ? clip(f[fl.k].value,8000) : fl.t==='url' ? (safeUrl(f[fl.k].value.trim()) || '') : clip(f[fl.k].value,300);
    if (!data.name) return;
    const dept = key.split('/')[0];
    const ok = id ? await write(()=>col('hub_reg').doc(id).update(Object.assign(data, stamp())))
                  : await write(()=>col('hub_reg').add(Object.assign(data, {key, createdAt:now(), createdBy:S.me}, stamp())));
    if (ok) { log(id?'изменил(а) запись':'добавил(а) запись', data.name, dept); if (!id) gain(3, ic('Plus')+' Запись добавлена'); closeDrawer(); } }
  if (k==='wiki-save') {
    const data = {title:clip(f.title.value,120), tldr:clip(f.tldr.value,240), body:clip(f.body.value,20000)}; if (!data.title) return;
    const id = f.dataset.id;
    if (id) { const ok = await write(()=>col('hub_wiki').doc(id).update(Object.assign(data, stamp()))); if (ok) { log('изменил(а) статью', data.title); UI.edit = false; paintDrawer(); } }
    else { const ref = col('hub_wiki').doc(); const ok = await write(()=>ref.set(Object.assign(data, {createdAt:now(), createdBy:S.me}, stamp()))); if (ok) { log('написал(а) статью', data.title); gain(5, ic('BookOpen')+' Статья добавлена'); openDrawer('wiki:'+ref.id); } } }
  if (k==='profile') { const name = clip(f.name.value,40); if (!name) return; patchMe({name, role:clip(f.role.value,60)}).then(ok => { if (ok) { toast(ic('Check')+' Профиль сохранён'); if (AUTH.currentUser) AUTH.currentUser.updateProfile({displayName:name}).catch(()=>{}); } }); }
});
/* в палитре выделение идёт за мышью. Сразу после листания стрелками наведение игнорируется:
   список прокручивается под неподвижным курсором, и выделение не должно прыгать назад */
let palKeyAt = 0, palMouse = '';
function palHover(e, moved){
  const it = UI.pal && e.target.closest && e.target.closest('[data-pal]'); if (!it) return;
  if (!moved && now()-palKeyAt < 500) return;
  const i = Number(it.dataset.pal); if (i===UI.pal.i) return;
  UI.pal.i = i;
  document.querySelectorAll('#pal-list [data-pal]').forEach(x => x.setAttribute('aria-selected', String(x===it)));
}
document.addEventListener('mouseover', e => palHover(e, false));
document.addEventListener('mousemove', e => { const p = e.screenX+','+e.screenY; if (p===palMouse) return; palMouse = p; palHover(e, true); });
document.addEventListener('input', e => { if (e.target.id==='chat-in') { UI.chatDraft[e.target.form.dataset.id] = e.target.value; return; } });
/* картинку из буфера обмена можно сразу отправить в чат */
document.addEventListener('paste', e => {
  if (e.target.id!=='chat-in') return;
  const files = [...(e.clipboardData && e.clipboardData.files || [])]; if (!files.length) return;
  e.preventDefault(); const id = e.target.form.dataset.id;
  uploadFiles(files.map((f,i)=>f.name && f.name!=='image.png' ? f : new File([f], 'скриншот-'+new Date().toISOString().slice(0,19).replace(/[T:]/g,'-')+(i?'-'+i:'')+'.png', {type:f.type})), {chat:id}).then(ids => { if (ids.length) sendMsg(id, '', ids); });
});
document.addEventListener('input', e => { if (e.target.id==='pal-in') { UI.pal.q = e.target.value; UI.pal.items = palItems(e.target.value); UI.pal.i = 0; paintPal(); } });
document.addEventListener('keydown', e => {
  if (document.body.classList.contains('locked')) return;
  if (e.key==='Enter' && e.target.matches('[data-go]:not(button),[data-open]:not(button)')) { e.preventDefault(); e.target.click(); return; }
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k') { e.preventDefault(); UI.pal ? closeOverlay() : palette(); return; }
  if (e.key==='Escape') { if ($('#overlay').innerHTML) closeOverlay(); else if (UI.drawer) closeDrawer(); else document.body.classList.remove('nav-open'); return; }
  if (UI.pal) {
    if (e.key==='ArrowDown' || e.key==='ArrowUp') palKeyAt = now();
    if (e.key==='ArrowDown') { e.preventDefault(); UI.pal.i = Math.min(UI.pal.items.length-1, UI.pal.i+1); paintPal(); }
    if (e.key==='ArrowUp') { e.preventDefault(); UI.pal.i = Math.max(0, UI.pal.i-1); paintPal(); }
    if (e.key==='Enter') { e.preventDefault(); runPal(UI.pal.i); }
    return;
  }
  if (e.target.id==='chat-in' && e.key==='Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); e.target.form.requestSubmit(); return; }
  if (e.target.name==='t' && e.target.form && e.target.form.dataset.form==='capture' && e.key==='Enter' && !e.shiftKey) { e.preventDefault(); e.target.form.requestSubmit(); return; }
  if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key==='q' || e.key==='й')) { e.preventDefault(); capture(); }
});

/* перетаскивание карточек между колонками */
let dragId = null;
document.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('.card'); if (!c) return; dragId = c.dataset.id; c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
document.addEventListener('dragend', () => { document.querySelectorAll('.dragging,.drop').forEach(x=>x.classList.remove('dragging','drop')); dragId = null; });
document.addEventListener('dragover', e => { const c = e.target.closest && e.target.closest('.colm'); if (!c || !dragId) return; e.preventDefault(); document.querySelectorAll('.drop').forEach(x=>x!==c&&x.classList.remove('drop')); c.classList.add('drop'); });
document.addEventListener('drop', e => { const c = e.target.closest && e.target.closest('.colm'); if (!c || !dragId) return; e.preventDefault(); setStatus(dragId, c.dataset.col, e.clientX, e.clientY); });

/* ── отрисовка ──────────────────────────────── */
function view(){
  const bad = Object.keys(S.errs);
  const banner = bad.length ? `<div class="banner err">${ic('CircleAlert')}<div><b>База не отдаёт: ${esc(bad.join(', '))}.</b> ${esc(S.errs[bad[0]])}<br><small>Проверь, что эти коллекции есть в правилах Firestore, и обнови страницу.</small></div></div>` : '';
  if (S.errs.hub_tasks || S.errs.hub_people) return banner;
  return banner + viewRoute();
}
function viewRoute(){
  if (!S.loaded.has('hub_tasks') || !S.loaded.has('hub_people')) return '<div class="loading"><span class="spin"></span>Загружаем данные команды…</div>';
  const r = UI.route;
  if (r==='tasks') return viewTasks();
  if (r==='decisions') return viewDecisions();
  if (r==='inbox') return viewInbox();
  if (r==='log') return viewLog();
  if (r==='people') return viewPeople();
  if (r==='wiki') return viewWiki();
  if (r==='chats') return viewChats();
  listenChat(null);
  if (r==='claude') return viewClaude();
  if (r.startsWith('d/')) return viewDept();
  return viewToday();
}
function focusKey(el){
  if (!el || el===document.body) return null;
  if (el.id && /INPUT|TEXTAREA/.test(el.tagName)) return '#'+CSS.escape(el.id);
  for (const a of ['data-open','data-go','data-action']) if (el.hasAttribute && el.hasAttribute(a)) return `[${a}="${CSS.escape(el.getAttribute(a))}"]` + (el.dataset.id?`[data-id="${CSS.escape(el.dataset.id)}"]`:'') + (el.dataset.s?`[data-s="${CSS.escape(el.dataset.s)}"]`:'');
  return null;
}
function paint(){
  if (document.body.classList.contains('locked')) return;
  const ae = document.activeElement, fk = focusKey(ae), sy = scrollY, sel = ae && ae.id && 'selectionStart' in ae ? [ae.selectionStart, ae.selectionEnd] : null;
  const ms = $('#msgs'), mst = ms ? {top:ms.scrollTop, end:ms.scrollHeight-ms.scrollTop-ms.clientHeight < 60, chat:UI.chat} : null;
  $('#side').innerHTML = sidebar();
  $('#topbar').innerHTML = topbar();
  $('#view').innerHTML = view();
  document.body.classList.toggle('r-chats', UI.route==='chats');
  const ms2 = $('#msgs'); if (ms2) ms2.scrollTop = !mst || mst.end || mst.chat!==UI.chat ? ms2.scrollHeight : mst.top;
  if (fk) { const el = document.querySelector('#side '+fk+',#topbar '+fk+',#view '+fk); if (el) { el.focus({preventScroll:true}); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
  if (scrollY !== sy) scrollTo(0, sy);
}
let queued = false;
function schedule(){
  if (queued) return; queued = true;
  let done = false;
  const run = () => { if (done) return; done = true; queued = false; paint(); refreshDrawer(); };
  /* requestAnimationFrame стоит на паузе в скрытом или перекрытом окне — подстраховка таймером */
  setTimeout(run, document.hidden ? 0 : 60); requestAnimationFrame(run);
}

/* таймеры фокуса тикают без полной перерисовки */
let focusEnded = 0, lastClaude = '';
setInterval(() => {
  if (!S.me) return;
  const f = me().focus;
  if (f && f.until <= now()) { if (focusEnded===f.until) return; focusEnded = f.until; patchMe({focus:null});
    if (f.claude) { if ($('#overlay .cfocus')) closeOverlay(); gain(15, ic('Bot')+' Время с Claude закончилось — он свободен для следующего.'); }
    else gain(15, ic('Headphones')+' 25 минут фокуса позади! Сделай перерыв.');
    confetti(innerWidth-120, 40); return; }
  /* начало или конец чужой брони Claude меняет статус в боковой панели */
  const cb = claudeAt(now()); const cbId = cb ? cb.id : ''; if (cbId!==lastClaude) { lastClaude = cbId; schedule(); }
  const fl = $('#focus-left'); if (fl && f) fl.textContent = mmss(f.until-now());
  document.querySelectorAll('[data-until]').forEach(el => el.textContent = mmss(Number(el.dataset.until)-now()));
}, 1000);

/* ── подписки на данные ─────────────────────── */
function listen(){
  const onErr = c => e => { console.error(c, e); S.errs[c] = errText(e); S.loaded.add(c); schedule(); };
  const docs = sn => sn.docs.map(d=>Object.assign({id:d.id}, d.data()));
  const simple = [['hub_decisions','decisions'],['hub_reg','reg'],['hub_wiki','wiki'],['hub_files','files'],['hub_chats','chats']];
  for (const [c,k] of simple) UNSUB.push(col(c).onSnapshot(sn => { S[k] = docs(sn); S.loaded.add(c); schedule(); }, onErr(c)));
  /* задачи — отдельная подписка на каждый свой отдел: правила Firestore пускают только к задачам своих отделов */
  const syncTasks = () => {
    const want = myDepts(), seen = new Map();
    for (const d of want) for (const t of [...(S.tdept[d]||[]), ...(S.tdept['+'+d]||[])]) seen.set(t.id, t);
    S.allTasks = [...seen.values()]; applyVis();
    if (want.every(d=>S.tdept[d] && S.tdept['+'+d])) S.loaded.add('hub_tasks');
    schedule();
  };
  const listenTasks = () => {
    const want = new Set(myDepts());
    for (const d of Object.keys(TASK_UNSUB)) if (!want.has(d.replace('+',''))) { try { TASK_UNSUB[d](); } catch (e) {} delete TASK_UNSUB[d]; delete S.tdept[d]; }
    for (const d of want) if (!TASK_UNSUB[d]) TASK_UNSUB[d] = col('hub_tasks').where('dept','==',d).onSnapshot(sn => { S.tdept[d] = docs(sn); syncTasks(); },
      e => { if (!canSee(d)) return; /* отдел только что сняли — ответ уже не нужен */ onErr('hub_tasks')(e); });
    /* задачи, где отдел не основной; если правила базы ещё старые — молча обходимся основными */
    for (const d of want) if (!TASK_UNSUB['+'+d]) TASK_UNSUB['+'+d] = col('hub_tasks').where('depts','array-contains',d).onSnapshot(sn => { S.tdept['+'+d] = docs(sn); syncTasks(); },
      e => { console.warn('hub_tasks depts', d, e); S.tdept['+'+d] = []; syncTasks(); });
    syncTasks();
  };
  UNSUB.push(col('hub_claude').where('end','>',now()-14*86400e3).onSnapshot(sn => { S.claude = docs(sn); schedule(); }, onErr('hub_claude')));
  let lastLevel = null;
  UNSUB.push(col('hub_people').onSnapshot(sn => {
    const p = {}; sn.docs.forEach(d => { p[d.id] = d.data(); }); S.people = p; S.loaded.add('hub_people'); listenTasks();
    const lv = level(); if (lastLevel!==null && lv>lastLevel && !P.calm) { toast(ic('PartyPopper')+' Новый уровень: '+lv); confetti(innerWidth/2, innerHeight/2, 60); } lastLevel = lv;
    schedule();
  }, onErr('hub_people')));
  UNSUB.push(col('hub_log').orderBy('at','desc').limit(300).onSnapshot(sn => { S.log = docs(sn); schedule(); }, onErr('hub_log')));
  UNSUB.push(col('hub_inbox').where('by','==',S.me).onSnapshot(sn => { S.inbox = docs(sn); schedule(); }, onErr('hub_inbox')));
}
/* сообщения слушаем только у открытого чата */
let MSG_UNSUB = null, msgChat = null;
function listenChat(id){
  if (msgChat===id) return;
  if (MSG_UNSUB) { try { MSG_UNSUB(); } catch (e) {} MSG_UNSUB = null; }
  msgChat = id; S.msgs = []; S.loaded.delete('hub_msgs');
  if (!id) return;
  MSG_UNSUB = col('hub_msgs').where('chat','==',id).onSnapshot(sn => { if (msgChat!==id) return; S.msgs = sn.docs.map(d=>Object.assign({id:d.id}, d.data())).sort((a,b)=>a.at-b.at); S.loaded.add('hub_msgs'); markRead(id); schedule(); },
    e => { console.error('hub_msgs', e); S.errs.hub_msgs = errText(e); schedule(); });
}
let TASK_UNSUB = {};
function unlisten(){ UNSUB.forEach(u => { try { u(); } catch (e) {} }); UNSUB = []; listenChat(null);
  Object.values(TASK_UNSUB).forEach(u => { try { u(); } catch (e) {} }); TASK_UNSUB = {}; S.tdept = {}; S.allTasks = []; S.tasks = []; S.E = null; S.loaded = new Set(); S.errs = {}; }

/* стартовое наполнение — один раз на всю команду */
async function seedIfEmpty(){
  const ref = col('hub_meta').doc('seed');
  const first = await DB.runTransaction(async tx => { const d = await tx.get(ref); if (d.exists) return false; tx.set(ref, {at:now(), by:S.me}); return true; });
  if (!first) return;
  const b = DB.batch(), t0 = now(); let n = 0;
  const base = () => ({createdAt:t0 + n++, createdBy:S.me, updatedAt:t0, updatedBy:S.me});
  for (const t of SEED.tasks) { const {id, ...rest} = t; b.set(col('hub_tasks').doc(id), Object.assign({who:null, comments:[]}, rest, base())); }
  for (const d of SEED.decisions) { const {id, ...rest} = d; b.set(col('hub_decisions').doc(id), Object.assign({votes:{}, chosen:null}, rest, base())); }
  for (const [key, data] of SEED.reg) b.set(col('hub_reg').doc(), Object.assign({key}, data, base()));
  for (const w of SEED.wiki) b.set(col('hub_wiki').doc(), Object.assign({}, w, base()));
  await b.commit();
}
async function ensureMe(user, nameHint){
  const login = (user.email||'').replace(LOGIN_DOMAIN,'');
  const ref = col('hub_people').doc(user.uid); const d = await ref.get();
  if (!d.exists) {
    let h = 0; for (const c of user.uid) h = (h*31 + c.charCodeAt(0)) >>> 0;
    await ref.set({name:nameHint || user.displayName || login, login, role:'', depts:[], color:PERSON_COLORS[h % PERSON_COLORS.length], xp:0, days:[], top3:[], last:null, focus:null, seen:now(), createdAt:now()});
  } else await ref.update({seen:now(), login});
}
let presenceTimer = null;
function presence(){ if (S.me && !document.hidden) { col('hub_people').doc(S.me).update({seen:now()}).catch(()=>{}); if (UI.route==='d/econ') eSyncName(); } }
document.addEventListener('visibilitychange', presence);

/* ── вход ───────────────────────────────────
   У каждого свой логин и пароль (Firebase Auth). Почта не нужна: логин превращается
   во внутренний адрес login@kentucky.hub. Регистрация — только с кодом команды. */
const TEAM_CODE_SHA256 = '331d85f0258782c704e39e8877605b87f57166600b5b7e27a6847b1e745b9d19';
const LOGIN_DOMAIN = '@kentucky.hub';
const LOGIN_RE = /^[a-z0-9._-]{3,24}$/;
let gateMode = 'login', gateBusy = false, pendingName = null;
async function sha256(t){ const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''); }
const BAD_LOGIN = 'Неверный логин или пароль.';
const AUTH_ERR = {
  'auth/invalid-credential':BAD_LOGIN, 'auth/wrong-password':BAD_LOGIN, 'auth/user-not-found':BAD_LOGIN, 'auth/invalid-login-credentials':BAD_LOGIN,
  'auth/email-already-in-use':'Такой логин уже занят. Придумай другой.',
  'auth/weak-password':'Пароль слишком простой: минимум 6 символов.',
  'auth/invalid-email':'Логин: только латиница, цифры, точка, дефис и _, от 3 до 24 символов.',
  'auth/too-many-requests':'Слишком много попыток. Подожди пару минут.',
  'auth/network-request-failed':'Нет связи с сервером. Проверь интернет.',
  'auth/operation-not-allowed':'Вход по паролю ещё не включён в Firebase (Authentication → Sign-in method → Email/Password).',
  'auth/configuration-not-found':'Firebase Authentication ещё не настроен (Authentication → Get started → Email/Password).'
};
const field = (name, label, icon, type, extra='') => `<div class="fld"><label for="g-${name}">${label}</label><div class="inp">${ic(icon)}<input class="input" id="g-${name}" name="${name}" type="${type}" ${extra}>${type==='password'?`<button type="button" class="icon-btn eye" data-auth="eye" aria-label="Показать пароль">${ic('Eye')}</button>`:''}</div></div>`;
const BRAND = `<div class="gate-brand"><span class="mark">KS</span><div><b>Kentucky Hub</b><small>рабочее место команды</small></div></div>`;
function paintGate(msg){
  const login = gateMode==='login';
  $('#gate-card').innerHTML = `${BRAND}
    <div class="seg" role="group" aria-label="Режим"><button type="button" data-auth="mode" data-m="login" aria-pressed="${login}">${ic('LogIn')} Вход</button><button type="button" data-auth="mode" data-m="register" aria-pressed="${!login}">${ic('UserPlus')} Регистрация</button></div>
    <form data-gate="${gateMode}" novalidate>
      ${field('login','Логин','User','text','autocomplete="username" autocapitalize="none" spellcheck="false" required')}
      ${login ? '' : field('name','Как тебя называть','Sparkles','text','autocomplete="nickname" maxlength="32" required')}
      ${field('pass','Пароль','Lock','password', login?'autocomplete="current-password" required':'autocomplete="new-password" minlength="6" required')}
      ${login ? '' : field('pass2','Повтори пароль','Lock','password','autocomplete="new-password" required')}
      ${login ? '' : field('code','Код команды','KeyRound','password','autocomplete="off" required') + '<small class="fld-hint">Спроси у руководителя проекта.</small>'}
      <div class="gate-err" role="alert">${esc(msg||'')}</div>
      <button class="btn primary">${login?'Войти':'Создать аккаунт'}</button>
    </form>
    <div class="gate-foot">${login?'Нет аккаунта? Нажми «Регистрация».':'Логин: латиница, цифры, точка, дефис и _, от 3 до 24 символов.'}</div>`;
  const f = $('#gate-card input'); if (f) f.focus();
}
function gateError(msg){
  gateBusy = false;
  const f = $('#gate-card form'); const vals = f ? Object.fromEntries(new FormData(f)) : {};
  paintGate(msg);
  const g = $('#gate-card form');
  for (const [k,v] of Object.entries(vals)) if (g[k] && !/pass|code/.test(k)) g[k].value = v;
  const firstEmpty = [...g.querySelectorAll('input')].find(i=>!i.value); if (firstEmpty) firstEmpty.focus();
}
$('#gate').addEventListener('click', e => {
  const b = e.target.closest('[data-auth]'); if (!b) return;
  if (b.dataset.auth==='mode') { gateMode = b.dataset.m; paintGate(); }
  if (b.dataset.auth==='eye') {
    const i = b.parentElement.querySelector('input'); const show = i.type==='password';
    i.type = show ? 'text' : 'password'; b.innerHTML = ic(show?'EyeOff':'Eye'); b.setAttribute('aria-label', show?'Скрыть пароль':'Показать пароль');
  }
});
$('#gate').addEventListener('submit', async e => {
  e.preventDefault(); e.stopPropagation(); if (gateBusy || !AUTH) return;
  const f = e.target, login = f.login.value.trim().toLowerCase(), mode = f.dataset.gate;
  if (!LOGIN_RE.test(login)) return gateError(AUTH_ERR['auth/invalid-email']);
  if (!f.pass.value) return gateError('Введи пароль.');
  if (mode==='register') {
    if (!f.name.value.trim()) return gateError('Напиши, как тебя называть.');
    if (f.pass.value.length < 6) return gateError(AUTH_ERR['auth/weak-password']);
    if (f.pass.value !== f.pass2.value) return gateError('Пароли не совпадают.');
    if (await sha256(f.code.value.trim().toLowerCase()) !== TEAM_CODE_SHA256) return gateError('Неверный код команды.');
  }
  gateBusy = true;
  const btn = f.querySelector('.btn.primary'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>' + btn.textContent;
  const pass = f.pass.value;
  try {
    if (mode==='login') await AUTH.signInWithEmailAndPassword(login+LOGIN_DOMAIN, pass);
    else { pendingName = clip(f.name.value,32); const cred = await AUTH.createUserWithEmailAndPassword(login+LOGIN_DOMAIN, pass); await cred.user.updateProfile({displayName:pendingName}); }
  } catch (err) { pendingName = null; gateError(AUTH_ERR[err && err.code] || ('Не получилось: ' + (err && (err.code || err.message)))); }
});
async function enter(user){
  S.me = user.uid;
  $('#gate-card').innerHTML = BRAND + '<div class="gate-load"><span class="spin"></span>Загружаем данные команды…</div>';
  try {
    await ensureMe(user, pendingName);
    if (pendingName) { await col('hub_people').doc(S.me).update({name:pendingName}); pendingName = null; }
    seedIfEmpty().catch(e => console.error('seed', e));
  } catch (e) {
    console.error(e); gateBusy = false;
    $('#gate-card').innerHTML = BRAND + `<div class="gate-err">Вход выполнен, но база не пускает: ${esc(errText(e))}.</div><button class="btn" id="g-out">Выйти</button>`;
    $('#g-out').onclick = () => AUTH.signOut(); return;
  }
  gateBusy = false;
  document.body.classList.remove('locked');
  readHash(); listen(); econListen(); paint();
  clearInterval(presenceTimer); presenceTimer = setInterval(presence, 60e3);
}
function lock(){ S.me = null; unlisten(); clearInterval(presenceTimer); document.body.classList.add('locked'); closeDrawer(); closeOverlay(); gateBusy = false; paintGate(); }
applyPrefs();
try {
  if (!window.firebase || !firebase.auth || !firebase.firestore) throw new Error('sdk');
  firebase.initializeApp(FIREBASE_CONFIG);
  AUTH = firebase.auth(); DB = firebase.firestore();
  AUTH.onAuthStateChanged(u => u ? enter(u) : lock());
} catch (e) {
  $('#gate-card').innerHTML = BRAND + '<div class="gate-err">Не загрузился модуль входа. Обнови страницу или проверь, не блокирует ли что-то gstatic.com.</div>';
}
})();
