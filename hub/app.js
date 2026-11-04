/* Kentucky Hub — общее рабочее место команды.
   Данные — Firestore (коллекции hub_*), вход — Firebase Auth, всё обновляется у всех сразу. */
(() => {
'use strict';

/* ── иконки Lucide (ISC), встроены только нужные ── */
const ICONS = {
  MousePointer2:'<path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>',
  StickyNote:'<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/>',
  Type:'<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  Square:'<rect width="18" height="18" x="3" y="3" rx="2"/>',
  Upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  Layers:'<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  Circle:'<circle cx="12" cy="12" r="10"/>',
  MoveUpRight:'<path d="M13 5H19V11"/><path d="M19 5L5 19"/>',
  Minus:'<path d="M5 12h14"/>',
  Eraser:'<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
  Frame:'<line x1="22" x2="2" y1="6" y2="6"/><line x1="22" x2="2" y1="18" y2="18"/><line x1="6" x2="6" y1="2" y2="22"/><line x1="18" x2="18" y1="2" y2="22"/>',
  Undo2:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  Redo2:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/>',
  Presentation:'<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
  Pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  ZoomIn:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  ZoomOut:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>',
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
  ChevronLeft:'<path d="m15 18-6-6 6-6"/>',
  ChevronRight:'<path d="m9 18 6-6-6-6"/>',
  Image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  Bell:'<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  AtSign:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
  FileDown:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
  Phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  PhoneOff:'<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><path d="M22 2 2 22"/>',
  Mic:'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  MicOff:'<path d="m2 2 20 20"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M12 19v3"/>',
  Video:'<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.75-.43L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  VideoOff:'<path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.25-3.06a.5.5 0 0 1 .75.43v8.2"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="m2 2 20 20"/>',
  ScreenShare:'<path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="m17 8 5-5"/><path d="M17 3h5v5"/>',
  Maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
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
/* «Новые» (id inbox), чтобы не путать с личными «Входящими» на Q. «Заблокировано» — с причиной (blockedWhy) */
const COLS = [['inbox','Новые','var(--muted)'],['todo','К работе','var(--info)'],['doing','В работе','var(--warn)'],['review','Ревью','var(--violet)'],['blocked','Заблокировано','var(--red)'],['done','Готово','var(--ok)']];
const COL_TONE = {inbox:'muted', todo:'info', doing:'warn', review:'violet', blocked:'red', done:'ok'};
const colName = id => (COLS.find(c=>c[0]===id)||[,id])[1];
const SIZES = {S:'≤ 15 мин', M:'≈ 1–2 ч', L:'полдня+'};
const XP_BY_SIZE = {S:10, M:20, L:40};
const WEEK_GOALS = [3, 5, 10];
const weekGoal = () => WEEK_GOALS.includes(me().weekGoal) ? me().weekGoal : 10;
/* отметка «онлайн» раз в 10 минут: каждая запись в hub_people стоит одно чтение у каждого открытого хаба
   (при 20 людях раз в 4 минуты это почти весь бесплатный дневной лимит Firestore) */
const PRESENCE_MS = 600e3, ONLINE_MS = 1500e3;
const PERSON_COLORS = ['#7C5CE6','#4C6FB8','#A0558F','#A86A3C','#3F8466','#6B55B8','#8E7A2E','#3B7F95','#9C4D4D','#5E6AD2'];

const DEPTS = [
  {id:'dev', name:'Разработка', icon:'Code', color:'#8DB6F8', has:['cef'], tldr:'Сервер на C# (RAGE MP) и интерфейсы в игре (CEF): remote-события, конфиги, таблицы БД, экраны и компоненты. Перед вёрсткой экрана проверь, что макет утверждён.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['events','Remote-события'],['configs','Конфиги'],['db','База данных'],['adr','Архитектура'],['screens','Экраны CEF','cef/screens'],['components','Компоненты CEF','cef/components']]},
  {id:'design', name:'UI/UX-дизайн', icon:'Palette', color:'#F0A6CA', tldr:'Макеты, UI-кит и передача в разработку. Макет считается готовым после статуса «Утверждён» и пройденного чеклиста передачи.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['mockups','Макеты'],['kit','UI-кит'],['handoff','Передача']]},
  {id:'art3d', name:'3D и маппинг', icon:'Car', color:'#F5B98A', tldr:'Машины, одежда, интерьеры (MLO) и маппинг. В реестре видны размер стрима и лицензия каждого ассета, чтобы не превысить лимиты.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['assets','Ассеты'],['limits','Лимиты']]},
  {id:'gd', name:'Геймдизайн', icon:'Dice5', color:'#B9A3FF', tldr:'Механики, работы, квесты и фракции. Каждая механика описана карточкой: зачем, как работает, связанные параметры экономики.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['mechanics','Механики'],['jobs','Работы'],['factions','Фракции']]},
  {id:'econ', name:'Экономика', icon:'Coins', color:'#86D9B0', has:['donate','analytics'], tldr:'Деньги сервера целиком: план, параметры, этапы, донат (позиции, акции, курс) и метрики. Баги, решения и журнал экономики — в общих разделах с фильтром «Экономика».',
    tabs:[['overview','Обзор'],['plan','План'],['params','Параметры'],['stages','Этапы'],['items','Донат: позиции','donate/items'],['promos','Донат: акции','donate/promos'],['metrics','Метрики','analytics/metrics'],['reports','Отчёты','analytics/reports'],['finance','Финансы','analytics/finance'],['tasks','Задачи']]},
  {id:'qa', name:'QA и релизы', icon:'FlaskConical', color:'#F49A9A', has:['release'], tldr:'Все баги команды (с фильтром по отделу), тест-кейсы, чеклист релиза, версии с changelog и деплой. Релиз выходит, когда чеклист закрыт; критичный баг блокирует релиз, пока не исправлен или не принято решение.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['bugs','Баги'],['cases','Тест-кейсы'],['checklist','Чеклист релиза'],['versions','Версии','release/versions'],['deploy','Деплой','release/deploy']]},
  {id:'admin', name:'Администрация', icon:'Shield', color:'#B8DD8A', tldr:'Фидбек игроков: предложения голосуются и при поддержке становятся задачами. Правила сервера — в Вики.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['feedback','Фидбек игроков']]},
  {id:'smm', name:'SMM', icon:'Megaphone', color:'#E3A6F0', tldr:'Публикации и анонсы в одном плане. Каждый анонс привязан к релизу, чтобы не анонсировать то, что ещё не готово.',
    tabs:[['overview','Обзор'],['tasks','Задачи'],['plan','Публикации'],['bloggers','Блогеры']]}
];
/* вкладки, которые переехали в общие разделы: старые ссылки ведут на новое место */
const MOVED = {'econ/bugs':'d/qa/bugs/econ', 'econ/edec':'decisions/econ', 'econ/elog':'log/econ', 'admin/rules':'wiki', 'smm/posts':'d/smm/plan', 'qa/changelog':'d/qa/versions'};
/* записи реестров, которые показываются в другом месте (ключ записи → путь) */
const REG_HOME = {'admin/rules':'wiki', 'smm/posts':'d/smm/plan', 'release/changelog':'d/qa/versions'};
/* реестр показывает и записи старых ключей: SMM-анонсы теперь в «Публикациях» */
const REG_ALSO = {'smm/plan':['smm/posts']};
/* объединённые отделы: старые id (cef, release, donate, analytics) остаются в базе и ведут в новый отдел */
const D = Object.fromEntries(DEPTS.flatMap(d=>[[d.id,d], ...(d.has||[]).map(x=>[x,d])]));
const hd = id => (D[id]||{}).id;                              // старый id → id отдела
const deptIds = id => D[id] ? [D[id].id, ...(D[id].has||[])] : []; // все id отдела, как они хранятся у людей и в правилах
const ALL_IDS = DEPTS.flatMap(d=>deptIds(d.id));
const tabKey = (d, tab) => ((d.tabs.find(t=>t[0]===tab)||[])[2]) || d.id+'/'+tab;

/* ── реестры отделов: схема полей ───────────── */
const fName = l => ({k:'name', l, t:'text', req:true});
const fTldr = {k:'tldr', l:'Суть в одном предложении', t:'text'};
const fDetails = {k:'details', l:'Подробности', t:'textarea'};
const fText = (k, l, mono) => ({k, l, t:'text', mono});
const fWho = l => ({k:'who', l:l||'Ответственный', t:'person'});
const fStatus = o => ({k:'status', l:'Статус', t:'select', o});
const CHANNELS = [['Telegram','info'],['VK','info'],['Discord','violet'],['YouTube','red'],['TikTok','warn'],['Twitch','violet'],['Сайт','ok'],['Другое','muted']];
const S_CARD = [['Черновик','muted'],['Обсуждается','info'],['Принято','ok'],['Отменено','red']];
const REGS = {
  'dev/events':   {type:'table', noun:'событие', fields:[fName('Событие'), {k:'dir', l:'Направление', t:'select', o:[['CEF → сервер','info'],['сервер → CEF','violet']]}, fText('args','Аргументы',true), fText('where','Где в коде',true), fStatus([['Планируется','muted'],['В работе','warn'],['Готово','ok'],['Переделать','red']]), fDetails]},
  'dev/configs':  {type:'table', noun:'конфиг', fields:[fName('Файл'), fText('what','Что внутри'), fWho('Владелец'), fStatus([['Стабильно','ok'],['Меняется','warn'],['Новый','info']]), fDetails]},
  'dev/db':       {type:'table', noun:'таблицу', fields:[fName('Таблица'), fText('what','Назначение'), fText('migration','Миграция',true), fStatus([['Стабильно','ok'],['Новая','info'],['Проблема','red']]), fDetails]},
  'dev/adr':      {type:'cards', noun:'решение', fields:[fName('Решение'), fTldr, fStatus(S_CARD), fDetails]},
  'cef/screens':  {type:'table', noun:'экран', fields:[fName('Экран'), fText('path','Путь',true), fText('events','События',true), {k:'mockup', l:'Макет', t:'mockup'}, fStatus([['Ждёт макет','muted'],['Вёрстка','warn'],['Готово','ok'],['Переделать','red']]), fDetails]},
  'cef/components':{type:'cards', noun:'компонент', fields:[fName('Компонент'), fTldr, fStatus([['Планируется','muted'],['В работе','warn'],['Готово','ok']]), fDetails]},
  'design/mockups':{type:'mockups', noun:'макет', fields:[fName('Макет'), fTldr, {k:'link', l:'Ссылка на макет (Figma и т.п.)', t:'url'}, fWho('Дизайнер'), fStatus([['Черновик','muted'],['В работе','warn'],['На ревью','violet'],['Утверждён','ok']]), fDetails]},
  'design/handoff':{type:'checklist', noun:'пункт', fields:[fName('Пункт')]},
  'art3d/assets': {type:'table', noun:'ассет', fields:[fName('Ассет'), {k:'kind', l:'Тип', t:'select', o:[['Машина','info'],['Одежда','violet'],['MLO','warn'],['Маппинг','ok'],['Другое','muted']]}, fWho('Автор'), fText('size','Стрим, МБ',true), fText('license','Лицензия'), fStatus([['Идея','muted'],['В работе','warn'],['Готово','ok'],['Превышен лимит','red']]), fDetails]},
  'art3d/limits': {type:'metrics', noun:'лимит', fields:[fName('Показатель'), fText('value','Значение'), fText('target','Цель'), {k:'at', l:'Дата снимка', t:'date'}, fText('note','Комментарий'), {k:'series', l:'История (числа через запятую)', t:'text', mono:true}]},
  'gd/mechanics': {type:'cards', noun:'механику', fields:[fName('Механика'), fTldr, fStatus([['Черновик','muted'],['Обсуждается','info'],['Описано','ok'],['Переделать','red']]), fDetails]},
  'gd/jobs':      {type:'table', noun:'работу', fields:[fName('Работа'), fText('target','Цель, $/ч'), fText('now','Сейчас'), fStatus([['В норме','ok'],['Пересчитать','warn'],['Сломано','red']]), fDetails]},
  'gd/factions':  {type:'table', noun:'фракцию', fields:[fName('Фракция'), {k:'kind', l:'Тип', t:'select', o:[['Гос.','info'],['Банда','warn'],['Мафия','violet'],['Другое','muted']]}, fText('income','Доход'), fStatus([['Черновик','muted'],['Описано','ok']]), fDetails]},
  'qa/bugs':      {type:'table', noun:'баг', fields:[fName('Баг'), {k:'dept', l:'Отдел', t:'dept'}, {k:'sev', l:'Важность', t:'select', o:[['Критично','red'],['Высокая','warn'],['Средняя','info'],['Низкая','muted']]}, fText('where','Где',true), fWho(), fStatus([['Открыт','red'],['В работе','warn'],['На ревью','violet'],['Исправлен','ok'],['Не будем','muted']]), fDetails]},
  'qa/cases':     {type:'table', noun:'тест-кейс', fields:[fName('Кейс'), fText('steps','Шаги'), fText('expected','Ожидаемо'), fStatus([['Не проверен','muted'],['Проходит','ok'],['Падает','red']]), fDetails]},
  'qa/checklist': {type:'checklist', noun:'пункт', fields:[fName('Пункт')]},
  'release/versions':{type:'timeline', noun:'версию', fields:[fName('Версия'), fTldr, fStatus([['Готовится','warn'],['Вышла','ok'],['Отменена','muted']]), {k:'changes', l:'Changelog — что нового для игроков', t:'textarea'}, fDetails]},
  'release/changelog':{type:'cards', noun:'changelog', fields:[fName('Заголовок'), fTldr, fStatus([['Черновик','muted'],['Опубликован','ok']]), fDetails]},
  'release/deploy':{type:'table', noun:'деплой', fields:[fName('Окружение'), fText('version','Версия',true), fText('when','Когда'), fWho('Кто'), fStatus([['Работает','ok'],['Тестируется','warn'],['Упал','red']]), fDetails]},
  'admin/rules':  {type:'cards', noun:'правило', fields:[fName('Правило'), fTldr, fStatus(S_CARD), fDetails]},
  'admin/feedback':{type:'table', noun:'предложение', fields:[fName('Предложение'), fText('source','Откуда'), fText('votes','Голоса игроков'), fStatus([['Новое','muted'],['Обсуждается','info'],['Взяли в работу','ok'],['Отклонено','red']]), fDetails]},
  'smm/plan':     {type:'table', noun:'публикацию', fields:[fName('Тема'), {k:'date', l:'Дата', t:'date'}, {k:'channel', l:'Канал', t:'select', o:CHANNELS}, {k:'release', l:'Версия', t:'ver'}, fWho(), fStatus([['Идея','muted'],['Готовится','warn'],['Готово','ok'],['Опубликовано','violet']]), {k:'url', l:'Ссылка на пост', t:'url'}, fText('reach','Охват / клики'), fDetails]},
  'smm/bloggers': {type:'table', noun:'блогера', fields:[fName('Блогер'), {k:'platform', l:'Площадка', t:'select', o:CHANNELS}, fText('audience','Аудитория'), fText('promo','Промокод',true), {k:'date', l:'Дата выхода', t:'date'}, {k:'link', l:'Ссылка на ролик', t:'url'}, fText('cost','Стоимость, ₽',true), fText('regs','Регистрации по коду',true), fText('d7','Остались на 7-й день',true), fStatus([['Договариваемся','info'],['Снимает','warn'],['Вышло','ok'],['Отказ','muted']]), fDetails]},
  'smm/posts':    {type:'cards', noun:'анонс', fields:[fName('Анонс'), fTldr, fStatus([['Идея','muted'],['Готовится','warn'],['Готово','ok']]), fDetails]},
  'donate/items': {type:'table', noun:'позицию', fields:[fName('Позиция'), fText('price','Цена, RB',true), fText('rub','≈ ₽',true), {k:'rules', l:'Правила FiveM / Tebex', t:'select', o:[['Разрешено','ok'],['Проверить','warn'],['Нарушает','red']]}, fStatus([['Активна','ok'],['Пересчитать','warn'],['Ждёт решения','info'],['Снята','muted']]), fDetails]},
  'donate/promos':{type:'cards', noun:'акцию', fields:[fName('Акция'), fTldr, fStatus([['Черновик','muted'],['Согласована','ok'],['Идёт','violet'],['Прошла','muted']]), fDetails]},
  'analytics/metrics':{type:'metrics', noun:'метрику', fields:[fName('Метрика'), fText('value','Значение'), fText('target','Цель'), {k:'at', l:'Дата снимка', t:'date'}, fText('note','Комментарий'), {k:'series', l:'История (числа через запятую)', t:'text', mono:true}]},
  'analytics/finance':{type:'table', noun:'месяц', fields:[fName('Месяц'), fText('revenue','Выручка, ₽',true), fText('costs','Расходы, ₽',true), fText('sources','Откуда выручка'), fText('spend','На что расходы'), fDetails]},
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
/* edec — решения экономики (коллекция decisions, общая со страницей /economy/): их видно в общем разделе «Решения» */
const S = {me:null, people:{}, tdept:{}, allTasks:[], tasks:[], decisions:[], edec:[], pending:[], inbox:[], team:[], boards:[], log:[], reg:[], wiki:[], files:[], chats:[], msgs:[], claude:[], notifs:[], up:{}, E:null, loaded:new Set(), errs:{}};
/* dfilt / lfilt / bfilt — фильтр по отделу в «Решениях», «Журнале» и «Багах»; приходит из адреса: #/decisions/econ */
const UI = {route:'today', tab:null, chat:null, board:null, chatDraft:{}, cday:0, filt:{dept:'mine', small:false, mine:false}, drawer:null, edit:false, pal:null, ef:{status:'all', group:'all', q:'', hideFixed:false, hideDone:false}, eDraft:'', dfilt:'all', lfilt:'all', bfilt:'all', bhide:false};
const PREFS_KEY = 'kyHubPrefs';
const P = Object.assign({theme:'auto', bg:'off', snow:'auto', calm:false, fs:'m', density:'normal', hidden:[], sysNotif:true}, (() => { try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; } })());
const savePrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(P)); } catch (e) {} };

const task = id => S.tasks.find(t=>t.id===id);
/* большая задача: у задач внутри неё поле parent = id большой. Вложенность одна — внутри большой задачи только обычные */
const kids = id => S.tasks.filter(x=>x.parent===id && x.id!==id).sort(byOrder);
const isKid = t => !!(t && t.parent && t.parent!==t.id && task(t.parent));
const dec = id => S.decisions.find(d=>d.id===id);
const regItem = id => S.reg.find(r=>r.id===id);
const wikiItem = id => S.wiki.find(w=>w.id===id);
const me = () => S.people[S.me] || {};
const myDepts = () => [...new Set((me().depts||[]).map(hd).filter(Boolean))];
const canSee = dept => myDepts().includes(dept);
const seesAll = () => DEPTS.every(d=>canSee(d.id));
/* отделы назначает руководитель (поле admin в hub_people); сами участники их не меняют */
const isAdmin = () => me().admin === true;
/* участник команды: одобрен руководителем или уже в отделе (то же условие в firestore.rules → isMember) */
const isMemberP = p => !!p && (p.approved === true || p.admin === true || (p.depts||[]).length > 0);
const adminNames = () => Object.values(S.people).filter(p=>p.admin===true).map(p=>p.name).join(', ');
/* задача может относиться к нескольким отделам: dept — основной, depts — все (с основным) */
const tDepts = t => [...new Set([t.dept, ...(Array.isArray(t.depts)?t.depts:[])].map(hd).filter(Boolean))];
const inDept = (t, d) => tDepts(t).includes(d);
const canEdit = t => tDepts(t).some(canSee); // задачи видят все, меняют участники их отделов
const roMsg = t => ic('Lock')+' Менять задачу могут участники отдела '+tDepts(t).map(x=>'«'+esc(D[x].name)+'»').join(', ')+'. Писать в обсуждении можно всем.';
const dchips = t => tDepts(t).map(dchip).join('');
function applyVis(){ S.tasks = S.allTasks; }
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
  /* суббота и воскресенье без действий серию не обрывают — отдыхать можно */
  for (let i=0;;i++) { const t = now()-i*86400e3, k = dayKey(t); if (set.has(k)) n++; else if (i>0 && ![0,6].includes(new Date(t).getDay())) break; if (i>400) break; }
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
/* expireAt — когда база сама удалит документ (TTL-политика Firestore по этому полю, включается один раз в консоли) */
const expireIn = days => { const T = firebase.firestore.Timestamp; return T ? {expireAt:T.fromMillis(now()+days*86400e3)} : {}; };
function log(act, title, dept){ col('hub_log').add(Object.assign({by:S.me, at:now(), act, title:clip(title,200), dept:dept||null}, expireIn(365))).catch(()=>{}); }
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
  $('#toasts').appendChild(el); setTimeout(()=>el.classList.add('out'), 3150); setTimeout(()=>el.remove(), 3400);
}
/* уведомление с кнопкой «Восстановить», как у удалённых сообщений в мессенджерах; полоска внизу показывает, сколько осталось */
const UNDO_MS = 15000;
function undoToast(html, onUndo, ms=UNDO_MS){
  const el = document.createElement('div'); el.className = 'toast undo';
  el.innerHTML = `<span>${html}</span><button class="btn sm" type="button">${ic('Undo2')} Восстановить <small class="mono">${Math.round(ms/1000)}</small></button><i class="undo-bar" style="animation-duration:${ms}ms"></i>`;
  const sec = el.querySelector('small'), end = now()+ms;
  const tick = setInterval(() => { sec.textContent = Math.max(0, Math.ceil((end-now())/1000)); }, 250);
  const close = () => { clearInterval(tick); el.classList.add('out'); setTimeout(()=>el.remove(), 260); };
  el.querySelector('button').addEventListener('click', e => { e.stopPropagation(); close(); onUndo(); });
  $('#toasts').appendChild(el); setTimeout(close, ms);
}

/* ── маршрутизация ──────────────────────────── */
function readHash(){
  const p = (location.hash||'').replace(/^#\/?/,'').split('/');
  if (p[0]==='task' && p[1]) { UI.pendingTask = decodeURIComponent(p[1]); history.replaceState(null, '', '#/tasks'); p[0] = 'tasks'; }
  const moved = p[0]==='d' && D[p[1]] && MOVED[hd(p[1])+'/'+p[2]];
  if (moved) { history.replaceState(null, '', '#/'+moved); return readHash(); }
  const filt = v => v && (D[v] ? hd(v) : 'all') || 'all';
  if (p[0]==='d' && D[p[1]]) { UI.route = 'd/'+hd(p[1]); UI.tab = p[2] || 'overview'; if (UI.route==='d/qa' && UI.tab==='bugs') UI.bfilt = filt(p[3]); }
  else { UI.route = ['today','lead','tasks','decisions','inbox','log','people','wiki','chats','board','claude','call'].includes(p[0]) ? p[0] : 'today'; UI.tab = null; }
  if (UI.route==='decisions') UI.dfilt = filt(p[1]);
  if (UI.route==='log') UI.lfilt = filt(p[1]);
  UI.chat = UI.route==='chats' && p[1] ? decodeURIComponent(p[1]) : null;
  UI.board = UI.route==='board' && p[1] ? decodeURIComponent(p[1]) : null;
}
const go = path => { location.hash = '#/'+path; };
addEventListener('hashchange', () => { readHash(); if (UI.route==='d/econ') eSyncName(); closeDrawer(); document.body.classList.remove('nav-open'); paint(); afterPaint(); scrollTo(0,0); });

/* ── боковая панель ─────────────────────────── */
/* в боковой панели — свои отделы (остальные по кнопке «все»); скрытые в настройках не показываются никогда */
const sideDepts = () => DEPTS.filter(d=>!P.hidden.includes(d.id) && (UI.allDepts || seesAll() || !myDepts().length || canSee(d.id)));
function sidebar(){
  const r = UI.route, m = me();
  const openDec = pendingDecs().length;
  const myTop = (m.top3||[]).map(task).filter(t=>t && t.status!=='done').length;
  const link = (path, icon, name, n, color, hot) =>
    `<a href="#/${path}" ${r===path?'aria-current="page"':''} style="--dc:${color}"><span class="ico">${ic(icon)}</span>${esc(name)}${n?`<span class="n${hot?' hot':''}">${n}</span>`:''}</a>`;
  const xpIn = (m.xp||0) % 100;
  return `
  <div class="brand"><span class="mark">KS</span><div><b>Kentucky Hub</b><small>рабочее место команды</small></div></div>
  <div class="side-scroll" id="side-scroll">
  <nav class="nav">
    ${link('today','Sun','Мой день', myTop, '#F5B971')}
    ${isAdmin() ? (n => link('lead','Gauge','Обзор', n, '#F49A9A', n>0))(leadAlerts()) : ''}
    ${link('inbox','Inbox','Входящие', S.inbox.length, '#A9A8B6')}
    ${link('tasks','LayoutGrid','Задачи', S.tasks.filter(t=>canEdit(t) && t.status!=='done').length, '#8DB6F8')}
    ${link('decisions','Scale','Решения', openDec, '#B9A3FF', openDec>0)}
    ${link('log','ScrollText','Журнал', 0, '#A9A8B6')}
    ${isAdmin() && S.pending.length ? link('people','Users','Люди', S.pending.length, '#86D9B0', true) : link('people','Users','Люди', Object.keys(S.people).filter(isOnline).length, '#86D9B0')}
    ${link('chats','MessagesSquare','Чаты', unreadChats(), '#7DD3E8', unreadChats()>0)}
    ${link('board','Presentation','Доски', 0, '#F2A3C8')}
    ${(n => link('call','Phone','Звонок', CALL.in ? '●' : n, '#7FD6A4', n>0 && !CALL.in))(callCount())}
    ${link('wiki','BookOpen','Вики', 0, '#F5B98A')}
    ${(b => link('claude','Bot','Claude', b ? (b.by===S.me ? 'ты' : 'занят') : '', '#E8B07D', !!b && b.by!==S.me))(claudeAt(now()))}
  </nav>
  <div class="nav-h">${UI.allDepts || seesAll() || !myDepts().length ? 'Отделы' : 'Мои отделы'} ${seesAll() || !myDepts().length ? '' : `<button data-action="side-all" title="Показать или скрыть остальные отделы">${UI.allDepts ? 'только мои' : 'все'}</button>`}<button data-action="settings" title="Показать или скрыть отделы">настроить</button></div>
  <nav class="nav">
    ${sideDepts().map(d => link('d/'+d.id, d.icon, d.name, S.tasks.filter(t=>inDept(t,d.id) && t.status!=='done').length || '', d.color)).join('')}
  </nav>
  </div>
  <div class="me-card">
    <div class="me-row">${av(S.me,30)}<div style="min-width:0;flex:1"><b style="font-size:14px">${esc(m.name||'')}</b><br><small>${esc(m.role || '@'+(m.login||''))}</small></div><span class="streak" title="Дней подряд с действием">${ic('Flame')} ${streak()}</span><button class="icon-btn" data-action="logout" title="Выйти" aria-label="Выйти" style="width:30px;height:30px">${ic('LogOut')}</button></div>
    <div class="me-row"><span class="lvl">Ур. ${level()}</span><div class="xpbar" style="flex:1"><i style="width:${xpIn}%"></i></div><small class="mono">${xpIn}/100</small></div>
    <small>Неделя: ${weekDone()} из ${weekGoal()} задач закрыто</small>
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
      : `<button class="btn sm focus-btn" data-action="focus-start" data-id="${esc(me().last||'')}" title="25 минут фокуса — коллеги увидят, что вы работаете" aria-label="Фокус 25 минут">${ic('Headphones')}<span class="lbl"> Фокус 25 мин</span></button>`}
  ${(n => `<button class="icon-btn bell${n?' on':''}" data-action="notifs" aria-label="Уведомления${n?': '+n:''}" title="Уведомления">${ic('Bell')}${n?`<span class="bdg">${n>99?'99+':n}</span>`:''}</button>`)(notifCount())}
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
    <button class="check${done?' on':''}" ${canEdit(t)?'':'disabled title="Только просмотр"'} data-action="toggle-done" data-id="${esc(t.id)}" aria-label="${done?'Вернуть в работу':'Готово'}">${ic('Check')}</button>
    <div class="bd">
      <div class="tt" style="${done?'text-decoration:line-through;color:var(--muted)':''}">${esc(t.title)}</div>
      ${t.tldr ? `<div class="ds">${mdLine(t.tldr)}</div>`:''}${blockedNote(t)}
      <div class="mt">${dchips(t)}<span class="size" title="${SIZES[t.size]||''}">${esc(t.size||'M')}</span>${dueChip(t)}${opts.status?chip(colName(t.status), COL_TONE[t.status]):''}${sub.length?`<small style="color:var(--muted)">${ic('ListChecks')} ${sd}/${sub.length}</small>`:''}</div>
    </div>
    ${av(t.who)}
  </div>`;
}
const blockedNote = t => t.status==='blocked' ? `<div class="blk" title="Заблокировано ${t.blockedAt?ago(t.blockedAt):''}">${ic('CircleAlert')} ${esc(t.blockedWhy||'причина не указана')}</div>` : '';
function heatmap(){
  const days = Array.from({length:14},(_,i)=>dayKey(now()-(13-i)*86400e3));
  const nums = Array.from({length:14},(_,i)=>new Date(now()-(13-i)*86400e3).getDate());
  const counts = {};
  for (const l of S.log) { if (!l.dept) continue; const k = dayKey(l.at); const i = days.indexOf(k); if (i<0) continue; const dd = hd(l.dept); if (dd) (counts[dd] = counts[dd] || Array(14).fill(0))[i]++; }
  const rows = DEPTS.filter(d=>!P.hidden.includes(d.id)).sort((a,b)=>(counts[b.id]||[]).reduce((x,y)=>x+y,0)-(counts[a.id]||[]).reduce((x,y)=>x+y,0)).slice(0,6);
  const lv = n => n>=6?3:n>=3?2:n>=1?1:0;
  return `<section class="panel"><div class="panel-h"><h2><span class="hi">${ic('TrendingUp')}</span>Активность команды</h2><a class="btn sm ghost" href="#/log">Журнал</a></div>
  <div class="legend"><span><i style="opacity:.3"></i>Тишина</span><span><i style="opacity:.55"></i>1–2</span><span><i style="opacity:.8"></i>3–5</span><span><i></i>6+ действий</span></div>
  <div class="heat">${rows.map(d=>`<span class="rl" title="${esc(d.name)}">${ic(d.icon)} ${esc(d.name)}</span>`+(counts[d.id]||Array(14).fill(0)).map((n,i)=>`<span class="cell l${lv(n)}" title="${esc(d.name)}: ${n} · ${nums[i]}"></span>`).join('')).join('')}<span></span>${nums.map(n=>`<span class="cl">${n}</span>`).join('')}</div></section>`;
}
/* первые шаги новичка: пропадают, когда всё сделано или скрыты */
function onboarding(){
  if (P.onbHide) return '';
  const m = me(), steps = [
    [!!(m.role||'').trim(), 'Заполни профиль: роль в команде', 'settings', 'Профиль'],
    [myDepts().length > 0, 'Получи отдел — его назначает руководитель'+(adminNames()?' ('+adminNames()+')':''), '', ''],
    [S.tasks.some(t=>t.who===S.me), 'Возьми первую задачу — лучше размера S, «≤ 15 мин»', 'go-small', 'Найти'],
    [(m.xp||0) >= 10 || S.inbox.length > 0, 'Запиши любую мысль на клавишу Q — разберёшь потом', 'capture', 'Записать']];
  const done = steps.filter(x=>x[0]).length; if (done===steps.length) return '';
  return `<section class="panel glow"><div class="panel-h"><h2><span class="hi">${ic('Sparkles')}</span>Первые шаги · ${done} из ${steps.length}</h2><button class="btn sm ghost" data-action="onb-hide">Скрыть</button></div>
    <div class="cl">${steps.map(([ok, t, act, b])=>`<div class="row"><label class="${ok?'done':''}"><input type="checkbox" disabled ${ok?'checked':''}><span>${esc(t)}</span></label>${!ok && act ? `<button class="btn sm" data-action="${act}">${b}</button>` : ''}</div>`).join('')}</div></section>`;
}
function viewToday(){
  const m = me();
  const top = (m.top3||[]).map(task).filter(Boolean);
  const left = top.filter(t=>t.status!=='done').length;
  const wd = weekDone(), pct = Math.min(100, Math.round(wd/weekGoal()*100));
  const last = m.last && task(m.last);
  const pendingVotes = pendingDecs();
  const quick = S.tasks.filter(t=>canEdit(t) && t.size==='S' && t.status!=='done' && (!t.who || t.who===S.me) && !(m.top3||[]).includes(t.id)).slice(0,3);
  const online = Object.keys(S.people).filter(id=>id!==S.me && isOnline(id));
  return `
  <section class="hero">
    <div><h1>${hello()}, ${esc((m.name||'').split(' ')[0])}! ${ic('Hand')}</h1><p>${top.length ? (left ? `На сегодня ${left} из ${top.length} главных задач. Начни с самой маленькой.` : 'Главные задачи закрыты. Можно выдохнуть.') : 'Выбери до трёх главных задач на сегодня — кнопка «В день» в карточке задачи.'}</p></div>
    <div class="hero-stats">
      <div class="ring" style="--p:${pct}" title="Цель недели"><span>${pct}%</span></div>
      <div class="hs"><b>${wd}/${weekGoal()}</b><small>задач за неделю</small></div>
      <div class="hs"><b>${ic('Flame')} ${streak()}</b><small>дней подряд</small></div>
      <div class="hs"><b>Ур. ${level()}</b><small>${m.xp||0} XP</small></div>
    </div>
  </section>
  ${last && last.status!=='done' ? `<div class="resume">${ic('MapPin')}<div class="bd"><small>Ты остановился здесь</small><b>${esc(last.title)}</b></div><button class="btn sm" data-open="task:${esc(last.id)}">Открыть</button><button class="btn sm primary" data-action="focus-start" data-id="${esc(last.id)}">${ic('Headphones')} Продолжить 25 мин</button></div>`:''}
  ${onboarding()}
  <div class="today-grid">
    <div class="col">
      <section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('Target')}</span>Три главные на сегодня</h2><span class="sub">не больше трёх — так проще начать</span></div>
        <div class="list">${top.map(t=>taskItem(t,{status:true})).join('') || `<div class="empty"><b>Пока пусто</b>Открой любую задачу и нажми «${ic('Star')} В день».<a class="btn sm" href="#/tasks">Открыть задачи</a></div>`}</div>
      </section>
      ${pendingVotes.length ? `<section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('Scale')}</span>Ждут твоего голоса</h2><a class="btn sm ghost" href="#/decisions">Все решения</a></div>
        <div class="list">${pendingVotes.map(d=>`<div class="item" tabindex="0" data-action="open-dec" data-id="${esc(d.id)}"><div class="bd"><div class="tt">${esc(decQ(d))}</div>${decTldr(d)?`<div class="ds">${mdLine(decTldr(d))}</div>`:''}<div class="mt">${dchip(decDept(d))}<small style="color:var(--muted)">${plural(decVoters(d),'голос','голоса','голосов')}</small></div></div></div>`).join('')}</div>
      </section>`:''}
      <section class="panel">
        <div class="panel-h"><h2><span class="hi">${ic('Zap')}</span>Если сил мало: задачи на 15 минут</h2></div>
        <div class="list">${quick.map(t=>taskItem(t)).join('') || '<div class="empty">Быстрых свободных задач нет.</div>'}</div>
      </section>
      ${isAdmin() ? heatmap() : ''}
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
  return S.tasks.filter(t => (dept ? inDept(t,dept) : UI.filt.dept==='all' || (UI.filt.dept==='mine' ? canEdit(t) : inDept(t,UI.filt.dept))) && (!UI.filt.small || t.size==='S') && (!UI.filt.mine || t.who===S.me || top.includes(t.id)));
}
function card(t){
  const d = D[t.dept] || DEPTS[0]; const sub = t.sub||[], sd = sub.filter(s=>s.done).length;
  const ks = kids(t.id), kd = ks.filter(k=>k.status==='done').length, picked = UI.merge && UI.merge.includes(t.id);
  return `<div class="card${canEdit(t)?'':' ro'}${ks.length?' big':''}${picked?' picked':''}" tabindex="0" draggable="${canEdit(t) && !UI.merge}" data-id="${esc(t.id)}" data-open="task:${esc(t.id)}" style="--dc:${d.color}">
    ${UI.merge ? `<span class="pick" aria-hidden="true">${picked?ic('Check'):''}</span>` : ''}
    <div class="tt">${esc(t.title)}</div>
    ${t.tldr?`<div class="tl">${mdLine(t.tldr)}</div>`:''}${blockedNote(t)}
    ${ks.length?`<div class="grp" title="${esc(ks.map(k=>'• '+k.title).join('\n'))}">${ic('Layers')} ${plural(ks.length,'задача','задачи','задач')} внутри<span class="sp"></span><small>${kd}/${ks.length}</small></div><div class="mini-bar"><i style="width:${Math.round(kd/ks.length*100)}%"></i></div>`:''}
    ${sub.length?`<div class="mini-bar"><i style="width:${Math.round(sd/sub.length*100)}%"></i></div>`:''}
    <div class="mt">${tDepts(t).map(x=>D[x]).map(x=>`<span class="dchip" style="--dc:${x.color}" title="${esc(x.name)}">${ic(x.icon)}</span>`).join('')}<span class="size">${esc(t.size||'M')}</span>${dueChip(t)}${canEdit(t)?'':`<span title="Только просмотр: задача другого отдела" style="color:var(--muted)">${ic('Lock')}</span>`}${(me().top3||[]).includes(t.id)?`<span title="В «Моём дне»" style="color:var(--warn)">${ic('Sun')}</span>`:''}<span class="sp"></span>${(n => n?`<small style="color:var(--muted)">${ic('Paperclip')} ${n}</small>`:'')(S.files.filter(f=>f.task===t.id).length)}${(n => n?`<small style="color:var(--muted)" title="Сообщений в обсуждении">${ic('MessageSquare')} ${n}</small>`:'')((t.comments||[]).length + ((threadChat('task', t.id)||{}).n||0))}${av(t.who,22)}</div>
  </div>`;
}
function board(dept){
  const list = filteredTasks(dept).filter(t=>!isKid(t)).sort(byOrder); // задачи внутри большой показываем в её карточке
  return `${mergeBar()}<div class="board${UI.merge?' merging':''}">${COLS.map(([id,name,color]) => { const items = list.filter(t=>t.status===id);
    return `<div class="colm" data-col="${id}"><div class="colm-h"><span class="dot" style="background:${color}"></span>${name}<span class="n">${items.length}</span></div>${items.map(card).join('')}
    ${id==='inbox'||id==='todo' ? `<button class="btn sm ghost" data-action="new-task" data-status="${id}" data-dept="${dept||''}">${ic('Plus')} Задача</button>`:''}</div>`; }).join('')}</div>`;
}
function filters(withDept){
  const f = UI.filt;
  return `<div class="toolbar">
    ${withDept ? `<select class="select" data-action="filt-dept" aria-label="Отдел">${myDepts().length && !seesAll() ? `<option value="mine" ${f.dept==='mine'?'selected':''}>Мои отделы</option>`:''}<option value="all" ${f.dept==='all'?'selected':''}>Все отделы</option>${DEPTS.map(d=>`<option value="${d.id}" ${f.dept===d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select>`:''}
    <div class="seg"><button data-action="filt-small" aria-pressed="${f.small}">${ic('Zap')} Только ≤ 15 мин</button><button data-action="filt-mine" aria-pressed="${f.mine}">${ic('Sun')} Только мои</button></div>
    <button class="btn sm" data-action="merge-mode" aria-pressed="${!!UI.merge}" title="Выбрать несколько карточек и собрать их в одну большую задачу">${ic('Layers')} Объединить</button>
    <small style="color:var(--muted)">Перетаскивайте карточки между колонками, а на другую карточку — чтобы вложить в неё</small>
  </div>`;
}
/* режим выбора карточек для объединения */
function mergeBar(){
  if (!UI.merge) return '';
  const n = UI.merge.length;
  return `<div class="merge-bar">${ic('Layers')}<span>${n ? 'Выбрано: <b>'+n+'</b>' : 'Нажимай на карточки, которые нужно собрать в одну задачу'}</span><span class="sp"></span>
    <button class="btn sm primary" data-action="merge-go" ${n<2?'disabled':''}>Объединить${n>1?' ('+n+')':''}</button><button class="btn sm ghost" data-action="merge-mode">Отмена</button></div>`;
}
function mergeDialog(ids){
  const list = ids.map(task).filter(Boolean);
  const opts = [['', 'Новая большая задача'], ...list.map(t=>[t.id, 'В задачу «'+clip(t.title,60)+'»'])];
  overlay(`<form class="pal" data-form="merge"><div class="cap"><h2>${ic('Layers')} Объединить ${plural(list.length,'задачу','задачи','задач')}</h2>
    <div class="links">${list.map(t=>`<span class="link">${esc(clip(t.title,48))}</span>`).join('')}</div>
    ${inSelect('into','Куда собрать',opts,'')}
    ${inText('title','Название большой задачи','', 'maxlength="160" placeholder="Например: Запустить систему бизнесов"')}
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint">Задачи не удаляются — они станут частью большой, их можно вынести обратно</span><span style="flex:1"></span><button class="btn primary">${ic('Layers')} Объединить</button></div></div></form>`);
}
let downOnBg = false;
document.addEventListener('pointerdown', e => { downOnBg = !!(e.target.matches && e.target.matches('.overlay[data-action="overlay-bg"]')); }, true);
/* удаление задачи с отменой: документ удаляется сразу (у всех пропадает), копия живёт UNDO_MS в этой вкладке.
   Файлы задачи стираем только когда время вышло — иначе восстанавливать было бы нечего */
const PENDING_FILES = new Map();
function deleteTask(t){
  const id = t.id, data = Object.assign({}, t); delete data.id;
  const ks = kids(id).filter(canEdit).map(k=>k.id), fids = S.files.filter(f=>f.task===id).map(f=>f.id);
  write(()=>col('hub_tasks').doc(id).delete()).then(ok => {
    if (!ok) return;
    log('удалил(а) задачу', t.title, t.dept); if (UI.drawer==='task:'+id) closeDrawer();
    ks.forEach(k=>col('hub_tasks').doc(k).update(Object.assign({parent:FV().delete()}, stamp())).catch(()=>{}));
    if (fids.length) PENDING_FILES.set(id, fids);
    const timer = setTimeout(() => { const f = PENDING_FILES.get(id); PENDING_FILES.delete(id); if (f) deleteFiles(f).catch(()=>{}); }, UNDO_MS);
    undoToast(ic('Trash2')+' Задача «'+esc(clip(t.title,50))+'» удалена', async () => {
      clearTimeout(timer); PENDING_FILES.delete(id);
      const ok = await write(()=>col('hub_tasks').doc(id).set(Object.assign(data, stamp())));
      if (!ok) return;
      ks.forEach(k=>col('hub_tasks').doc(k).update(Object.assign({parent:id}, stamp())).catch(()=>{}));
      log('восстановил(а) задачу', t.title, t.dept); toast(ic('Undo2')+' Задача восстановлена');
    });
  });
}
/* вкладку закрыли, пока шёл отсчёт, — удаление окончательное, дочищаем файлы */
addEventListener('pagehide', () => { for (const f of PENDING_FILES.values()) deleteFiles(f).catch(()=>{}); PENDING_FILES.clear(); });
/* собрать задачи в одну: into — id существующей большой задачи или null (тогда создаём новую с названием title) */
async function mergeTasks(ids, into, title){
  const target = into && task(into);
  if (into && !target) return false;
  let list = [...new Set(ids)].map(task).filter(t => t && t.id!==into);
  /* вложенность одна: задачи из вложенных групп переезжают в новую группу вместе с ними */
  list = [...new Set([...list, ...list.flatMap(t=>kids(t.id))])].filter(t => t.id!==into);
  if (!list.length) return false;
  const ro = list.filter(t=>!canEdit(t));
  if (ro.length) { toast(ic('Lock')+' Нельзя вложить чужие задачи: '+ro.map(t=>'«'+esc(clip(t.title,40))+'»').join(', ')+'. Их меняют участники своих отделов.'); return false; }
  const b = DB.batch(); let pid = into;
  if (!target) {
    const ref = col('hub_tasks').doc(); pid = ref.id;
    const depts = [...new Set(list.flatMap(tDepts))].filter(canSee), dues = list.map(t=>t.due).filter(Boolean);
    const st = list.every(t=>t.status==='done') ? 'done' : list.some(t=>t.status==='doing'||t.status==='review') ? 'doing' : 'todo';
    const name = clip((title||'').trim(),160) || clip(list[0].title,160);
    b.set(ref, {title:name, tldr:'', details:'', dept:depts[0], depts, status:st, size:'L', who:list[0].who||S.me, due:dues.length?Math.min(...dues):null, ver:null, reg:null, links:[], sub:[], comments:[], createdAt:now(), createdBy:S.me, updatedAt:now(), updatedBy:S.me});
  } else if (target.parent) b.update(col('hub_tasks').doc(target.id), Object.assign({parent:FV().delete()}, stamp()));
  list.forEach((t,i) => b.update(col('hub_tasks').doc(t.id), Object.assign({parent:pid, order:now()+i}, stamp())));
  const ok = await write(()=>b.commit());
  if (!ok) return false;
  const pt = target || {title:clip((title||'').trim(),160) || list[0].title, dept:list[0].dept};
  log('объединил(а) '+plural(list.length,'задачу','задачи','задач')+' в большую', pt.title, pt.dept);
  toast(ic('Layers')+' '+(target ? 'Добавлено в «'+esc(clip(target.title,60))+'»' : 'Собрано в большую задачу «'+esc(clip(pt.title,60))+'»'));
  return pid;
}
/* задачи отдела видят только те, у кого этот отдел отмечен в профиле */
const askAdmin = () => isAdmin() ? `<a class="btn sm" href="#/people">${ic('Users')} Назначить отделы</a>`
  : `<small style="color:var(--muted)">Отделы назначает руководитель${adminNames() ? ': '+esc(adminNames()) : ''}.</small>`;
const roHint = d => `<div class="tldr"><b>${ic('Eye')} Только просмотр</b>Задачи отдела «${esc(d.name)}» меняют его участники. Ты можешь смотреть и писать в обсуждении задачи. ${askAdmin()}</div>`;
function viewTasks(){
  const mine = myDepts();
  if (UI.filt.dept==='mine' && (!mine.length || seesAll())) UI.filt.dept = 'all';
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#8DB6F8">${ic('LayoutGrid')}</span><div><h1>Задачи</h1><p>${seesAll() ? 'У тебя все роли — можешь менять задачи всех отделов.' : 'Видны задачи всех отделов. Менять можно задачи своих'+(mine.length ? ': '+esc(mine.map(id=>D[id].name).join(', ')) : ' — отделы назначает руководитель')+', остальные — смотреть и комментировать.'}</p></div></div><button class="btn primary" data-action="new-task" data-status="todo">${ic('Plus')} Задача</button></div>
  ${filters(true) + board(null)}`;
}

/* ── обзор руководителя ───────────────────────
   Где горит за одну минуту: просрочки, задачи без ответственного, застрявшие, заблокированные,
   решения без итога, критичные баги, заявки. Плюс нагрузка по людям, отделы, текущая версия и метрики. */
const STUCK_DAYS = 3, DEC_DAYS = 7, SIZE_W = {S:1, M:3, L:8};
const isLate = t => dueLeft(t)!==null && dueLeft(t)<0;
function leadData(){
  const open = S.tasks.filter(t=>t.status!=='done'), idle = t => (t.updatedAt||t.createdAt||0) < now()-STUCK_DAYS*DAY;
  return {open,
    overdue: open.filter(isLate).sort((a,b)=>a.due-b.due),
    noOwner: open.filter(t=>!t.who),
    stuck: open.filter(t=>(t.status==='doing'||t.status==='review') && idle(t)),
    blocked: open.filter(t=>t.status==='blocked'),
    decs: allDecs().filter(d=>decOpen(d) && decAt(d) && decAt(d) < now()-DEC_DAYS*DAY),
    crit: allBugs().filter(b=>b.open && b.sev==='critical')};
}
function leadAlerts(){ const L = leadData(); return L.overdue.length + L.blocked.length + L.crit.length + S.pending.length; }
function viewLead(){
  const L = leadData(), t0 = now(), wk = 7*DAY;
  const closedIn = (a, b) => S.tasks.filter(t=>t.status==='done' && (t.doneAt||0) >= a && (t.doneAt||0) < b);
  const doneWeek = closedIn(t0-wk, t0+1), donePrev = closedIn(t0-2*wk, t0-wk);
  const madeWeek = S.tasks.filter(t=>(t.createdAt||0) >= t0-wk);
  const working = L.open.filter(t=>t.status==='doing' || t.status==='review');
  const team = Object.keys(S.people), online = team.filter(isOnline);
  /* закрытые задачи по дням за 14 дней — столбики активности */
  const days = Array.from({length:14}, (_,i) => dayKey(t0-(13-i)*DAY));
  const perDay = days.map(k => S.tasks.filter(t=>t.status==='done' && t.doneAt && dayKey(t.doneAt)===k).length);
  const maxDay = Math.max(1, ...perDay);
  /* здоровье: доля открытых задач без проблем */
  const bad = new Set([...L.overdue, ...L.blocked, ...L.stuck].map(t=>t.id));
  /* без ответственного важно, только когда задача уже в работе или у неё близкий срок; остальное — обычный бэклог */
  const ownerless = L.noOwner.filter(t => t.status==='doing' || t.status==='review' || (dueLeft(t)!==null && dueLeft(t)<=7)), backlog = L.noOwner.length - ownerless.length;
  const health = L.open.length ? Math.round((L.open.length - bad.size) / L.open.length * 100) : 100;
  const fire = L.overdue.length + L.blocked.length + L.crit.length, warnN = L.stuck.length + ownerless.length + L.decs.length + S.pending.length;
  const mood = fire ? ['red', 'CircleAlert', 'Горит: '+plural(fire,'проблема','проблемы','проблем')] : warnN ? ['warn', 'Eye', 'Есть вопросы: '+warnN] : ['ok', 'CircleCheck', 'Всё под контролем'];
  const delta = doneWeek.length - donePrev.length;
  const deltaTxt = delta>0 ? `<span class="up">▲ ${delta}</span> к прошлой неделе` : delta<0 ? `<span class="down">▼ ${-delta}</span> к прошлой неделе` : 'столько же, сколько на прошлой неделе';
  const summary = `За 7 дней команда закрыла <b>${plural(doneWeek.length,'задачу','задачи','задач')}</b> (${deltaTxt}). Сейчас в работе ${working.length}, всего открыто ${L.open.length}`
    + (L.overdue.length ? `, просрочено <b class="t-red-tx">${L.overdue.length}</b>` : '') + (L.blocked.length ? `, заблокировано <b class="t-red-tx">${L.blocked.length}</b>` : '') + '.';
  /* единый список «что требует внимания»: по важности, у каждой строки — причина */
  const ATT = [];
  S.pending.forEach(p => ATT.push({w:0, tag:['Заявка в хаб','warn'], title:p.name||p.login||'Новый участник', sub:'ждёт одобрения', go:'people'}));
  L.crit.forEach(b => ATT.push({w:1, tag:['Критичный баг','red'], title:b.name, sub:(D[b.dept]||{}).name||'', open:b.ref, who:b.who}));
  L.overdue.forEach(t => ATT.push({w:2, tag:['Просрочено на '+plural(-dueLeft(t),'день','дня','дней'),'red'], title:t.title, sub:tDepts(t).map(x=>D[x].name).join(', '), open:'task:'+t.id, who:t.who}));
  L.blocked.forEach(t => ATT.push({w:3, tag:['Заблокировано','red'], title:t.title, sub:t.blockedWhy||'причина не указана', open:'task:'+t.id, who:t.who}));
  L.decs.forEach(d => ATT.push({w:4, tag:['Решение висит '+Math.floor((t0-decAt(d))/DAY)+' дн.','warn'], title:decQ(d), sub:plural(decVoters(d),'голос','голоса','голосов'), dec:d.id}));
  L.stuck.forEach(t => ATT.push({w:5, tag:['Стоит '+Math.floor((t0-(t.updatedAt||t.createdAt||t0))/DAY)+' дн.','warn'], title:t.title, sub:colName(t.status), open:'task:'+t.id, who:t.who}));
  ownerless.forEach(t => ATT.push({w:6, tag:['Нет ответственного','muted'], title:t.title, sub:tDepts(t).map(x=>D[x].name).join(', '), open:'task:'+t.id}));
  ATT.sort((a,b)=>a.w-b.w);
  const attRow = x => `<div class="att" tabindex="0" ${x.open?`data-open="${esc(x.open)}"`:x.dec?`data-action="open-dec" data-id="${esc(x.dec)}"`:`data-go="${x.go}"`}>
    ${chip(x.tag[0], x.tag[1])}<div class="bd"><div class="tt">${esc(clip(x.title,90))}</div><small>${esc(clip(x.sub,90))}</small></div>${x.who?av(x.who,24):''}</div>`;
  /* люди: чем занят сейчас, нагрузка, проблемы */
  const people = team.map(id => { const p = S.people[id], ts = L.open.filter(t=>t.who===id);
    const now_ = ts.find(t=>p.focus && p.focus.task===t.id && p.focus.until>t0) || ts.find(t=>t.status==='doing') || ts.find(t=>t.status==='review');
    return {id, p, ts, now:now_, w:ts.reduce((a,t)=>a+(SIZE_W[t.size]||3),0), over:ts.filter(isLate).length, blk:ts.filter(t=>t.status==='blocked').length,
      done:doneWeek.filter(t=>t.who===id || t.doneBy===id).length, focus:!!(p.focus && p.focus.until>t0), on:isOnline(id)}; })
    .sort((a,b)=>(b.on-a.on) || (b.w-a.w));
  const maxW = Math.max(8, ...people.map(x=>x.w));
  const personCard = x => `<div class="pcard">
    <div class="pc-h">${av(x.id,34)}<div class="bd"><b>${esc(pname(x.id))}</b><small>${x.focus ? `<span class="st on">${ic('Headphones')} в фокусе</span>` : x.on ? '<span class="st on">онлайн</span>' : '<span class="st">был(а) '+esc(ago(x.p.seen||0))+'</span>'}${x.p.role?' · '+esc(x.p.role):''}</small></div></div>
    <div class="pc-now">${x.now ? `<span class="lbl">Сейчас</span><span class="lnk" data-open="task:${esc(x.now.id)}">${esc(clip(x.now.title,70))}</span>` : `<span class="lbl">Сейчас</span><span style="color:var(--muted)">${x.ts.length ? 'нет задачи в работе' : 'свободен(на) — можно дать задачу'}</span>`}</div>
    <div class="pc-load" title="Нагрузка: S = 1, M = 3, L = 8"><div class="mini-bar"><i style="width:${Math.min(100,Math.round(x.w/maxW*100))}%;${x.w>=16?'background:var(--warn)':''}"></i></div><small>${plural(x.ts.length,'задача','задачи','задач')}</small></div>
    <div class="pc-f">${x.done?`<span class="chip t-ok">${ic('Check')} ${x.done} за неделю</span>`:''}${x.over?`<span class="chip t-red">просрочено ${x.over}</span>`:''}${x.blk?`<span class="chip t-red">блок ${x.blk}</span>`:''}</div></div>`;
  /* отделы: прогресс = закрыто за 14 дней от (закрыто + открыто) */
  const depts = DEPTS.map(d => { const ts = L.open.filter(t=>inDept(t,d.id)), dn = S.tasks.filter(t=>t.status==='done' && inDept(t,d.id) && (t.doneAt||0) >= t0-14*DAY).length;
    return {d, n:ts.length, dn, over:ts.filter(isLate).length, blk:ts.filter(t=>t.status==='blocked').length, work:ts.filter(t=>t.status==='doing'||t.status==='review').length}; })
    .filter(x=>x.n || x.dn);
  const deptCard = x => { const pct = x.n+x.dn ? Math.round(x.dn/(x.n+x.dn)*100) : 0;
    return `<button class="dcard" data-go="d/${x.d.id}/tasks" style="--dc:${x.d.color}"><div class="dc-h">${ic(x.d.icon)}<b>${esc(x.d.name)}</b><span class="sp"></span>${x.over||x.blk?`<span class="chip t-red">${x.over+x.blk} проблем</span>`:''}</div>
      <div class="dc-n"><span><b>${x.work}</b> в работе</span><span><b>${x.n}</b> открыто</span><span><b>${x.dn}</b> закрыто за 2 нед.</span></div>
      <div class="mini-bar"><i style="width:${pct}%;background:var(--dc)"></i></div></button>`; };
  const cur = S.reg.filter(x=>x.key==='release/versions' && x.status==='Готовится').sort(byOrder);
  const kpi = (label, val, sub, extra='') => `<div class="kpi"><span class="k">${label}</span><span class="v">${val}</span><span class="s">${sub}</span>${extra}</div>`;
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#F49A9A">${ic('Gauge')}</span><div><h1>Обзор руководителя</h1><p>Что происходит в команде прямо сейчас — за одну минуту.</p></div></div>
    <button class="btn" data-action="week-report">${ic('FileDown')} Отчёт за неделю</button></div>
  <section class="lead-hero tone-${mood[0]}">
    <div class="lh-main"><span class="lh-state">${ic(mood[1])} ${mood[2]}</span><p>${summary}</p>
      ${ATT.length ? `<small style="color:var(--text-2)">Главное: ${[...new Set(ATT.map(x=>x.title))].slice(0,3).map(x=>esc(clip(x,40))).join(' · ')}</small>` : '<small style="color:var(--text-2)">Нечего тушить — можно думать о следующей версии.</small>'}</div>
    <div class="lh-ring"><div class="ring" style="--p:${health};--rc:var(--${health>=80?'ok':health>=55?'warn':'red'})"><span>${health}%</span></div><small>задач идут<br>без проблем</small></div>
  </section>
  <div class="kpis">
    ${kpi('Закрыто за неделю', doneWeek.length, deltaTxt)}
    ${kpi('В работе сейчас', working.length, plural(L.open.length,'открытая задача','открытые задачи','открытых задач'))}
    ${kpi('Новых за неделю', madeWeek.length, madeWeek.length > doneWeek.length ? 'задач приходит больше, чем закрывается' : 'закрываем не медленнее, чем приходят')}
    ${kpi('Онлайн', online.length+'<small> / '+team.length+'</small>', online.length ? online.slice(0,4).map(id=>esc(pname(id).split(' ')[0])).join(', ') : 'сейчас никого')}
  </div>
  <div class="lead-g">
    <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('Flame')}</span>Требует твоего внимания${ATT.length?' · '+ATT.length:''}</h2></div>
      <div class="att-list">${ATT.slice(0,12).map(attRow).join('') || `<div class="empty"><b>${ic('CircleCheck')} Всё чисто</b>Ни просрочек, ни блоков, ни зависших решений.</div>`}${ATT.length>12?`<small style="color:var(--muted)">и ещё ${ATT.length-12} — смотри задачи отделов</small>`:''}${backlog?`<a class="btn sm ghost" href="#/tasks" style="align-self:flex-start">${ic('Inbox')} В бэклоге без ответственного: ${backlog}</a>`:''}</div></section>
    <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('TrendingUp')}</span>Темп команды</h2><span class="sub">закрыто задач по дням</span></div>
      <div class="bars">${perDay.map((n,i)=>`<span title="${new Date(t0-(13-i)*DAY).toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}: ${n}"><i style="height:${Math.max(4, Math.round(n/maxDay*100))}%;${n?'':'opacity:.25'}"></i></span>`).join('')}</div>
      <div class="bars-x"><span>2 недели назад</span><span>сегодня</span></div>
      <p class="sub-h" style="margin:14px 0 6px">Последние события</p><div class="log">${S.log.slice(0,5).map(logEntry).join('') || '<small style="color:var(--muted)">Пока тихо.</small>'}</div>
      <a class="btn sm ghost" href="#/log" style="align-self:flex-start">Весь журнал</a></section>
  </div>
  <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('Users')}</span>Кто чем занят</h2><span class="sub">сначала те, кто онлайн</span></div>
    <div class="pgrid">${people.map(personCard).join('') || '<div class="empty">В команде пока никого.</div>'}</div></section>
  ${depts.length ? `<section class="panel"><div class="panel-h"><h2><span class="hi">${ic('LayoutGrid')}</span>Отделы</h2><span class="sub">полоска — доля закрытого за 2 недели</span></div><div class="dgrid">${depts.map(deptCard).join('')}</div></section>` : ''}
  ${cur.length ? `<section class="panel"><div class="panel-h"><h2><span class="hi">${ic('Rocket')}</span>Готовятся к выходу</h2><a class="btn sm ghost" href="#/d/qa/versions">Все версии</a></div>${cur.map(v=>`<div><b>${esc(v.name)}</b>${v.tldr?` <small style="color:var(--text-2)">${esc(v.tldr)}</small>`:''}${verProgress(v) || '<div><small style="color:var(--muted)">К версии пока не привязано ни одной задачи — укажи версию в карточке задачи.</small></div>'}</div>`).join('')}</section>` : ''}
  ${metricTiles()}`;
}
/* отчёт за неделю в Markdown: что закрыто, что просрочено и заблокировано, какие решения приняты, что вышло */
function weekReport(){
  const from = now()-7*DAY, L = leadData(), line = t => '- '+t.title+' — '+tDepts(t).map(x=>D[x].name).join(', ')+(t.who?' · '+pname(t.who):'');
  const done = S.tasks.filter(t=>t.status==='done' && (t.doneAt||0) >= from);
  const made = S.tasks.filter(t=>(t.createdAt||0) >= from);
  const decs = allDecs().filter(d=>!decOpen(d) && ((isEdec(d) ? d.updatedAt : d.chosenAt)||0) >= from);
  const vers = S.reg.filter(x=>x.key==='release/versions' && x.status==='Вышла' && (x.updatedAt||0) >= from);
  const out = ['# Отчёт за неделю', '', '_'+fullDt.format(from)+' — '+fullDt.format(now())+'_', '',
    '| | |', '|---|---|', '| Закрыто задач | '+done.length+' |', '| Создано задач | '+made.length+' |', '| Просрочено сейчас | '+L.overdue.length+' |',
    '| Заблокировано | '+L.blocked.length+' |', '| Без ответственного | '+L.noOwner.length+' |', '| Критичных багов | '+L.crit.length+' |', ''];
  const sec = (h, list, f) => { if (list.length) out.push('## '+h, '', ...list.map(f), ''); };
  sec('Закрыто', done, line);
  sec('Вышли версии', vers, v => '- **'+v.name+'**'+(v.tldr?' — '+v.tldr:''));
  sec('Приняты решения', decs, d => '- '+decQ(d)+' → **'+decChoice(d)+'**');
  sec('Просрочено', L.overdue, t => line(t)+' · срок '+dateFmt(t.due));
  sec('Заблокировано', L.blocked, t => line(t)+' · '+(t.blockedWhy||''));
  sec('Застряли (больше '+STUCK_DAYS+' дн. без движения)', L.stuck, line);
  sec('Критичные баги', L.crit, b => '- '+b.name+' — '+D[b.dept].name);
  sec('Метрики', S.reg.filter(x=>x.key==='analytics/metrics'), m => '- '+m.name+': **'+(m.value||'—')+'**'+(m.target?' (цель: '+m.target+')':'')+(m.at?' · снимок '+m.at:''));
  saveMd('Отчёт за неделю '+isoDay(now())+'.md', out.concat(mdFoot()).join('\n'));
  toast(ic('FileDown')+' Отчёт за неделю скачан');
}

/* ── решения ────────────────────────────────── */
/* решение можно вынести из записи отдела (ассет, механика, экран…): запись остаётся на месте, решение ссылается на неё.
   Решать — вариантами или реакцией (за / против / есть вопросы) */
const REACTS = [{t:'👍 За', d:''}, {t:'👎 Против', d:''}, {t:'🤔 Есть вопросы', d:''}];
const regTab = it => { const dd = D[it.key.split('/')[0]]; return dd ? dd.id+'/'+((dd.tabs.find(x=>tabKey(dd, x[0])===it.key)||[])[0]||'overview') : it.key; };
const regPath = it => REG_HOME[it.key] || 'd/'+regTab(it);
function openReg(id){ const it = regItem(id); if (!it) { toast(ic('CircleAlert')+' Запись уже удалили'); return; } go(regPath(it)); setTimeout(()=>openDrawer('reg:'+id), 120); }
function openDec(id){ go('decisions'); setTimeout(() => { const el = document.getElementById('dec-'+id); if (el) { el.scrollIntoView({block:'center', behavior:'smooth'}); el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'), 1600); } }, 150); }
const regDecs = id => S.decisions.filter(d=>d.ref && d.ref.id===id).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
const decMark = id => { const ds = regDecs(id); if (!ds.length) return ''; const open = ds.some(d=>d.chosen==null);
  return `<span class="dec-mark${open?' open':''}" title="${open?'На решении':'Решение принято'}">${ic('Scale')}</span>`; };
function refChip(d){
  if (!d.ref) return '';
  const it = regItem(d.ref.id), r = REGS[d.ref.key];
  return `<button type="button" class="ref-chip" data-action="open-reg" data-id="${esc(d.ref.id)}" ${it?'':'disabled'} title="${it?'Открыть запись':'Запись удалена'}">${ic('Paperclip')} ${esc((r ? r.noun[0].toUpperCase()+r.noun.slice(1) : 'Запись')+': '+((it && it.name) || d.ref.name || ''))}${it?'':' · удалена'}</button>`;
}
function reactRow(d){
  const votes = d.votes||{}, mine = votes[S.me], open = d.chosen==null;
  return `<div class="reacts">${(d.options||[]).map((o,i) => { const who = Object.entries(votes).filter(([,v])=>v===i).map(([u])=>u);
    return `<div class="react${mine===i?' mine':''}${d.chosen===i?' chosen':''}"><button class="react-b" ${open?`data-action="vote" data-id="${esc(d.id)}" data-i="${i}"`:'disabled'} aria-pressed="${mine===i}" title="${esc(who.map(pname).join(', ')||'Пока никого')}">${esc(o.t)} <b>${who.length}</b></button><span class="votes">${who.map(u=>av(u,22)).join('')}</span>
      ${open && who.length ? `<button class="btn sm ghost" data-action="accept" data-id="${esc(d.id)}" data-i="${i}" title="Зафиксировать итог">Принять</button>` : ''}</div>`; }).join('')}</div>`;
}
/* закреплённые решения — свои у каждого (поле pins в hub_people), висят наверху раздела, чтобы не искать их в списке */
const myPins = () => Array.isArray(me().pins) ? me().pins : [];
const isPinned = id => myPins().includes(id);
const pinBtn = id => { const on = isPinned(id);
  return `<button class="mini-x pin-b${on?' on':''}" data-action="dec-pin" data-id="${esc(id)}" aria-pressed="${on}" title="${on?'Открепить':'Закрепить наверху'}" aria-label="${on?'Открепить решение':'Закрепить решение'}" style="margin:0">${ic('Pin')}</button>`; };
function decisionCard(d){
  const votes = d.votes||{}, mine = votes[S.me];
  const note = d.note ? `<div class="dec-note"><b>Мысль целиком</b>${mdBlock(d.note)}</div>` : '';
  if (d.mode==='react') return `<article class="decision${isPinned(d.id)?' pinned':''}" id="dec-${esc(d.id)}">
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap"><h3>${esc(d.q)}</h3><div style="display:flex;gap:6px;align-items:center">${pinBtn(d.id)}${dchip(d.dept)}${d.chosen!=null?chip('Принято','ok'):chip('Реакции','info')}<button class="mini-x" data-action="dec-del" data-id="${esc(d.id)}" title="Удалить решение" aria-label="Удалить решение" style="margin:0">${ic('Trash2')}</button></div></div>
    ${refChip(d)}${d.tldr?`<div class="tldr"><b>Суть</b>${mdLine(d.tldr)}</div>`:''}${note}
    ${reactRow(d)}
    ${d.chosen!=null?`<div class="meta-line" style="font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap">${decTaskBtn(d)}Итог: <b style="color:var(--text)">${esc((d.options[d.chosen]||{}).t||'')}</b> · зафиксировал(а) ${esc(pname(d.chosenBy))} · ${ago(d.chosenAt)} <button class="btn sm ghost" data-action="reopen" data-id="${esc(d.id)}">${ic('RotateCcw')} Переоткрыть</button></div>`:''}
  </article>`;
  return `<article class="decision${isPinned(d.id)?' pinned':''}" id="dec-${esc(d.id)}">
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap"><h3>${esc(d.q)}</h3><div style="display:flex;gap:6px;align-items:center">${pinBtn(d.id)}${dchip(d.dept)}${d.chosen!=null?chip('Принято','ok'):chip('Голосуем','info')}<button class="mini-x" data-action="dec-del" data-id="${esc(d.id)}" title="Удалить решение" aria-label="Удалить решение" style="margin:0">${ic('Trash2')}</button></div></div>
    ${refChip(d)}${d.tldr?`<div class="tldr"><b>Суть</b>${mdLine(d.tldr)}</div>`:''}${note}
    <div class="list">${(d.options||[]).map((o,i)=>`<div class="opt${d.chosen===i?' chosen':''}${mine===i?' mine':''}">
      <div><div class="l">${esc(o.t)} ${d.rec===i?'<span class="chip t-violet" style="margin-left:4px">рекомендуем</span>':''}</div>${o.d?`<div class="d">${mdLine(o.d)}</div>`:''}</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="votes">${Object.entries(votes).filter(([,v])=>v===i).map(([u])=>av(u,24)).join('')}</span>
      ${d.chosen==null ? `<button class="btn sm${mine===i?' primary':''}" data-action="vote" data-id="${esc(d.id)}" data-i="${i}">${mine===i?ic('Check')+' Мой голос':'Голосовать'}</button>
      <button class="btn sm ghost" data-action="accept" data-id="${esc(d.id)}" data-i="${i}" title="Зафиксировать итог">Принять</button>`:''}</div></div>`).join('')}</div>
    ${d.chosen!=null?`<div class="meta-line" style="font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap">${decTaskBtn(d)}Итог зафиксировал(а) ${esc(pname(d.chosenBy))} · ${ago(d.chosenAt)} <button class="btn sm ghost" data-action="reopen" data-id="${esc(d.id)}">${ic('RotateCcw')} Переоткрыть</button></div>`:''}
  </article>`;
}
/* общий список решений: решения хаба и вопросы экономики (у них свои поля: question, options[{label,desc}], recommended с 1) */
const isEdec = d => d._e === true;
const allDecs = () => [...S.decisions, ...S.edec.map(x => Object.assign({}, x, {_e:true}))];
const decOpen = d => isEdec(d) ? (d.chosen==null || d.chosen==='') : d.chosen==null;
const decQ = d => isEdec(d) ? d.question||'' : d.q||'';
const decTldr = d => isEdec(d) ? '' : d.tldr||'';
const decDept = d => isEdec(d) ? 'econ' : hd(d.dept);
const decVoters = d => Object.values(d.votes||{}).filter(v=>v!=null).length;
const decAt = d => d.createdAt || d.updatedAt || 0;
function pendingDecs(){ return allDecs().filter(d=>decOpen(d) && (d.votes||{})[S.me]==null); }
/* принятое решение превращается в задачу: в задаче остаётся ссылка на решение */
const decChoice = d => isEdec(d) ? ((d.options||[])[Number(d.chosen)]||{}).label||'' : ((d.options||[])[d.chosen]||{}).t||'';
const decTaskBtn = d => `<button class="btn sm" data-action="dec-task" data-id="${esc(d.id)}" data-e="${isEdec(d)?1:''}">${ic('Plus')} Задача из итога</button>`;
const decCard = d => isEdec(d) ? eDecCard(d) : decisionCard(d);
/* ряд кнопок «Все / отдел / отдел…» над общими списками; ссылки меняют адрес, поэтому фильтр переживает обновление страницы */
function deptSeg(base, cur, counts){
  const ids = DEPTS.map(d=>d.id).filter(id=>counts[id]);
  if (cur!=='all' && !ids.includes(cur)) ids.push(cur);
  const all = Object.values(counts).reduce((a,b)=>a+b, 0);
  return `<div class="seg dseg" role="group" aria-label="Отдел"><a href="#/${base}" role="button" aria-pressed="${cur==='all'}">Все <span class="mono" style="color:var(--muted)">${all}</span></a>${ids.map(id=>`<a href="#/${base}/${id}" role="button" aria-pressed="${cur===id}" style="--dc:${D[id].color}">${ic(D[id].icon)} ${esc(D[id].name)} <span class="mono" style="color:var(--muted)">${counts[id]||0}</span></a>`).join('')}</div>`;
}
function viewDecisions(dept){
  const f = dept || UI.dfilt, every = allDecs();
  const list = every.filter(d=>f==='all'||decDept(d)===f).sort((a,b)=>decAt(b)-decAt(a));
  const pins = myPins(), pinned = pins.map(id=>list.find(d=>d.id===id)).filter(Boolean), rest = list.filter(d=>!pins.includes(d.id));
  const open = rest.filter(decOpen), closed = rest.filter(d=>!decOpen(d));
  const counts = {}; every.forEach(d => { const k = decDept(d); if (k) counts[k] = (counts[k]||0)+1; });
  return `${dept?'':`<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#B9A3FF">${ic('Scale')}</span><div><h1>Решения</h1><p>Все спорные вопросы команды, включая экономику: варианты, голоса, итог. Принятое не теряется в чатах.</p></div></div><button class="btn primary" data-action="new-decision" data-dept="${f==='all'?'':f}">${ic('Plus')} Решение</button></div>
  <div class="toolbar">${deptSeg('decisions', f, counts)}</div>`}
  ${pinned.length?`<h2 class="sub-h">${ic('Pin')} Закреплено · ${pinned.length}</h2>${pinned.map(decCard).join('')}`:''}
  ${open.length?`<h2 class="sub-h">Голосуем · ${open.length}</h2>${open.map(decCard).join('')}`:''}
  ${closed.length?`<h2 class="sub-h">Принято · ${closed.length}</h2>${closed.map(decCard).join('')}`:''}
  ${!list.length?`<div class="empty"><b>Решений пока нет</b>Спорный вопрос? Вынеси его на голосование.<button class="btn sm" data-action="new-decision" data-dept="${f==='all'?'':f}">${ic('Plus')} Решение</button></div>`:''}`;
}

/* ── входящие ───────────────────────────────── */
const inboxFind = id => S.inbox.find(i=>i.id===id) || S.team.find(i=>i.id===id);
/* мысль: первая строка — заголовок, остальное — текст; ссылки на чат и решение, куда её вынесли */
function inboxItem(i){
  const mine = i.by===S.me, c = i.chat && chat(i.chat), d = i.dec && dec(i.dec);
  const lines = String(i.text||'').split('\n'), rest = lines.slice(1).join('\n').trim();
  return `<div class="item inb" style="cursor:default" data-pk="i:${esc(i.id)}">${mine ? ic('Lightbulb') : av(i.by,26)}<div class="bd"><div class="tt">${mdLine(lines[0])}</div>${rest?`<div class="ds">${mdBlock(rest)}</div>`:''}
    <div class="mt">${mine?'':`<small style="color:var(--text-2);font-weight:600">${esc(pname(i.by))}</small>`}<small style="color:var(--muted)">${ago(i.at)}</small>${i.dept?dchip(i.dept):''}
      ${mine?`<button type="button" class="btn sm ghost" data-action="inbox-vis" data-id="${esc(i.id)}" title="Сменить, кто видит мысль">${ic(i.team?'Users':'Lock')} ${i.team?'Видит команда':'Только я'}</button>`:''}
      ${c?`<a class="ref-chip" href="#/chats/${esc(c.id)}">${ic('MessagesSquare')} ${esc(clip(c.title,40))}</a>`:''}${d?`<button type="button" class="ref-chip" data-action="open-dec" data-id="${esc(d.id)}">${ic('Scale')} ${esc(clip(d.q,40))}</button>`:''}</div></div>
    <div class="inb-act"><button class="btn sm" data-action="inbox-chat" data-id="${esc(i.id)}">${ic('MessagesSquare')} В чат</button><button class="btn sm" data-action="inbox-dec" data-id="${esc(i.id)}">${ic('Scale')} В решение</button>
    ${mine?`<button class="btn sm" data-action="inbox-task" data-id="${esc(i.id)}">${ic('ArrowRight')} В задачу</button><button class="icon-btn" data-action="inbox-del" data-id="${esc(i.id)}" aria-label="Удалить" title="Удалить">${ic('Trash2')}</button>`:''}</div></div>`;
}
function viewInbox(){
  const list = [...S.inbox].sort((a,b)=>b.at-a.at), team = [...S.team].sort((a,b)=>b.at-a.at);
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#A9A8B6">${ic('Inbox')}</span><div><h1>Входящие</h1><p>Мысли, записанные через <kbd>Q</kbd>. Личные видишь только ты, общие — вся команда. Мысль можно обсудить в чате, вынести на решение или превратить в задачу.</p></div></div><button class="btn primary" data-action="capture">${ic('Plus')} Записать мысль</button></div>
  <div class="list">${list.map(inboxItem).join('') || `<div class="empty"><b>Всё разобрано ${ic('Sparkles')}</b>Голова свободна. Новая мысль — <kbd>Q</kbd>.</div>`}</div>
  ${team.length?`<h2 class="inb-h">${ic('Users')} Мысли команды <small>${team.length}</small></h2><div class="list">${team.map(inboxItem).join('')}</div>`:''}`;
}

/* ── журнал ─────────────────────────────────── */
function logEntry(l){ return `<div class="entry">${av(l.by,24)}<div><b>${esc(pname(l.by))}</b> ${esc(l.act)} ${l.title?`<q>${esc(l.title)}</q>`:''} ${l.dept?dchip(l.dept):''}</div><span class="when">${ago(l.at)}</span></div>`; }
/* правки экономики пишутся и в журнал хаба (короткой строкой), и в журнал экономики (с изменениями полей).
   В общем журнале показываем подробную запись, а короткую копию прячем */
const ELOG_ACTS = new Set(['добавил(а) в экономику','изменил(а) в экономике','удалил(а) из экономики','восстановил(а) в экономике','сменил(а) статус в экономике',
  'проголосовал(а) в экономике','зафиксировал(а) итог в экономике','оставил(а) заметку в экономике','изменил(а) якорь экономики','добавил(а) таблицу в план','изменил(а) таблицу плана']);
function viewLog(){
  const f = UI.lfilt, ready = S.E && S.E.loaded.has('log');
  const hub = S.log.filter(l => !(ready && ELOG_ACTS.has(l.act))).map(l => ({at:l.at||0, dept:hd(l.dept)||'', html:logEntry(l)}));
  const eco = ready ? S.E.log.map(l => ({at:l.at||0, dept:'econ', html:eLogEntry(l)})) : [];
  const every = [...hub, ...eco];
  const counts = {}; every.forEach(x => { if (x.dept) counts[x.dept] = (counts[x.dept]||0)+1; });
  const list = every.filter(x => f==='all' || x.dept===f).sort((a,b)=>b.at-a.at);
  let out = '', day = '';
  for (const x of list) { const d = dayf.format(new Date(x.at)); if (d!==day) { out += `<div class="day">${esc(d)}</div>`; day = d; } out += x.html; }
  const note = f==='econ' ? `<section class="panel"><form class="form" data-form="e-note"><label class="fld"><span>Заметка в журнал экономики</span><textarea class="input" name="t" rows="3" placeholder="Что обсудили, что проверили в игре, какие цифры получили" maxlength="4000">${esc(UI.eDraft||'')}</textarea></label><div style="display:flex;justify-content:flex-end"><button class="btn primary">${ic('Plus')} Добавить заметку</button></div></form></section>` : '';
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#A9A8B6">${ic('ScrollText')}</span><div><h1>Журнал</h1><p>Изменения команды за две недели. Правки экономики — подробно: что было, что стало, и удалённое можно вернуть.</p></div></div></div>
  <div class="toolbar">${deptSeg('log', f, counts)}${ready?'':'<small style="color:var(--muted)"><span class="spin"></span> загружаем журнал экономики…</small>'}</div>
  ${note}<section class="panel"><div class="log">${out || '<div style="color:var(--text-2)">Пока пусто.</div>'}</div></section>`;
}

/* ── люди ───────────────────────────────────── */
function viewPeople(){
  const ids = Object.keys(S.people).sort((a,b)=>(isOnline(b)-isOnline(a)) || String(S.people[a].name).localeCompare(String(S.people[b].name)));
  const adm = isAdmin();
  const roles = (id, p) => adm
    ? `<div class="dpick roles" role="group" aria-label="Отделы: ${esc(p.name)}">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="set-dept" data-uid="${esc(id)}" data-d="${d.id}" aria-pressed="${(p.depts||[]).some(x=>hd(x)===d.id)}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm ghost" data-action="set-all-depts" data-uid="${esc(id)}" data-v="1">Все отделы</button><button class="btn sm ghost" data-action="set-all-depts" data-uid="${esc(id)}" data-v="0">Снять все</button>
      <button class="btn sm${p.admin===true?' primary':''}" data-action="set-admin" data-uid="${esc(id)}" title="Руководитель назначает отделы">${ic('Shield')} ${p.admin===true?'Руководитель':'Сделать руководителем'}</button></div>`
    : `<div class="links">${[...new Set((p.depts||[]).map(hd).filter(Boolean))].map(dchip).join('') || '<small style="color:var(--muted)">Отделы не назначены</small>'}</div>`;
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#86D9B0">${ic('Users')}</span><div><h1>Люди</h1><p>${adm ? 'Ты руководитель: отмечай каждому его отделы — человек сразу увидит задачи этих отделов.' : 'Кто за что отвечает и кто сейчас онлайн. Отделы назначает руководитель'+(adminNames()?' ('+esc(adminNames())+')':'')+'.'}</p></div></div><button class="btn" data-action="settings">${ic('Pencil')} Мой профиль</button></div>
  ${adm && S.pending.length ? `<section class="panel glow"><div class="panel-h"><h2><span class="hi">${ic('UserPlus')}</span>Ждут одобрения · ${S.pending.length}</h2><span class="sub">пока не одобришь, человек ничего в хабе не видит</span></div>
    <div class="list">${S.pending.map(p=>`<div class="item" style="cursor:default"><span class="av" style="background:${safeColor(p.color)}">${esc(initials(p.name))}</span><div class="bd"><div class="tt">${esc(p.name||'Без имени')}</div><div class="mt"><small style="color:var(--muted)">@${esc(p.login||'')} · заявка ${ago(p.createdAt)}</small></div></div>
      <button class="btn sm primary" data-action="approve" data-uid="${esc(p.id)}">${ic('UserCheck')} Одобрить</button><button class="btn sm ghost" data-action="reject" data-uid="${esc(p.id)}">${ic('X')} Отклонить</button></div>`).join('')}</div></section>` : ''}
  <div class="g3">${ids.map(id => { const p = S.people[id]; const f = focusOf(id); const open = S.tasks.filter(t=>t.who===id && t.status!=='done').length;
    return `<section class="panel"><div class="person">${av(id,40)}<div class="bd"><div class="nm">${esc(p.name)}${id===S.me?' <small style="color:var(--muted)">(вы)</small>':''}${p.admin===true?` <span class="chip t-violet" title="Назначает отделы">${ic('Shield')} руководитель</span>`:''}</div><div class="st">${esc(p.role || '@'+(p.login||''))}</div></div></div>
    <div class="st" style="font-size:13px;color:${f?'var(--acc)':'var(--text-2)'}">${f?`${ic('Headphones')} В фокусе ещё <span class="mono" data-until="${f.until}">${mmss(f.until-now())}</span>`: isOnline(id)?`${ic('CircleDot')} Онлайн`:'Был(а) '+ago(p.seen)}</div>
    ${roles(id, p)}<small style="color:var(--muted)">Открытых задач: ${open}</small></section>`; }).join('')}</div>`;
}

/* ── вики ───────────────────────────────────── */
function viewWiki(){
  const list = [...S.wiki].sort(byOrder);
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#F5B98A">${ic('BookOpen')}</span><div><h1>Вики</h1><p>Как всё устроено и правила сервера. Суть сверху — подробности по клику. Текст статей понимает Markdown.</p></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn" title="Открыть файл .md с компьютера в читалке">${ic('BookOpen')} Открыть .md<input type="file" hidden accept=".md,.markdown,.mdown,.mkd,.txt,text/markdown,text/plain" data-action="md-local"></label><button class="btn primary" data-action="wiki-new">${ic('Plus')} Статья</button></div></div>
  <div class="g2">${list.map(w=>`<section class="panel"><div class="panel-h"><h2>${esc(w.title)}</h2><button class="icon-btn" data-open="wiki:${esc(w.id)}" aria-label="Открыть" title="Открыть и изменить">${ic('Pencil')}</button></div>${w.tldr?`<div class="tldr"><b>Суть</b>${mdLine(w.tldr)}</div>`:''}${w.body?`<details class="more"><summary>Подробнее</summary><div class="body md">${md(w.body)}</div></details>`:''}</section>`).join('') || '<div class="empty"><b>Статей пока нет</b></div>'}</div>
  ${wikiRules()}`;
}
/* правила сервера (реестр admin/rules) — справочник, поэтому живут в вики */
function wikiRules(){
  const items = S.reg.filter(x=>x.key==='admin/rules').sort(byOrder), stF = REGS['admin/rules'].fields.find(f=>f.k==='status'), d = D.admin;
  return `<div class="panel-h" style="margin-top:8px"><h2 class="sub-h" style="margin:0">${ic('Shield')} Правила сервера${items.length?' · '+items.length:''}</h2><button class="btn sm" data-open="regnew:admin/rules">${ic('Plus')} Правило</button></div>
  ${items.length ? `<div class="tiles">${items.map(it=>`<button class="tile" data-open="reg:${esc(it.id)}" style="--dc:${d.color}"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h3>${esc(it.name)}${decMark(it.id)}</h3>${it.status?chip(it.status, toneOf(stF, it.status)):''}</div>${it.tldr?`<div class="s">${mdLine(it.tldr)}</div>`:''}</button>`).join('')}</div>`
    : '<div class="empty">Правил пока нет. Добавь первое — его увидит вся команда.</div>'}`;
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
  const key = target.task ? 'task:'+target.task : target.reg ? 'reg:'+target.reg : target.board ? 'board:'+target.board : 'chat:'+target.chat, ids = [];
  for (const file of list) {
    if (file.size > FILE_MAX) { toast(ic('CircleAlert')+' «'+esc(file.name)+'» больше '+fsize(FILE_MAX)+' — положи его в облако и прикрепи ссылку'); continue; }
    S.up[key] = {name:file.name, pct:0}; schedule();
    try {
      const data = b64(await file.arrayBuffer()), ref = col('hub_files').doc(), parts = Math.max(1, Math.ceil(data.length/PART));
      for (let i=0;i<parts;i++) { await col('hub_fileparts').doc(ref.id+'_'+i).set({file:ref.id, i, data:data.slice(i*PART, (i+1)*PART)}); S.up[key].pct = Math.round((i+1)/parts*100); schedule(); }
      const tb = await mkThumb(file);
      if (tb) await col('hub_thumbs').doc(ref.id).set({th:tb.th, by:S.me});
      await ref.set(Object.assign({name:clip(file.name,160), type:clip(file.type,100), size:file.size, parts, by:S.me, at:now()}, tb ? {thumb:true, w:tb.w, h:tb.h} : {}, target));
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
    const f = S.files.find(x=>x.id===id);
    const b = DB.batch(); sn.docs.forEach(d=>b.delete(d.ref)); if (f && f.thumb) b.delete(col('hub_thumbs').doc(id)); b.delete(col('hub_files').doc(id)); await b.commit();
  }
}
/* превью приходит из базы: пропускаем только data:image/… и blob:, иначе через него можно вставить код в страницу */
const safeImg = u => /^(data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+\/=]+|blob:[^\s"'<>]+)$/.test(u||'') ? u : '';
/* старые файлы хранят превью в самом документе (th), новые — в hub_thumbs/{id}: его читаем, только когда картинку показывают */
function thumb(f){
  if (safeImg(f.th)) return f.th;
  if (THUMBS[f.id]) return THUMBS[f.id]==='…' ? '' : THUMBS[f.id];
  THUMBS[f.id] = '…';
  if (f.thumb) { col('hub_thumbs').doc(f.id).get().then(d => { THUMBS[f.id] = safeImg(d.exists && d.data().th); schedule(); }).catch(() => { THUMBS[f.id] = ''; }); return ''; }
  fileBlob(f).then(b => { THUMBS[f.id] = URL.createObjectURL(b); schedule(); }).catch(() => { THUMBS[f.id] = ''; });
  return '';
}
function fileChip(f, big){
  if (!f) return '';
  const del = f.by===S.me ? `<button class="mini-x" data-action="file-del" data-id="${esc(f.id)}" aria-label="Удалить файл" title="Удалить файл">${ic('X')}</button>` : '';
  const src = big && isImg(f) && (f.th || f.thumb || f.size <= THUMB_MAX) ? thumb(f) : '';
  if (src) return `<span class="fimg"><img src="${src}" alt="${esc(f.name)}" data-action="img-view" data-id="${esc(f.id)}" title="${esc(f.name)} · открыть">${del}</span>`;
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
  /* готовые теги прячем в tags: следующие замены (автоссылки, курсив) не должны попадать внутрь атрибутов */
  const tags = [], keep = h => { tags.push(h); return '\u0001'+(tags.length-1)+'\u0001'; };
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;.*?&quot;)?\)/g, (m,a,u) => url(u) ? keep('<img src="'+esc(url(u))+'" alt="'+a+'" loading="lazy">') : a);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;.*?&quot;)?\)/g, (m,t,u) => url(u) ? keep('<a href="'+esc(url(u))+'" target="_blank" rel="noopener noreferrer">')+t+keep('</a>') : t);
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<\u0001]+[^\s<\u0001.,:;!?)])/g, (m,p,u) => p+keep('<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+'</a>'));
  s = s.replace(/\*\*(.+?)\*\*|__(.+?)__/g, (m,a,b) => '<b>'+(a||b)+'</b>');
  s = s.replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<i>$2</i>').replace(/(^|[^_\wа-яё])_(?!\s)(.+?)_(?![\wа-яё])/gi, '$1<i>$2</i>');
  s = s.replace(/~~(.+?)~~/g, '<s>$1</s>');
  s = s.replace(/\u0001(\d+)\u0001/g, (_,i) => tags[i]);
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
/* короткий текст (суть, подписи, шаги): только строчная разметка, переносы строк сохраняются */
const mdLine = s => String(s||'').replace(/\r\n?/g,'\n').split('\n').map(mdInline).join('<br>');
/* многострочный текст (заметки, комментарии, сообщения): полный Markdown, компактно */
const mdBlock = s => '<div class="md md-c">'+md(s, true)+'</div>';
/* предпросмотр под полем ввода: рисуется только когда раскрыт */
const mdPrev = () => '<details class="mdp"><summary>Предпросмотр · можно Markdown</summary><div class="md md-c"></div></details>';
const mdPrevFill = d => { const t = d.previousElementSibling && d.previousElementSibling.matches('textarea') ? d.previousElementSibling : d.parentElement.querySelector('textarea');
  const out = d.querySelector('.md'); if (t && out) out.innerHTML = md(t.value, true) || '<p style="color:var(--muted)">Пусто.</p>'; };
document.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('details.mdp') && e.target.open) mdPrevFill(e.target); }, true);
document.addEventListener('input', e => { const t = e.target; if (!t.matches || !t.matches('textarea')) return;
  const d = t.nextElementSibling && t.nextElementSibling.matches('details.mdp') ? t.nextElementSibling : t.closest('label') && t.closest('label').nextElementSibling;
  if (d && d.matches && d.matches('details.mdp') && d.open) mdPrevFill(d); });
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
/* маленькое превью картинки прямо в hub_files: списки показывают его, не скачивая весь файл */
async function mkThumb(file){
  if (!/^image\/(png|jpe?g|gif|webp)$/i.test(file.type||'')) return null;
  try {
    const bm = await createImageBitmap(file), w = bm.width, h = bm.height, k = Math.min(1, 480/Math.max(w, h));
    const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w*k)); c.height = Math.max(1, Math.round(h*k));
    const g = c.getContext('2d'); g.fillStyle = '#16161c'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bm, 0, 0, c.width, c.height); if (bm.close) bm.close();
    return {th:c.toDataURL('image/jpeg', .78), w, h};
  } catch (e) { return null; }
}
/* просмотр картинок на весь экран: листание стрелками, скачивание */
let LB = null; const FULL = {};
function imgGroup(f){ const k = f.reg ? 'reg' : f.task ? 'task' : f.board ? 'board' : 'chat'; return S.files.filter(x=>x[k] && x[k]===f[k] && isImg(x)).sort((a,b)=>a.at-b.at).map(x=>x.id); }
function lightbox(){
  if (!LB) return;
  const id = LB.ids[LB.i], f = S.files.find(x=>x.id===id); if (!f) { closeOverlay(); return; }
  /* в THUMBS у больших картинок лежит сжатое превью (480px) — оригиналом оно считается, только если это сам файл (blob:) */
  if (!FULL[id] && /^blob:/.test(THUMBS[id]||'')) FULL[id] = THUMBS[id];
  if (!FULL[id]) { FULL[id] = '…'; fileBlob(f).then(b => { FULL[id] = URL.createObjectURL(b); if (LB && LB.ids[LB.i]===id) lightbox(); }).catch(() => { FULL[id] = ''; }); }
  const full = FULL[id] && FULL[id]!=='…' ? FULL[id] : '', src = full || safeImg(f.th) || safeImg(THUMBS[id]), n = LB.ids.length;
  overlay('<div class="lb" role="dialog" aria-label="'+esc(f.name)+'"><div class="lb-h"><b>'+esc(f.name)+'</b><small>'+fsize(f.size)+(f.w?' · '+Number(f.w)+'×'+Number(f.h):'')+(n>1?' · '+(LB.i+1)+' из '+n:'')+'</small><span class="sp"></span>'
    +(full?'<button class="icon-btn" data-action="lb-zoom" title="Масштаб: по экрану / 100% (клик по картинке)" aria-label="Масштаб" aria-pressed="'+!!LB.z+'">'+ic(LB.z?'ZoomOut':'ZoomIn')+'</button>':'')
    +'<button class="icon-btn" data-action="file-dl" data-id="'+esc(id)+'" title="Скачать" aria-label="Скачать">'+ic('Download')+'</button>'
    +'<button class="icon-btn" data-action="close-overlay" aria-label="Закрыть">'+ic('X')+'</button></div>'
    +'<div class="lb-b'+(LB.z && full?' z':'')+'" data-action="lb-bg">'+(n>1?'<button class="icon-btn lb-nav prev" data-action="lb-go" data-v="-1" aria-label="Предыдущее">'+ic('ChevronLeft')+'</button>':'')
    +(src?'<img src="'+src+'" alt="'+esc(f.name)+'"'+(full?' data-action="lb-zoom"':'')+'>':'<span class="spin"></span>')+(!full && src?'<span class="lb-load"><span class="spin"></span></span>':'')
    +(n>1?'<button class="icon-btn lb-nav next" data-action="lb-go" data-v="1" aria-label="Следующее">'+ic('ChevronRight')+'</button>':'')+'</div></div>');
}
function openImg(id){ const f = S.files.find(x=>x.id===id); if (!f) return; const ids = imgGroup(f); LB = {ids, i:Math.max(0, ids.indexOf(id))}; lightbox(); }
function lbGo(d){ if (!LB || LB.ids.length<2) return; LB.i = (LB.i + d + LB.ids.length) % LB.ids.length; lightbox(); }
/* фото и скриншоты записей реестров отделов */
const regFiles = id => S.files.filter(f=>f.reg===id).sort((a,b)=>a.at-b.at);
const regCover = id => regFiles(id).find(isImg);
let REG_PENDING = []; // для ещё не сохранённой записи: загрузятся после «Добавить»
function clearPending(){ REG_PENDING.forEach(p => p.url && URL.revokeObjectURL(p.url)); REG_PENDING = []; }
const shotName = (f, i) => f.name && f.name!=='image.png' ? f : new File([f], 'скриншот-'+new Date().toISOString().slice(0,19).replace(/[T:]/g,'-')+(i?'-'+i:'')+'.png', {type:f.type});
function imgTile(f){
  const s = thumb(f);
  return '<span class="gimg"><button type="button" class="gimg-b" data-action="img-view" data-id="'+esc(f.id)+'" title="'+esc(f.name)+' · открыть">'+(s?'<img src="'+s+'" alt="'+esc(f.name)+'" loading="lazy">':'<span class="spin"></span>')+'</button>'
    +(f.by===S.me?'<button type="button" class="mini-x" data-action="file-del" data-id="'+esc(f.id)+'" aria-label="Удалить фото" title="Удалить">'+ic('X')+'</button>':'')+'</span>';
}
function regGallery(id){
  const files = id ? regFiles(id) : [], n = files.length + REG_PENDING.length;
  const tiles = files.filter(isImg).map(imgTile).join('')
    + REG_PENDING.map((p,i) => '<span class="gimg pending">'+(p.url?'<span class="gimg-b"><img src="'+p.url+'" alt="'+esc(p.file.name)+'"></span>':'<span class="gimg-b"><small>'+esc(clip(p.file.name,24))+'</small></span>')
      +'<button type="button" class="mini-x" data-action="reg-unpend" data-i="'+i+'" aria-label="Убрать" title="Убрать">'+ic('X')+'</button></span>').join('');
  const other = files.filter(f=>!isImg(f)).map(f=>fileChip(f)).join('');
  return '<div style="display:flex;align-items:center;gap:8px"><p class="sub-h" style="margin:0">Фото и файлы'+(n?' · '+n:'')+'</p><span style="flex:1"></span>'+attachBtn('reg-attach', id||'', 'Добавить')+'</div>'
    + upBar('reg:'+(id||''))
    + (tiles ? '<div class="gal">'+tiles+'</div>' : '')
    + (other ? '<div class="files">'+other+'</div>' : '')
    + '<small style="color:var(--muted)">'+(n ? 'Ещё можно перетащить сюда или вставить скриншот: Ctrl+V.' : 'Перетащи сюда картинки или вставь скриншот: Ctrl+V. До '+fsize(FILE_MAX)+' на файл.')+(id||!REG_PENDING.length?'':' Загрузятся после «Добавить».')+'</small>';
}
function addRegFiles(id, list){
  if (!list.length) return;
  if (!id) { for (const file of list) { if (file.size > FILE_MAX) { toast(ic('CircleAlert')+' «'+esc(file.name)+'» больше '+fsize(FILE_MAX)); continue; } REG_PENDING.push({file, url: /^image\//.test(file.type) ? URL.createObjectURL(file) : null}); } paintRegGal(); return; }
  uploadFiles(list, {reg:id}).then(ids => { if (!ids.length) return; const it = regItem(id); if (it) log('прикрепил(а) '+plural(ids.length,'фото','фото','фото')+' к записи', it.name, it.key.split('/')[0]); toast(ic('Image')+' Добавлено: '+ids.length); });
}
function paintRegGal(){ const g = $('#reg-gal'); if (g) g.innerHTML = regGallery(g.dataset.id); }
/* превью в списках реестра */
function coverMini(id){
  const fs = regFiles(id).filter(isImg); if (!fs.length) return '';
  const s = thumb(fs[0]);
  return '<span class="rthumb">'+(s?'<img src="'+s+'" alt="" loading="lazy">':'')+(fs.length>1?'<i>'+fs.length+'</i>':'')+'</span>';
}
const upBar = key => S.up[key] ? `<div class="upbar"><span class="spin"></span> Загружаем «${esc(clip(S.up[key].name,40))}» · ${S.up[key].pct}%</div>` : '';
const attachBtn = (action, id, label) => `<label class="btn sm" title="До ${fsize(FILE_MAX)} на файл">${ic('Paperclip')}${label?' '+label:''}<input type="file" multiple hidden data-action="${action}" data-id="${esc(id)}"></label>`;

/* ── чаты ───────────────────────────────────────
   Общие для всей команды. Чат задачи создаётся кнопкой в карточке задачи и доступен всем. */
const chat = id => S.chats.find(c=>c.id===id);
const READ_AT = {};
const chatUnread = c => !c.stub && !!c.lastAt && c.lastBy!==S.me && c.lastAt > Math.max((me().reads||{})[c.id]||0, READ_AT[c.id]||0);
function markRead(id){
  const c = chat(id); if (!c || !chatUnread(c) || document.hidden) return;
  READ_AT[id] = c.lastAt; col('hub_people').doc(S.me).update({['reads.'+id]:c.lastAt}).catch(()=>{});
}
const unreadChats = () => S.chats.filter(chatUnread).length;
/* обсуждение задачи — это её чат: тот же, что в карточке. У задачи со старыми комментариями чата ещё может не быть —
   в списке она всё равно есть (id «task:…»), а настоящий чат заводится первым сообщением */
function taskChatStubs(){
  return S.allTasks.filter(t=>(t.comments||[]).length && !threadChat('task', t.id)).map(t => { const l = [...t.comments].sort((a,b)=>a.at-b.at).pop();
    return {id:'task:'+t.id, stub:true, title:t.title, task:t.id, dept:t.dept, by:t.createdBy, createdAt:t.createdAt, lastAt:l.at, lastBy:l.by, lastText:l.text}; });
}
const chatOrStub = id => chat(id) || (String(id||'').startsWith('task:') ? taskChatStubs().find(c=>c.id===id) : null);
function chatItem(c){
  const t = c.task && S.allTasks.find(x=>x.id===c.task), it = c.reg && regItem(c.reg);
  const d = D[t ? t.dept : it ? it.key.split('/')[0] : c.dept] || null;
  const kind = c.task ? 'Задача' : c.reg ? 'Запись' : '';
  return `<a class="chat-i${UI.chat===c.id?' on':''}" href="#/chats/${esc(c.id)}" style="--dc:${d?d.color:'var(--acc)'}">
    <span class="ph-ico" title="${kind ? kind+(d?': '+esc(d.name):'') : 'Общий чат'}">${ic(kind ? (d?d.icon:'LayoutGrid') : 'MessagesSquare')}</span>
    <span class="bd"><b>${esc(c.title)}</b><small>${c.lastText ? esc(pname(c.lastBy).split(' ')[0])+': '+esc(clip(c.lastText,60)) : 'Пока без сообщений'}</small></span>
    <span class="r"><small>${c.lastAt?ago(c.lastAt).replace(' назад',''):''}</small>${chatUnread(c)?'<i class="udot" aria-label="Есть новые"></i>':''}</span></a>`;
}
/* m.old — старый комментарий задачи: хранится в самой задаче, удалить его нельзя. В ленте карточки (thread) время — «N мин назад» */
function msgHtml(m, prev, thread){
  const same = prev && prev.by===m.by && m.at-prev.at < 5*60e3;
  const files = (m.files||[]).map(id=>fileChip(S.files.find(f=>f.id===id), true)).join('');
  return `<div class="msg${m.by===S.me?' me':''}${same?' cont':''}" data-pk="m:${esc(m.id||'')}">${same?'<span class="av-sp"></span>':av(m.by,30)}<div class="bd">
    ${same?'':`<div class="mh"><b>${esc(pname(m.by))}</b><small title="${esc(dayf.format(m.at)+', '+dtf.format(m.at))}">${thread ? ago(m.at) : dtf.format(m.at)}</small></div>`}
    ${m.text?`<div class="tx">${mdBlock(m.text)}</div>`:''}${files?`<div class="mf">${files}</div>`:''}</div>
    ${m.by===S.me && !m.old?`<button class="mini-x" data-action="msg-del" data-id="${esc(m.id)}" aria-label="Удалить сообщение" title="Удалить">${ic('Trash2')}</button>`:''}</div>`;
}
function viewChats(){
  const list = [...S.chats, ...taskChatStubs()].sort((a,b)=>(b.lastAt||b.createdAt||0)-(a.lastAt||a.createdAt||0));
  const c = UI.chat && chatOrStub(UI.chat);
  listenChat(c && !c.stub ? c.id : null);
  if (c && !c.stub) markRead(c.id);
  const t = c && c.task && S.allTasks.find(x=>x.id===c.task), it = c && c.reg && regItem(c.reg);
  let main = `<div class="empty" style="margin:auto"><b>${ic('MessagesSquare')} Выбери чат слева</b>Или создай новый — его увидит вся команда. Чат задачи появляется, как только в ней кто-то напишет.</div>`;
  if (UI.chat && !c && S.loaded.has('hub_chats')) main = `<div class="empty" style="margin:auto"><b>Чат не найден</b>Возможно, его удалили.<a class="btn sm" href="#/chats">К списку</a></div>`;
  if (c) {
    /* в чате задачи видны и старые комментарии из карточки */
    const old = ((t && t.comments) || []).map(x => Object.assign({files:[]}, x, {old:true}));
    const msgs = [...old, ...(c.stub ? [] : S.msgs)].sort((a,b)=>a.at-b.at);
    const loading = !c.stub && !S.loaded.has('hub_msgs');
    const sub = t ? `<span class="lnk" data-open="task:${esc(t.id)}">${ic('LayoutGrid')} Открыть задачу</span> · `+dchips(t)
      : it ? `<span class="lnk" data-action="open-reg" data-id="${esc(it.id)}">${ic('BookOpen')} Открыть запись</span> · `+dchip(it.key.split('/')[0])
      : c.task ? (c.dept && !canSee(c.dept) ? 'Задача отдела '+dchip(c.dept) : 'Задача удалена') : c.reg ? 'Запись удалена' : 'Создал(а) '+esc(pname(c.by));
    main = `<div class="chat-h"><a class="icon-btn chat-back" href="#/chats" aria-label="К списку чатов">${ic('ArrowRight')}</a><div class="bd"><b>${esc(c.title)}</b><small>${sub}</small></div>
      ${c.stub ? `<button class="icon-btn" data-action="task-md" data-id="${esc(c.task)}" title="Скачать переписку в .md" aria-label="Скачать переписку в .md">${ic('FileDown')}</button>`
        : `<button class="icon-btn" data-action="chat-md" data-id="${esc(c.id)}" title="Скачать переписку в .md" aria-label="Скачать переписку в .md">${ic('FileDown')}</button>`}
      ${c.by===S.me && !c.stub && !isThread(c)?`<button class="icon-btn" data-action="chat-del" data-id="${esc(c.id)}" title="Удалить чат" aria-label="Удалить чат">${ic('Trash2')}</button>`:''}</div>
      <div class="msgs" id="msgs">${loading ? '<div class="loading"><span class="spin"></span>Загружаем сообщения…</div>' : msgs.map((m,i)=>msgHtml(m, msgs[i-1])).join('') || '<div class="empty" style="margin:auto">Здесь пока тихо. Напиши первым.</div>'}</div>
      ${c.stub ? '' : upBar('chat:'+c.id)}
      <form class="composer" data-form="msg" data-id="${esc(c.id)}">${attachBtn('chat-attach', c.id)}
        <textarea class="input" id="chat-in" name="m" rows="1" maxlength="4000" placeholder="Сообщение… Enter — отправить, Shift+Enter — новая строка. Картинку можно вставить из буфера.">${esc(UI.chatDraft[c.id]||'')}</textarea>
        <button class="btn primary" aria-label="Отправить">${ic('Send')}</button></form>`;
  }
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#7DD3E8">${ic('MessagesSquare')}</span><div><h1>Чаты</h1><p>Общие каналы и обсуждения задач и записей. Чат задачи — тот же, что в её карточке: пишите где удобнее.</p></div></div><button class="btn primary" data-action="chat-new">${ic('Plus')} Чат</button></div>
  <div class="chats${c?' open':''}"><aside class="chat-list">${list.map(chatItem).join('') || '<div class="empty">Чатов пока нет.</div>'}</aside><section class="chat-main">${main}</section></div>`;
}
/* сообщение в чат задачи или записи идёт через обсуждение: те же уведомления и запись в журнал */
async function chatSend(id, text, files){
  const c = chatOrStub(id); if (!c) return false;
  if (!c.task && !c.reg) return sendMsg(id, text, files);
  const ok = await threadSend(c.task ? 'task' : 'reg', c.task || c.reg, text, files);
  if (ok && c.stub) { const r = threadChat('task', c.task); if (r) go('chats/'+r.id); }
  return ok;
}
async function chatFiles(id, list){
  const c = chatOrStub(id); if (!c) return;
  if (c.stub) { const cid = await threadChatId('task', c.task); if (!cid) return; id = cid; }
  const ids = await uploadFiles(list, {chat:id}); if (ids.length) chatSend(id, '', ids);
}
/* ── обсуждение в карточке ──────────────────────
   У задачи и у записи отдела одна лента прямо в карточке: старые комментарии задачи (поле comments)
   и сообщения её чата (hub_msgs, чат с полем task или reg). Чат заводится сам при первом сообщении,
   в разделе «Чаты» остаются только общие каналы. */
const threadChat = (k, id) => S.chats.find(c=>c[k]===id);
const isThread = c => !!(c.task || c.reg);
const TH = {chat:null, msgs:[], loaded:true, unsub:null};
function listenThread(chatId){
  if (TH.chat===chatId) return;
  if (TH.unsub) { try { TH.unsub(); } catch (e) {} TH.unsub = null; }
  TH.chat = chatId; TH.msgs = []; TH.loaded = !chatId;
  if (!chatId) return;
  TH.unsub = col('hub_msgs').where('chat','==',chatId).onSnapshot(sn => { if (TH.chat!==chatId) return; TH.msgs = sn.docs.map(d=>Object.assign({id:d.id}, d.data())).sort((a,b)=>a.at-b.at); TH.loaded = true; schedule(); },
    e => { console.error('hub_msgs', e); TH.loaded = true; schedule(); });
}
function threadMsgs(k, id){
  const t = k==='task' && task(id), c = threadChat(k, id);
  listenThread(c ? c.id : null);
  const old = ((t && t.comments) || []).map(x => Object.assign({files:[]}, x, {old:true}));
  return [...old, ...(c ? TH.msgs : [])].sort((a,b)=>a.at-b.at);
}
function threadList(k, id){
  const msgs = threadMsgs(k, id);
  if (!TH.loaded) return '<div class="loading"><span class="spin"></span>Загружаем обсуждение…</div>';
  const c = threadChat(k, id); if (c) markRead(c.id); // прочитано в карточке — в «Чатах» не горит как новое
  return msgs.map((m,i)=>msgHtml(m, msgs[i-1], true)).join('') || '<small style="color:var(--muted)">Пока никто не писал. Вопрос, ответ, скриншот — всё сюда. @логин позовёт человека.</small>';
}
const threadCount = (k, id) => threadMsgs(k, id).length;
function threadBlock(k, id){
  const c = threadChat(k, id), n = threadCount(k, id);
  return `<div class="thread" id="thread" data-k="${k}" data-id="${esc(id)}"><div style="display:flex;align-items:center;gap:8px"><p class="sub-h" style="margin:0">Чат${k==='task'?' задачи':''}<span id="thread-n">${n?' · '+n:''}</span></p><span style="flex:1"></span><a class="btn sm ghost" id="thread-go" href="#/chats/${esc(c ? c.id : 'task:'+id)}" ${c || n ? '' : 'hidden'} title="Тот же чат в разделе «Чаты»">${ic('MessagesSquare')} В «Чатах»</a></div>
    <div class="msgs" id="thread-list">${threadList(k, id)}</div><div id="thread-up">${c ? upBar('chat:'+c.id) : ''}</div>
    <form class="composer" data-form="thread" data-k="${k}" data-id="${esc(id)}">${attachBtn('thread-attach', k+':'+id)}
      <textarea class="input" id="thread-in" name="m" rows="1" maxlength="4000" placeholder="Написать… Enter — отправить, Shift+Enter — новая строка. Картинку можно вставить из буфера."></textarea>
      <button class="btn primary" aria-label="Отправить">${ic('Send')}</button></form></div>`;
}
/* обновить ленту, не трогая поле ввода (шторка записи целиком не перерисовывается) */
function paintThread(){
  const el = $('#thread'); if (!el) return;
  const k = el.dataset.k, id = el.dataset.id, c = threadChat(k, id), n = threadCount(k, id);
  swapHtml($('#thread-list'), threadList(k, id), true);
  $('#thread-n').textContent = n ? ' · '+n : '';
  const g = $('#thread-go'); g.hidden = !(c || n); g.setAttribute('href', '#/chats/'+(c ? c.id : 'task:'+id));
  $('#thread-up').innerHTML = c ? upBar('chat:'+c.id) : '';
}
async function threadChatId(k, id){
  const ex = threadChat(k, id); if (ex) return ex.id;
  const it = k==='task' ? task(id) : regItem(id); if (!it) return null;
  const ref = col('hub_chats').doc(), body = {title:clip(k==='task' ? it.title : it.name, 120), task:k==='task' ? id : null, reg:k==='reg' ? id : null,
    dept:k==='task' ? it.dept : it.key.split('/')[0], by:S.me, createdAt:now(), lastAt:null, lastBy:null, lastText:''};
  if (!await write(()=>ref.set(body))) return null;
  if (!chat(ref.id)) S.chats.push(Object.assign({id:ref.id}, body)); // до прихода снимка из базы
  return ref.id;
}
async function threadSend(k, id, text, files){
  const cid = await threadChatId(k, id); if (!cid) return false;
  listenThread(cid);
  if (!await sendMsg(cid, text, files)) return false;
  const what = text || '📎 '+plural(files.length,'файл','файла','файлов');
  if (k==='task') { const t = task(id); if (!t) return true;
    log('написал(а) в обсуждении', t.title, t.dept);
    const ment = mentions(text||''); notify(ment, 'mention', t, what);
    notify([...watchers(t), ...(t.comments||[]).map(c=>c.by), ...TH.msgs.map(m=>m.by)].filter(u=>!ment.includes(u)), 'comment', t, what); }
  else { const it = regItem(id); if (it) log('написал(а) в обсуждении записи', it.name, it.key.split('/')[0]); }
  return true;
}
async function threadFiles(k, id, list){
  const cid = await threadChatId(k, id); if (!cid) return;
  const ids = await uploadFiles(list, {chat:cid}); if (ids.length) threadSend(k, id, '', ids);
}
async function sendMsg(chatId, text, files){
  text = clip(text,4000); files = files||[];
  if (!text && !files.length) return false;
  const c = chat(chatId); if (!c) return false;
  const ok = await write(async () => {
    const b = DB.batch();
    b.set(col('hub_msgs').doc(), {chat:chatId, by:S.me, text, files, at:now()});
    b.update(col('hub_chats').doc(chatId), {lastAt:now(), lastBy:S.me, lastText:text || ('📎 '+plural(files.length,'файл','файла','файлов')), n:FV().increment(1)});
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
  if (f.t==='dept') return dchip(hd(v));
  if (f.t==='date') return /^\d{4}-\d\d-\d\d$/.test(v||'') ? esc(dateFmt(parseDay(v))) : esc(v||'');
  return esc(v||'');
}
const regKeys = key => [key, ...(REG_ALSO[key]||[])];
/* метрика: значение, цель и дата снимка; снимок старше 14 дней подсвечивается — по устаревшим цифрам решений не принимают */
const METRIC_STALE = 14;
function metricTile(it, color){
  const age = /^\d{4}-\d\d-\d\d$/.test(it.at||'') ? Math.round((dueDay(now()) - dueDay(parseDay(it.at)))/DAY) : null;
  return `<button class="tile" data-open="reg:${esc(it.id)}"><span class="k">${esc(it.name)}</span><span class="v">${esc(it.value||'—')}</span>${spark(series(it.series), color)}
    ${it.target?`<span class="s">Цель: <b>${esc(it.target)}</b></span>`:''}
    <span class="s"${age===null||age>METRIC_STALE?' style="color:var(--warn)"':''}>${age===null ? 'дата снимка не указана' : 'снимок '+(age<=0?'сегодня':plural(age,'день','дня','дней')+' назад')}</span>
    ${it.note?`<span class="s">${mdLine(it.note)}</span>`:''}</button>`;
}
/* метрики проекта в «Обзоре руководителя» */
function metricTiles(){
  const items = S.reg.filter(x=>x.key==='analytics/metrics').sort(byOrder);
  return `<section class="panel"><div class="panel-h"><h2><span class="hi">${ic('ChartColumn')}</span>Метрики проекта</h2><a class="btn sm ghost" href="#/d/econ/metrics">Все метрики</a></div>
    ${items.length ? `<div class="tiles">${items.map(it=>metricTile(it, D.econ.color)).join('')}</div>` : '<div class="empty">Метрик пока нет. Добавь онлайн-пик, удержание D1/D7/D30, выручку за неделю — с целью и датой снимка.</div>'}</section>`;
}
/* финансы: выручка, расходы и итог по месяцам */
function financeSummary(){
  const items = S.reg.filter(x=>x.key==='analytics/finance'); if (!items.length) return '';
  const num = v => parseMoney(v) || 0, rev = items.reduce((a,x)=>a+num(x.revenue),0), cost = items.reduce((a,x)=>a+num(x.costs),0);
  const last = [...items].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0))[0], lp = num(last.revenue)-num(last.costs);
  return `<div class="tiles"><div class="tile" style="cursor:default"><span class="k">Выручка всего</span><span class="v mono">${nfmt.format(rev)} ₽</span></div>
    <div class="tile" style="cursor:default"><span class="k">Расходы всего</span><span class="v mono">${nfmt.format(cost)} ₽</span></div>
    <div class="tile" style="cursor:default"><span class="k">Итог</span><span class="v mono" style="color:var(--${rev-cost>=0?'ok':'red'})">${nfmt.format(rev-cost)} ₽</span><span class="s">последний месяц «${esc(last.name)}»: ${nfmt.format(lp)} ₽</span></div></div>`;
}
function registry(key, d){
  if (key==='design/kit') return kit();
  if (key==='qa/bugs') return bugsView();
  return (key==='analytics/finance' ? financeSummary() : '') + regList(key, d) + (key==='release/versions' ? oldChangelog(d) : '');
}
/* changelog теперь живёт в карточке версии; старые отдельные записи видны под версиями, пока их не перенесут */
/* что входит в версию: задачи с этой версией, сколько готово, что заблокировано */
function verProgress(it){
  const ts = S.allTasks.filter(t=>t.ver===it.name); if (!ts.length) return '';
  const done = ts.filter(t=>t.status==='done').length, bl = ts.filter(t=>t.status==='blocked').length;
  return `<div class="ver-p"><div class="mini-bar"><i style="width:${Math.round(done/ts.length*100)}%"></i></div><small>Задачи: ${done} из ${ts.length} готовы${bl?` · <span style="color:var(--red)">заблокировано ${bl}</span>`:''}</small></div>`;
}
function oldChangelog(d){
  const items = S.reg.filter(x=>x.key==='release/changelog').sort(byOrder); if (!items.length) return '';
  const stF = REGS['release/changelog'].fields.find(f=>f.k==='status');
  return `<h2 class="sub-h">Старые записи changelog · ${items.length}</h2><small style="color:var(--muted)">Перенеси текст в поле «Changelog» нужной версии и удали запись здесь.</small>
  <div class="tiles">${items.map(it=>`<button class="tile" data-open="reg:${esc(it.id)}" style="--dc:${d.color}"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h3>${esc(it.name)}</h3>${it.status?chip(it.status, toneOf(stF, it.status)):''}</div>${it.tldr?`<div class="s">${mdLine(it.tldr)}</div>`:''}</button>`).join('')}</div>`;
}
function regList(key, d){
  const r = REGS[key]; if (!r) return '<div class="empty">Скоро.</div>';
  const items = S.reg.filter(x=>regKeys(key).includes(x.key)).sort(key==='smm/plan' ? (a,b)=>String(a.date||'9').localeCompare(String(b.date||'9')) || byOrder(a,b) : byOrder);
  const tools = `<div class="reg-tools"><small>${plural(items.length,'запись','записи','записей')}</small><span class="sp"></span><button class="btn sm primary" data-open="regnew:${key}">${ic('Plus')} Добавить ${esc(r.noun)}</button></div>`;
  if (!items.length) return tools + `<div class="empty"><b>Пока пусто</b>Добавь первую запись — её увидит вся команда.</div>`;
  if (r.type==='table') { const fs = tableFields(r);
    return tools + `<div class="tbl-wrap"><table class="grid"><thead><tr>${fs.map(f=>`<th>${esc(f.l)}</th>`).join('')}</tr></thead><tbody>${items.map(it=>`<tr tabindex="0" data-open="reg:${esc(it.id)}">${fs.map((f,j)=>`<td class="${j===0?'b':f.mono?'m':''}">${j===0?coverMini(it.id):''}${cell(f, it[f.k])}${j===0?decMark(it.id):''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
  const stF = r.fields.find(f=>f.k==='status');
  const st = it => stF && it.status ? chip(it.status, toneOf(stF, it.status)) : '';
  const cover = it => (f => f && thumb(f) ? `<div class="tile-img"><img src="${thumb(f)}" alt="" loading="lazy"></div>` : '')(regCover(it.id));
  if (r.type==='cards') return tools + `<div class="tiles">${items.map(it=>`<button class="tile" data-open="reg:${esc(it.id)}">${cover(it)}<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h3>${esc(it.name)}${decMark(it.id)}</h3>${st(it)}</div>${it.tldr?`<div class="s">${mdLine(it.tldr)}</div>`:''}</button>`).join('')}</div>`;
  if (r.type==='mockups') return tools + `<div class="tiles">${items.map(it=>`<button class="tile" data-open="reg:${esc(it.id)}" style="--dc:${d.color}"><div class="thumb">${(f => f && thumb(f) ? `<img src="${thumb(f)}" alt="" loading="lazy">` : '<div class="ui"></div>')(regCover(it.id))}</div><div style="display:flex;justify-content:space-between;gap:8px"><h3>${esc(it.name)}</h3>${st(it)}</div>${it.tldr?`<div class="s">${mdLine(it.tldr)}</div>`:''}<div style="display:flex;gap:8px;align-items:center">${it.who?av(it.who,22)+`<small style="color:var(--text-2)">${esc(pname(it.who))}</small>`:''}${safeUrl(it.link)?`<small style="color:var(--acc);margin-left:auto">${ic('ExternalLink')} есть ссылка</small>`:''}</div></button>`).join('')}</div>`;
  if (r.type==='metrics') return tools + `<div class="tiles">${items.map(it=>metricTile(it, d.color)).join('')}</div>`;
  if (r.type==='timeline') return tools + `<section class="panel"><div class="timeline" style="--dc:${d.color}">${items.slice().reverse().map(it=>`<div class="tl-i${it.status==='Готовится'?' cur':''}" data-open="reg:${esc(it.id)}" style="cursor:pointer"><h3>${esc(it.name)} ${st(it)}</h3>${it.tldr?`<p>${esc(it.tldr)}</p>`:''}${verProgress(it)}${it.changes?`<div class="md md-c">${md(it.changes, true)}</div>`:''}</div>`).join('')}</div></section>`;
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
  const decs = allDecs().filter(x=>decDept(x)===d.id && decOpen(x));
  const people = Object.keys(S.people).filter(id=>(S.people[id].depts||[]).some(x=>hd(x)===d.id));
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
  ${canSee(d.id) ? '' : roHint(d)}${`<div class="g2">
    <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('Hammer')}</span>Сейчас в работе</h2></div><div class="list">${doing.map(t=>taskItem(t,{status:true})).join('')||'<div class="empty">Ничего не в работе.</div>'}</div></section>
    <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('SkipForward')}</span>Следующие</h2><a class="btn sm ghost" href="#/d/${d.id}/tasks">Все задачи</a></div><div class="list">${next.map(t=>taskItem(t)).join('')||'<div class="empty">Очередь пуста.</div>'}</div></section>
  </div>`}
  ${decs.length?`<h2 class="sub-h">Решения отдела</h2>${decs.map(decCard).join('')}`:''}
  <section class="panel"><div class="panel-h"><h2><span class="hi">${ic('Users')}</span>Кто в отделе</h2>${isAdmin()?`<a class="btn sm ghost" href="#/people">Назначить отделы</a>`:''}</div><div class="g3">${people.map(id=>`<div class="person">${av(id,32)}<div class="bd"><div class="nm">${esc(S.people[id].name)}</div><div class="st">${esc(S.people[id].role||'')}</div></div></div>`).join('') || '<small style="color:var(--muted)">Пока никто не отметил этот отдел в профиле.</small>'}</div></section>`;
}
function viewDept(){
  const d = D[UI.route.slice(2)];
  const tab = d.tabs.some(t=>t[0]===UI.tab) ? UI.tab : 'overview';
  const body = tab==='overview' ? deptOverview(d) : tab==='tasks' ? (canSee(d.id) ? '' : roHint(d)) + filters(false) + board(d.id) : d.id==='econ' && !REGS[tabKey(d, tab)] ? econView(tab) : registry(tabKey(d, tab), d);
  const count = id => id==='tasks' ? S.tasks.filter(t=>inDept(t,d.id) && t.status!=='done').length : id==='overview' ? 0 : d.id==='econ' && !REGS[tabKey(d, id)] ? econCount(id)
    : tabKey(d, id)==='qa/bugs' ? allBugs().filter(b=>b.open).length : S.reg.filter(x=>regKeys(tabKey(d, id)).includes(x.key)).length;
  const people = Object.keys(S.people).filter(id=>(S.people[id].depts||[]).some(x=>hd(x)===d.id)).map(id=>S.people[id].name);
  return `<div style="--dc:${d.color};display:contents">
  <div class="ph"><div class="ph-l"><span class="ph-ico">${ic(d.icon)}</span><div><h1>${esc(d.name)}</h1><p>${people.length?esc(people.join(', ')):'В отделе пока никого'}</p></div></div>
  <button class="btn primary" data-action="new-task" data-status="todo" data-dept="${d.id}">${ic('Plus')} Задача</button></div>
  <div class="tldr"><b>Суть раздела</b>${mdLine(d.tldr)}</div>
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
const efind = (c,id) => (c==='decisions' ? S.edec : S.E && S.E[c] || []).find(x=>x.id===id);
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
  const E = S.E = {sections:[], params:[], bugs:[], stages:[], log:[], people:{}, anchor:3e6, meta:{}, loaded:new Set()};
  /* решения экономики слушаются всегда (они в общем разделе «Решения»), здесь — та же выборка */
  Object.defineProperty(E, 'decisions', {get:() => S.edec, enumerable:true});
  const docs = sn => sn.docs.filter(d=>d.exists).map(d=>Object.assign({id:d.id}, d.data()));
  const onErr = c => e => { console.error(c, e); S.errs[c] = errText(e); E.loaded.add(c); schedule(); };
  for (const c of ECOLLS.filter(c=>c!=='decisions')) UNSUB.push(DB.collection(c).onSnapshot(sn => { E[c] = docs(sn); E.loaded.add(c); schedule(); }, onErr(c)));
  UNSUB.push(DB.collection('log').orderBy('at','desc').limit(150).onSnapshot(sn => { E.log = docs(sn); E.loaded.add('log'); schedule(); }, onErr('log')));
  UNSUB.push(DB.doc('meta/settings').onSnapshot(d => { if (d.exists) { E.meta = d.data(); E.anchor = Number(E.meta.anchor) || 3e6; } schedule(); }, onErr('meta')));
  UNSUB.push(DB.collection('people').onSnapshot(sn => { const p = {}; sn.docs.forEach(d => { p[d.id] = d.data(); }); E.people = p; schedule(); }, () => {}));
}
const eReady = () => S.E && ECOLLS.every(c=>c==='decisions' ? S.loaded.has('decisions') : S.E.loaded.has(c));

const ETAB_ICON = {plan:'BookOpen', params:'Gauge', bugs:'Bug', stages:'ListOrdered', edec:'Scale', elog:'ScrollText'};
function econOverview(d){
  const E = S.E;
  if (!eReady()) return '<div class="loading"><span class="spin"></span>Загружаем экономику…</div>';
  const P = E.params, pc = s => P.filter(p=>p.status===s).length, live = P.length - pc('rejected');
  const openB = allBugs().filter(b=>b.dept==='econ' && b.open), crit = openB.filter(b=>b.sev==='critical').length;
  const doneSt = E.stages.filter(s=>s.status==='done').length, curSt = [...E.stages].sort(byOrder).find(s=>s.status!=='done');
  const decided = E.decisions.filter(x=>x.chosen!=null && x.chosen!=='').length;
  const bar = parts => `<div class="sbar">${parts.map(([n,c])=>n?`<i style="flex:${n};background:${c}"></i>`:'').join('')}</div>`;
  return `<section class="panel glow" style="--dc:${d.color}">
    <div class="panel-h"><h2><span class="hi">${ic('Coins')}</span>Экономика сейчас</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-action="e-copy">${ic('Copy')} Markdown для репозитория</button><a class="btn sm ghost" href="#/log/econ">${ic('ScrollText')} Журнал экономики</a><a class="btn sm ghost" href="../economy/" target="_blank" rel="noopener">${ic('ExternalLink')} Старая страница</a></div></div>
    <div class="tiles">
      <a class="tile" href="#/d/econ/params"><span class="k">Параметры</span><span class="v">${pc('agreed')+pc('done')} <small>/ ${live}</small></span>${bar([[pc('done'),'var(--ok)'],[pc('agreed'),'var(--violet)'],[pc('proposed'),'var(--info)'],[pc('idea'),'var(--muted)']])}<span class="s">согласовано · ${pc('done')} внедрено · ${pc('proposed')} ждут</span></a>
      <a class="tile" href="#/d/qa/bugs/econ"><span class="k">Баги</span><span class="v">${openB.length}</span>${bar([[crit,'var(--red)'],[openB.length-crit,'var(--warn)']])}<span class="s">открыто · ${crit ? plural(crit,'критичный','критичных','критичных') : 'критичных нет'}</span></a>
      <a class="tile" href="#/d/econ/stages"><span class="k">Этапы</span><span class="v">${doneSt} <small>/ ${E.stages.length}</small></span>${bar([[doneSt,'var(--ok)'],[E.stages.length-doneSt,'var(--panel-3)']])}<span class="s">${curSt ? 'сейчас: '+esc(clip(curSt.title,48)) : 'все готовы'}</span></a>
      <a class="tile" href="#/decisions/econ"><span class="k">Решения</span><span class="v">${decided} <small>/ ${E.decisions.length}</small></span>${bar([[decided,'var(--ok)'],[E.decisions.length-decided,'var(--panel-3)']])}<span class="s">${E.decisions.length-decided ? (E.decisions.length-decided)+' ждут решения' : 'все приняты'}</span></a>
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
        <td><div class="pname">${esc(p.name)}</div>${p.where?`<div class="where mono">${esc(p.where)}</div>`:''}${p.note?`<div class="pnote">${mdBlock(p.note)}</div>`:''}</td>
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
const sevRank = {critical:0,high:1,medium:2,low:3};
function eStages(){
  const all = [...S.E.stages].sort(byOrder);
  if (!all.length) return eEmpty('Этапов пока нет','Этап — шаг плана работ: что делаем, от чего зависит, кто ведёт.','stages','Добавить этап');
  const done = all.filter(s=>s.status==='done').length;
  const list = all.map((s,i)=>[s,i+1]).filter(([s]) => !UI.ef.hideDone || s.status!=='done');
  return `<div class="reg-tools"><div class="seg"><button data-action="e-toggle" data-k="hideDone" aria-pressed="${UI.ef.hideDone}">Скрыть готовые <span class="mono" style="color:var(--muted)">${done}</span></button></div><span class="sp"></span><button class="btn primary" data-open="enew:stages">${ic('Plus')} Этап</button></div>
  <div class="list">${list.map(([s,n]) => `<article class="erow ${s.status==='done'?'done':''}">
    <div class="body"><h3><span class="stage-n">${n}</span>${esc(s.title)}</h3>${s.details?`<div class="txt">${mdBlock(s.details)}</div>`:''}${s.depends?`<div class="txt"><b>Зависит от:</b> ${mdLine(s.depends)}</div>`:''}${s.note?`<div class="txt"><b>Заметка:</b>${mdBlock(s.note)}</div>`:''}${eMeta(s)}</div>
    <div class="side">${eStatusSelect('stages', s, STAGE_STATUS)}${ewho(s.assignee)}${eActions('stages', s.id, true)}</div></article>`).join('')}</div>`;
}
/* вопрос экономики в общем списке «Решения»: выглядит и голосуется как решение хаба, хранится в коллекции decisions */
function eDecCard(x){
  const opts = Array.isArray(x.options) ? x.options : [], votes = x.votes || {};
  const chosen = (x.chosen===null||x.chosen===undefined||x.chosen==='') ? null : Number(x.chosen), rec = Number(x.recommended)||0;
  return `<article class="decision${isPinned(x.id)?' pinned':''}" id="dec-${esc(x.id)}">
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap"><h3>${esc(x.question)}</h3><div style="display:flex;gap:6px;align-items:center">${pinBtn(x.id)}${dchip('econ')}${chosen!=null?chip('Принято','ok'):chip('Голосуем','info')}<button class="mini-x" data-open="eedit:decisions:${esc(x.id)}" title="Изменить вопрос" aria-label="Изменить вопрос" style="margin:0">${ic('Pencil')}</button></div></div>
    <div class="list">${opts.map((o,i) => { const voters = Object.keys(votes).filter(k => votes[k]===i), mine = votes[S.me]===i;
      return `<div class="opt${chosen===i?' chosen':''}${mine?' mine':''}"><div><div class="l">${esc(o.label)} ${rec===i+1?'<span class="chip t-violet" style="margin-left:4px">рекомендуем</span>':''}</div>${o.desc?`<div class="d">${mdLine(o.desc)}</div>`:''}</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="votes" title="${esc(voters.map(epname).join(', '))}">${voters.map(v=>eav(v,24)).join('')}</span>
        ${chosen==null ? `<button class="btn sm${mine?' primary':''}" data-action="e-vote" data-id="${esc(x.id)}" data-i="${i}">${mine?ic('Check')+' Мой голос':'Голосовать'}</button>
        <button class="btn sm ghost" data-action="e-choose" data-id="${esc(x.id)}" data-i="${i}" title="Зафиксировать итог">Принять</button>` : ''}</div></div>`; }).join('')}</div>
    ${x.note?`<div class="txt"><b>Заметка:</b>${mdBlock(x.note)}</div>`:''}
    ${chosen!=null?`<div class="meta-line" style="font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap">${decTaskBtn(x)}Итог: <b style="color:var(--text)">${esc((opts[chosen]||{}).label||'')}</b>${x.updatedBy?' · '+esc(epname(x.updatedBy))+' · '+ago(x.updatedAt):''} <button class="btn sm ghost" data-action="e-choose" data-id="${esc(x.id)}" data-i="">${ic('RotateCcw')} Переоткрыть</button></div>`:eMeta(x)}
  </article>`;
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
/* запись журнала экономики: кто, что поменял (было → стало), удалённое можно вернуть */
function eLogEntry(l){
  const dt = new Date(l.at||0);
  const diff = Array.isArray(l.diff) && l.diff.length ? `<ul class="diff">${l.diff.map(x=>`<li><span class="f">${esc(x.f)}:</span> <del>${esc(x.from||'—')}</del> → <ins>${esc(x.to||'—')}</ins></li>`).join('')}</ul>` : '';
  const canRestore = l.action==='delete' && l.snapshot && ECOLLS.includes(l.coll) && !efind(l.coll, l.docId);
  return `<div class="entry">${eav(l.by||'claude',24)}<div><b>${esc(epname(l.by||'claude'))}</b> ${eLogText(l)} ${dchip('econ')}${l.text?`<div class="note-text">${mdBlock(l.text)}</div>`:''}${diff}${canRestore?`<div style="margin-top:6px"><button class="btn sm" data-action="e-restore" data-id="${esc(l.id)}">${ic('RotateCcw')} Восстановить</button></div>`:''}</div><span class="when">${esc(dtf.format(dt))}</span></div>`;
}
function econView(tab){
  if (!eReady()) return '<div class="loading"><span class="spin"></span>Загружаем экономику…</div>';
  if (tab==='plan') return ePlan();
  if (tab==='params') return eParams();
  if (tab==='stages') return eStages();
  return '';
}
function econCount(tab){
  if (!S.E) return 0; const E = S.E;
  return {plan:E.sections.length, params:E.params.length, stages:E.stages.length}[tab] || 0;
}

/* ── баги: один список на всю команду ──────────
   Баги QA (реестр qa/bugs, у каждого поле «Отдел») и баги экономики (коллекция bugs, общая со страницей /economy/)
   приводятся к одному виду. Новые баги заводятся в реестре QA с нужным отделом. */
const SEV_KEY = {'Критично':'critical', 'Высокая':'high', 'Средняя':'medium', 'Низкая':'low'};
const QA_BUG_OPEN = ['Открыт','В работе','На ревью'];
function allBugs(){
  const reg = REGS['qa/bugs'], sevF = reg.fields.find(f=>f.k==='sev'), stF = reg.fields.find(f=>f.k==='status');
  const qa = S.reg.filter(x=>x.key==='qa/bugs').map(x => ({id:x.id, name:x.name, dept:hd(x.dept)||'qa', sev:SEV_KEY[x.sev]||'', sevL:x.sev||'', where:x.where||'', who:x.who||null,
    st:x.status||'', stTone:toneOf(stF, x.status), open:!x.status || QA_BUG_OPEN.includes(x.status), ref:'reg:'+x.id, at:x.createdAt||0, item:x}));
  const ec = S.E && S.E.loaded.has('bugs') ? S.E.bugs.map(b => ({id:b.id, name:b.title, dept:'econ', sev:b.severity||'medium', sevL:lab(BUG_SEV,b.severity||'medium'), where:b.where||'', who:b.assignee||null,
    st:lab(BUG_STATUS,b.status||'open'), stTone:ETONE[b.status||'open'], open:b.status!=='fixed' && b.status!=='wontfix', ref:'eedit:bugs:'+b.id, at:b.createdAt||b.order||0, item:b, e:true})) : [];
  return [...qa, ...ec];
}
function bugsView(){
  const every = allBugs(), f = UI.bfilt, loading = !(S.E && S.E.loaded.has('bugs'));
  const counts = {}; every.forEach(b => { counts[b.dept] = (counts[b.dept]||0)+1; });
  const list = every.filter(b => (f==='all' || b.dept===f) && (!UI.bhide || b.open))
    .sort((a,b)=>(b.open-a.open) || (sevRank[a.sev]??2)-(sevRank[b.sev]??2) || b.at-a.at);
  const closed = every.filter(b => (f==='all' || b.dept===f) && !b.open).length;
  const tools = `<div class="toolbar">${deptSeg('d/qa/bugs', f, counts)}</div>
    <div class="reg-tools"><div class="seg"><button data-action="bugs-hide" aria-pressed="${UI.bhide}">Скрыть закрытые <span class="mono" style="color:var(--muted)">${closed}</span></button></div>${loading?'<small style="color:var(--muted)"><span class="spin"></span> загружаем баги экономики…</small>':''}<span class="sp"></span><button class="btn sm primary" data-open="regnew:qa/bugs">${ic('Plus')} Добавить баг</button></div>`;
  if (!list.length) return tools + `<div class="empty"><b>${every.length ? 'Под фильтр ничего не подходит' : 'Багов пока нет'}</b>Новый баг — кнопка «Добавить баг», в карточке выбери отдел.</div>`;
  return tools + `<div class="tbl-wrap"><table class="grid"><thead><tr><th>Баг</th><th>Отдел</th><th>Важность</th><th>Где</th><th>Ответственный</th><th>Статус</th></tr></thead><tbody>${list.map(b=>`<tr tabindex="0" data-open="${esc(b.ref)}"${b.open?'':' class="rej"'}>
    <td class="b">${b.e?'':coverMini(b.id)}${esc(b.name)}${b.e?'':decMark(b.id)}</td><td>${dchip(b.dept)}</td><td>${b.sevL?chip(b.sevL, ETONE[b.sev]||'muted'):'<span style="color:var(--muted)">—</span>'}</td>
    <td class="m">${esc(b.where)}</td><td>${b.who?`<span class="who-pick">${eav(b.who,22)} ${esc(epname(b.who))}</span>`:'<span style="color:var(--muted)">—</span>'}</td><td>${b.st?chip(b.st, b.stTone):''}</td></tr>`).join('')}</tbody></table></div>`;
}

/* формы записей экономики (в шторке) */
const optionsToText = o => (Array.isArray(o)?o:[]).map(x => x.desc ? `${x.label} — ${x.desc}` : x.label).join('\n');
const textToOptions = t => String(t||'').split('\n').map(s=>s.trim()).filter(Boolean).map(s => { const m = s.split(/\s+[—–-]\s+/); return {label:clip(m[0],160), desc:clip(m.slice(1).join(' — '),400)}; });
function eFieldHtml(f, v){
  const hint = f.hint ? `<small style="color:var(--muted);font-size:12px">${esc(f.hint)}</small>` : '';
  const mono = f.mono ? ' style="font-family:var(--f-mono);font-size:13px"' : '';
  let ctl;
  switch (f.t) {
    case 'textarea': ctl = `<textarea class="input" name="${f.k}" rows="${f.rows||3}"${mono}>${esc(v ?? '')}</textarea>${f.mono?'':mdPrev()}`; break;
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
    const cur = efind(coll, id); if (!cur || !confirm('Удалить «'+ESCHEMA[coll].title(cur)+'»? Вернуть можно в «Журнале», фильтр «Экономика».')) return;
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
const inArea = (name, label, val, rows=4) => `<label class="fld"><span>${label}</span><textarea class="input" name="${name}" rows="${rows}">${esc(val??'')}</textarea></label>${mdPrev()}`;
const inSelect = (name, label, opts, val) => `<label class="fld"><span>${label}</span><select class="input" name="${name}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(val??'')?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
const peopleOpts = () => [['','Не назначен'], ...Object.entries(S.people).sort((a,b)=>String(a[1].name).localeCompare(String(b[1].name))).map(([id,p])=>[id, (p.name||'Участник')+(id===S.me?' (вы)':'')])];
const deptOpts = () => DEPTS.map(d=>[d.id, d.name]);
/* выбор отделов задачи: первый выбранный — основной (цвет карточки) */
const deptsPick = ds => `<div class="fld"><span>Отделы — можно несколько</span><div class="dpick roles" role="group" aria-label="Отделы задачи">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="pick-depts" data-d="${d.id}" aria-pressed="${ds.includes(d.id)}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div>
  <input type="hidden" name="depts" value="${esc(ds.join(','))}"></div>`;
const formDepts = f => f.depts.value.split(',').filter(x=>D[x]);
/* версии из «QA → Версии», кроме отменённых; текущая версия задачи остаётся в списке, даже если её отменили */
const verOpts = cur => [['','— без версии'], ...[...new Set([...S.reg.filter(x=>x.key==='release/versions' && x.status!=='Отменена').sort(byOrder).map(x=>x.name), ...(cur?[cur]:[])])].map(v=>[v,v])];
/* макеты для поля «Макет» у экрана CEF: значение — название макета, рядом его статус */
const mockOpts = cur => [['','— нет макета'], ...[...new Set([...S.reg.filter(x=>x.key==='design/mockups').sort(byOrder).map(x=>x.name), ...(cur?[cur]:[])])].map(n=>{ const m = S.reg.find(x=>x.key==='design/mockups' && x.name===n); return [n, n+(m&&m.status?' · '+m.status:'')]; })];
const sizeOpts = () => Object.entries(SIZES).map(([k,v])=>[k, k+' · '+v]);

/* ── шторка ─────────────────────────────────── */
function openDrawer(ref, edit){
  clearPending(); UI.drawer = ref; UI.edit = !!edit; UI.openedAt = now();
  if (ref.startsWith('task:') && me().last !== ref.slice(5)) col('hub_people').doc(S.me).update({last:ref.slice(5)}).catch(()=>{});
  paintDrawer();
  const el = $('#drawer'); el.classList.add('open'); el.setAttribute('aria-hidden','false');
}
function closeDrawer(){ clearPending(); listenThread(null); UI.drawer = null; UI.edit = false; TE = null; const el = $('#drawer'); el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
const drawerHead = (d, title, extra='') => `<div class="dr-h" style="--dc:${d?d.color:'var(--acc)'}"><span class="ph-ico" style="width:40px;height:40px">${ic(d?d.icon:'BookOpen')}</span><h2>${esc(title)}</h2>${extra}<button class="icon-btn" data-action="close-drawer" aria-label="Закрыть">${ic('X')}</button></div>`;
function linkChip(id, removable){
  const t = task(id), d = dec(id);
  const x = removable ? `<button class="mini-x" data-action="link-del" data-l="${esc(id)}" aria-label="Убрать связь">${ic('X')}</button>` : '';
  if (t) { const dd = D[t.dept]||DEPTS[0]; return `<span class="link" style="--dc:${dd.color}"><span data-open="task:${esc(t.id)}" style="display:inline-flex;gap:6px;align-items:center">${ic(dd.icon)} ${esc(clip(t.title,48))}</span>${x}</span>`; }
  if (d) return `<span class="link"><span data-go="decisions" style="display:inline-flex;gap:6px;align-items:center">${ic('Scale')} ${esc(clip(d.q,48))}</span>${x}</span>`;
  return '';
}
function drawerTask(t){
  const d = D[t.dept] || DEPTS[0], ro = !canEdit(t);
  if (UI.edit && !ro) return drawerHead(d, 'Изменить задачу') + `<form class="dr-b form" data-form="task-edit" data-id="${esc(t.id)}">
    ${inText('title','Название — начни с глагола',t.title,'required maxlength="160"')}
    ${inText('tldr','Суть в одном предложении — зачем',t.tldr,'maxlength="240"')}
    ${deptsPick(tDepts(t))}
    ${inSelect('size','Размер',sizeOpts(),t.size)}
    ${verOpts(t.ver).length>1 ? inSelect('ver','Версия',verOpts(t.ver),t.ver||'') : '<input type="hidden" name="ver" value="">'}
    <div class="fld-row">${inSelect('who','Ответственный',peopleOpts(),t.who||'')}${inText('due','Срок',isoDay(t.due),'type="date"')}</div>
    ${inArea('details','Подробности',t.details,6)}
    <div class="form-foot"><button class="btn primary">${ic('Save')} Сохранить</button><button type="button" class="btn ghost" data-action="edit-cancel">Отмена</button><span class="sp"></span><button type="button" class="btn danger" data-action="task-del" data-id="${esc(t.id)}">${ic('Trash2')} Удалить</button></div>
  </form>`;
  const sub = t.sub||[], sd = sub.filter(s=>s.done).length;
  const back = S.tasks.filter(x=>(x.links||[]).includes(t.id)).map(x=>x.id);
  const links = [...new Set([...(t.links||[]), ...back])].filter(id=>task(id)||dec(id));
  const linkable = [...S.tasks.filter(x=>x.id!==t.id && !links.includes(x.id)).map(x=>[x.id,'Задача: '+clip(x.title,60)]), ...S.decisions.filter(x=>!links.includes(x.id)).map(x=>[x.id,'Решение: '+clip(x.q,60)])];
  const top = (me().top3||[]).includes(t.id);
  const files = S.files.filter(f=>f.task===t.id).sort((a,b)=>a.at-b.at);
  return drawerHead(d, t.title, ro ? '' : `<button class="icon-btn" data-action="edit" aria-label="Изменить" title="Изменить">${ic('Pencil')}</button>`) + `
  <div class="dr-b">
    ${ro ? `<div class="ro-note">${roMsg(t)}</div>` : ''}
    ${t.tldr?`<div class="tldr"><b>Суть</b>${mdLine(t.tldr)}</div>`:''}
    <div class="statusbar" role="group" aria-label="Статус">${COLS.map(([id,n])=>`<button data-action="set-status" data-id="${esc(t.id)}" data-s="${id}" aria-pressed="${t.status===id}" ${ro?'disabled':''}>${n}</button>`).join('')}</div>
    <dl class="kv">${isKid(t)?`<dt>Часть задачи</dt><dd style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="link" data-open="task:${esc(t.parent)}" style="cursor:pointer">${ic('Layers')} ${esc(clip(task(t.parent).title,60))}</span>${ro?'':`<button class="btn sm ghost" data-action="kid-out" data-id="${esc(t.id)}">Вынести отдельно</button>`}</dd>`:''}<dt>${tDepts(t).length>1?'Отделы':'Отдел'}</dt><dd style="display:flex;gap:6px;flex-wrap:wrap">${dchips(t)}</dd>
      <dt>Ответственный</dt><dd style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${av(t.who)} ${esc(pname(t.who))}${t.who!==S.me && !ro?`<button class="btn sm ghost" data-action="take" data-id="${esc(t.id)}">${ic('UserCheck')} Взять себе</button>`:''}</dd>
      ${t.status==='blocked'?`<dt>Заблокировано</dt><dd>${blockedNote(t)}</dd>`:''}
      ${t.ver?`<dt>Версия</dt><dd><span class="link" data-go="d/qa/versions">${ic('Rocket')} ${esc(t.ver)}</span></dd>`:''}
      ${t.reg && regItem(t.reg)?`<dt>Из записи</dt><dd><span class="link" data-action="open-reg" data-id="${esc(t.reg)}" style="cursor:pointer">${ic('BookOpen')} ${esc(clip(regItem(t.reg).name,60))}</span></dd>`:''}
      <dt>Срок</dt><dd>${t.due ? dueChip(t)+` <small style="color:var(--muted)">${esc(dateFmt(t.due))}</small>` : '<span style="color:var(--muted)">не задан</span>'}</dd>
      <dt>Размер</dt><dd><span class="size">${esc(t.size||'M')}</span> <small style="color:var(--muted)">${SIZES[t.size]||''}</small></dd>
      ${t.createdBy?`<dt>Создал(а)</dt><dd style="color:var(--text-2)">${esc(pname(t.createdBy))} · ${ago(t.createdAt)}</dd>`:''}</dl>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn sm primary" data-action="focus-start" data-id="${esc(t.id)}">${ic('Headphones')} Фокус 25 мин</button>
      <button class="btn sm" data-action="toggle-top" data-id="${esc(t.id)}">${top?ic('Star','filled')+' В «Моём дне»':ic('Star')+' В день'}</button>
      ${threadChat('task', t.id) || (t.comments||[]).length ? `<button class="btn sm" data-action="task-md" data-id="${esc(t.id)}" title="Скачать задачу с обсуждением одним файлом Markdown">${ic('FileDown')} Экспорт .md</button>` : ''}
    </div>
    <div><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><p class="sub-h" style="margin:0">Файлы${files.length?` · ${files.length}`:''}</p><span style="flex:1"></span>${ro ? '' : attachBtn('task-attach', t.id, 'Прикрепить')}</div>
      ${upBar('task:'+t.id)}<div class="files">${files.map(f=>fileChip(f, true)).join('') || '<small style="color:var(--muted)">Макеты, логи, скриншоты — до '+fsize(FILE_MAX)+' на файл.</small>'}</div></div>
    ${isKid(t) ? '' : kidsBlock(t, ro)}
    <div><p class="sub-h">Шаги${sub.length?` · ${sd}/${sub.length}`:''}</p>${sub.length?`<div class="mini-bar" style="margin:8px 0"><i style="width:${Math.round(sd/sub.length*100)}%"></i></div>`:''}
      <div class="cl">${sub.map((s,i)=>`<div class="row"><label class="${s.done?'done':''}"><input type="checkbox" data-action="step" data-id="${esc(t.id)}" data-i="${i}" ${s.done?'checked':''} ${ro?'disabled':''}><span>${mdLine(s.t)}</span></label>${ro?'':`<button class="mini-x" data-action="step-del" data-id="${esc(t.id)}" data-i="${i}" aria-label="Удалить шаг">${ic('X')}</button>`}</div>`).join('')}${ro && !sub.length ? '<small style="color:var(--muted)">Шагов нет.</small>' : ''}</div>
      ${ro ? '' : `<form class="inline-add" data-form="step-add" data-id="${esc(t.id)}" style="margin-top:6px"><input class="input" name="s" placeholder="Добавить шаг — маленький и конкретный" autocomplete="off" maxlength="160"><button class="btn sm" aria-label="Добавить шаг">${ic('Plus')}</button></form>`}</div>
    ${t.details?`<details class="more"><summary>Подробности</summary><div class="body md">${md(t.details, true)}</div></details>`:''}
    <div><p class="sub-h" style="margin-bottom:8px">Связано</p><div class="links">${links.map(id=>linkChip(id, !ro && (t.links||[]).includes(id))).join('') || (ro ? '<small style="color:var(--muted)">Связей нет.</small>' : '')}</div>
      ${linkable.length && !ro?`<select class="input" data-action="link-add" data-id="${esc(t.id)}" aria-label="Связать" style="margin-top:8px"><option value="">${'＋ Связать с задачей или решением…'}</option>${linkable.map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select>`:''}</div>
    ${threadBlock('task', t.id)}
  </div>`;
}
/* задачи внутри большой: список со статусами, добавить существующую или создать новую прямо здесь */
function kidsBlock(t, ro){
  const ks = kids(t.id), kd = ks.filter(k=>k.status==='done').length;
  if (ro && !ks.length) return '';
  const addable = S.tasks.filter(x => x.id!==t.id && x.parent!==t.id && canEdit(x) && !isKid(x)).sort(byOrder);
  return `<div><p class="sub-h">${ic('Layers')} Задачи внутри${ks.length?` · ${kd}/${ks.length}`:''}</p>${ks.length?`<div class="mini-bar" style="margin:8px 0"><i style="width:${Math.round(kd/ks.length*100)}%"></i></div>`:''}
    <div class="cl kids">${ks.map(k=>`<div class="row"><input type="checkbox" data-action="kid-done" data-id="${esc(k.id)}" ${k.status==='done'?'checked':''} ${canEdit(k)?'':'disabled'} aria-label="Готово: ${esc(k.title)}"><span class="kid-t${k.status==='done'?' done':''}" data-open="task:${esc(k.id)}" tabindex="0">${esc(k.title)}</span>${chip(colName(k.status), k.status==='done'?'ok':k.status==='blocked'?'red':k.status==='doing'||k.status==='review'?'warn':'muted')}${k.who?av(k.who,20):''}${canEdit(k)?`<button class="mini-x" data-action="kid-out" data-id="${esc(k.id)}" aria-label="Вынести из большой задачи" title="Вынести отдельно">${ic('X')}</button>`:''}</div>`).join('') || (ro ? '' : '<small style="color:var(--muted)">Собери сюда связанные задачи — получится одна большая с общим прогрессом.</small>')}</div>
    ${ro ? '' : `${addable.length?`<select class="input" data-action="kid-add" data-id="${esc(t.id)}" aria-label="Добавить задачу внутрь" style="margin-top:8px"><option value="">＋ Добавить существующую задачу…</option>${addable.map(x=>`<option value="${esc(x.id)}">${esc(clip(x.title,70))}${kids(x.id).length?' (+'+kids(x.id).length+')':''}</option>`).join('')}</select>`:''}
      <form class="inline-add" data-form="kid-new" data-id="${esc(t.id)}" style="margin-top:6px"><input class="input" name="s" placeholder="Новая задача внутри — начни с глагола" autocomplete="off" maxlength="160"><button class="btn sm" aria-label="Создать задачу внутри">${ic('Plus')}</button></form>`}</div>`;
}
function regDecBlock(it){
  const ds = regDecs(it.id);
  return `<div class="reg-decs" id="reg-decs" data-id="${esc(it.id)}"><div style="display:flex;align-items:center;gap:8px"><p class="sub-h" style="margin:0">Решения${ds.length?' · '+ds.length:''}</p><span style="flex:1"></span><button type="button" class="btn sm" data-action="reg-decide" data-id="${esc(it.id)}">${ic('Scale')} Вынести на решение</button></div>
    ${ds.map(d => { const lead = d.chosen!=null ? (d.options[d.chosen]||{}).t : null, n = Object.keys(d.votes||{}).length;
      return `<button type="button" class="dec-line" data-action="open-dec" data-id="${esc(d.id)}">${d.chosen!=null?chip('Принято','ok'):chip(d.mode==='react'?'Реакции':'Голосуем','info')}<span class="q">${esc(d.q)}</span><small>${lead ? esc(lead) : plural(n,'голос','голоса','голосов')}</small></button>`; }).join('') || '<small style="color:var(--muted)">Спорный момент по записи? Вынеси его на решение — запись останется здесь.</small>'}</div>`;
}
/* передача макета в разработку: свой чеклист у каждого макета (отметки в поле hand), пункты — общий список «Передача» */
function mockHandoff(it){
  const items = S.reg.filter(x=>x.key==='design/handoff').sort(byOrder); if (!items.length) return '';
  const hand = it.hand || {}, n = items.filter(x=>hand[x.id]).length;
  return `<div><p class="sub-h" style="margin:0 0 6px">Передача в разработку · ${n} из ${items.length}</p><div class="cl">${items.map(x=>`<div class="row"><label class="${hand[x.id]?'done':''}"><input type="checkbox" data-action="mock-hand" data-id="${esc(it.id)}" data-h="${esc(x.id)}" ${hand[x.id]?'checked':''}><span>${esc(x.name)}</span></label></div>`).join('')}</div>
    ${n<items.length && it.status==='Утверждён' ? '<small style="color:var(--warn)">Макет утверждён, но чеклист передачи не закрыт.</small>' : ''}</div>`;
}
/* задачи, сделанные из записи (поле reg у задачи) */
function regTasks(it){
  const ts = S.allTasks.filter(t=>t.reg===it.id); if (!ts.length) return '';
  return `<div><p class="sub-h" style="margin:0 0 6px">Задачи по записи · ${ts.length}</p><div class="list">${ts.map(t=>taskItem(t,{status:true})).join('')}</div></div>`;
}
function regForm(key, it){
  const r = REGS[key], d = D[key.split('/')[0]];
  const field = f => {
    const v = it ? it[f.k] : (f.k==='status' && f.o ? f.o[0][0] : '');
    if (f.t==='textarea') return inArea(f.k, f.l, v, 5);
    if (f.t==='select') return inSelect(f.k, f.l, [['','—'], ...f.o.map(o=>[o[0],o[0]])], v);
    if (f.t==='person') return inSelect(f.k, f.l, peopleOpts(), v||'');
    if (f.t==='dept') return inSelect(f.k, f.l, deptOpts(), hd(v) || (UI.bfilt!=='all' ? UI.bfilt : d.id));
    if (f.t==='url') return inText(f.k, f.l, v, 'type="url" placeholder="https://"');
    /* старые даты свободным текстом («01.11») не стираем: показываем как текст, пока их не заменят */
    if (f.t==='date') return !v || /^\d{4}-\d\d-\d\d$/.test(v) ? inText(f.k, f.l, v, 'type="date"') : inText(f.k, f.l+' — замени на ГГГГ-ММ-ДД', v, 'maxlength="40"');
    if (f.t==='ver') return inSelect(f.k, f.l, verOpts(v), v||'');
    if (f.t==='mockup') return inSelect(f.k, f.l, mockOpts(v), v||'');
    return inText(f.k, f.l, v, (f.req?'required ':'')+'maxlength="300"'+(f.mono?' style="font-family:var(--f-mono);font-size:13px"':''));
  };
  return drawerHead(d, it ? it.name : 'Новая запись: '+r.noun, it && r.type!=='checklist' ? `<button type="button" class="btn sm" data-action="reg-task" data-id="${esc(it.id)}" title="Сделать задачу по этой записи — связь сохранится">${ic('Plus')} В задачу</button><button type="button" class="btn sm" data-action="reg-decide" data-id="${esc(it.id)}" title="Вынести запись на решение — она останется на месте">${ic('Scale')} На решение</button>` : '') + `<div class="dr-b"><form class="form" data-form="reg-save" data-key="${key}" data-id="${it?esc(it.id):''}">
    ${r.fields.map(field).join('')}
    ${it && safeUrl(it.link) ? `<a class="btn" href="${esc(it.link)}" target="_blank" rel="noopener">${ic('ExternalLink')} Открыть макет</a>`:''}
    ${it && key==='design/mockups' ? mockHandoff(it) : ''}
    ${it && r.type!=='checklist' ? regDecBlock(it) + regTasks(it) : ''}
    ${r.type==='checklist' ? '' : `<div class="reg-gal" id="reg-gal" data-id="${it?esc(it.id):''}">${regGallery(it&&it.id)}</div>`}
    <div class="form-foot"><button class="btn primary">${ic('Save')} ${it?'Сохранить':'Добавить'}</button><button type="button" class="btn ghost" data-action="close-drawer">Отмена</button><span class="sp"></span>${it?`<button type="button" class="btn danger" data-action="reg-del" data-id="${esc(it.id)}">${ic('Trash2')} Удалить</button>`:''}</div>
    ${it&&it.updatedBy?`<small style="color:var(--muted)">Изменено: ${esc(pname(it.updatedBy))}, ${ago(it.updatedAt)}</small>`:''}
  </form>${it && r.type!=='checklist' ? threadBlock('reg', it.id) : ''}</div>`;
}
function wikiDrawer(w){
  const pre = (!w && UI.wikiPre) || {};
  if (!w || UI.edit) return drawerHead(null, w ? 'Изменить статью' : 'Новая статья') + `<form class="dr-b form" data-form="wiki-save" data-id="${w?esc(w.id):''}">
    ${inText('title','Заголовок',w ? w.title : pre.title,'required maxlength="120"')}
    ${inText('tldr','Суть в одном предложении',w&&w.tldr,'maxlength="240"')}
    ${inArea('body','Текст — можно Markdown: # заголовок, **жирный**, - список, | таблица |',w ? w.body : pre.body,14)}
    <div class="form-foot"><button class="btn primary">${ic('Save')} Сохранить</button><button type="button" class="btn ghost" data-action="${w?'edit-cancel':'close-drawer'}">Отмена</button><span class="sp"></span>${w?`<button type="button" class="btn danger" data-action="wiki-del" data-id="${esc(w.id)}">${ic('Trash2')} Удалить</button>`:''}</div>
  </form>`;
  return drawerHead(null, w.title, `<button class="icon-btn" data-action="edit" aria-label="Изменить" title="Изменить">${ic('Pencil')}</button>`) + `<div class="dr-b">${w.tldr?`<div class="tldr"><b>Суть</b>${mdLine(w.tldr)}</div>`:''}<article class="md">${md(w.body||'')}</article>${w.updatedBy?`<small style="color:var(--muted)">Изменено: ${esc(pname(w.updatedBy))}, ${ago(w.updatedAt)}</small>`:''}</div>`;
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
  else if (kind==='eedit') { const [c, x] = [id.slice(0, id.indexOf(':')), id.slice(id.indexOf(':')+1)]; html = (S.E || c==='decisions') && eForm(c, x); if (!html) return missing(); }
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
  paintRegGal(); paintThread(); // фото, обсуждение и решения записи обновляются, даже пока форма открыта
  { const rd = $('#reg-decs'), it = rd && regItem(rd.dataset.id); if (it) rd.outerHTML = regDecBlock(it); }
  const force = UI.forceDrawer; UI.forceDrawer = false;
  if (!force && (UI.edit || /^(reg|regnew|wikinew|eedit|enew|etable):/.test(UI.drawer))) return;
  const a = document.activeElement, inside = a && $('#drawer').contains(a);
  const form = inside && a.form && a.form.dataset.form, name = inside && a.name, act = inside && a.dataset && a.dataset.action;
  const keep = {}; document.querySelectorAll('#drawer form[data-form] input[name], #drawer form[data-form] textarea[name]').forEach(i => { if (i.value) keep[i.form.dataset.form+'/'+i.name] = i.value; });
  const sel = inside && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null;
  const sb = $('#drawer .dr-b'), st = sb ? sb.scrollTop : 0; // перерисовка не должна уводить к началу карточки
  paintDrawer(); repop($('#drawer'));
  { const nb = $('#drawer .dr-b'); if (nb) nb.scrollTop = st; }
  for (const [k,v] of Object.entries(keep)) { const [f,n] = k.split('/'); const i = $(`#drawer form[data-form="${f}"] [name="${n}"]`); if (i && !i.value) i.value = v; }
  const el = form ? $(`#drawer form[data-form="${form}"] [name="${name}"]`) : act ? $(`#drawer [data-action="${act}"]`) : null;
  if (el) { el.focus({preventScroll:true}); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} }
}

/* ── доски (как FigJam): стикеры, текст, фигуры, стрелки, карандаш, картинки и файлы ──
   Холст живёт в #boardbox вне #view: общая перерисовка его не трогает, объекты обновляются точечно по id.
   Каждый объект — документ hub_bitems {board, k, x, y, w, h, c, t, pts, file, z, by}; курсоры — hub_bcur/{доска_uid}. */
const BCOLORS = ['ink','#FFD43B','#FF8FAB','#74C0FC','#69DB7C','#B197FC','#FFA94D','#FF6B6B'];
const BTOOLS = [['select','MousePointer2','Выбор','V'],['hand','Hand','Рука — двигать холст','H'],['sticky','StickyNote','Стикер','S'],['text','Type','Текст','T'],
  ['rect','Square','Прямоугольник','R'],['ellipse','Circle','Эллипс','O'],['arrow','MoveUpRight','Стрелка','A'],['line','Minus','Линия','L'],
  ['pen','Pencil','Карандаш','P'],['eraser','Eraser','Ластик','E'],['frame','Frame','Секция','F']];
const BKEYS = {KeyV:'select', KeyH:'hand', KeyS:'sticky', KeyT:'text', KeyR:'rect', KeyO:'ellipse', KeyA:'arrow', KeyL:'line', KeyP:'pen', KeyE:'eraser', KeyF:'frame'};
const BFS = [[16,'S'],[24,'M'],[36,'L'],[56,'XL']];
const BB = {id:null, items:{}, unsub:[], built:false, px:0, py:0, z:1, tool:'select', color:'#FFD43B', ink:'ink', sel:new Set(), act:null, edit:null,
  els:{}, sigs:{}, curs:{}, curT:0, curLast:null, undo:[], redo:[], clip:[], fit:false, touchedAt:0, space:false};
const bcol = c => c==='ink' || !c ? 'var(--text)' : safeColor(c);
const bItems = () => Object.values(BB.items).sort((a,b) => ((a.k==='frame' ? 0 : 1) - (b.k==='frame' ? 0 : 1)) || (a.z||0)-(b.z||0));
const boardOf = id => S.boards.find(b=>b.id===id);
const isBox = it => ['sticky','text','rect','ellipse','image','file','frame'].includes(it.k);
const isPath = it => ['pen','arrow','line'].includes(it.k);
/* рамка объекта в координатах холста */
function bBox(it){
  if (it.k==='pen') { const p = it.pts||[]; let x0=0,y0=0,x1=0,y1=0; for (let i=0;i<p.length;i+=2) { x0=Math.min(x0,p[i]); y0=Math.min(y0,p[i+1]); x1=Math.max(x1,p[i]); y1=Math.max(y1,p[i+1]); } return {x:it.x+x0, y:it.y+y0, w:x1-x0, h:y1-y0}; }
  if (it.k==='arrow' || it.k==='line') return {x:Math.min(it.x, it.x+it.w), y:Math.min(it.y, it.y+it.h), w:Math.abs(it.w), h:Math.abs(it.h)};
  return {x:it.x, y:it.y, w:it.w||0, h:it.h||0};
}
const toWorld = (cx, cy) => { const r = $('#bd-stage').getBoundingClientRect(); return {x:(cx-r.left-BB.px)/BB.z, y:(cy-r.top-BB.py)/BB.z}; };

/* ── список досок (#/board) ── */
function viewBoards(){
  const list = [...S.boards].sort((a,b)=>(b.updatedAt||b.createdAt||0)-(a.updatedAt||a.createdAt||0));
  return `<div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#F2A3C8">${ic('Presentation')}</span><div><h1>Доски</h1><p>Общие холсты команды: стикеры, схемы, стрелки, рисунки, скриншоты и файлы. Всё видно всем и сразу.</p></div></div><button class="btn primary" data-action="board-new">${ic('Plus')} Новая доска</button></div>
  ${list.length ? `<div class="bd-grid">${list.map(b => `<a class="bd-card" href="#/board/${esc(b.id)}" data-pk="b:${esc(b.id)}">
    <span class="bd-thumb">${ic('Presentation')}</span>
    <span class="bd-ci"><b>${esc(b.title||'Без названия')}</b><small>${esc(pname(b.by))} · ${ago(b.updatedAt||b.createdAt)}</small></span>
    ${b.by===S.me || isAdmin() ? `<button type="button" class="mini-x" data-action="board-del" data-id="${esc(b.id)}" title="Удалить доску" aria-label="Удалить доску">${ic('Trash2')}</button>` : ''}</a>`).join('')}</div>`
  : `<div class="empty"><b>Досок пока нет</b>Набросай схему механики, мудборд или план релиза.<button class="btn sm" data-action="board-new">${ic('Plus')} Новая доска</button></div>`}`;
}
function boardNew(){
  overlay(`<form class="pal" data-form="board-new"><div class="cap"><h2>${ic('Presentation')} Новая доска</h2>
    <input class="input" name="title" placeholder="Название: «Схема экономики», «Мудборд HUD»…" required maxlength="120" autocomplete="off">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint">Доску видит и рисует вся команда · <kbd>Enter</kbd> создать</span><span style="flex:1"></span><button class="btn primary">Создать</button></div></div></form>`);
}
async function boardCreate(f){
  const title = clip(f.title.value.trim(),120); if (!title) return;
  const ref = col('hub_boards').doc();
  if (!await write(()=>ref.set({title, by:S.me, createdAt:now(), updatedAt:now(), updatedBy:S.me}))) return;
  closeOverlay(); log('создал(а) доску', title); gain(3, ic('Presentation')+' Доска создана'); go('board/'+ref.id);
}
async function boardDelete(id){
  const b = boardOf(id); if (!b || !confirm('Удалить доску «'+(b.title||'')+'» со всем содержимым?')) return;
  await write(async () => {
    const sn = await col('hub_bitems').where('board','==',id).get();
    const fids = sn.docs.map(d=>d.data().file).filter(Boolean);
    for (let i=0;i<sn.docs.length;i+=400) { const bt = DB.batch(); sn.docs.slice(i,i+400).forEach(d=>bt.delete(d.ref)); await bt.commit(); }
    await col('hub_boards').doc(id).delete();
    await deleteFiles(fids);
  }) && log('удалил(а) доску', b.title||'');
}

/* ── подписка на открытую доску ── */
function boardOpen(id){
  if (BB.id===id) return;
  boardLeave();
  BB.id = id; BB.items = {}; BB.sel = new Set(); BB.undo = []; BB.redo = []; BB.edit = null; BB.loaded = false; BB.fit = true; BB.firstPaint = true;
  BB.px = 0; BB.py = 0; BB.z = 1; BB.tool = 'select';
  Object.values(BB.els).forEach(e=>e.remove()); BB.els = {}; BB.sigs = {};
  BB.unsub.push(col('hub_bitems').where('board','==',id).onSnapshot(sn => {
    sn.docChanges().forEach(ch => { if (ch.type==='removed') { delete BB.items[ch.doc.id]; BB.sel.delete(ch.doc.id); } else BB.items[ch.doc.id] = Object.assign({id:ch.doc.id}, ch.doc.data()); });
    BB.loaded = true; boardRender();
    if (BB.fit) { BB.fit = false; boardFit(true); }
  }, e => { console.error('hub_bitems', e); BB.err = errText(e); boardStatus(); }));
  BB.unsub.push(col('hub_bcur').where('board','==',id).onSnapshot(sn => { BB.curs = {}; sn.docs.forEach(d => { const c = d.data(); if (c.uid!==S.me) BB.curs[c.uid] = c; }); boardCursors(); }, e => console.warn('hub_bcur', e.code)));
}
function boardLeave(){
  BB.unsub.forEach(u => { try { u(); } catch (e) {} }); BB.unsub = [];
  if (BB.id && S.me) col('hub_bcur').doc(BB.id+'_'+S.me).delete().catch(()=>{});
  BB.id = null; BB.curs = {}; BB.err = null;
}

/* ── каркас: верхняя панель, холст, панель инструментов ── */
function boardShell(){
  const el = $('#boardbox'); BB.built = true;
  el.innerHTML = `<div class="bd-top"><a class="icon-btn" href="#/board" title="Все доски" aria-label="Все доски">${ic('ChevronLeft')}</a>
      <input class="bd-title" id="bd-title" maxlength="120" aria-label="Название доски" spellcheck="false">
      <span class="bd-who" id="bd-who"></span><span style="flex:1"></span>
      <div class="bd-zoom"><button class="icon-btn" data-b="undo" title="Отменить (Ctrl+Z)" aria-label="Отменить">${ic('Undo2')}</button><button class="icon-btn" data-b="redo" title="Вернуть (Ctrl+Shift+Z)" aria-label="Вернуть">${ic('Redo2')}</button>
      <button class="icon-btn" data-b="zout" title="Отдалить" aria-label="Отдалить">${ic('ZoomOut')}</button><button class="bd-pct" data-b="z100" title="100%"><span id="bd-pct">100%</span></button><button class="icon-btn" data-b="zin" title="Приблизить" aria-label="Приблизить">${ic('ZoomIn')}</button><button class="icon-btn" data-b="fit" title="Показать всё (Shift+1)" aria-label="Показать всё">${ic('Maximize')}</button></div></div>
    <div class="bd-stage" id="bd-stage" tabindex="0" aria-label="Холст доски">
      <div class="bd-world" id="bd-world"><div class="bd-items" id="bd-items"></div><svg class="bd-svg" id="bd-svg" width="1" height="1"><g id="bd-paths"></g><g id="bd-draft"></g></svg><div class="bd-selbox" id="bd-selbox" hidden><i class="bd-h" data-h="se"></i></div></div>
      <div class="bd-curs" id="bd-curs"></div><div class="bd-marq" id="bd-marq" hidden></div>
      <div class="bd-msg" id="bd-msg" hidden></div><div class="bd-drop" id="bd-drop" hidden>${ic('Image')} Отпусти — картинки и файлы лягут на доску</div></div>
    <div class="bd-bar" id="bd-bar"></div>
    <input type="file" id="bd-file" multiple hidden>`;
  const st = $('#bd-stage');
  st.addEventListener('pointerdown', bDown); st.addEventListener('pointermove', bMove); st.addEventListener('pointerup', bUp); st.addEventListener('pointercancel', bUp);
  st.addEventListener('wheel', bWheel, {passive:false});
  st.addEventListener('dblclick', bDbl);
  st.addEventListener('dragover', e => { if (!dragFiles(e)) return; e.preventDefault(); $('#bd-drop').hidden = false; });
  st.addEventListener('dragleave', e => { if (!st.contains(e.relatedTarget)) $('#bd-drop').hidden = true; });
  st.addEventListener('drop', e => { if (!dragFiles(e)) return; e.preventDefault(); $('#bd-drop').hidden = true; const p = toWorld(e.clientX, e.clientY); boardFiles([...e.dataTransfer.files], p.x, p.y); });
  st.addEventListener('pointerleave', () => { if (BB.id) curSend(null); });
  el.addEventListener('click', bClick);
  $('#bd-title').addEventListener('change', e => { const t = clip(e.target.value.trim(),120); if (t && BB.id) write(()=>col('hub_boards').doc(BB.id).update(Object.assign({title:t}, stamp()))); });
  $('#bd-title').addEventListener('keydown', e => { if (e.key==='Enter') e.target.blur(); });
  $('#bd-file').addEventListener('change', e => { const fs_ = [...e.target.files]; e.target.value = ''; const c = bCenter(); boardFiles(fs_, c.x, c.y); });
}
const bCenter = () => { const r = $('#bd-stage').getBoundingClientRect(); return toWorld(r.left+r.width/2, r.top+r.height/2); };
/* вызывается из paint(): показать/спрятать доску, обновить шапку */
function boardPaint(){
  const el = $('#boardbox'); if (!el) return;
  const on = !!(S.me && UI.route==='board' && UI.board && !document.body.classList.contains('locked'));
  el.hidden = !on;
  if (!on) { if (BB.id) boardLeave(); return; }
  if (!BB.built) boardShell();
  boardOpen(UI.board);
  const b = boardOf(UI.board), t = $('#bd-title');
  if (t && document.activeElement!==t) t.value = b ? b.title||'' : '';
  boardRender();
}
/* подсказки поверх холста, панель инструментов, кто на доске */
function boardStatus(){
  const msg = $('#bd-msg'); if (!msg) return; msg.classList.remove('soft'); const b = boardOf(UI.board);
  if (BB.err) { msg.hidden = false; msg.innerHTML = `<div class="banner err">${ic('CircleAlert')}<div><b>Доска недоступна: ${esc(BB.err)}.</b><br><small>В правилах Firestore нужны коллекции hub_boards, hub_bitems, hub_bcur.</small></div></div>`; }
  else if (S.loaded.has('hub_boards') && !b) { msg.hidden = false; msg.innerHTML = `<div class="empty"><b>Доска не найдена</b>Возможно, её удалили.<a class="btn sm" href="#/board">К списку</a></div>`; }
  else if (!BB.loaded) { msg.hidden = false; msg.innerHTML = '<div class="loading"><span class="spin"></span>Открываем доску…</div>'; }
  else if (!Object.keys(BB.items).length) { msg.hidden = false; msg.innerHTML = `<div class="bd-hint"><b>Пустая доска</b>Выбери инструмент внизу или нажми <kbd>S</kbd> — стикер, <kbd>T</kbd> — текст, <kbd>P</kbd> — карандаш. Картинку можно вставить через <kbd>Ctrl</kbd>+<kbd>V</kbd> или перетащить.</div>`; msg.classList.add('soft'); }
  else msg.hidden = true;
  boardBar(); boardWho();
}
function boardWho(){
  const w = $('#bd-who'); if (!w) return;
  const ids = Object.values(BB.curs).filter(c => c.at > now()-60e3).map(c=>c.uid);
  w.innerHTML = [S.me, ...ids].slice(0,6).map(id=>av(id,26)).join('') + (ids.length ? `<small>${ids.length+1} на доске</small>` : '');
}
function boardBar(){
  const bar = $('#bd-bar'); if (!bar) return;
  const sel = [...BB.sel].map(id=>BB.items[id]).filter(Boolean), texts = sel.filter(it=>it.k==='text');
  const cur = sel.length ? (sel[0].c||'ink') : BB.tool==='sticky' ? BB.color : BB.ink;
  const html = `<div class="bd-tools" role="toolbar" aria-label="Инструменты">${BTOOLS.map(([k,icn,t,key])=>`<button data-b="tool" data-v="${k}" aria-pressed="${BB.tool===k}" title="${t} (${key})" aria-label="${t}">${ic(icn)}</button>`).join('')}
    <span class="bd-sep"></span><button data-b="file" title="Картинка или файл" aria-label="Картинка или файл">${ic('Paperclip')}</button></div>
    <div class="bd-tools bd-props">${BCOLORS.map(c=>`<button class="bd-sw" data-b="color" data-v="${c}" aria-pressed="${cur===c}" title="${c==='ink'?'Цвет текста':c}" style="--sw:${bcol(c)}"></button>`).join('')}
    ${texts.length ? `<span class="bd-sep"></span>${BFS.map(([n,l])=>`<button class="bd-fs" data-b="fs" data-v="${n}" aria-pressed="${texts[0].fs===n || (!texts[0].fs && n===24)}">${l}</button>`).join('')}` : ''}
    ${sel.length ? `<span class="bd-sep"></span><button data-b="front" title="На передний план" aria-label="На передний план">${ic('ArrowUp')}</button><button data-b="dup" title="Дублировать (Ctrl+D)" aria-label="Дублировать">${ic('Copy')}</button><button data-b="del" title="Удалить (Delete)" aria-label="Удалить">${ic('Trash2')}</button>` : ''}</div>`;
  if (bar.innerHTML !== html) bar.innerHTML = html;
}

/* ── отрисовка объектов: только изменившиеся ── */
function bView(){ const w = $('#bd-world'), st = $('#bd-stage'); if (!w) return;
  w.style.transform = `translate(${BB.px}px,${BB.py}px) scale(${BB.z})`;
  const g = 24*BB.z; st.style.backgroundSize = `${g}px ${g}px`; st.style.backgroundPosition = `${BB.px}px ${BB.py}px`;
  st.style.setProperty('--z', BB.z); const p = $('#bd-pct'); if (p) p.textContent = Math.round(BB.z*100)+'%';
}
function bFileHtml(it){
  const f = S.files.find(x=>x.id===it.file);
  if (!f) return `<div class="bd-ph">${ic('Image')}<small>Загружается…</small></div>`;
  if (it.k==='image') { const src = thumb(f); return src ? `<img src="${src}" alt="${esc(f.name)}" draggable="false">` : `<div class="bd-ph"><span class="spin"></span></div>`; }
  return `<div class="bd-fc">${ic('Paperclip')}<span><b>${esc(f.name)}</b><small>${fsize(f.size||0)} · двойной клик — скачать</small></span></div>`;
}
function bHtml(it){
  if (it.k==='sticky') return `<div class="bd-tx">${esc(it.t||'')}</div><small class="bd-by">${esc(pname(it.by).split(' ')[0])}</small>`;
  if (it.k==='text' || it.k==='rect' || it.k==='ellipse') return `<div class="bd-tx">${esc(it.t||'')}</div>`;
  if (it.k==='frame') return `<span class="bd-ft">${esc(it.t||'Секция')}</span>`;
  return bFileHtml(it);
}
function bPathD(it){
  if (it.k==='pen') { const p = it.pts||[]; let d = `M${it.x+p[0]} ${it.y+p[1]}`; for (let i=2;i<p.length;i+=2) d += `L${it.x+p[i]} ${it.y+p[i+1]}`; return d; }
  return bLineD(it.x, it.y, it.x+it.w, it.y+it.h, it.k==='arrow');
}
function bLineD(x0, y0, x1, y1, head){
  let d = `M${x0} ${y0}L${x1} ${y1}`; if (!head) return d;
  const a = Math.atan2(y1-y0, x1-x0), L = 14;
  return d + `M${x1-L*Math.cos(a-.45)} ${y1-L*Math.sin(a-.45)}L${x1} ${y1}L${x1-L*Math.cos(a+.45)} ${y1-L*Math.sin(a+.45)}`;
}
function boardRender(){
  if (!BB.id || !$('#bd-items')) return;
  const box = $('#bd-items'), paths = $('#bd-paths'), seen = new Set();
  bItems().forEach((it, i) => {
    const d = BB.drag && BB.drag.pos[it.id], x = d ? d.x : it.x, y = d ? d.y : it.y, r = BB.drag && BB.drag.size && BB.drag.size.id===it.id ? BB.drag.size : null;
    const v = Object.assign({}, it, {x, y}, r ? {w:r.w, h:r.h} : {});
    const f = (it.k==='image'||it.k==='file') && S.files.find(q=>q.id===it.file);
    const sig = JSON.stringify([v.k,v.x,v.y,v.w,v.h,v.c,v.t,v.fs,v.pts&&v.pts.length,v.file, f ? f.id+(THUMBS[f.id]||'') : '', i]);
    seen.add(it.id);
    if (BB.sigs[it.id]===sig || BB.edit===it.id) return;
    BB.sigs[it.id] = sig;
    let el = BB.els[it.id];
    if (isPath(it)) {
      if (!el) { el = document.createElementNS('http://www.w3.org/2000/svg','g'); el.dataset.id = it.id; el.innerHTML = '<path class="bd-hit"/><path class="bd-ln"/>'; BB.els[it.id] = el; }
      const dd = bPathD(v);
      el.firstChild.setAttribute('d', dd); el.lastChild.setAttribute('d', dd);
      el.lastChild.style.stroke = bcol(v.c); el.lastChild.style.strokeWidth = v.sw || (it.k==='pen' ? 3 : 2.5);
    } else {
      if (!el) { el = document.createElement('div'); el.dataset.id = it.id; BB.els[it.id] = el; if (!BB.firstPaint) el.classList.add('pop'); }
      el.className = 'bd-it k-'+it.k + (el.classList.contains('pop') ? ' pop' : '');
      el.style.cssText = `left:${v.x}px;top:${v.y}px;width:${v.w||0}px;${it.k==='text'?'':'height:'+(v.h||0)+'px;'}--c:${bcol(v.c)};${it.k==='text'?'font-size:'+(v.fs||24)+'px;':''}`;
      el.innerHTML = bHtml(v);
    }
  });
  for (const id of Object.keys(BB.els)) if (!seen.has(id)) { BB.els[id].remove(); delete BB.els[id]; delete BB.sigs[id]; }
  /* порядок слоёв: двигаем в DOM только то, что стоит не на месте */
  const order = bItems(); let hp = null, sp = null;
  order.forEach(it => { const el = BB.els[it.id]; if (!el) return; const host = isPath(it) ? paths : box, prev = isPath(it) ? sp : hp, want = prev ? prev.nextSibling : host.firstChild;
    if (el.parentNode!==host || el!==want) host.insertBefore(el, want); if (isPath(it)) sp = el; else hp = el; });
  if (BB.loaded) BB.firstPaint = false;
  bSel(); boardStatus();
}
/* рамка выделения и ручка размера */
function bSel(){
  const sb = $('#bd-selbox'); if (!sb) return;
  Object.entries(BB.els).forEach(([id, el]) => el.classList.toggle('sel', BB.sel.has(id)));
  const its = [...BB.sel].map(id=>BB.items[id]).filter(Boolean);
  if (!its.length || BB.edit) { sb.hidden = true; return; }
  let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
  its.forEach(it => { const d = BB.drag && BB.drag.pos[it.id], s = BB.drag && BB.drag.size && BB.drag.size.id===it.id ? BB.drag.size : null;
    const b = bBox(Object.assign({}, it, d||{}, s ? {w:s.w, h:s.h} : {}));
    const h = it.k==='text' && BB.els[it.id] ? BB.els[it.id].offsetHeight : b.h;
    x0=Math.min(x0,b.x); y0=Math.min(y0,b.y); x1=Math.max(x1,b.x+b.w); y1=Math.max(y1,b.y+h); });
  sb.hidden = false; sb.style.cssText = `left:${x0-4}px;top:${y0-4}px;width:${x1-x0+8}px;height:${y1-y0+8}px`;
  sb.firstChild.hidden = !(its.length===1 && isBox(its[0]));
}
/* курсоры команды */
function boardCursors(){
  const box = $('#bd-curs'); if (!box) return;
  box.innerHTML = Object.values(BB.curs).filter(c => c.at > now()-20e3 && c.x!=null).map(c => { const p = S.people[c.uid] || {};
    return `<div class="bd-cur" data-uid="${esc(c.uid)}" style="transform:translate(${c.x*BB.z+BB.px}px,${c.y*BB.z+BB.py}px);--c:${safeColor(p.color)||'#B197FC'}"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 3l7 17 2.5-7L21 10.5z"/></svg><span>${esc(pname(c.uid).split(' ')[0])}</span></div>`; }).join('');
  boardWho();
}
/* свой курсор в базу — не чаще 4 раз в секунду */
function curSend(p){
  if (!BB.id || !S.me) return;
  BB.curLast = p; if (BB.curT) return;
  BB.curT = setTimeout(() => { BB.curT = 0; const q = BB.curLast; if (!BB.id) return;
    col('hub_bcur').doc(BB.id+'_'+S.me).set(Object.assign({board:BB.id, uid:S.me, x:q ? Math.round(q.x) : null, y:q ? Math.round(q.y) : null, at:now()}, expireIn(1))).catch(()=>{}); }, 250);
}

/* ── запись в базу и отмена ── */
const BFIELDS = ['k','x','y','w','h','c','t','fs','pts','sw','file','z'];
const bSnap = it => { const o = {}; BFIELDS.forEach(k => { if (it[k]!==undefined) o[k] = it[k]; }); return o; };
async function bCommit(op, record){
  /* op: {add:[{id,...}], del:[{id,...}], upd:[{id, before, after}]} — применяем сразу локально, потом в базу */
  (op.add||[]).forEach(it => { BB.items[it.id] = Object.assign({id:it.id, board:BB.id, by:S.me, at:now()}, BB.items[it.id]||{}, it); });
  (op.del||[]).forEach(it => { delete BB.items[it.id]; BB.sel.delete(it.id); });
  (op.upd||[]).forEach(u => { if (BB.items[u.id]) Object.assign(BB.items[u.id], u.after); });
  if (record!==false) { BB.undo.push(op); if (BB.undo.length > 80) BB.undo.shift(); BB.redo = []; }
  boardRender();
  const ok = await write(async () => {
    const b = DB.batch();
    (op.add||[]).forEach(it => b.set(col('hub_bitems').doc(it.id), Object.assign({board:BB.id, by:it.by||S.me, at:it.at||now()}, bSnap(it))));
    (op.del||[]).forEach(it => b.delete(col('hub_bitems').doc(it.id)));
    (op.upd||[]).forEach(u => b.update(col('hub_bitems').doc(u.id), u.after));
    await b.commit();
  });
  if (ok && now()-BB.touchedAt > 60e3 && BB.id) { BB.touchedAt = now(); col('hub_boards').doc(BB.id).update(stamp()).catch(()=>{}); }
  return ok;
}
const bInv = op => ({add:(op.del||[]).map(x=>Object.assign({}, x)), del:(op.add||[]).map(x=>({id:x.id})), upd:(op.upd||[]).map(u=>({id:u.id, before:u.after, after:u.before}))});
function bUndo(redo){
  const from = redo ? BB.redo : BB.undo, to = redo ? BB.undo : BB.redo, op = from.pop(); if (!op) return;
  /* объект мог исчезнуть у других — отменяем только то, что ещё на месте */
  const inv = bInv(op); inv.upd = inv.upd.filter(u=>BB.items[u.id]); inv.del = inv.del.filter(d=>BB.items[d.id]);
  inv.add = inv.add.map(a => Object.assign({}, a, a.by ? {} : {by:S.me}));
  to.push(op); bCommit(inv, false);
}
function bNew(k, x, y, extra){ return Object.assign({id:col('hub_bitems').doc().id, k, x:Math.round(x), y:Math.round(y), z:now(), by:S.me, at:now()}, extra); }
function bUpdate(ids, fn){
  const upd = ids.map(id => BB.items[id]).filter(Boolean).map(it => { const after = fn(it); const before = {}; Object.keys(after).forEach(k => before[k] = it[k]===undefined ? null : it[k]); return {id:it.id, before, after}; });
  if (upd.length) bCommit({upd});
}
function bDelete(ids){ const del = ids.map(id=>BB.items[id]).filter(Boolean).map(it=>Object.assign({}, it)); if (del.length) bCommit({del}); }
function bDup(ids, dx, dy){
  const src = (ids || [...BB.sel]).map(id=>BB.items[id]).filter(Boolean); if (!src.length) return;
  const add = src.map((it, i) => Object.assign(bSnap(it), {id:col('hub_bitems').doc().id, x:it.x+(dx==null?24:dx), y:it.y+(dy==null?24:dy), z:now()+i, by:S.me, at:now()}));
  bCommit({add}); BB.sel = new Set(add.map(a=>a.id)); bSel(); boardBar();
}

/* картинки и файлы: загружаем через общий механизм файлов хаба */
async function boardFiles(list, x, y){
  if (!BB.id || !list.length) return;
  const board = BB.id, files = list.map(shotName).filter(f => f.size <= FILE_MAX || (toast(ic('CircleAlert')+' «'+esc(f.name)+'» больше '+fsize(FILE_MAX)), false));
  if (!files.length) return;
  const dims = await Promise.all(files.map(f => isImg(f) && window.createImageBitmap ? createImageBitmap(f).then(b => ({w:b.width, h:b.height})).catch(()=>null) : null));
  toast(ic('Paperclip')+' Загружаю '+plural(files.length,'файл','файла','файлов')+'…');
  const ids = await uploadFiles(files, {board});
  if (BB.id!==board) return;
  const add = ids.map((fid, i) => { const file = files[i] || {}, img = isImg(file), d = dims[i];
    const w = img ? Math.min(420, (d && d.w) || 320) : 240, h = img ? Math.round(w * (d && d.w ? d.h/d.w : .66)) : 64;
    return bNew(img ? 'image' : 'file', x - w/2 + i*28, y - h/2 + i*28, {w, h, file:fid}); });
  if (add.length) { bCommit({add}); BB.sel = new Set(add.map(a=>a.id)); toast(ic('Image')+' На доске: '+plural(add.length,'файл','файла','файлов')); }
}

/* ── ввод: мышь, перо, тач ── */
const bHitId = e => { const at = e.type==='pointermove' ? document.elementFromPoint(e.clientX, e.clientY) : e.target, t = at && at.closest && at.closest('[data-id]'); return t && $('#bd-world').contains(t) ? t.dataset.id : null; };
function bDown(e){
  if (!BB.id || BB.edit) { if (BB.edit && !e.target.closest('[contenteditable]')) bEndEdit(); return; }
  const st = $('#bd-stage'); st.focus({preventScroll:true});
  const p = toWorld(e.clientX, e.clientY), id = bHitId(e), tool = BB.tool;
  st.setPointerCapture(e.pointerId);
  if (e.button===1 || tool==='hand' || BB.space) { BB.act = {k:'pan', sx:e.clientX, sy:e.clientY, px:BB.px, py:BB.py}; st.classList.add('panning'); return; }
  if (e.button!==0) return;
  if (tool==='select') {
    if (e.target.dataset.h) { const it = BB.items[[...BB.sel][0]]; BB.act = {k:'size', id:it.id, p, w:it.w, h:it.h}; BB.drag = {pos:{}, size:{id:it.id, w:it.w, h:it.h}}; return; }
    if (id) {
      if (e.shiftKey) { BB.sel.has(id) ? BB.sel.delete(id) : BB.sel.add(id); }
      else if (!BB.sel.has(id)) BB.sel = new Set([id]);
      /* секция тащит за собой всё, что целиком внутри неё */
      const ids = new Set(BB.sel);
      [...BB.sel].map(i=>BB.items[i]).filter(it=>it && it.k==='frame').forEach(fr => Object.values(BB.items).forEach(it => { const b = bBox(it);
        if (it.id!==fr.id && b.x>=fr.x && b.y>=fr.y && b.x+b.w<=fr.x+fr.w && b.y+b.h<=fr.y+fr.h) ids.add(it.id); }));
      BB.act = {k:'move', p, ids:[...ids], moved:false}; BB.drag = {pos:{}};
      bSel(); boardBar(); return;
    }
    if (e.pointerType==='touch') { BB.act = {k:'pan', sx:e.clientX, sy:e.clientY, px:BB.px, py:BB.py}; return; }
    if (!e.shiftKey) BB.sel = new Set();
    BB.act = {k:'marq', p, base:new Set(BB.sel)}; bSel(); boardBar(); return;
  }
  if (tool==='eraser') { BB.act = {k:'erase', ids:new Set()}; if (id) { BB.act.ids.add(id); bErase(id); } return; }
  if (tool==='pen') { BB.act = {k:'pen', p, pts:[0,0]}; bDraft(); return; }
  if (tool==='arrow' || tool==='line') { BB.act = {k:'line', p, q:p}; bDraft(); return; }
  if (['rect','ellipse','frame','sticky','text'].includes(tool)) { BB.act = {k:'shape', p, q:p}; bDraft(); return; }
}
function bMove(e){
  if (!BB.id) return;
  const p = toWorld(e.clientX, e.clientY);
  if (e.pointerType!=='touch') curSend(p);
  const a = BB.act; if (!a) return;
  if (a.k==='pan') { BB.px = a.px + e.clientX - a.sx; BB.py = a.py + e.clientY - a.sy; bView(); boardCursors(); return; }
  if (a.k==='move') { const dx = p.x-a.p.x, dy = p.y-a.p.y; if (!a.moved && Math.hypot(dx,dy)*BB.z < 3) return; a.moved = true;
    a.ids.forEach(id => { const it = BB.items[id]; if (it) BB.drag.pos[id] = {x:Math.round(it.x+dx), y:Math.round(it.y+dy)}; }); boardRender(); return; }
  if (a.k==='size') { BB.drag.size = {id:a.id, w:Math.max(40, Math.round(a.w + p.x-a.p.x)), h:Math.max(30, Math.round(a.h + p.y-a.p.y))};
    const it = BB.items[a.id]; if (it && it.k==='image' && it.w && it.h && !e.shiftKey) BB.drag.size.h = Math.round(BB.drag.size.w * it.h/it.w); boardRender(); return; }
  if (a.k==='marq') { const m = $('#bd-marq'), x0 = Math.min(a.p.x,p.x), y0 = Math.min(a.p.y,p.y), x1 = Math.max(a.p.x,p.x), y1 = Math.max(a.p.y,p.y);
    m.hidden = false; m.style.cssText = `left:${x0*BB.z+BB.px}px;top:${y0*BB.z+BB.py}px;width:${(x1-x0)*BB.z}px;height:${(y1-y0)*BB.z}px`;
    BB.sel = new Set(a.base); Object.values(BB.items).forEach(it => { const b = bBox(it); if (b.x<x1 && b.x+b.w>x0 && b.y<y1 && b.y+b.h>y0) BB.sel.add(it.id); }); bSel(); return; }
  if (a.k==='erase') { const id = bHitId(e); if (id && !a.ids.has(id)) { a.ids.add(id); bErase(id); } return; }
  if (a.k==='pen') { const n = a.pts.length, lx = a.pts[n-2], ly = a.pts[n-1], dx = p.x-a.p.x, dy = p.y-a.p.y;
    if (Math.hypot(dx-lx, dy-ly)*BB.z >= 2 && n < 6000) { a.pts.push(Math.round(dx*10)/10, Math.round(dy*10)/10); bDraft(); } return; }
  if (a.k==='line' || a.k==='shape') { a.q = p; bDraft(); }
}
function bErase(id){ const el = BB.els[id]; if (el) el.classList.add('erasing'); }
function bUp(e){
  const a = BB.act; BB.act = null; $('#bd-stage').classList.remove('panning'); if (!a) return;
  if (a.k==='move') { const pos = BB.drag.pos; BB.drag = null;
    if (a.moved) bCommit({upd:Object.keys(pos).map(id => ({id, before:{x:BB.items[id].x, y:BB.items[id].y}, after:pos[id]}))}); else boardRender();
    return; }
  if (a.k==='size') { const s = BB.drag.size; BB.drag = null; const it = BB.items[s.id]; if (it && (s.w!==it.w || s.h!==it.h)) bCommit({upd:[{id:s.id, before:{w:it.w, h:it.h}, after:{w:s.w, h:s.h}}]}); else boardRender(); return; }
  if (a.k==='marq') { $('#bd-marq').hidden = true; boardBar(); return; }
  if (a.k==='erase') { bDelete([...a.ids]); return; }
  $('#bd-draft').innerHTML = '';
  const color = BB.tool==='sticky' ? BB.color : BB.ink;
  if (a.k==='pen') { if (a.pts.length >= 4) bCommit({add:[bNew('pen', a.p.x, a.p.y, {pts:a.pts, c:color, sw:3})]}); return; }
  if (a.k==='line') { const w = Math.round(a.q.x-a.p.x), h = Math.round(a.q.y-a.p.y); if (Math.hypot(w,h) < 6) return;
    bCommit({add:[bNew(BB.tool, a.p.x, a.p.y, {w, h, c:color})]}); bSetTool('select'); return; }
  if (a.k==='shape') {
    let x = Math.min(a.p.x,a.q.x), y = Math.min(a.p.y,a.q.y), w = Math.abs(a.q.x-a.p.x), h = Math.abs(a.q.y-a.p.y);
    const k = BB.tool, small = w*BB.z < 8 && h*BB.z < 8;
    const def = {sticky:[200,200], text:[260,40], rect:[180,120], ellipse:[160,160], frame:[640,420]}[k];
    if (small) { w = def[0]; h = def[1]; x -= w/2; y -= h/2; }
    if (k==='sticky' && !small) { const m = Math.max(w,h,120); w = h = m; }
    const it = bNew(k, x, y, Object.assign({w:Math.round(w), h:Math.round(h), c: k==='sticky' ? (BB.color==='ink' ? '#FFD43B' : BB.color) : k==='frame' ? 'ink' : color, t: k==='frame' ? 'Секция' : ''}, k==='text' ? {fs:24} : {}));
    if (k==='frame') it.z = 0;
    bCommit({add:[it]}); BB.sel = new Set([it.id]); bSetTool('select');
    if (k==='sticky' || k==='text' || k==='frame') setTimeout(() => bEdit(it.id), 30);
  }
}
/* черновик рисования поверх холста */
function bDraft(){
  const a = BB.act, g = $('#bd-draft'); if (!a) { g.innerHTML = ''; return; }
  const c = bcol(BB.tool==='sticky' ? BB.color : BB.ink);
  if (a.k==='pen') { let d = `M${a.p.x} ${a.p.y}`; for (let i=2;i<a.pts.length;i+=2) d += `L${a.p.x+a.pts[i]} ${a.p.y+a.pts[i+1]}`; g.innerHTML = `<path d="${d}" class="bd-ln" style="stroke:${c};stroke-width:3"/>`; return; }
  if (a.k==='line') { g.innerHTML = `<path d="${bLineD(a.p.x, a.p.y, a.q.x, a.q.y, BB.tool==='arrow')}" class="bd-ln" style="stroke:${c};stroke-width:2.5"/>`; return; }
  const x = Math.min(a.p.x,a.q.x), y = Math.min(a.p.y,a.q.y), w = Math.abs(a.q.x-a.p.x), h = Math.abs(a.q.y-a.p.y);
  g.innerHTML = BB.tool==='ellipse' ? `<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" class="bd-dr"/>` : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="bd-dr"/>`;
}
function bWheel(e){
  if (!BB.id) return; e.preventDefault();
  if (e.ctrlKey || e.metaKey) { const r = $('#bd-stage').getBoundingClientRect(); bZoom(BB.z * Math.exp(-e.deltaY*0.01), e.clientX-r.left, e.clientY-r.top); }
  else { BB.px -= e.deltaX; BB.py -= e.deltaY; bView(); boardCursors(); }
}
function bZoom(z, cx, cy){
  const r = $('#bd-stage').getBoundingClientRect(); if (cx==null) { cx = r.width/2; cy = r.height/2; }
  z = Math.min(4, Math.max(.1, z)); const wx = (cx-BB.px)/BB.z, wy = (cy-BB.py)/BB.z;
  BB.z = z; BB.px = cx - wx*z; BB.py = cy - wy*z; bView(); boardCursors();
}
function boardFit(first){
  const its = Object.values(BB.items), st = $('#bd-stage'); if (!st) return;
  const r = st.getBoundingClientRect();
  if (!its.length) { BB.z = 1; BB.px = r.width/2; BB.py = r.height/2; bView(); return; }
  let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity; its.forEach(it => { const b = bBox(it); x0=Math.min(x0,b.x); y0=Math.min(y0,b.y); x1=Math.max(x1,b.x+b.w); y1=Math.max(y1,b.y+Math.max(b.h,40)); });
  const z = Math.min(first ? 1 : 2, Math.max(.1, Math.min((r.width-120)/(x1-x0||1), (r.height-160)/(y1-y0||1))));
  BB.z = z; BB.px = r.width/2 - (x0+x1)/2*z; BB.py = (r.height-60)/2 - (y0+y1)/2*z; bView(); boardCursors();
}
/* редактирование текста: двойной клик по стикеру, тексту, фигуре или названию секции */
function bDbl(e){
  const id = bHitId(e); if (!id) { if (BB.tool==='select') { const p = toWorld(e.clientX, e.clientY); const it = bNew('sticky', p.x-100, p.y-100, {w:200, h:200, c:BB.color==='ink'?'#FFD43B':BB.color, t:''}); bCommit({add:[it]}); BB.sel = new Set([it.id]); setTimeout(()=>bEdit(it.id), 30); } return; }
  const it = BB.items[id]; if (!it) return;
  if (it.k==='image') return openImg(it.file);
  if (it.k==='file') return downloadFile(it.file);
  if (['sticky','text','rect','ellipse','frame'].includes(it.k)) bEdit(id);
}
function bEdit(id){
  const it = BB.items[id], el = BB.els[id]; if (!it || !el) return;
  BB.edit = id; bSel();
  const t = el.querySelector(it.k==='frame' ? '.bd-ft' : '.bd-tx'); if (!t) return;
  t.textContent = it.t || ''; try { t.contentEditable = 'plaintext-only'; } catch (e) {} if (t.contentEditable!=='plaintext-only') t.contentEditable = 'true';
  t.focus(); const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  t.addEventListener('blur', bEndEdit, {once:true});
  t.addEventListener('keydown', e => { if (e.key==='Escape' || (e.key==='Enter' && (e.ctrlKey||e.metaKey))) { e.preventDefault(); e.stopPropagation(); t.blur(); } e.stopPropagation(); });
}
function bEndEdit(){
  const id = BB.edit; if (!id) return; BB.edit = null;
  const it = BB.items[id], el = BB.els[id]; if (!it || !el) return boardRender();
  const t = el.querySelector('[contenteditable]'); const v = t ? clip(t.innerText.replace(/\n{3,}/g,'\n\n').trim(), 4000) : it.t;
  if (t) t.removeAttribute('contenteditable');
  delete BB.sigs[id];
  if ((it.k==='text') && !v) { bDelete([id]); return; }
  if (v !== (it.t||'')) bCommit({upd:[{id, before:{t:it.t||''}, after:{t:v}}]}); else boardRender();
}
function bSetTool(t){ BB.tool = t; const st = $('#bd-stage'); if (st) st.dataset.tool = t; if (t!=='select') { BB.sel = new Set(); bSel(); } boardBar(); }
function bClick(e){
  const b = e.target.closest('[data-b]'); if (!b) return;
  const a = b.dataset.b, v = b.dataset.v, ids = [...BB.sel];
  if (a==='tool') bSetTool(v);
  else if (a==='file') $('#bd-file').click();
  else if (a==='color') {
    if (ids.length) bUpdate(ids, it => ({c: it.k==='sticky' && v==='ink' ? '#F1F3F5' : v}));
    if (BB.tool==='sticky' || (ids.length && BB.items[ids[0]] && BB.items[ids[0]].k==='sticky')) BB.color = v==='ink' ? '#F1F3F5' : v; else BB.ink = v;
    boardBar();
  }
  else if (a==='fs') bUpdate(ids.filter(id=>BB.items[id] && BB.items[id].k==='text'), () => ({fs:Number(v)}));
  else if (a==='front') bUpdate(ids, (it) => ({z:now()+ids.indexOf(it.id)}));
  else if (a==='dup') bDup();
  else if (a==='del') bDelete(ids);
  else if (a==='undo') bUndo(false);
  else if (a==='redo') bUndo(true);
  else if (a==='zin') bZoom(BB.z*1.25);
  else if (a==='zout') bZoom(BB.z/1.25);
  else if (a==='z100') bZoom(1);
  else if (a==='fit') boardFit(false);
}
/* клавиши доски перехватываем раньше общих (V у звонка — камера, Q — мысль) */
document.addEventListener('keydown', e => {
  if (!BB.id || UI.route!=='board' || $('#overlay').innerHTML || BB.edit) return;
  const t = e.target; if (t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable)) return;
  const mod = e.ctrlKey || e.metaKey, ids = [...BB.sel];
  const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  if (e.code==='Space') { if (!BB.space) { BB.space = true; $('#bd-stage').classList.add('space'); } stop(); return; }
  if (mod && e.code==='KeyZ') { stop(); bUndo(e.shiftKey); return; }
  if (mod && e.code==='KeyY') { stop(); bUndo(true); return; }
  if (mod && e.code==='KeyD') { stop(); bDup(); return; }
  if (mod && e.code==='KeyA') { stop(); BB.sel = new Set(Object.keys(BB.items)); bSel(); boardBar(); return; }
  if (mod && e.code==='KeyC' && ids.length) { BB.clip = ids.map(id=>BB.items[id]).filter(Boolean).map(it=>Object.assign({}, it)); return; }
  if ((e.key==='Delete' || e.key==='Backspace') && ids.length) { stop(); bDelete(ids); return; }
  if (e.key==='Escape') { stop(); BB.sel = new Set(); bSetTool('select'); bSel(); return; }
  if (e.key==='Enter' && ids.length===1) { stop(); bEdit(ids[0]); return; }
  if (e.shiftKey && e.code==='Digit1') { stop(); boardFit(false); return; }
  if (e.key.startsWith('Arrow') && ids.length) { stop(); const d = e.shiftKey ? 10 : 1, dx = e.key==='ArrowLeft'?-d:e.key==='ArrowRight'?d:0, dy = e.key==='ArrowUp'?-d:e.key==='ArrowDown'?d:0;
    bUpdate(ids, it => ({x:it.x+dx, y:it.y+dy})); return; }
  if (mod && (e.key==='=' || e.key==='+')) { stop(); bZoom(BB.z*1.25); return; }
  if (mod && e.key==='-') { stop(); bZoom(BB.z/1.25); return; }
  if (mod && e.key==='0') { stop(); bZoom(1); return; }
  if (!mod && !e.altKey && BKEYS[e.code]) { stop(); bSetTool(BKEYS[e.code]); return; }
}, true);
document.addEventListener('keyup', e => { if (e.code==='Space' && BB.space) { BB.space = false; const st = $('#bd-stage'); if (st) st.classList.remove('space'); } });
/* вставка: картинки из буфера или скопированные объекты доски */
document.addEventListener('paste', e => {
  if (!BB.id || UI.route!=='board' || BB.edit || $('#overlay').innerHTML) return;
  const t = e.target; if (t && (/INPUT|TEXTAREA/.test(t.tagName) || t.isContentEditable)) return;
  const files = [...(e.clipboardData && e.clipboardData.files || [])];
  const p = BB.curLast || bCenter();
  if (files.length) { e.preventDefault(); boardFiles(files, p.x, p.y); return; }
  const text = e.clipboardData && e.clipboardData.getData('text');
  if (BB.clip.length) { e.preventDefault(); const c = BB.clip; let x0 = Infinity, y0 = Infinity; c.forEach(it=>{ x0 = Math.min(x0, it.x); y0 = Math.min(y0, it.y); });
    const add = c.map((it,i) => Object.assign(bSnap(it), {id:col('hub_bitems').doc().id, x:Math.round(p.x+it.x-x0), y:Math.round(p.y+it.y-y0), z:now()+i, by:S.me, at:now()}));
    bCommit({add}); BB.sel = new Set(add.map(a=>a.id)); return; }
  if (text && text.trim()) { e.preventDefault(); const it = bNew('sticky', p.x-100, p.y-100, {w:200, h:200, c:BB.color==='ink'?'#FFD43B':BB.color, t:clip(text.trim(),4000)}); bCommit({add:[it]}); }
});
addEventListener('resize', () => { if (BB.id) bView(); });
setInterval(() => { if (BB.id && Object.keys(BB.curs).length) boardCursors(); }, 10e3);

/* ── оверлеи: палитра, захват, формы, настройки ── */
function closeOverlay(){ $('#overlay').innerHTML = ''; UI.pal = null; LB = null; }
function overlay(html){ UI.pal = null; $('#overlay').innerHTML = `<div class="overlay" data-action="overlay-bg">${html}</div>`; const f = $('#overlay input:not([type=hidden]),#overlay textarea'); if (f) f.focus(); }
function capture(){
  const cur = UI.route.startsWith('d/') ? UI.route.slice(2) : '';
  overlay(`<form class="pal" data-form="capture" data-keep><div class="cap"><h2><span class="hi">${ic('Lightbulb')}</span> Записать мысль<span style="flex:1"></span><button type="button" class="icon-btn" data-action="close-overlay" aria-label="Закрыть" title="Закрыть (Esc)">${ic('X')}</button></h2>
    <textarea class="input" name="t" placeholder="Что пришло в голову? Разберёшь потом." maxlength="8000"></textarea>
    <div class="dpick" role="group" aria-label="Отдел (необязательно)">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="pick-dept" data-d="${d.id}" aria-pressed="${d.id===cur}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div>
    <input type="hidden" name="d" value="${cur}">
    <div class="seg" role="radiogroup" aria-label="Кто видит мысль" style="align-self:flex-start"><button type="button" data-action="pick-vis" data-v="me" aria-pressed="true">${ic('Lock')} Только я</button><button type="button" data-action="pick-vis" data-v="team" aria-pressed="false">${ic('Users')} Видит команда</button></div>
    <input type="hidden" name="vis" value="me">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint"><kbd>Enter</kbd> сохранить · <kbd>Shift</kbd>+<kbd>Enter</kbd> новая строка · <kbd>Esc</kbd> закрыть</span><span style="flex:1"></span><button class="btn primary">Во «Входящие»</button></div></div></form>`);
}
/* from — откуда задача: {reg} запись отдела (фидбек, баг, механика), {dec} принятое решение; tldr — готовая суть */
function newTask(status, dept, title, fromInbox, from){
  from = from || {};
  dept = dept || (UI.route.startsWith('d/') ? UI.route.slice(2) : (D[UI.filt.dept] && UI.filt.dept) || myDepts()[0] || 'dev');
  overlay(`<form class="pal" data-form="task-new" data-status="${status||'todo'}" data-inbox="${esc(fromInbox||'')}" data-reg="${esc(from.reg||'')}" data-dec="${esc(from.dec||'')}"><div class="cap"><h2>${ic('Plus')} Новая задача</h2>
    ${from.label ? `<div class="ref-chip" style="cursor:default">${ic('Paperclip')} ${esc(from.label)}</div>` : ''}
    <input class="input" name="title" placeholder="Что сделать? Начни с глагола: «Починить…», «Добавить…»" value="${esc(title||'')}" required maxlength="160" autocomplete="off">
    <input class="input" name="tldr" placeholder="Суть в одном предложении — зачем это нужно" maxlength="240" autocomplete="off" value="${esc(from.tldr||'')}">
    ${deptsPick([dept])}
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <div class="seg" role="radiogroup" aria-label="Размер">${Object.entries(SIZES).map(([k,v])=>`<button type="button" data-action="pick-size" data-v="${k}" aria-pressed="${k==='M'}" title="${v}">${k} · ${v}</button>`).join('')}</div>
      <input type="hidden" name="size" value="M">
    </div>
    <div class="fld-row">${inSelect('who','Ответственный',peopleOpts(),S.me)}${inText('due','Срок (необязательно)','','type="date"')}</div>
    ${verOpts().length>1 ? inSelect('ver','Версия (необязательно)',verOpts(),'') : '<input type="hidden" name="ver" value="">'}
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint"><kbd>Enter</kbd> создать · <kbd>Esc</kbd> закрыть</span><span style="flex:1"></span><button class="btn primary">Создать</button></div></div></form>`);
}
function newDecision(dept, pre){
  pre = pre || {}; const mode = pre.mode || 'options';
  dept = hd(dept) || (UI.route.startsWith('d/') ? UI.route.slice(2) : 'econ');
  overlay(`<form class="pal" data-form="decision-new" style="max-height:85vh;overflow:auto"><div class="cap"><h2>${ic('Scale')} ${pre.ref ? 'Вынести на решение' : 'Новое решение'}</h2>
    ${pre.ref ? `<div class="ref-chip" style="cursor:default">${ic('Paperclip')} ${esc(pre.refLabel)} — запись останется на месте</div>` : ''}
    <input type="hidden" name="ref" value="${esc(pre.ref ? JSON.stringify(pre.ref) : '')}">
    ${pre.inbox ? `<div class="ref-chip" style="cursor:default">${ic('Lightbulb')} Из мысли${pre.by && pre.by!==S.me ? ' · '+esc(pname(pre.by)) : ''} — полный текст сохранится в решении</div>` : ''}
    <input type="hidden" name="inbox" value="${esc(pre.inbox||'')}">
    ${inText('q','Вопрос',pre.q||'','required maxlength="200" placeholder="Например: «Комиссия отмыва денег»"')}
    ${inText('tldr','Суть — почему это важно',pre.tldr||'','maxlength="240"')}
    ${inSelect('dept','Отдел',deptOpts(),dept)}
    <div class="fld"><span>Как решаем</span><div class="seg" role="radiogroup" aria-label="Как решаем"><button type="button" data-action="dec-mode" data-v="react" aria-pressed="${mode==='react'}">👍 Реакцией</button><button type="button" data-action="dec-mode" data-v="options" aria-pressed="${mode==='options'}">${ic('ListChecks')} Вариантами</button></div>
      <input type="hidden" name="mode" value="${mode}"></div>
    <small class="dec-react-hint" style="color:var(--muted)" ${mode==='react'?'':'hidden'}>Каждый ставит одну реакцию: 👍 за, 👎 против или 🤔 есть вопросы. Итог фиксирует любой участник.</small>
    <div class="dec-opts" ${mode==='options'?'':'hidden'}>
    ${inArea('options','Варианты — по одному на строку, «Название — пояснение»','',5)}
    ${inText('rec','Рекомендуемый вариант (номер строки, пусто — нет)','','inputmode="numeric" maxlength="2"')}</div>
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
    ['Sparkles','Снежинки вкл/выкл','',()=>{ const on = document.documentElement.hasAttribute('data-snow'); P.snow = on ? 'off' : 'on'; applyPrefs(); savePrefs(); toast(on ? 'Снежинки выключены' : 'Снежинки включены'); }],
    ['Sparkles','Сменить фон','',()=>{ const i = BGS.findIndex(b=>b[0]===P.bg); P.bg = BGS[(i+1)%BGS.length][0]; applyPrefs(); savePrefs(); toast('Фон: '+BGS.find(b=>b[0]===P.bg)[1]); }],
    ['Leaf','Спокойный режим вкл/выкл','',()=>{ P.calm = !P.calm; applyPrefs(); savePrefs(); toast(P.calm?'Спокойный режим: без конфетти и всплывающих XP':'Спокойный режим выключен'); }],
    ['Settings','Профиль и настройки','',()=>settings()]
  ].map(c=>({g:'Команды', ico:c[0], t:c[1], r:c[2], run:c[3]}));
  const pages = [['today','Sun','Мой день'],['inbox','Inbox','Входящие'],['tasks','LayoutGrid','Задачи'],['decisions','Scale','Решения'],['log','ScrollText','Журнал'],['people','Users','Люди'],['chats','MessagesSquare','Чаты'],['board','Presentation','Доски'],['call','Phone','Звонок'],['wiki','BookOpen','Вики'],['claude','Bot','Claude — график']]
    .map(p=>({g:'Разделы', ico:p[1], t:p[2], run:()=>go(p[0])}))
    .concat(DEPTS.flatMap(d=>[{g:'Разделы', ico:d.icon, t:d.name, run:()=>go('d/'+d.id)}].concat(d.tabs.slice(1).map(([id,n])=>({g:'Разделы', ico:d.icon, t:d.name+' → '+n, run:()=>go('d/'+d.id+'/'+id)})))));
  const tasks = S.tasks.map(t=>({g:'Задачи', ico:(D[t.dept]||DEPTS[0]).icon, t:t.title, r:colName(t.status), extra:t.tldr, run:()=>openDrawer('task:'+t.id)}));
  const decs = S.decisions.map(d=>({g:'Решения', ico:'Scale', t:d.q, extra:d.tldr, run:()=>openDec(d.id)}));
  const regs = S.reg.map(r=>({g:'Записи отделов', ico:(D[r.key.split('/')[0]]||DEPTS[0]).icon, t:r.name, extra:r.tldr||r.what||'', run:()=>openReg(r.id)}));
  const chats = S.chats.map(c=>({g:'Чаты', ico:'MessagesSquare', t:c.title, extra:c.lastText, run:()=>go('chats/'+c.id)}));
  const wiki = S.wiki.map(w=>({g:'Вики', ico:'BookOpen', t:w.title, extra:w.tldr, run:()=>openDrawer('wiki:'+w.id)}));
  const people = Object.entries(S.people).map(([id,p])=>({g:'Люди', ico:'User', t:p.name, extra:p.role, run:()=>go('people')}));
  const eco = !S.E ? [] : [
    ...S.E.params.map(p=>({g:'Экономика', ico:'Gauge', t:p.name, r:lab(PARAM_STATUS,p.status), extra:[p.where,p.current,p.proposed,p.group].join(' '), run:()=>{ go('d/econ/params'); setTimeout(()=>openDrawer('eedit:params:'+p.id), 120); }})),
    ...S.E.bugs.map(b=>({g:'Экономика', ico:'Bug', t:b.title, r:lab(BUG_STATUS,b.status), extra:b.where, run:()=>{ go('d/qa/bugs/econ'); setTimeout(()=>openDrawer('eedit:bugs:'+b.id), 120); }})),
    ...S.E.stages.map(x=>({g:'Экономика', ico:'ListOrdered', t:x.title, r:lab(STAGE_STATUS,x.status), run:()=>go('d/econ/stages')})),
    ...S.E.sections.map(x=>({g:'Экономика', ico:'BookOpen', t:x.title, extra:x.body, run:()=>go('d/econ/plan')})),
  ];
  const edecs = S.edec.map(x=>({g:'Решения', ico:'Scale', t:x.question, extra:x.note, run:()=>openDec(x.id)}));
  if (!q) return [...cmds, ...pages.slice(0,7), ...tasks.filter(t=>true).slice(0,4)];
  return [...cmds, ...pages, ...tasks, ...decs, ...edecs, ...chats, ...regs, ...wiki, ...people, ...eco].filter(x=>(x.t+' '+(x.extra||'')).toLowerCase().includes(q)).slice(0,40);
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
    ${notifSettings()}
    <div class="set-row"><div>Цель недели<small>Сколько задач закрывать за неделю. Волонтёру хватит трёх.</small></div><div class="seg">${WEEK_GOALS.map(n=>`<button data-action="week-goal" data-v="${n}" aria-pressed="${weekGoal()===n}">${n}</button>`).join('')}</div></div>
    <h2 style="margin-top:8px">${ic('Settings')} Отображение</h2>
    <div class="set-row"><div>Тема</div>${seg('theme',[['auto','Авто'],['dark','Тёмная'],['light','Светлая']])}</div>
    <div class="set-row bg-row"><div>Фон и стекло<small>Цветной фон, панели как матовое стекло</small></div><div class="bg-pick">${BGS.map(([v,n,t])=>`<button data-action="pref" data-k="bg" data-v="${v}" aria-pressed="${P.bg===v}" title="${t}" ${v==='custom' && !customBg() ? 'disabled' : ''}><i class="bgsw bgsw-${v}"${v==='custom' && customBg() ? ` style="background-image:url('${customBg()}')"` : ''}></i><span>${n}</span></button>`).join('')}</div>
      <div class="bg-own"><label class="btn sm">${ic('Upload')} ${customBg() ? 'Заменить своё фото' : 'Загрузить своё фото'}<input type="file" accept="image/*" data-action="bg-upload" hidden></label>${customBg() ? `<button class="btn sm ghost" data-action="bg-drop">${ic('Trash2')} Убрать</button>` : ''}<small>Фото хранится только в этом браузере, другим не видно</small></div></div>
    <div class="set-row"><div>Снежинки<small>Падающий снег на фоне. В спокойном режиме выключен</small></div>${seg('snow',[['auto','На «Зиме»'],['on','Всегда'],['off','Выкл']])}</div>
    <div class="set-row"><div>Размер текста</div>${seg('fs',[['s','S'],['m','M'],['l','L']])}</div>
    <div class="set-row"><div>Плотность</div>${seg('density',[['normal','Свободно'],['compact','Плотно']])}</div>
    <div class="set-row"><div>Спокойный режим<small>Без конфетти и всплывающих XP. Прогресс остаётся.</small></div>${seg('calm',[[false,'Выкл'],[true,'Вкл']])}</div>
    <div><p class="sub-h" style="margin:10px 0 8px">Отделы в боковой панели</p><div class="dpick">${DEPTS.map(d=>`<button type="button" class="dchip" style="--dc:${d.color}" data-action="toggle-dept" data-d="${d.id}" aria-pressed="${!P.hidden.includes(d.id)}">${ic(d.icon)} ${esc(d.name)}</button>`).join('')}</div><small style="color:var(--muted)">Скрой то, чем не занимаешься. Меньше шума. Настройки отображения хранятся в этом браузере.</small></div>
    <div style="display:flex;justify-content:flex-end"><button class="btn" data-action="close-overlay">Готово</button></div></div></div>`);
}
/* фон и «жидкое стекло»: полупрозрачные панели с размытием поверх цветного фона. off — прежний строгий вид */
const BGS = [['off','Классика','Без стекла, как раньше'],['orbit','Орбита','Оранжевая планета и бирюза'],['aurora','Сияние','Зелёно-фиолетовые волны'],['ocean','Глубина','Синий и голубой'],['sunset','Закат','Розовый и фиолетовый'],['frost','Лёд','Светлое матовое стекло на бирюзе, тёмное меню — всегда светлая тема'],
  ['lake','Озеро','Горное озеро в тумане (фото Unsplash)'],['winter','Зима','Домик в заснеженном лесу, падает снег (фото Unsplash)'],['custom','Своё фото','Загрузи свою картинку — она хранится только в этом браузере']];
/* своё фото фона: уменьшаем до 1920 px и храним в браузере (localStorage), на сервер не уходит */
const BG_KEY = 'kyHubBg';
const customBg = () => { try { return localStorage.getItem(BG_KEY) || ''; } catch (e) { return ''; } };
async function setCustomBg(file){
  if (!/^image\//.test(file.type)) { toast(ic('CircleAlert')+' Это не картинка'); return; }
  try {
    const bmp = await createImageBitmap(file), k = Math.min(1, 1920/Math.max(bmp.width, bmp.height));
    const cv = document.createElement('canvas'); cv.width = Math.round(bmp.width*k); cv.height = Math.round(bmp.height*k);
    cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
    let q = .82, url = cv.toDataURL('image/jpeg', q);
    while (url.length > 2.4e6 && q > .4) { q -= .12; url = cv.toDataURL('image/jpeg', q); }
    localStorage.setItem(BG_KEY, url);
  } catch (e) { console.warn('свой фон', e); toast(ic('CircleAlert')+' Не получилось сохранить картинку — возможно, браузер запретил хранилище'); return; }
  P.bg = 'custom'; savePrefs(); applyPrefs(); if ($('#overlay .settings')) settings(); toast(ic('Image')+' Фон обновлён');
}
function dropCustomBg(){ try { localStorage.removeItem(BG_KEY); } catch (e) {} if (P.bg==='custom') { P.bg = 'off'; savePrefs(); } applyPrefs(); if ($('#overlay .settings')) settings(); }
/* падающий снег для зимнего фона: холст под контентом, замирает в фоновой вкладке; в спокойном режиме и при «уменьшить движение» выключен */
let SNOW = null;
function snow(on){
  if (on && matchMedia('(prefers-reduced-motion: reduce)').matches) on = false;
  if (!on) { if (SNOW) { cancelAnimationFrame(SNOW.raf); SNOW.cv.remove(); SNOW = null; } return; }
  if (SNOW) return;
  const cv = document.createElement('canvas'); cv.className = 'snow'; cv.setAttribute('aria-hidden', 'true'); document.body.prepend(cv);
  const ctx = cv.getContext('2d'), S = SNOW = {cv, raf:0, flakes:[], w:0, h:0};
  const fit = () => { const d = Math.min(2, devicePixelRatio||1); S.w = innerWidth; S.h = innerHeight; cv.width = S.w*d; cv.height = S.h*d; ctx.setTransform(d,0,0,d,0,0);
    const n = Math.round(Math.min(160, S.w*S.h/9000)); while (S.flakes.length < n) S.flakes.push(flake(true)); S.flakes.length = n; };
  const flake = top => ({x:Math.random()*S.w, y:top ? Math.random()*S.h : -10, r:.8+Math.random()*2.6, v:.35+Math.random()*1.1, sw:Math.random()*Math.PI*2, a:.45+Math.random()*.5});
  let last = performance.now();
  const step = t => { if (SNOW!==S) return; const dt = Math.min(50, t-last)/16.7; last = t;
    ctx.clearRect(0, 0, S.w, S.h); ctx.fillStyle = '#fff';
    for (const f of S.flakes) { f.y += f.v*dt; f.sw += .012*dt; f.x += Math.sin(f.sw)*.45*dt;
      if (f.y > S.h+10) Object.assign(f, flake(false)); if (f.x < -10) f.x = S.w+10; if (f.x > S.w+10) f.x = -10;
      ctx.globalAlpha = f.a; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1; S.raf = requestAnimationFrame(step); };
  fit(); addEventListener('resize', () => { if (SNOW===S) fit(); });
  S.raf = requestAnimationFrame(step);
}
function applyPrefs(){
  const r = document.documentElement;
  if (!BGS.some(b=>b[0]===P.bg)) P.bg = 'off'; // фон убрали из списка — возвращаемся к «Классике»
  const th = P.bg==='frost' ? 'light' : P.theme; // «Лёд» задуман светлым
  if (th==='auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', th);
  if (!BGS.some(b=>b[0]===P.bg)) P.bg = 'off';
  if (P.bg==='custom' && !customBg()) P.bg = 'off'; // своё фото удалили или браузер его не сохранил
  if (P.bg==='off') r.removeAttribute('data-bg'); else r.setAttribute('data-bg', P.bg);
  if (P.bg==='custom') r.style.setProperty('--photo', 'url("'+customBg()+'")'); else r.style.removeProperty('--photo');
  /* снежинки: auto — только на «Зиме», on — на любом фоне, off — никогда; в спокойном режиме выключены */
  const sn = !P.calm && (P.snow==='on' || (P.snow!=='off' && P.bg==='winter'));
  r.toggleAttribute('data-snow', sn); snow(sn);
  r.setAttribute('data-fs', P.fs); r.setAttribute('data-density', P.density); r.setAttribute('data-calm', P.calm?'1':'0');
}

/* ── действия с данными ─────────────────────── */
function setStatus(id, s, x, y){
  const t = task(id); if (!t || t.status===s) return;
  if (!canEdit(t)) { toast(roMsg(t)); return; }
  const patch = Object.assign({status:s}, stamp());
  if (s==='done') { patch.doneAt = now(); patch.doneBy = S.me; }
  else if (t.status==='done') { patch.doneAt = FV().delete(); patch.doneBy = FV().delete(); }
  /* заблокировано — только с причиной: руководитель видит, кто и что держит */
  if (s==='blocked') { const why = prompt('Чем заблокирована задача? Например: «ждём макет», «нет доступа к серверу».', t.blockedWhy||''); if (why===null) return; patch.blockedWhy = clip(why,200) || 'причина не указана'; patch.blockedAt = now(); }
  else if (t.status==='blocked') { patch.blockedWhy = FV().delete(); patch.blockedAt = FV().delete(); }
  write(()=>col('hub_tasks').doc(id).update(patch)).then(ok => {
    if (!ok) return;
    if (s==='done') { log('закрыл(а) задачу', t.title, t.dept); confetti(x ?? innerWidth/2, y ?? innerHeight/2); gain(XP_BY_SIZE[t.size]||10, ic('CircleCheck')+' Готово: '+esc(t.title)); }
    else log('перевёл(а) в «'+colName(s)+'»'+(s==='blocked' ? ': '+patch.blockedWhy : ''), t.title, t.dept);
    notify(watchers(t), 'status', t, '«'+colName(t.status)+'» → «'+colName(s)+'»');
  });
}
async function createTask(f){
  const title = clip(f.title.value,160); if (!title) return;
  const ref = col('hub_tasks').doc(), depts = formDepts(f), dept = depts[0]; if (!dept) return;
  /* мысль длиннее заголовка уходит в описание целиком */
  const inb = f.dataset.inbox && S.inbox.find(i=>i.id===f.dataset.inbox), details = inb && inb.text.trim() !== title ? clip(inb.text,8000) : '';
  const ok = await write(()=>ref.set({title, tldr:clip(f.tldr.value,240), details, dept, depts, status:f.dataset.status||'todo', size:f.size.value, who:f.who.value||null, due:parseDay(f.due.value), ver:f.ver.value||null, reg:f.dataset.reg||null, links:f.dataset.dec?[f.dataset.dec]:[], sub:[], comments:[], createdAt:now(), createdBy:S.me, updatedAt:now(), updatedBy:S.me}));
  if (!ok) return;
  if (f.dataset.inbox) col('hub_inbox').doc(f.dataset.inbox).delete().catch(()=>{});
  /* предложение игрока взяли в работу — статус записи меняется сам */
  const src = f.dataset.reg && regItem(f.dataset.reg);
  if (src && src.key==='admin/feedback' && src.status!=='Взяли в работу') write(()=>col('hub_reg').doc(src.id).update(Object.assign({status:'Взяли в работу'}, stamp())));
  closeOverlay(); log(src ? 'сделал(а) задачу из записи «'+clip(src.name,60)+'»' : 'создал(а) задачу', title, dept);
  notify(f.who.value, 'assign', {id:ref.id, title}, f.due.value ? 'Срок: '+dateFmt(parseDay(f.due.value)) : clip(f.tldr.value,240));
  if (!depts.some(canSee)) { gain(3, ic('Plus')+' Задача передана: '+depts.map(x=>'«'+esc(D[x].name)+'»').join(', ')+'. Менять её будут участники этих отделов.'); openDrawer('task:'+ref.id); return; }
  gain(3, ic('Plus')+' Задача создана'); openDrawer('task:'+ref.id);
}
function addInbox(text, dept, team){
  write(()=>col('hub_inbox').add({text:clip(text,8000), at:now(), by:S.me, dept:dept||null, team:!!team})).then(ok => ok && gain(2, ic('Lightbulb')+(team ? ' Мысль записана, её видит команда' : ' Записано во «Входящие»')));
}
/* обсудить мысль: сообщение в выбранный общий чат или в новый */
function inboxToChat(it){
  const first = clip(it.text.split('\n')[0],120);
  const list = S.chats.filter(c=>!isThread(c)).sort((a,b)=>(b.lastAt||b.createdAt||0)-(a.lastAt||a.createdAt||0));
  overlay(`<form class="pal" data-form="inbox-chat" data-id="${esc(it.id)}"><div class="cap"><h2>${ic('MessagesSquare')} Обсудить в чате</h2>
    <div class="ref-chip" style="cursor:default">${ic('Lightbulb')} ${esc(clip(first,80))}</div>
    ${inSelect('chat','Куда отправить',[['','Новый чат: «'+clip(first,60)+'»'], ...list.map(c=>[c.id, c.title])], it.chat && chat(it.chat) ? it.chat : '')}
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="hint">Мысль уйдёт сообщением · чат видит вся команда</span><span style="flex:1"></span><button class="btn primary">Отправить</button></div></div></form>`);
}
function startFocus(id){
  if (!id || !task(id)) { const m = me(); id = (m.top3||[]).find(x=>task(x) && task(x).status!=='done') || (S.tasks.find(t=>t.status!=='done' && t.who===S.me) || S.tasks.find(t=>t.status!=='done' && canEdit(t)) || {}).id || null; }
  patchMe({focus:{task:id, until:now()+25*60e3}, last:id}).then(ok => ok && toast(ic('Headphones')+' Фокус 25 минут. Коллеги видят, что ты работаешь.'));
}
const updTask = (id, patch) => { const t = task(id); if (t && !canEdit(t) && Object.keys(patch).some(k=>k!=='comments')) { toast(roMsg(t)); return Promise.resolve(false); } if (UI.drawer==='task:'+id) UI.forceDrawer = true; return write(()=>col('hub_tasks').doc(id).update(Object.assign(patch, stamp()))); };

document.addEventListener('click', e => {
  if (document.body.classList.contains('locked')) return;
  /* режим объединения: нажатие на карточку выбирает её, а не открывает */
  if (UI.merge) { const c = e.target.closest('.board .card'); if (c) { e.preventDefault(); e.stopPropagation(); const id = c.dataset.id, i = UI.merge.indexOf(id); if (i>=0) UI.merge.splice(i,1); else if (!canEdit(task(id))) toast(roMsg(task(id))); else UI.merge.push(id); schedule(); return; } }
  const a = e.target.closest('[data-action]'), go_ = e.target.closest('[data-go]'), op = e.target.closest('[data-open]'), pi = e.target.closest('[data-pal]');
  if (pi) { runPal(Number(pi.dataset.pal)); return; }
  if (a && a.tagName!=='SELECT') {
    const k = a.dataset.action, id = a.dataset.id;
    /* закрываем, только если и нажали, и отпустили на фоне: иначе растягивание поля или выделение текста
       с отпусканием мыши за окном закрывало его вместе с недописанным */
    /* окна с data-keep (запись мысли) по фону не закрываются вовсе — только крестиком или Esc */
    if (k==='overlay-bg') { if (e.target===a && downOnBg && !a.querySelector('[data-keep]')) closeOverlay(); return; }
    if (k==='check' || k==='step' || k==='kid-done') return; // обрабатываются в change
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
      case 'take': { const t = task(id), old = t.who; updTask(id, {who:S.me}).then(ok => { if (!ok) return; log('взял(а) задачу', t.title, t.dept); notify(old, 'unassign', t, 'Теперь ответственный: '+pname(S.me)); }); break; }
      case 'notifs': notifPanel(); break;
      case 'notif-open': { const n = S.notifs.find(x=>x.id===id); closeOverlay(); if (n) { markNotifs([n]); openTask(n.task); } break; }
      case 'notif-due': closeOverlay(); openTask(id); break;
      case 'notif-all': markNotifs(S.notifs.filter(n=>!n.read)); break;
      case 'notif-clear': clearNotifs(); break;
      case 'notif-on': enableNotifs(); break;
      case 'notif-off': disableNotifs(); break;
      case 'chat-md': exportChat(id); break;
      case 'task-md': exportTask(id); break;
      case 'toggle-top': { const top = (me().top3||[]).filter(x=>task(x)); const i = top.indexOf(id);
        if (i>=0) top.splice(i,1); else { if (top.filter(x=>task(x).status!=='done').length>=3) { toast('В «Моём дне» максимум 3 задачи. Сначала закрой или убери одну.'); break; } top.push(id); }
        patchMe({top3:top}); break; }
      case 'step-del': { const t = task(id); const sub = (t.sub||[]).filter((_,i)=>i!==Number(a.dataset.i)); updTask(id, {sub}); break; }
      case 'link-del': { const t = task(UI.drawer.slice(5)); if (t) updTask(t.id, {links:(t.links||[]).filter(x=>x!==a.dataset.l)}); break; }
      case 'task-del': { const t = task(id); if (!canEdit(t)) { toast(roMsg(t)); break; } deleteTask(t); break; }
      case 'vote': { const d = dec(id); const i = Number(a.dataset.i); const cur = (d.votes||{})[S.me];
        write(()=>col('hub_decisions').doc(id).update({['votes.'+S.me]: cur===i ? FV().delete() : i, updatedAt:now()})).then(ok => { if (ok && cur==null) { log('проголосовал(а) в решении', d.q, d.dept); gain(5, ic('Vote')+' Голос учтён'); } }); break; }
      case 'accept': { const d = dec(id); const i = Number(a.dataset.i); if (!confirm('Зафиксировать «'+d.options[i].t+'» как итог?')) break; if (d.ref) { const it = regItem(d.ref.id); if (it) log('итог по записи «'+it.name+'»: '+d.options[i].t, d.q, d.dept); } const r = a.getBoundingClientRect();
        write(()=>col('hub_decisions').doc(id).update({chosen:i, chosenBy:S.me, chosenAt:now(), updatedAt:now()})).then(ok => { if (ok) { log('принял(а) решение', d.q+' → '+d.options[i].t, d.dept); confetti(r.left, r.top); gain(10, ic('Scale')+' Решение принято'); } }); break; }
      case 'reopen': { const d = dec(id); write(()=>col('hub_decisions').doc(id).update({chosen:null, chosenBy:null, chosenAt:null})).then(ok => ok && log('переоткрыл(а) решение', d.q, d.dept)); break; }
      case 'dec-pin': { const on = isPinned(id); patchMe({pins: on ? FV().arrayRemove(id) : FV().arrayUnion(id)}).then(ok => ok && toast(ic('Pin')+(on?' Откреплено':' Закреплено наверху «Решений»'))); break; }
      case 'dec-del': { const d = dec(id); if (!confirm('Удалить решение «'+d.q+'»?')) break; write(()=>col('hub_decisions').doc(id).delete()).then(ok => ok && log('удалил(а) решение', d.q, d.dept)); break; }
      case 'new-task': newTask(a.dataset.status, a.dataset.dept); break;
      case 'bg-drop': dropCustomBg(); break;
      case 'merge-mode': UI.merge = UI.merge ? null : []; schedule(); break;
      case 'merge-go': if (UI.merge && UI.merge.length>1) mergeDialog(UI.merge); break;
      case 'kid-out': { const t = task(id); if (!t) break; updTask(id, {parent:FV().delete()}).then(ok => ok && toast(ic('Layers')+' «'+esc(clip(t.title,60))+'» снова отдельная задача')); break; }
      case 'new-decision': newDecision(a.dataset.dept); break;
      case 'filt-small': UI.filt.small = !UI.filt.small; paint(); break;
      case 'side-all': UI.allDepts = !UI.allDepts; paint(); break;
      case 'onb-hide': P.onbHide = true; savePrefs(); paint(); break;
      case 'week-goal': patchMe({weekGoal:Number(a.dataset.v)}).then(ok => ok && toast(ic('Target')+' Цель недели: '+a.dataset.v+' задач')); a.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); break;
      case 'go-small': UI.filt.small = true; go('tasks'); break;
      case 'bugs-hide': UI.bhide = !UI.bhide; paint(); break;
      case 'filt-mine': UI.filt.mine = !UI.filt.mine; paint(); break;
      case 'inbox-del': write(()=>col('hub_inbox').doc(id).delete()); break;
      case 'board-new': boardNew(); break;
      case 'board-del': e.preventDefault(); boardDelete(id); break;
      case 'inbox-chat': { const it = inboxFind(id); if (it) inboxToChat(it); break; }
      case 'inbox-dec': { const it = inboxFind(id); if (!it) break; const ls = it.text.split('\n');
        newDecision(it.dept, {mode:'react', q:clip(ls[0],200), tldr:clip(ls.slice(1).join(' ').trim(),240), inbox:it.id, by:it.by}); break; }
      case 'inbox-vis': { const it = S.inbox.find(i=>i.id===id); if (!it) break;
        write(()=>col('hub_inbox').doc(id).update({team:!it.team})).then(ok => ok && toast(ic(it.team?'Lock':'Users')+(it.team ? ' Мысль снова видишь только ты' : ' Мысль теперь видит команда'))); break; }
      case 'pick-vis': { const f = a.closest('form'); f.vis.value = a.dataset.v; f.querySelectorAll('[data-action="pick-vis"]').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); break; }
      case 'inbox-task': { const it = S.inbox.find(i=>i.id===id); if (it) newTask('inbox', it.dept, it.text.split('\n')[0], it.id); break; }
      case 'pick-dept': { const f = a.closest('form'); const was = a.getAttribute('aria-pressed')==='true'; f.querySelectorAll('[data-action="pick-dept"]').forEach(b=>b.setAttribute('aria-pressed','false')); if (!was) a.setAttribute('aria-pressed','true'); f.d.value = was?'':a.dataset.d; f.t.focus(); break; }
      case 'pick-depts': { const f = a.closest('form'); let ds = formDepts(f); const on = ds.includes(a.dataset.d);
        if (on && ds.length===1) { toast(ic('CircleAlert')+' Нужен хотя бы один отдел'); break; }
        ds = on ? ds.filter(x=>x!==a.dataset.d) : [...ds, a.dataset.d]; f.depts.value = ds.join(','); a.setAttribute('aria-pressed', String(!on)); break; }
      case 'pick-size': { const f = a.closest('form'); f.querySelectorAll('[data-action="pick-size"]').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); f.size.value = a.dataset.v; break; }
      case 'pref': { let v = a.dataset.v; if (v==='true') v = true; if (v==='false') v = false; P[a.dataset.k] = v; applyPrefs(); savePrefs(); a.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); break; }
      case 'toggle-dept': { const i = P.hidden.indexOf(a.dataset.d); if (i>=0) P.hidden.splice(i,1); else P.hidden.push(a.dataset.d); savePrefs(); a.setAttribute('aria-pressed', String(i>=0)); paint(); break; }
      case 'set-dept': case 'set-all-depts': { if (!isAdmin()) break; const uid = a.dataset.uid, p = S.people[uid]; if (!p) break;
        let ds; if (k==='set-all-depts') ds = a.dataset.v==='1' ? ALL_IDS : [];
        else { const s = new Set(p.depts||[]), on = [...s].some(x=>hd(x)===a.dataset.d); for (const x of deptIds(a.dataset.d)) on ? s.delete(x) : s.add(x); ds = ALL_IDS.filter(x=>s.has(x)); }
        write(()=>col('hub_people').doc(uid).update({depts:ds})).then(ok => ok && log('назначил(а) отделы: '+(ds.length===DEPTS.length?'все':ds.map(x=>D[x].name).join(', ')||'нет'), p.name)); break; }
      case 'set-admin': { if (!isAdmin()) break; const uid = a.dataset.uid, p = S.people[uid]; if (!p) break; const on = p.admin!==true;
        if (!on && uid===S.me && !confirm('Снять с себя роль руководителя? Вернуть её сможет только другой руководитель.')) break;
        if (!on && Object.values(S.people).filter(x=>x.admin===true).length<=1) { toast(ic('CircleAlert')+' Это последний руководитель — сначала назначь другого'); break; }
        if (on && !confirm('Сделать '+p.name+' руководителем? Он(а) сможет назначать отделы всем.')) break;
        write(()=>col('hub_people').doc(uid).update({admin:on})).then(ok => ok && log(on?'сделал(а) руководителем':'снял(а) роль руководителя', p.name)); break; }
      case 'approve': { if (!isAdmin()) break; const p = S.pending.find(x=>x.id===a.dataset.uid); if (!p) break;
        write(()=>col('hub_people').doc(p.id).update({approved:true})).then(ok => { if (ok) { log('одобрил(а) вход в хаб', p.name); toast(ic('UserCheck')+' '+esc(p.name)+' теперь в команде. Назначь отделы ниже.'); } }); break; }
      case 'reject': { if (!isAdmin()) break; const p = S.pending.find(x=>x.id===a.dataset.uid); if (!p || !confirm('Отклонить заявку '+(p.name||'')+'? Профиль удалится; если человек войдёт снова, заявка появится опять.')) break;
        write(()=>col('hub_people').doc(p.id).delete()).then(ok => ok && log('отклонил(а) заявку в хаб', p.name)); break; }
      case 'reg-task': { const it = regItem(id); if (!it) break; const dd = hd(it.key.split('/')[0]) || hd(it.dept) || 'dev';
        newTask('todo', it.key==='qa/bugs' ? (hd(it.dept)||'qa') : dd, clip(it.name,160), null, {reg:it.id, label:'Запись: '+clip(it.name,80), tldr:clip(it.tldr||it.what||'',240)}); break; }
      case 'dec-task': { const d = a.dataset.e ? Object.assign({_e:true}, S.edec.find(x=>x.id===id)) : dec(id); if (!d || decOpen(d)) break;
        newTask('todo', decDept(d), clip(decQ(d)+': '+decChoice(d),160), null, {dec:isEdec(d)?'':d.id, label:'Решение: '+clip(decQ(d),80), tldr:clip('Итог решения: '+decChoice(d),240)}); break; }
      case 'week-report': weekReport(); break;
      case 'my-color': { a.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b===a))); patchMe({color:a.dataset.c}); break; }
      case 'focus-start': startFocus(id); break;
      case 'focus-stop': patchMe({focus:null}).then(ok => ok && toast('Фокус остановлен')); break;
      case 'reg-del': { const it = regItem(id); if (!confirm('Удалить «'+it.name+'»?')) break; write(()=>col('hub_reg').doc(id).delete()).then(ok => { if (ok) { log('удалил(а) запись', it.name, it.key.split('/')[0]); closeDrawer(); deleteFiles(regFiles(id).map(f=>f.id)).catch(()=>{}); } }); break; }
      case 'img-view': openImg(id); break;
      case 'open-reg': openReg(id); break;
      case 'open-dec': closeDrawer(); openDec(id); break;
      case 'reg-decide': { const it = regItem(id); if (!it) break; const r = REGS[it.key];
        newDecision(it.key.split('/')[0], {mode:'react', q:clip(it.name,200), tldr:clip(it.tldr||it.what||'',240), ref:{kind:'reg', id:it.id, key:it.key, name:clip(it.name,120)}, refLabel:(r ? r.noun[0].toUpperCase()+r.noun.slice(1) : 'Запись')+': '+it.name}); break; }
      case 'dec-mode': { const f = a.closest('form'); f.mode.value = a.dataset.v; f.querySelectorAll('[data-action="dec-mode"]').forEach(b=>b.setAttribute('aria-pressed', String(b===a)));
        f.querySelector('.dec-opts').hidden = a.dataset.v!=='options'; f.querySelector('.dec-react-hint').hidden = a.dataset.v!=='react'; break; }
      case 'lb-go': lbGo(Number(a.dataset.v)); break;
      case 'lb-bg': if (e.target===a) closeOverlay(); break;
      case 'lb-zoom': if (LB) { LB.z = !LB.z; lightbox(); } break;
      case 'reg-unpend': { const p = REG_PENDING.splice(Number(a.dataset.i), 1)[0]; if (p && p.url) URL.revokeObjectURL(p.url); paintRegGal(); break; }
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
      case 'chat-new': newChat(); break;
      case 'chat-del': { const c = chat(id); if (!c || !confirm('Удалить чат «'+c.title+'» со всеми сообщениями?')) break;
        write(async () => { const ms = await col('hub_msgs').where('chat','==',id).get(); const fids = ms.docs.flatMap(d=>d.data().files||[]);
          for (let i=0;i<ms.docs.length;i+=400) { const b = DB.batch(); ms.docs.slice(i,i+400).forEach(d=>b.delete(d.ref)); await b.commit(); }
          await deleteFiles(fids); await col('hub_chats').doc(id).delete(); }).then(ok => { if (ok) { log('удалил(а) чат', c.title); go('chats'); } }); break; }
      case 'msg-del': { const m = S.msgs.find(x=>x.id===id) || TH.msgs.find(x=>x.id===id); if (!m || !confirm('Удалить сообщение?')) break; write(async () => { await col('hub_msgs').doc(id).delete(); await deleteFiles(m.files||[]); }); break; }
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
  if (a.dataset.action==='bg-upload' && a.files.length) { const f = a.files[0]; a.value = ''; setCustomBg(f); }
  if (a.dataset.action==='md-local' && a.files.length) { const file = a.files[0]; a.value = '';
    if (file.size > MD_MAX) toast(ic('CircleAlert')+' Файл больше '+fsize(MD_MAX));
    else file.text().then(t => openMd(file.name, t)).catch(e => toast(ic('CircleAlert')+' Не открылось: '+esc(errText(e)))); }
  if (a.dataset.action==='task-attach' && a.files.length) { const id = a.dataset.id, list = [...a.files]; a.value = '';
    uploadFiles(list, {task:id}).then(ids => { if (ids.length) { const t = task(id); if (t) log('прикрепил(а) '+plural(ids.length,'файл','файла','файлов')+' к задаче', t.title, t.dept); toast(ic('Paperclip')+' Прикреплено: '+ids.length); } }); }
  if (a.dataset.action==='reg-attach' && a.files.length) { const list = [...a.files]; a.value = ''; addRegFiles(a.dataset.id, list); }
  if (a.dataset.action==='thread-attach' && a.files.length) { const [tk, tid] = a.dataset.id.split(':'), list = [...a.files]; a.value = ''; threadFiles(tk, tid, list); }
  if (a.dataset.action==='chat-attach' && a.files.length) { const id = a.dataset.id, list = [...a.files]; a.value = '';
    chatFiles(id, list); }
  if (a.name==='day' && a.form && a.form.dataset.form==='claude-book') { a.form.from.innerHTML = claudeTimes(Number(a.value)).map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join(''); }
  if (a.dataset.action==='mock-hand') { const it = regItem(a.dataset.id); if (it) write(()=>col('hub_reg').doc(it.id).update(Object.assign({['hand.'+a.dataset.h]:a.checked}, stamp()))); }
  if (a.dataset.action==='check') { const it = regItem(a.dataset.id); write(()=>col('hub_reg').doc(a.dataset.id).update({done:a.checked, updatedAt:now(), updatedBy:S.me})).then(ok => { if (ok && a.checked) { log('отметил(а) пункт', it.name, it.key.split('/')[0]); gain(2, ic('ListChecks')+' Отмечено'); } }); }
  if (a.dataset.action==='step') { const t = task(a.dataset.id); const sub = (t.sub||[]).map((s,i)=>i===Number(a.dataset.i)?{t:s.t, done:a.checked}:s); updTask(t.id, {sub}).then(ok => ok && a.checked && gain(2, ic('ListChecks')+' Шаг выполнен')); }
  if (a.dataset.action==='kid-add' && a.value) { const v = a.value; a.value = ''; mergeTasks([v], a.dataset.id); }
  if (a.dataset.action==='kid-done') { const k = task(a.dataset.id); if (k) { const r = a.getBoundingClientRect(); setStatus(k.id, a.checked ? 'done' : 'todo', r.left+10, r.top+10); } }
  if (a.dataset.action==='link-add' && a.value) { const t = task(a.dataset.id); updTask(t.id, {links:[...new Set([...(t.links||[]), a.value])]}); }
});
document.addEventListener('submit', async e => {
  const f = e.target; if (!f.dataset.form) return; e.preventDefault();
  const k = f.dataset.form;
  if (k==='board-new') boardCreate(f);
  if (k==='capture') { const t = f.t.value.trim(); if (!t) return; closeOverlay(); addInbox(t, f.d.value, f.vis.value==='team'); }
  if (k==='task-new') createTask(f);
  if (k==='merge') { const ids = (UI.merge||[]).slice(); if (ids.length<2) { closeOverlay(); return; } const into = f.into.value || null;
    const pid = await mergeTasks(ids, into, f.title.value); if (pid) { UI.merge = null; closeOverlay(); schedule(); openDrawer('task:'+pid); } }
  if (k==='kid-new') { const title = clip(f.s.value.trim(),160), p = task(f.dataset.id); if (!title || !p) return; f.s.value = '';
    const depts = tDepts(p).filter(canSee), dept = depts[0] || myDepts()[0]; if (!dept) { toast(roMsg(p)); return; }
    const ref = col('hub_tasks').doc();
    const ok = await write(()=>ref.set({title, tldr:'', details:'', dept, depts:depts.length?depts:[dept], status:'todo', size:'M', who:null, due:null, ver:null, reg:null, links:[], sub:[], comments:[], parent:p.id, order:now(), createdAt:now(), createdBy:S.me, updatedAt:now(), updatedBy:S.me}));
    if (ok) { log('создал(а) задачу внутри «'+clip(p.title,60)+'»', title, dept); setTimeout(()=>{ const i = $('#drawer [data-form="kid-new"] input'); if (i) i.focus(); }, 60); } else f.s.value = title; }
  if (k==='chat-new') { const title = clip(f.title.value,120); if (!title) return; const ref = col('hub_chats').doc();
    const ok = await write(()=>ref.set({title, task:null, by:S.me, createdAt:now(), lastAt:null, lastBy:null, lastText:''}));
    if (ok) { closeOverlay(); log('создал(а) чат', title); go('chats/'+ref.id); } }
  if (k==='msg') { const id = f.dataset.id, text = f.m.value; if (!text.trim()) return; f.m.value = ''; UI.chatDraft[id] = '';
    const ok = await chatSend(id, clip(text.trim(),4000), []); if (!ok) { f.m.value = text; UI.chatDraft[id] = text; } const i = $('#chat-in'); if (i) i.focus(); }
  if (k==='claude-book') { const s = Number(f.from.value); if (!s) return; const ok = await bookClaude(s, s+Number(f.dur.value), f.note.value);
    if (ok) { UI.cday = Number(f.day.value); closeOverlay(); paint(); } }
  if (k==='thread') { const text = f.m.value.trim(); if (!text) return; f.m.value = '';
    const ok = await threadSend(f.dataset.k, f.dataset.id, clip(text,4000), []); if (!ok) f.m.value = text; const i = $('#thread-in'); if (i) i.focus();
    if (ok) setTimeout(() => { const b = $('#drawer .dr-b'); if (b) b.scrollTop = b.scrollHeight; }, 150); } // своё сообщение — сразу видно внизу
  if (k==='step-add') { const t = clip(f.s.value,160); if (!t) return; const tk = task(f.dataset.id); updTask(tk.id, {sub:[...(tk.sub||[]), {t, done:false}]}).then(ok => { if (ok) setTimeout(()=>{ const i = $('#drawer [data-form="step-add"] input'); if (i) i.focus(); }, 60); }); f.s.value = ''; }
  if (k==='task-edit') { const t = task(f.dataset.id); const title = clip(f.title.value,160); if (!title) return;
    const ds = formDepts(f); if (!ds.length) return;
    const ok = await updTask(t.id, {title, tldr:clip(f.tldr.value,240), details:clip(f.details.value,8000), dept:ds[0], depts:ds, size:f.size.value, who:f.who.value||null, due:parseDay(f.due.value), ver:f.ver.value||null});
    if (ok) { log('изменил(а) задачу', title, ds[0]); UI.edit = false; paintDrawer();
      const who = f.who.value||null, due = parseDay(f.due.value), nt = {id:t.id, title};
      if (who && who!==t.who) notify(who, 'assign', nt, due ? 'Срок: '+dateFmt(due) : '');
      if (t.who && who!==t.who) notify(t.who, 'unassign', nt, 'Теперь ответственный: '+pname(who));
      if (who && who===t.who && dueDay(due)!==dueDay(t.due)) notify(who, 'due', nt, due ? 'Новый срок: '+dateFmt(due) : 'Срок снят'); } }
  if (k==='decision-new') {
    const q = clip(f.q.value,200), mode = f.mode.value==='react' ? 'react' : 'options'; let ref = null; try { ref = f.ref.value ? JSON.parse(f.ref.value) : null; } catch (e) {}
    const options = mode==='react' ? REACTS : f.options.value.split('\n').map(l=>l.trim()).filter(Boolean).slice(0,8).map(l=>{ const m = l.split(/\s+[—–-]\s+/); return {t:clip(m[0],120), d:clip(m.slice(1).join(' — '),240)}; });
    if (!q) return; if (options.length < 2) { toast(ic('CircleAlert')+' Нужно хотя бы два варианта'); return; }
    const rec = parseInt(f.rec.value,10); const dept = f.dept.value;
    const inb = f.inbox.value && inboxFind(f.inbox.value), tldr = clip(f.tldr.value,240), flat = x => x.replace(/\s+/g,' ').trim(),
      note = inb && flat(inb.text) !== flat(q+' '+tldr) ? clip(inb.text,8000) : '', dref = col('hub_decisions').doc();
    const ok = await write(()=>dref.set({q, tldr, note, dept, mode, options, rec:mode==='options' && rec>=1&&rec<=options.length?rec-1:-1, votes:{}, chosen:null, ref, createdAt:now(), createdBy:S.me}));
    if (ok && inb && inb.by===S.me) col('hub_inbox').doc(inb.id).update({dec:dref.id}).catch(()=>{});
    if (ok) { closeOverlay(); log('вынес(ла) на голосование', q, dept); gain(5, ic('Scale')+' Решение вынесено на голосование'); if (!ref && !inb && UI.route!=='decisions' && !UI.route.startsWith('d/')) go('decisions'); } }
  if (k==='inbox-chat') {
    const it = inboxFind(f.dataset.id); if (!it) return; let id = f.chat.value;
    if (!id) { const title = clip(it.text.split('\n')[0],120), ref = col('hub_chats').doc(), body = {title, task:null, by:S.me, createdAt:now(), lastAt:null, lastBy:null, lastText:''};
      if (!await write(()=>ref.set(body))) return;
      if (!chat(ref.id)) S.chats.push(Object.assign({id:ref.id}, body)); // до прихода снимка из базы
      id = ref.id; log('создал(а) чат', title); }
    if (!await sendMsg(id, '💡 Мысль'+(it.by===S.me ? '' : ' · '+pname(it.by))+':\n'+it.text, [])) return;
    if (it.by===S.me) col('hub_inbox').doc(it.id).update({chat:id}).catch(()=>{});
    closeOverlay(); go('chats/'+id); }
  if (k==='reg-save') {
    const key = f.dataset.key, r = REGS[key], id = f.dataset.id; const data = {};
    for (const fl of r.fields) data[fl.k] = fl.t==='textarea' ? clip(f[fl.k].value,8000) : fl.t==='url' ? (safeUrl(f[fl.k].value.trim()) || '') : clip(f[fl.k].value,300);
    if (!data.name) return;
    if (key==='cef/screens' && data.status==='Вёрстка') { const m = S.reg.find(x=>x.key==='design/mockups' && x.name===data.mockup);
      if (!m || m.status!=='Утверждён') { if (!confirm(m ? 'Макет «'+m.name+'» ещё не утверждён ('+(m.status||'без статуса')+'). Всё равно начать вёрстку?' : 'У экрана нет макета. Всё равно начать вёрстку?')) return; } }
    const dept = key.split('/')[0];
    const ref = id ? col('hub_reg').doc(id) : col('hub_reg').doc(), pend = REG_PENDING.map(p=>p.file);
    const ok = id ? await write(()=>ref.update(Object.assign(data, stamp())))
                  : await write(()=>ref.set(Object.assign(data, {key, createdAt:now(), createdBy:S.me}, stamp())));
    if (ok) { log(id?'изменил(а) запись':'добавил(а) запись', data.name, dept); if (!id) gain(3, ic('Plus')+' Запись добавлена'); closeDrawer();
      if (pend.length) { toast(ic('Image')+' Загружаем фото: '+pend.length); addRegFiles(ref.id, pend); } } }
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
  if (e.target.id==='thread-in') { const files = [...(e.clipboardData && e.clipboardData.files || [])]; if (!files.length) return;
    e.preventDefault(); const f = e.target.form; threadFiles(f.dataset.k, f.dataset.id, files.map(shotName)); return; }
  const g = $('#reg-gal');
  if (g && e.target.closest && e.target.closest('#drawer')) { const files = [...(e.clipboardData && e.clipboardData.files || [])].filter(f=>/^image\//.test(f.type)); if (!files.length) return; e.preventDefault(); addRegFiles(g.dataset.id, files.map(shotName)); return; }
  if (e.target.id!=='chat-in') return;
  const files = [...(e.clipboardData && e.clipboardData.files || [])]; if (!files.length) return;
  e.preventDefault(); const id = e.target.form.dataset.id;
  chatFiles(id, files.map(shotName));
});
const dragFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
document.addEventListener('dragover', e => { const g = e.target.closest && e.target.closest('#reg-gal'); if (!g || !dragFiles(e)) return; e.preventDefault(); g.classList.add('drag'); });
document.addEventListener('dragleave', e => { const g = e.target.closest && e.target.closest('#reg-gal'); if (g && !g.contains(e.relatedTarget)) g.classList.remove('drag'); });
document.addEventListener('drop', e => { const g = e.target.closest && e.target.closest('#reg-gal'); if (!g || !dragFiles(e)) return; e.preventDefault(); g.classList.remove('drag'); addRegFiles(g.dataset.id, [...e.dataTransfer.files]); });
document.addEventListener('input', e => { if (e.target.id==='pal-in') { UI.pal.q = e.target.value; UI.pal.items = palItems(e.target.value); UI.pal.i = 0; paintPal(); } });
document.addEventListener('keydown', e => {
  if (document.body.classList.contains('locked')) return;
  if (e.key==='Enter' && e.target.matches('[data-go]:not(button),[data-open]:not(button),[data-action="open-dec"]:not(button)')) { e.preventDefault(); e.target.click(); return; }
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k') { e.preventDefault(); UI.pal ? closeOverlay() : palette(); return; }
  if (LB && (e.key==='ArrowLeft' || e.key==='ArrowRight')) { e.preventDefault(); lbGo(e.key==='ArrowLeft' ? -1 : 1); return; }
  if (e.key==='Escape') { if ($('#overlay').innerHTML) closeOverlay(); else if (UI.drawer) closeDrawer(); else document.body.classList.remove('nav-open'); return; }
  if (UI.pal) {
    if (e.key==='ArrowDown' || e.key==='ArrowUp') palKeyAt = now();
    if (e.key==='ArrowDown') { e.preventDefault(); UI.pal.i = Math.min(UI.pal.items.length-1, UI.pal.i+1); paintPal(); }
    if (e.key==='ArrowUp') { e.preventDefault(); UI.pal.i = Math.max(0, UI.pal.i-1); paintPal(); }
    if (e.key==='Enter') { e.preventDefault(); runPal(UI.pal.i); }
    return;
  }
  if ((e.target.id==='chat-in' || e.target.id==='thread-in') && e.key==='Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); e.target.form.requestSubmit(); return; }
  if (e.target.name==='t' && e.target.form && e.target.form.dataset.form==='capture' && e.key==='Enter' && !e.shiftKey) { e.preventDefault(); e.target.form.requestSubmit(); return; }
  if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key==='q' || e.key==='й')) { e.preventDefault(); capture(); }
});

/* перетаскивание карточек между колонками */
let dragId = null;
document.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('.card'); if (!c || c.classList.contains('ro')) return; dragId = c.dataset.id; c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
document.addEventListener('dragend', () => { document.querySelectorAll('.dragging,.drop,.merge-drop').forEach(x=>x.classList.remove('dragging','drop','merge-drop')); dragId = null; });
/* карточку бросили на другую карточку — вкладываем в неё (большая задача) */
const dropCard = e => { const c = e.target.closest && e.target.closest('.board .card'); return c && dragId && c.dataset.id!==dragId ? c : null; };
document.addEventListener('dragover', e => { const k = dropCard(e); document.querySelectorAll('.merge-drop').forEach(x=>x!==k&&x.classList.remove('merge-drop')); if (k) { e.preventDefault(); k.classList.add('merge-drop'); document.querySelectorAll('.drop').forEach(x=>x.classList.remove('drop')); return; }
  const c = e.target.closest && e.target.closest('.colm'); if (!c || !dragId) return; e.preventDefault(); document.querySelectorAll('.drop').forEach(x=>x!==c&&x.classList.remove('drop')); c.classList.add('drop'); });
document.addEventListener('drop', e => { const k = dropCard(e); if (k) { e.preventDefault(); const a = task(dragId), b = task(k.dataset.id); k.classList.remove('merge-drop'); if (a && b && confirm('Вложить «'+a.title+'» в задачу «'+b.title+'»?\n\nПолучится одна большая задача, вынести обратно можно в её карточке.')) mergeTasks([a.id], b.id); return; }
  const c = e.target.closest && e.target.closest('.colm'); if (!c || !dragId) return; e.preventDefault(); setStatus(dragId, c.dataset.col, e.clientX, e.clientY); });

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
  if (r==='lead') return viewLead();
  if (r==='decisions') return viewDecisions();
  if (r==='inbox') return viewInbox();
  if (r==='log') return viewLog();
  if (r==='people') return viewPeople();
  if (r==='wiki') return viewWiki();
  if (r==='chats') return viewChats();
  if (r==='board') return UI.board ? '' : viewBoards();
  listenChat(null);
  if (r==='call') return '';
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
let SIDE_HTML = '', TOP_HTML = '', VIEW_HTML = '', VIEW_ROUTE = '', enterT = 0;
/* новые элементы списков (пришли из базы или только что созданы) мягко всплывают.
   Ключ элемента — data-pk, data-open, id решения или id карточки задачи */
const POP_SEL = '[data-pk],[data-open],.card[data-id],article.decision[id]';
const popKey = el => el.dataset.pk || el.dataset.open || el.id || el.dataset.id, POPPED = new Map();
/* перерисовка посреди всплывания: анимацию продолжаем с того же места, а не обрываем */
function repop(el){
  const t = now();
  if (POPPED.size) el.querySelectorAll(POP_SEL).forEach(x => { const p = POPPED.get(popKey(x)); if (p && t-p < 340) { x.classList.add('pop'); x.style.animationDelay = (p-t)+'ms'; } });
  return t;
}
function swapHtml(el, html, pop){
  const old = pop ? new Set([...el.querySelectorAll(POP_SEL)].map(popKey)) : null;
  el.innerHTML = html;
  const t = repop(el);
  if (!old || !old.size) return;
  const fresh = [...el.querySelectorAll(POP_SEL)].filter(x => !old.has(popKey(x)));
  if (fresh.length > 6) return; // массовая подгрузка — без анимации
  fresh.forEach(x => { x.classList.add('pop'); POPPED.set(popKey(x), t); });
  if (POPPED.size > 50) POPPED.clear();
}
/* вход в раздел: блоки страницы появляются лесенкой */
function enterView(v){
  v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter');
  clearTimeout(enterT); enterT = setTimeout(() => v.classList.remove('enter'), 600);
}
function paint(){
  if (document.body.classList.contains('locked')) return;
  /* данные экономики грузим, только когда их открыли: сама экономика, общий список багов и журнал */
  if (UI.route.startsWith('d/econ') || UI.route==='log' || UI.route==='lead' || (UI.route==='d/qa' && UI.tab==='bugs')) econListen();
  const ae = document.activeElement, fk = focusKey(ae), sy = scrollY, sel = ae && ae.id && 'selectionStart' in ae ? [ae.selectionStart, ae.selectionEnd] : null;
  const ms = $('#msgs'), mst = ms ? {top:ms.scrollTop, end:ms.scrollHeight-ms.scrollTop-ms.clientHeight < 60, chat:UI.chat} : null;
  /* боковую панель пересобираем, только когда она правда изменилась: иначе каждое обновление данных сбрасывает её прокрутку */
  const sh = sidebar(); if (sh !== SIDE_HTML) { const ss = $('#side-scroll'), st = ss ? ss.scrollTop : 0; $('#side').innerHTML = SIDE_HTML = sh; const ns = $('#side-scroll'); if (ns) ns.scrollTop = st; }
  const th = topbar(); if (th !== TOP_HTML) $('#topbar').innerHTML = TOP_HTML = th;
  const vh = view(), vr = UI.route+'|'+(UI.tab||'')+'|'+(UI.chat||'')+'|'+(UI.board||''), v = $('#view');
  if (vh !== VIEW_HTML) {
    const same = vr === VIEW_ROUTE;
    if (same) v.classList.remove('enter'); // данные пришли во время входа — без повторной анимации
    swapHtml(v, vh, same); VIEW_HTML = vh; VIEW_ROUTE = vr;
    if (!same) enterView(v);
  }
  document.body.classList.toggle('r-chats', UI.route==='chats');
  document.body.classList.toggle('r-call', UI.route==='call');
  document.body.classList.toggle('r-board', UI.route==='board' && !!UI.board);
  callPaint(); boardPaint();
  const ms2 = $('#msgs'); if (ms2) ms2.scrollTop = !mst || mst.end || mst.chat!==UI.chat ? ms2.scrollHeight : mst.top;
  if (fk) { const el = document.querySelector('#side '+fk+',#topbar '+fk+',#view '+fk); if (el) { el.focus({preventScroll:true}); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
  if (scrollY !== sy) scrollTo(0, sy);
}
let queued = false;
function schedule(){
  if (queued) return; queued = true;
  let done = false;
  const run = () => { if (done) return; done = true; queued = false; paint(); refreshDrawer(); afterPaint(); };
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

/* ── сроки задач ────────────────────────────
   due — полдень выбранного дня (мс), чтобы дата не съезжала между часовыми поясами */
const DAY = 86400e3;
const dueDay = t => { if (!t) return null; const d = new Date(t); d.setHours(0,0,0,0); return d.getTime(); };
const parseDay = v => v ? new Date(v+'T12:00:00').getTime() : null;
const isoDay = t => { if (!t) return ''; const d = new Date(t); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const dateFmt = t => new Date(t).toLocaleDateString('ru-RU', {day:'numeric', month:'short'});
const dueLeft = t => t.due ? Math.round((dueDay(t.due) - dueDay(now()))/DAY) : null; // 0 — сегодня, < 0 — просрочено
const dueText = t => { const n = dueLeft(t); return n===null ? '' : n<0 ? 'просрочено на '+plural(-n,'день','дня','дней') : n===0 ? 'сегодня' : n===1 ? 'завтра' : dateFmt(t.due); };
const dueTone = t => { const n = dueLeft(t); return n===null || t.status==='done' ? 'muted' : n<0 ? 'red' : n<=1 ? 'warn' : 'info'; };
const dueChip = t => t.due ? `<span class="due t-${dueTone(t)}" title="Срок: ${esc(dateFmt(t.due))}">${ic('Calendar')} ${esc(t.status==='done' ? dateFmt(t.due) : dueText(t))}</span>` : '';
/* мои незакрытые задачи со сроком сегодня, завтра или уже просроченные */
const myDue = () => S.tasks.filter(t => t.who===S.me && t.status!=='done' && t.due && dueLeft(t)<=1).sort((a,b)=>a.due-b.due);

/* ── уведомления ────────────────────────────
   hub_notifs/{id}: to — кому, by — от кого (или 'system'), kind, task, title, text, read.
   На сайте — колокольчик и всплывашка. Вне сайта — системное уведомление браузера, пока хаб открыт хоть в одной вкладке,
   а с включённым пушем (VAPID_KEY в index.html + функция из functions/) — даже когда сайт закрыт. */
const NOTIF_KIND = {assign:['UserCheck','назначил(а) тебя ответственным'], unassign:['UserCheck','передал(а) задачу другому'], comment:['MessageSquare','прокомментировал(а)'],
  mention:['AtSign','упомянул(а) тебя'], status:['CircleDot','сменил(а) статус'], due:['Calendar','срок задачи']};
const notifBy = n => n.by==='system' ? 'Kentucky Hub' : pname(n.by);
const notifHead = n => n.by==='system' ? 'Срок задачи' : notifBy(n)+' '+(NOTIF_KIND[n.kind]||['',''])[1];
const watchers = t => [t.who, t.createdBy];
function notify(to, kind, t, text){
  if (!t || !t.id) return;
  const list = [...new Set([].concat(to||[]))].filter(u => u && u!==S.me && S.people[u]);
  for (const u of list) col('hub_notifs').add(Object.assign({to:u, by:S.me, at:now(), kind, task:t.id, title:clip(t.title,160), text:clip(text||'',300), read:false}, expireIn(60)))
    .catch(e => console.warn('уведомление не отправлено', e.code));
}
/* @логин или @Имя (первое слово имени) */
function mentions(text){
  const out = new Set(), re = /@([\p{L}\p{N}._-]{2,32})/gu; let m;
  while ((m = re.exec(text))) { const k = m[1].toLowerCase();
    for (const [id,p] of Object.entries(S.people)) if (String(p.login||'').toLowerCase()===k || String(p.name||'').split(/\s+/)[0].toLowerCase()===k) out.add(id); }
  return [...out];
}
const unreadNotifs = () => S.notifs.filter(n=>!n.read);
const notifCount = () => unreadNotifs().length + myDue().filter(t=>dueLeft(t)<=0).length;
function titleBadge(n){
  document.title = (n ? '('+n+') ' : '') + 'Kentucky Hub';
  try { n ? navigator.setAppBadge && navigator.setAppBadge(n) : navigator.clearAppBadge && navigator.clearAppBadge(); } catch (e) {}
}
let notifStart = 0, notifFirst = true;
function listenNotifs(){
  notifStart = now(); notifFirst = true;
  UNSUB.push(col('hub_notifs').where('to','==',S.me).onSnapshot(sn => {
    S.notifs = sn.docs.map(d=>Object.assign({id:d.id}, d.data())).sort((a,b)=>b.at-a.at);
    const fresh = sn.docChanges().filter(ch => ch.type==='added').map(ch => Object.assign({id:ch.doc.id}, ch.doc.data())).filter(n => !n.read && n.at > notifStart-60e3);
    /* первый снимок (в том числе из кэша браузера) — это старые уведомления, всплывают только новые */
    if (!notifFirst) fresh.forEach(popNotif);
    else if (!sn.metadata.fromCache) { notifFirst = false; cleanNotifs(); dueReminder(); }
    S.notifErr = null;
    schedule();
  }, e => { console.warn('hub_notifs', e.code); S.notifErr = errText(e); schedule(); }));
}
/* прочитанные старше 30 дней удаляем — список не разрастается */
function cleanNotifs(){
  const old = S.notifs.filter(n => n.read && n.at < now()-30*DAY).slice(0, 200); if (!old.length) return;
  const b = DB.batch(); old.forEach(n => b.delete(col('hub_notifs').doc(n.id))); b.commit().catch(()=>{});
}
function popNotif(n){
  const k = NOTIF_KIND[n.kind] || ['Bell',''];
  toast(ic(k[0])+' <b>'+esc(notifHead(n))+'</b>: '+esc(clip(n.title,60)));
  if (document.hidden || !document.hasFocus()) sysNotify(notifHead(n), '«'+n.title+'»'+(n.text ? '\n'+clip(n.text,140) : ''), n.id, n.task);
}
/* напоминание о сроках — раз в день на устройстве, если пуш выключен (с пушем напоминает сервер) */
function dueReminder(){
  setTimeout(() => {
    const list = myDue(); if (!list.length) return;
    const key = 'kyHubDue:'+S.me, day = isoDay(now());
    try { if (localStorage.getItem(key)===day) return; localStorage.setItem(key, day); } catch (e) {}
    const over = list.filter(t=>dueLeft(t)<0).length, today = list.filter(t=>dueLeft(t)===0).length, tom = list.length-over-today;
    const parts = [over && 'просрочено: '+over, today && 'на сегодня: '+today, tom && 'на завтра: '+tom].filter(Boolean).join(', ');
    toast(ic('Calendar')+' Сроки по твоим задачам — '+esc(parts));
    if (!localStorage.getItem('kyHubPush')) sysNotify('Сроки по задачам', parts.charAt(0).toUpperCase()+parts.slice(1), 'due-'+day, list[0].id);
  }, 2500);
}
function markNotifs(list){
  list = list.filter(n=>!n.read); if (!list.length) return;
  list.forEach(n => n.read = true); schedule();
  const b = DB.batch(); list.forEach(n => b.update(col('hub_notifs').doc(n.id), {read:true})); b.commit().catch(e => console.warn('прочитано', e.code));
}
function clearNotifs(){
  const list = S.notifs.filter(n=>n.read).slice(0, 400); if (!list.length) return;
  const b = DB.batch(); list.forEach(n => b.delete(col('hub_notifs').doc(n.id))); write(()=>b.commit());
}
/* открыть задачу по id: если задачи ещё не пришли из базы — после загрузки */
function openTask(id){
  if (!id) return;
  if (!S.loaded.has('hub_tasks')) { UI.pendingTask = id; return; }
  if (!task(id)) { toast(ic('CircleAlert')+' Задачу уже удалили'); return; }
  openDrawer('task:'+id);
}
function afterPaint(){
  titleBadge(notifCount());
  if (UI.pendingTask && S.loaded.has('hub_tasks')) { const id = UI.pendingTask; UI.pendingTask = null; openTask(id); }
  /* открытая шторка задачи — уведомления по ней считаем прочитанными */
  if (UI.drawer && UI.drawer.startsWith('task:') && !document.hidden) { const id = UI.drawer.slice(5); markNotifs(S.notifs.filter(n=>n.task===id)); }
  const cap = $('#notif-cap'); if (cap) cap.innerHTML = notifBody();
}
function notifItem(n){
  const k = NOTIF_KIND[n.kind] || ['Bell',''], t = task(n.task), d = t && D[t.dept];
  return `<button class="ntf${n.read?'':' new'}" data-action="notif-open" data-id="${esc(n.id)}" style="--dc:${d?d.color:'var(--acc)'}">
    ${n.by==='system' ? `<span class="ntf-ic">${ic(k[0])}</span>` : av(n.by,30)}
    <span class="bd"><span class="hd"><b>${esc(notifHead(n))}</b><small>${ago(n.at)}</small></span><span class="tt">${ic(k[0])} ${esc(n.title)}</span>${n.text?`<span class="tx">${esc(clip(n.text,180))}</span>`:''}</span></button>`;
}
function notifBody(){
  const due = myDue(), list = S.notifs.slice(0, 80), un = unreadNotifs().length;
  const perm = window.Notification ? Notification.permission : 'unsupported';
  const hint = perm==='default' ? `<div class="tldr"><b>${ic('Bell')} Уведомления вне сайта</b>Разреши уведомления — браузер покажет их, даже когда вкладка свёрнута${pushReady()?' или сайт закрыт':''}. <button class="btn sm primary" data-action="notif-on" style="margin-top:8px">${ic('Bell')} Включить</button></div>`
    : perm==='denied' ? `<small style="color:var(--muted)">${ic('Lock')} Уведомления заблокированы в настройках браузера для этого сайта — разреши их там (значок замка в адресной строке).</small>` : '';
  return `<div style="display:flex;align-items:center;gap:8px"><h2 style="margin:0">${ic('Bell')} Уведомления</h2><span style="flex:1"></span>
      ${un?`<button class="btn sm ghost" data-action="notif-all">${ic('Check')} Прочитать все</button>`:''}${S.notifs.some(n=>n.read)?`<button class="btn sm ghost" data-action="notif-clear" title="Удалить прочитанные">${ic('Trash2')}</button>`:''}
      <button class="icon-btn" data-action="close-overlay" aria-label="Закрыть">${ic('X')}</button></div>
    ${S.notifErr ? `<div class="banner err">${ic('CircleAlert')}<div><b>Уведомления не загружаются: ${esc(S.notifErr)}.</b><br><small>Руководителю: добавь правила hub_notifs и hub_push из firestore.rules в Firebase Console.</small></div></div>` : ''}
    ${hint}
    ${due.length ? `<div><p class="sub-h" style="margin:4px 0 8px">Сроки</p><div class="ntf-list">${due.map(t=>`<button class="ntf" data-action="notif-due" data-id="${esc(t.id)}" style="--dc:${(D[t.dept]||DEPTS[0]).color}"><span class="ntf-ic">${ic('Calendar')}</span><span class="bd"><span class="tt">${esc(t.title)}</span><span class="tx">${dueChip(t)}</span></span></button>`).join('')}</div></div>` : ''}
    <div class="ntf-list">${list.map(notifItem).join('') || '<div class="empty">Пока тихо. Сюда придёт, когда тебя назначат на задачу, упомянут или ответят в обсуждении.</div>'}</div>`;
}
function notifPanel(){
  overlay(`<div class="pal notifs" role="dialog" aria-label="Уведомления"><div class="cap" id="notif-cap">${notifBody()}</div></div>`);
}

/* системные уведомления и пуш — через service worker (sw.js рядом с хабом) */
let SWR = null;
const swReg = () => SWR || (SWR = 'serviceWorker' in navigator ? navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).catch(e => { console.warn('sw', e); SWR = null; return null; }) : Promise.resolve(null));
if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { if (e.data && 'hubOpen' in e.data) { focus(); openTask(e.data.hubOpen); } });
async function sysNotify(title, body, tag, taskId){
  if (!P.sysNotif || !window.Notification || Notification.permission!=='granted') return;
  const opts = {body, tag:tag||undefined, icon:'favicon.svg', badge:'favicon.svg', data:{task:taskId||''}};
  try { const r = await swReg(); if (r) return r.showNotification(title, opts); } catch (e) {}
  try { const n = new Notification(title, opts); n.onclick = () => { focus(); openTask(taskId); n.close(); }; } catch (e) {}
}
const VAPID = () => typeof VAPID_KEY==='string' ? VAPID_KEY : '';
const pushReady = () => !!(VAPID() && firebase.messaging && 'serviceWorker' in navigator && 'PushManager' in window);
/* токен пуша этого браузера хранится в hub_push/{uid}.tokens — по нему функция шлёт уведомления, когда сайт закрыт */
async function pushToken(loud){
  if (!pushReady() || Notification.permission!=='granted') return false;
  try {
    const reg = await swReg(); if (!reg) return false;
    const token = await firebase.messaging().getToken({vapidKey:VAPID(), serviceWorkerRegistration:reg});
    if (!token) return false;
    const old = localStorage.getItem('kyHubPush');
    if (old !== token) {
      await col('hub_push').doc(S.me).set({tokens:FV().arrayUnion(token), at:now()}, {merge:true});
      if (old) col('hub_push').doc(S.me).update({tokens:FV().arrayRemove(old)}).catch(()=>{});
      localStorage.setItem('kyHubPush', token);
    }
    return true;
  } catch (e) { console.warn('push', e); if (loud) toast(ic('CircleAlert')+' Пуш не включился: '+esc(e.code||e.message)); return false; }
}
async function enableNotifs(){
  if (!window.Notification) { toast(ic('CircleAlert')+' Этот браузер не умеет уведомления. На iPhone добавь хаб на экран «Домой» и открой оттуда.'); return; }
  const perm = await Notification.requestPermission();
  if (perm!=='granted') { toast(ic('Lock')+' Уведомления не разрешены'); schedule(); return; }
  P.sysNotif = true; savePrefs(); await swReg();
  const push = await pushToken(true);
  sysNotify('Уведомления включены', push ? 'Придут, даже когда сайт закрыт.' : 'Придут, пока хаб открыт хоть в одной вкладке.', 'hub-test');
  if ($('#notif-cap')) $('#notif-cap').innerHTML = notifBody(); else settings();
}
async function disableNotifs(){
  P.sysNotif = false; savePrefs();
  const tok = localStorage.getItem('kyHubPush');
  if (tok) { try { localStorage.removeItem('kyHubPush'); await col('hub_push').doc(S.me).update({tokens:FV().arrayRemove(tok)}); if (firebase.messaging) await firebase.messaging().deleteToken(); } catch (e) { console.warn('push off', e); } }
  toast(ic('Bell')+' Уведомления вне сайта выключены на этом устройстве'); settings();
}
function notifSettings(){
  const perm = window.Notification ? Notification.permission : 'unsupported', on = perm==='granted' && P.sysNotif, push = on && !!localStorage.getItem('kyHubPush');
  const state = perm==='unsupported' ? 'Браузер не поддерживает' : perm==='denied' ? 'Заблокированы в браузере' : on ? (push ? 'Включены, в том числе когда сайт закрыт' : 'Включены, пока хаб открыт во вкладке'+(VAPID() ? '' : ' (пуш при закрытом сайте не настроен)')) : 'Выключены';
  return `<h2 style="margin-top:8px">${ic('Bell')} Уведомления</h2>
    <div class="set-row"><div>На этом устройстве<small>${esc(state)}. На сайте колокольчик работает всегда.</small></div>${on ? `<button class="btn sm" data-action="notif-off">Выключить</button>` : perm==='granted' || perm==='default' ? `<button class="btn sm primary" data-action="notif-on">${ic('Bell')} Включить</button>` : ''}</div>`;
}

/* ── экспорт переписки в Markdown ─────────── */
function saveMd(name, text){
  const url = URL.createObjectURL(new Blob([text], {type:'text/markdown;charset=utf-8'}));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
const mdName = s => (String(s||'чат').replace(/[\\/:*?"<>|#\n\r]+/g,' ').replace(/\s+/g,' ').trim().slice(0,80) || 'чат') + '.md';
const fullDt = new Intl.DateTimeFormat('ru-RU', {day:'numeric', month:'long', year:'numeric'});
const quoteMd = s => String(s||'').replace(/\r\n?/g,'\n').trim();
function msgsMd(msgs){
  const L = []; let day = '';
  for (const m of msgs) {
    const d = fullDt.format(m.at); if (d!==day) { day = d; L.push('', '### '+d, ''); }
    const files = (m.files||[]).map(id => S.files.find(f=>f.id===id)).filter(Boolean).map(f => '📎 '+f.name+' ('+fsize(f.size)+')');
    L.push('**'+pname(m.by)+'** · '+hhmm(m.at), '');
    if (m.text) L.push(quoteMd(m.text).replace(/\n/g, '  \n'), ''); // два пробела — перенос строки в Markdown
    if (files.length) L.push(files.map(f=>'- '+f).join('\n'), '');
  }
  return L;
}
function taskMdHead(t){
  const L = ['# '+t.title, ''];
  if (t.tldr) L.push('> '+quoteMd(t.tldr).replace(/\n/g,'\n> '), '');
  L.push('| | |', '|---|---|', '| Статус | '+colName(t.status)+' |', '| '+(tDepts(t).length>1?'Отделы':'Отдел')+' | '+tDepts(t).map(x=>D[x].name).join(', ')+' |',
    '| Ответственный | '+pname(t.who)+' |', '| Срок | '+(t.due ? fullDt.format(t.due) : '—')+' |', '| Размер | '+(t.size||'M')+' |');
  if (t.createdBy) L.push('| Создал(а) | '+pname(t.createdBy)+', '+fullDt.format(t.createdAt)+' |');
  L.push('');
  if ((t.sub||[]).length) L.push('## Шаги', '', ...t.sub.map(s => '- ['+(s.done?'x':' ')+'] '+s.t), '');
  if (t.details) L.push('## Подробности', '', quoteMd(t.details), '');
  return L;
}
const mdFoot = () => ['', '---', '_Экспорт из Kentucky Hub · '+fullDt.format(now())+', '+hhmm(now())+' · '+pname(S.me)+'_', ''];
async function chatMsgs(chatId){
  if (msgChat===chatId && S.loaded.has('hub_msgs')) return S.msgs;
  const sn = await col('hub_msgs').where('chat','==',chatId).get();
  return sn.docs.map(d=>Object.assign({id:d.id}, d.data())).sort((a,b)=>a.at-b.at);
}
async function exportChat(chatId){
  const c = chat(chatId); if (!c) return;
  try {
    const msgs = await chatMsgs(chatId), t = c.task && S.allTasks.find(x=>x.id===c.task);
    const L = t ? [...taskMdHead(t), '## Чат задачи', ...msgsMd(msgs)] : ['# '+c.title, '', '_Чат создал(а) '+pname(c.by)+(c.createdAt ? ', '+fullDt.format(c.createdAt) : '')+'_', ...msgsMd(msgs)];
    if (!msgs.length) L.push('', '_Сообщений нет._');
    if (t && (t.comments||[]).length) L.push('', '## Обсуждение в карточке', ...msgsMd([...t.comments].sort((a,b)=>a.at-b.at)));
    saveMd(mdName(c.title), L.concat(mdFoot()).join('\n'));
    toast(ic('FileDown')+' Скачано: '+plural(msgs.length,'сообщение','сообщения','сообщений'));
  } catch (e) { console.error(e); toast(ic('CircleAlert')+' Не выгрузилось: '+esc(errText(e))); }
}
async function exportTask(id){
  const t = task(id); if (!t) return;
  const c = S.chats.find(x=>x.task===id);
  if (c) return exportChat(c.id);
  saveMd(mdName(t.title), [...taskMdHead(t), '## Обсуждение в карточке', ...msgsMd([...(t.comments||[])].sort((a,b)=>a.at-b.at)), ...mdFoot()].join('\n'));
  toast(ic('FileDown')+' Скачано: обсуждение задачи');
}

/* ── звонок: один общий канал — голос, камера, демонстрация экрана ─────
   Звук и видео идут напрямую между браузерами (WebRTC, каждый с каждым). Firestore только сводит участников:
   hub_call/{uid} — кто сейчас в канале (пульс раз в 20 с), hub_rtc — предложение и ответ SDP для пары.
   Кандидаты ICE не шлём по одному: ждём, пока соберутся, и отправляем SDP целиком — одна запись на сторону.
   Блок звонка (#callbox) живёт вне #view: перерисовка страницы не пересоздаёт видео. */
const CALL_BEAT = 20e3, CALL_STALE = 65e3, CALL_MAX = 8;
const CALL_ICE = [{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']},
  ...(typeof TURN_SERVERS!=='undefined' && Array.isArray(TURN_SERVERS) ? TURN_SERVERS : [])];
/* порядок дорожек в соединении одинаковый у обеих сторон — по нему и узнаём, что пришло */
const T_MIC = 0, T_CAM = 1, T_SCR = 2, T_SCRA = 3;
const CAN_SHARE = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
const CALL = {in:false, joining:false, sid:'', raw:{}, list:{}, sig:'', first:true, err:'', peers:{}, mic:null, cam:null, scr:null,
  wantMic:true, wantCam:false, beat:null, sigUnsub:null, ac:null, meters:{}, loud:{}, meterT:null, tickT:null, pin:null, built:false, lobbyKey:'', dockKey:''};
const callIds = () => Object.keys(CALL.list).sort((a,b)=>(CALL.list[a].at||0)-(CALL.list[b].at||0));
const callCount = () => callIds().length;
const callSince = () => Math.min(...callIds().map(id=>CALL.list[id].at||now()), now());
const hms = ms => { const s = Math.max(0, Math.floor(ms/1000)), h = Math.floor(s/3600); return (h ? h+':' : '') + String(Math.floor(s/60)%60).padStart(h?2:1,'0')+':'+String(s%60).padStart(2,'0'); };
const myTracks = () => [CALL.mic && CALL.mic.getAudioTracks()[0], CALL.cam && CALL.cam.getVideoTracks()[0],
  CALL.scr && CALL.scr.getVideoTracks()[0], CALL.scr && CALL.scr.getAudioTracks()[0]].map(t=>t||null);
const micLive = () => !!(CALL.mic && CALL.mic.getAudioTracks()[0] && CALL.mic.getAudioTracks()[0].enabled);

/* ── присутствие ── */
function callListen(){
  return col('hub_call').onSnapshot(sn => {
    CALL.err = ''; CALL.raw = {}; sn.docs.forEach(d => { CALL.raw[d.id] = d.data(); });
    callRefresh(sn.metadata.fromCache);
  }, e => { console.warn('hub_call', e); CALL.err = errText(e); callPaint(); });
}
/* свежие — с пульсом не старше CALL_STALE; полная перерисовка хаба — только если состав или значки поменялись */
function callRefresh(cached){
  const prev = CALL.list, L = {};
  for (const [id, x] of Object.entries(CALL.raw)) if (x && x.beat > now()-CALL_STALE && x.sid) L[id] = x;
  CALL.list = L;
  if (CALL.in && L[S.me] && L[S.me].sid!==CALL.sid) { callLeave(true); toast(ic('Phone')+' Ты подключился к звонку в другой вкладке — здесь звонок закрыт.'); return; }
  if (!CALL.first && !cached) callNews(prev, L);
  if (!cached) CALL.first = false;
  if (CALL.in) callPeers();
  const sig = callIds().map(id => id+L[id].sid+(L[id].mic?1:0)+(L[id].cam?1:0)+(L[id].scr?1:0)).join('|');
  if (sig!==CALL.sig) { CALL.sig = sig; schedule(); }
  callPaint();
}
function callNews(prev, L){
  const came = Object.keys(L).filter(id=>id!==S.me && (!prev[id] || prev[id].sid!==L[id].sid));
  const went = Object.keys(prev).filter(id=>id!==S.me && !L[id]);
  if (CALL.in) { if (came.length) blip(true); else if (went.length) blip(false); return; }
  /* канал был пуст — зовём остальных */
  if (!Object.keys(prev).length && came.length) toast(ic('Phone')+' '+esc(pname(came[0]))+' в звонке — раздел «Звонок» слева');
}
function callBeat(patch){
  if (!CALL.in || !S.me) return Promise.resolve();
  return col('hub_call').doc(S.me).set(Object.assign({sid:CALL.sid, at:CALL.at, beat:now(), mic:micLive(), cam:!!CALL.cam, scr:!!CALL.scr}, patch||{})).catch(e => console.warn('hub_call beat', e.code));
}

/* ── вход и выход ── */
async function callJoin(){
  if (CALL.in || CALL.joining || !S.me) return;
  if (!window.RTCPeerConnection || !navigator.mediaDevices) return toast(ic('CircleAlert')+' Этот браузер не умеет звонки. Открой хаб в Chrome, Edge или Firefox.');
  if (callIds().filter(id=>id!==S.me).length >= CALL_MAX) return toast(ic('CircleAlert')+' В канале уже '+CALL_MAX+' человек — больше связь каждый-с-каждым не потянет.');
  CALL.joining = true; callPaint();
  /* звук создаём по клику — иначе браузер его заглушит */
  try { CALL.ac = CALL.ac || new (window.AudioContext || window.webkitAudioContext)(); CALL.ac.resume(); } catch (e) { CALL.ac = null; }
  try { CALL.mic = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true, autoGainControl:true}}); }
  catch (e) { CALL.mic = null; toast(ic('MicOff')+' Микрофон недоступен — зайдёшь без звука. Разреши доступ в адресной строке.'); }
  if (CALL.mic && !CALL.wantMic) CALL.mic.getAudioTracks().forEach(t => t.enabled = false);
  if (CALL.wantCam) await camOn(true);
  CALL.sid = Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4);
  CALL.at = now(); CALL.in = true; CALL.joining = false; CALL.pin = null;
  const ok = await col('hub_call').doc(S.me).set({sid:CALL.sid, at:CALL.at, beat:now(), mic:micLive(), cam:!!CALL.cam, scr:false}).then(()=>true, e => { console.error(e); return e; });
  if (ok!==true) { callLeave(true); return toast(ic('CircleAlert')+' Не получилось войти в канал: '+esc(errText(ok))); }
  CALL.raw[S.me] = {sid:CALL.sid, at:CALL.at, beat:now(), mic:micLive(), cam:!!CALL.cam, scr:false};
  CALL.sigUnsub = col('hub_rtc').where('to','==',S.me).onSnapshot(onSignals, e => { console.warn('hub_rtc', e); toast(ic('CircleAlert')+' Сигналы звонка не доходят: '+esc(errText(e))); });
  CALL.beat = setInterval(() => callBeat(), CALL_BEAT);
  meter(S.me, CALL.mic);
  CALL.meterT = setInterval(meterTick, 110);
  blip(true);
  callRefresh(false); schedule();
}
function callLeave(quiet){
  if (!CALL.in && !CALL.joining) return;
  const sid = CALL.sid;
  CALL.in = false; CALL.joining = false; CALL.sid = ''; CALL.pin = null;
  clearInterval(CALL.beat); clearInterval(CALL.meterT);
  if (CALL.sigUnsub) { try { CALL.sigUnsub(); } catch (e) {} CALL.sigUnsub = null; }
  Object.keys(CALL.peers).forEach(peerClose);
  for (const s of [CALL.mic, CALL.cam, CALL.scr]) if (s) s.getTracks().forEach(t => t.stop());
  CALL.mic = CALL.cam = CALL.scr = null;
  Object.keys(CALL.meters).forEach(meterOff); CALL.loud = {};
  /* свой документ удаляем, только если его не перехватила другая вкладка */
  if (S.me && CALL.raw[S.me] && CALL.raw[S.me].sid===sid) { delete CALL.raw[S.me]; col('hub_call').doc(S.me).delete().catch(()=>{}); }
  if (!quiet) blip(false);
  callRefresh(false); schedule();
}
addEventListener('pagehide', () => callLeave(true));

/* ── соединения ── */
function callPeers(){
  for (const [uid, x] of Object.entries(CALL.list)) {
    if (uid===S.me) continue;
    const p = CALL.peers[uid];
    if (p && p.sid!==x.sid) peerClose(uid);
    if (!CALL.peers[uid]) peerOpen(uid, x.sid);
  }
  for (const uid of Object.keys(CALL.peers)) if (!CALL.list[uid]) peerClose(uid);
}
function peerOpen(uid, sid){
  const pc = new RTCPeerConnection({iceServers:CALL_ICE, bundlePolicy:'max-bundle'});
  /* предложение всегда шлёт участник с меньшим uid — встречных предложений не бывает */
  const p = CALL.peers[uid] = {uid, sid, pc, offerer:S.me < uid, cam:null, scr:null, q:Promise.resolve(), tries:0, timer:null, state:'new',
    audio:new Audio(), saudio:new Audio()};
  p.audio.autoplay = p.saudio.autoplay = true;
  pc.ontrack = e => {
    const i = pc.getTransceivers().indexOf(e.transceiver), ms = new MediaStream([e.track]);
    if (i===T_MIC) { p.audio.srcObject = ms; p.audio.play().catch(()=>{}); meter(uid, ms); }
    else if (i===T_SCRA) { p.saudio.srcObject = ms; p.saudio.play().catch(()=>{}); }
    else if (i===T_CAM) p.cam = ms;
    else if (i===T_SCR) p.scr = ms;
    callPaint();
  };
  pc.onconnectionstatechange = () => {
    const s = pc.connectionState; p.state = s; clearTimeout(p.timer);
    if (s==='connected') p.tries = 0;
    if (s==='failed' && p.offerer) peerRetry(p);
    if (s==='disconnected') p.timer = setTimeout(() => { if (pc.connectionState!=='connected' && p.offerer) peerRetry(p); }, 4000);
    callPaint();
  };
  if (p.offerer) {
    myTracks().forEach((t, i) => pc.addTransceiver(t || (i===T_MIC || i===T_SCRA ? 'audio' : 'video'), {direction:'sendrecv'}));
    sendOffer(p, false);
  }
  return p;
}
function peerClose(uid){
  const p = CALL.peers[uid]; if (!p) return;
  delete CALL.peers[uid]; clearTimeout(p.timer); clearTimeout(p.watch);
  try { p.pc.close(); } catch (e) {}
  for (const a of [p.audio, p.saudio]) { a.pause(); a.srcObject = null; }
  meterOff(uid); delete CALL.loud[uid];
  if (CALL.pin && CALL.pin.startsWith(uid)) CALL.pin = null;
}
/* не соединились — переотправляем предложение с перезапуском ICE, не больше 4 раз подряд */
function peerRetry(p){
  if (CALL.peers[p.uid]!==p || p.tries >= 4) return;
  p.tries++; sendOffer(p, true);
}
const gathered = pc => new Promise(res => {
  if (pc.iceGatheringState==='complete') return res();
  const t = setTimeout(done, 2500);
  function done(){ clearTimeout(t); pc.removeEventListener('icegatheringstatechange', chk); res(); }
  function chk(){ if (pc.iceGatheringState==='complete') done(); }
  pc.addEventListener('icegatheringstatechange', chk);
});
function sendSig(p, kind, sdp){
  return col('hub_rtc').add(Object.assign({from:S.me, fsid:CALL.sid, to:p.uid, tsid:p.sid, kind, sdp, at:now()}, expireIn(1)));
}
function sendOffer(p, restart){
  p.q = p.q.then(async () => {
    if (CALL.peers[p.uid]!==p) return;
    await p.pc.setLocalDescription(await p.pc.createOffer(restart ? {iceRestart:true} : {}));
    await gathered(p.pc);
    if (CALL.peers[p.uid]!==p) return;
    await sendSig(p, 'offer', p.pc.localDescription.sdp);
    /* ответа нет 12 с — пробуем ещё раз */
    clearTimeout(p.watch); p.watch = setTimeout(() => { if (CALL.peers[p.uid]===p && p.pc.connectionState!=='connected') peerRetry(p); }, 12000);
  }).catch(e => console.warn('offer', e));
}
function onSignals(sn){
  sn.docChanges().forEach(ch => {
    if (ch.type!=='added') return;
    const d = ch.doc, x = d.data();
    /* сигнал прошлой сессии или другой вкладки: свежий не трогаем, старый убираем */
    if (x.tsid!==CALL.sid) { if (!(x.at > now()-120e3)) d.ref.delete().catch(()=>{}); return; }
    d.ref.delete().catch(()=>{});
    onSignal(x);
  });
}
function onSignal(x){
  let p = CALL.peers[x.from];
  if (x.kind==='offer') {
    if (!p || p.sid!==x.fsid) { if (p) peerClose(x.from); p = peerOpen(x.from, x.fsid); }
    if (p.offerer) return;
    p.q = p.q.then(async () => {
      await p.pc.setRemoteDescription({type:'offer', sdp:x.sdp});
      const tr = p.pc.getTransceivers(), mine = myTracks();
      for (let i=0; i<tr.length && i<4; i++) { tr[i].direction = 'sendrecv'; await tr[i].sender.replaceTrack(mine[i]); }
      await p.pc.setLocalDescription(await p.pc.createAnswer());
      await gathered(p.pc);
      if (CALL.peers[p.uid]!==p) return;
      await sendSig(p, 'answer', p.pc.localDescription.sdp);
      tune(p);
    }).catch(e => console.warn('answer', e));
  } else if (x.kind==='answer') {
    if (!p || p.sid!==x.fsid || !p.offerer) return;
    p.q = p.q.then(async () => {
      if (p.pc.signalingState!=='have-local-offer') return;
      await p.pc.setRemoteDescription({type:'answer', sdp:x.sdp});
      clearTimeout(p.watch); tune(p);
    }).catch(e => console.warn('answer in', e));
  }
}
/* битрейт: камера скромно, экран — чётко; чем больше людей, тем меньше на каждого */
function tune(p){
  const tr = p.pc.getTransceivers(), many = Object.keys(CALL.peers).length > 3;
  setMax(tr[T_CAM], many ? 300e3 : 650e3, 'balanced');
  setMax(tr[T_SCR], many ? 1.2e6 : 2.5e6, 'maintain-resolution');
}
async function setMax(t, bps, deg){
  if (!t || !t.sender || !t.sender.getParameters) return;
  try {
    const pr = t.sender.getParameters();
    if (!pr.encodings || !pr.encodings.length) pr.encodings = [{}];
    pr.encodings[0].maxBitrate = bps; pr.degradationPreference = deg;
    await t.sender.setParameters(pr);
  } catch (e) { /* старые браузеры не дают менять — работаем на своих настройках */ }
}
function pushTrack(i, track){
  for (const p of Object.values(CALL.peers)) { const t = p.pc.getTransceivers()[i]; if (t) t.sender.replaceTrack(track).then(() => tune(p)).catch(()=>{}); }
}

/* ── микрофон, камера, экран ── */
async function micToggle(){
  if (!CALL.in) { CALL.wantMic = !CALL.wantMic; return callPaint(); }
  if (!CALL.mic) {
    try { CALL.mic = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true, autoGainControl:true}}); }
    catch (e) { return toast(ic('MicOff')+' Нет доступа к микрофону — разреши его в адресной строке.'); }
    pushTrack(T_MIC, CALL.mic.getAudioTracks()[0]); meter(S.me, CALL.mic);
  } else { const t = CALL.mic.getAudioTracks()[0]; t.enabled = !t.enabled; }
  callBeat(); callPaint();
}
async function camOn(silent){
  try {
    CALL.cam = await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640}, height:{ideal:360}, frameRate:{ideal:24, max:30}}});
    const t = CALL.cam.getVideoTracks()[0]; t.contentHint = 'motion';
    t.onended = () => camOff();
    pushTrack(T_CAM, t); return true;
  } catch (e) { CALL.cam = null; if (!silent || e.name!=='AbortError') toast(ic('VideoOff')+' Камера недоступна: '+esc(e.name==='NotAllowedError' ? 'нет разрешения' : e.name==='NotFoundError' ? 'камеры нет' : 'занята другим приложением')); return false; }
}
function camOff(){ if (!CALL.cam) return; CALL.cam.getTracks().forEach(t=>t.stop()); CALL.cam = null; pushTrack(T_CAM, null); callBeat(); callPaint(); }
async function camToggle(){
  if (!CALL.in) { CALL.wantCam = !CALL.wantCam; return callPaint(); }
  if (CALL.cam) return camOff();
  if (await camOn()) { callBeat(); callPaint(); }
}
async function scrToggle(){
  if (!CALL.in || !CAN_SHARE) return;
  if (CALL.scr) return scrOff();
  try {
    /* выбор сразу открывается на «Весь экран»; окна и вкладки тоже доступны.
       restrictOwnAudio — в звук экрана не попадает звук самого хаба (голоса звонка), иначе у всех эхо */
    CALL.scr = await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:'monitor', frameRate:{ideal:30, max:30}, width:{max:1920}, height:{max:1080}},
      audio:{restrictOwnAudio:true, suppressLocalAudioPlayback:false, echoCancellation:false, noiseSuppression:false, autoGainControl:false},
      systemAudio:'include', monitorTypeSurfaces:'include', selfBrowserSurface:'exclude', surfaceSwitching:'include'});
  } catch (e) { CALL.scr = null; if (e.name!=='NotAllowedError' && e.name!=='AbortError') toast(ic('CircleAlert')+' Не получилось показать экран: '+esc(e.message||e.name)); return; }
  /* весь экран со звуком, а браузер не умеет вырезать свой звук — звук экрана не шлём, чтобы голоса звонка не вернулись эхом */
  const sa = CALL.scr.getAudioTracks()[0];
  if (sa && (CALL.scr.getVideoTracks()[0].getSettings().displaySurface||'monitor')!=='browser' && !(navigator.mediaDevices.getSupportedConstraints() || {}).restrictOwnAudio) {
    sa.stop(); CALL.scr.removeTrack(sa);
    toast(ic('CircleAlert')+' Звук экрана выключен: этот браузер не умеет отделять от него звук звонка. Обнови Chrome или Edge.');
  }
  const v = CALL.scr.getVideoTracks()[0], a = CALL.scr.getAudioTracks()[0] || null;
  /* «detail» — браузер бережёт резкость текста, а не плавность */
  v.contentHint = 'detail'; v.onended = () => scrOff();
  pushTrack(T_SCR, v); pushTrack(T_SCRA, a);
  CALL.pin = S.me+':s'; callBeat(); callPaint();
}
function scrOff(){
  if (!CALL.scr) return;
  CALL.scr.getTracks().forEach(t=>t.stop()); CALL.scr = null;
  pushTrack(T_SCR, null); pushTrack(T_SCRA, null);
  if (CALL.pin===S.me+':s') CALL.pin = null;
  callBeat(); callPaint();
}

/* ── кто говорит: один таймер на всех, без requestAnimationFrame ── */
function meter(key, stream){
  meterOff(key);
  if (!CALL.ac || !stream || !stream.getAudioTracks().length) return;
  try {
    const src = CALL.ac.createMediaStreamSource(stream), an = CALL.ac.createAnalyser();
    an.fftSize = 512; an.smoothingTimeConstant = .2; src.connect(an);
    CALL.meters[key] = {src, an, buf:new Uint8Array(an.fftSize), hold:0};
  } catch (e) {}
}
function meterOff(key){ const m = CALL.meters[key]; if (!m) return; try { m.src.disconnect(); } catch (e) {} delete CALL.meters[key]; }
function meterTick(){
  if (document.hidden) return;
  const t = now();
  for (const [key, m] of Object.entries(CALL.meters)) {
    m.an.getByteTimeDomainData(m.buf);
    let sum = 0; for (let i=0; i<m.buf.length; i+=4) { const v = (m.buf[i]-128)/128; sum += v*v; }
    const lvl = Math.sqrt(sum/(m.buf.length/4));
    if (lvl > .035 && (key!==S.me || micLive())) m.hold = t + 350;
    const on = m.hold > t;
    if (!!CALL.loud[key]!==on) {
      CALL.loud[key] = on;
      document.querySelectorAll(`#callbox [data-who="${CSS.escape(key)}"]`).forEach(el => el.classList.toggle('talk', on));
    }
  }
}
/* короткий звук входа и выхода — только когда сам в звонке */
function blip(up){
  const ac = CALL.ac; if (!ac || P.calm) return;
  try {
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = 'sine'; o.frequency.setValueAtTime(up?520:700, t); o.frequency.exponentialRampToValueAtTime(up?880:380, t+.16);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.07, t+.02); g.gain.exponentialRampToValueAtTime(.0001, t+.24);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t+.26);
  } catch (e) {}
}

/* ── отрисовка: каркас один раз, дальше только точечные правки ── */
const callBtn = (act, on, icOn, icOff, label, extra='') => `<button class="cbtn${on?'':' off'}" data-call="${act}" aria-pressed="${on}" title="${label}" aria-label="${label}" ${extra}>${ic(on?icOn:icOff)}</button>`;
function callShell(){
  const el = $('#callbox');
  el.innerHTML = `
  <div class="call-page">
    <div class="ph"><div class="ph-l"><span class="ph-ico" style="--dc:#7FD6A4">${ic('Phone')}</span><div><h1>Звонок</h1><p>Общий канал команды: голос, камера и демонстрация экрана. Связь идёт напрямую между участниками.</p></div></div>
      <div class="call-meta"><span class="live-chip" hidden><i></i><span data-call-time>0:00</span></span><span class="chip t-muted" data-call-n></span></div></div>
    <div class="call-err" hidden></div>
    <div class="lobby" hidden></div>
    <div class="cstage" hidden><div class="cstage-main"></div><div class="cstage-strip"></div></div>
    <div class="callbar" hidden></div>
  </div>
  <div class="dock" hidden></div>`;
  el.addEventListener('click', callClick);
  el.addEventListener('dblclick', e => { const t = e.target.closest('.ctile'); if (t) callFull(t); });
  CALL.built = true;
}
function callBar(dock){
  const cam = !!CALL.cam, scr = !!CALL.scr;
  return callBtn('mic', micLive(), 'Mic', 'MicOff', micLive() ? 'Выключить микрофон (M)' : 'Включить микрофон (M)')
    + callBtn('cam', cam, 'Video', 'VideoOff', cam ? 'Выключить камеру (V)' : 'Включить камеру (V)')
    + (CAN_SHARE ? `<button class="cbtn${scr?' share':' off'}" data-call="scr" aria-pressed="${scr}" title="${scr?'Остановить демонстрацию':'Показать экран'}" aria-label="${scr?'Остановить демонстрацию':'Показать экран'}">${ic('ScreenShare')}</button>` : '')
    + (dock ? `<a class="cbtn off" href="#/call" title="Открыть звонок" aria-label="Открыть звонок">${ic('Maximize')}</a>` : '')
    + `<button class="cbtn end" data-call="leave" title="Выйти из звонка" aria-label="Выйти из звонка">${ic('PhoneOff')}${dock?'':'<span>Выйти</span>'}</button>`;
}
function callPaint(){
  const el = $('#callbox'); if (!el) return;
  if (!S.me || document.body.classList.contains('locked')) { el.hidden = true; return; }
  if (!CALL.built) callShell();
  const page = UI.route==='call', dock = CALL.in && !page;
  el.hidden = !page && !dock;
  el.classList.toggle('docked', dock);
  $('.call-page', el).hidden = !page;
  $('.dock', el).hidden = !dock;
  const n = callCount();
  const err = $('.call-err', el); err.hidden = !CALL.err;
  if (CALL.err) err.innerHTML = `<div class="banner err">${ic('CircleAlert')}<div><b>Звонок недоступен: ${esc(CALL.err)}.</b><br><small>В правилах Firestore нужны коллекции hub_call и hub_rtc.</small></div></div>`;
  $('[data-call-n]', el).textContent = n ? plural(n, 'участник', 'участника', 'участников') : 'никого';
  $('.live-chip', el).hidden = !n;
  if (page) {
    const lobby = $('.lobby', el), cstage = $('.cstage', el), bar = $('.callbar', el);
    lobby.hidden = CALL.in; cstage.hidden = bar.hidden = !CALL.in;
    if (!CALL.in) paintLobby(lobby); else { paintStage(cstage); bar.innerHTML = callBar(false); }
  }
  if (dock) paintDock($('.dock', el));
  callTime();
  clearInterval(CALL.tickT); if (n) CALL.tickT = setInterval(callTime, 1000);
}
function callTime(){ const t = callCount() ? hms(now()-callSince()) : '0:00'; document.querySelectorAll('#callbox [data-call-time]').forEach(x => { if (x.textContent!==t) x.textContent = t; }); }
function paintLobby(box){
  const ids = callIds(), key = ids.join(',')+'|'+CALL.joining+CALL.wantMic+CALL.wantCam+Object.keys(S.people).length;
  if (key===CALL.lobbyKey && box.innerHTML) return;
  CALL.lobbyKey = key;
  const who = ids.length
    ? `<div class="lobby-who">${ids.map(id=>`<span class="lw" data-who="${esc(id)}">${av(id,40)}<small>${esc(pname(id).split(' ')[0])}</small></span>`).join('')}</div>
       <p>${ids.length===1 ? esc(pname(ids[0]))+' уже в канале' : 'Уже в канале: '+plural(ids.length,'человек','человека','человек')} · идёт <b data-call-time>0:00</b></p>`
    : `<p>Сейчас тихо. Зайди первым — у остальных в хабе всплывёт уведомление.</p>`;
  box.innerHTML = `
    <div class="orb${ids.length?' live':''}"><i></i><i></i><i></i><span>${ic('Phone')}</span></div>
    <h2>Общий канал</h2>${who}
    <div class="lobby-opts" role="group" aria-label="С чем зайти">
      <button class="pill${CALL.wantMic?' on':''}" data-call="mic" aria-pressed="${CALL.wantMic}">${ic(CALL.wantMic?'Mic':'MicOff')} ${CALL.wantMic?'Микрофон включён':'Без микрофона'}</button>
      <button class="pill${CALL.wantCam?' on':''}" data-call="cam" aria-pressed="${CALL.wantCam}">${ic(CALL.wantCam?'Video':'VideoOff')} ${CALL.wantCam?'Камера включена':'Без камеры'}</button>
    </div>
    <button class="btn primary join" data-call="join" ${CALL.joining?'disabled':''}>${CALL.joining?'<span class="spin"></span> Подключаемся…':ic('Phone')+' Подключиться'}</button>
    <small class="lobby-hint">${CAN_SHARE ? 'Экран можно показать после подключения: весь экран ПК, окно или вкладку.' : 'Телефонные браузеры не дают сайтам показывать экран — демонстрация доступна с компьютера.'} Горячие клавиши в звонке: M — микрофон, V — камера.</small>`;
  callTime();
}
/* плитки: своя камера, камеры остальных и отдельные плитки экранов */
function callTiles(){
  const T = [];
  for (const id of callIds()) {
    const x = CALL.list[id], mine = id===S.me, p = CALL.peers[id];
    const live = mine || (p && p.state==='connected');
    T.push({key:id, uid:id, scr:false, mine, stream: mine ? CALL.cam : p && p.cam, video: mine ? !!CALL.cam : !!(x.cam && p && p.cam), mic: mine ? micLive() : x.mic!==false, wait:!live});
    if (mine ? CALL.scr : x.scr) T.push({key:id+':s', uid:id, scr:true, mine, stream: mine ? CALL.scr : p && p.scr, video: mine ? true : !!(p && p.scr), mic:true, wait:!live});
  }
  return T;
}
function tileEl(t){
  const d = document.createElement('div');
  d.className = 'ctile'; d.dataset.ctile = t.key;
  if (!t.scr) d.dataset.who = t.uid;
  d.innerHTML = `<video autoplay playsinline muted></video>
    <div class="ct-av">${av(t.uid, 72)}</div>
    <div class="ct-tag"><span class="ct-mic">${ic('MicOff')}</span>${t.scr?ic('ScreenShare'):''}<b>${esc(pname(t.uid))}${t.mine?' (ты)':''}${t.scr?' · экран':''}</b></div>
    <div class="ct-wait"><span class="spin"></span>соединяемся…</div>
    <button class="ct-fs" data-call="full" title="На весь экран" aria-label="На весь экран">${ic('Maximize')}</button>`;
  return d;
}
function paintStage(cstage){
  const T = callTiles(), main = $('.cstage-main', cstage), strip = $('.cstage-strip', cstage);
  const keys = new Set(T.map(t=>t.key));
  if (CALL.pin && !keys.has(CALL.pin)) CALL.pin = null;
  const big = CALL.pin || (T.find(t=>t.scr && !t.mine) || T.find(t=>t.scr) || {}).key || null;
  cstage.classList.toggle('focus', !!big);
  cstage.querySelectorAll('.ctile').forEach(d => { if (!keys.has(d.dataset.ctile)) d.remove(); });
  let rows = 0;
  T.forEach(t => {
    let d = cstage.querySelector(`.ctile[data-ctile="${CSS.escape(t.key)}"]`);
    if (!d) d = tileEl(t);
    const host = big && t.key!==big ? strip : main;
    if (d.parentElement!==host) host.appendChild(d);
    const v = d.firstElementChild;
    const src = t.video ? t.stream : null;
    if (v.srcObject!==src) { v.srcObject = src; if (src) v.play().catch(()=>{}); }
    d.classList.toggle('vid', !!src); d.classList.toggle('scr', t.scr); d.classList.toggle('me', t.mine && !t.scr);
    d.classList.toggle('mute', !t.mic); d.classList.toggle('wait', t.wait); d.classList.toggle('big', t.key===big);
    d.classList.toggle('talk', !t.scr && !!CALL.loud[t.uid]);
    if (host===main) rows++;
  });
  /* сетка: столбцы по числу плиток, ширина такая, чтобы все влезли по высоте */
  const n = big ? 1 : T.length, cols = n<=1 ? 1 : n<=4 ? 2 : n<=9 ? 3 : 4;
  main.style.setProperty('--cols', cols); main.style.setProperty('--rows', Math.ceil(n/cols)); main.style.setProperty('--mcols', n<=3 ? 1 : 2);
}
function paintDock(box){
  const ids = callIds(), key = ids.join(',')+'|'+micLive()+!!CALL.cam+!!CALL.scr+ids.map(id=>CALL.list[id].mic?1:0).join('');
  if (key===CALL.dockKey && box.innerHTML) return;
  CALL.dockKey = key;
  box.innerHTML = `<a class="dock-go" href="#/call" title="Открыть звонок"><span class="live-dot"></span><span class="dock-t"><b>Общий канал</b><small data-call-time>0:00</small></span></a>
    <div class="dock-faces">${ids.slice(0,5).map(id=>`<span class="df${CALL.list[id].mic===false?' mute':''}${CALL.loud[id]?' talk':''}" data-who="${esc(id)}">${av(id,30)}</span>`).join('')}${ids.length>5?`<span class="df more">+${ids.length-5}</span>`:''}</div>
    <div class="dock-btns">${callBar(true)}</div>`;
  callTime();
}
function callFull(ctile){
  if (document.fullscreenElement) return document.exitFullscreen().catch(()=>{});
  if (ctile.requestFullscreen) ctile.requestFullscreen().catch(()=>{});
}
function callClick(e){
  const b = e.target.closest('[data-call]');
  if (!b) { const t = e.target.closest('.cstage .ctile'); if (t) { CALL.pin = CALL.pin===t.dataset.ctile ? null : t.dataset.ctile; callPaint(); } return; }
  const a = b.dataset.call;
  if (a==='join') callJoin();
  else if (a==='leave') callLeave(false);
  else if (a==='mic') micToggle();
  else if (a==='cam') camToggle();
  else if (a==='scr') scrToggle();
  else if (a==='full') { e.stopPropagation(); callFull(b.closest('.ctile')); }
}
document.addEventListener('keydown', e => {
  if (!CALL.in || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  const t = e.target; if (t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable)) return;
  if (e.code==='KeyM') { e.preventDefault(); micToggle(); }
  if (e.code==='KeyV') { e.preventDefault(); camToggle(); }
});
/* пульс чужих документов стареет без событий базы — пересчитываем сами */
setInterval(() => { if (S.me && Object.keys(CALL.raw).length) callRefresh(false); }, 15e3);

/* ── подписки на данные ─────────────────────── */
function listen(){
  const onErr = c => e => { console.error(c, e); S.errs[c] = errText(e); S.loaded.add(c); schedule(); };
  const docs = sn => sn.docs.map(d=>Object.assign({id:d.id}, d.data()));
  const simple = [['hub_decisions','decisions'],['hub_reg','reg'],['hub_wiki','wiki'],['hub_files','files'],['hub_chats','chats'],['hub_boards','boards']];
  for (const [c,k] of simple) UNSUB.push(col(c).onSnapshot(sn => { S[k] = docs(sn); S.loaded.add(c); schedule(); }, onErr(c)));
  /* вопросы экономики — часть общего раздела «Решения»; без них хаб работает, поэтому ошибка не ломает страницу */
  UNSUB.push(col('decisions').onSnapshot(sn => { S.edec = docs(sn).filter(x=>x.question); S.loaded.add('decisions'); schedule(); }, e => { console.warn('decisions', e); S.loaded.add('decisions'); schedule(); }));
  /* задачи видят все — одна подписка. Пока в базе старые правила, читаем по своим отделам, как раньше */
  let allTasks = true, allTries = 0;
  const syncTasks = () => {
    const want = myDepts(), seen = new Map();
    for (const d of want) for (const t of [...(S.tdept[d]||[]), ...(S.tdept['+'+d]||[])]) seen.set(t.id, t);
    S.allTasks = [...seen.values()]; applyVis();
    if (want.every(d=>S.tdept[d] && S.tdept['+'+d])) S.loaded.add('hub_tasks');
    schedule();
  };
  const listenTasks = () => {
    if (allTasks) { if (!TASK_UNSUB.all) TASK_UNSUB.all = col('hub_tasks').onSnapshot(sn => { S.allTasks = docs(sn); applyVis(); S.loaded.add('hub_tasks'); schedule(); },
      e => { if (!(e && e.code==='permission-denied')) return onErr('hub_tasks')(e);
        try { TASK_UNSUB.all(); } catch (x) {} delete TASK_UNSUB.all;
        /* отказ бывает и кратковременным сразу после входа — пробуем ещё, потом читаем по своим отделам и время от времени проверяем снова */
        if (++allTries < 4) { console.warn('hub_tasks: отказ, пробую ещё раз', allTries, e.message); setTimeout(() => { if (UNSUB.length) listenTasks(); }, 1500*allTries); return; }
        console.warn('hub_tasks: правила базы ещё старые — читаю задачи своих отделов', e.message); allTasks = false; listenTasks();
        const probe = setInterval(() => { if (!UNSUB.length) return clearInterval(probe);
          col('hub_tasks').limit(1).get().then(() => { clearInterval(probe); for (const k of Object.keys(TASK_UNSUB)) { try { TASK_UNSUB[k](); } catch (x) {} delete TASK_UNSUB[k]; } S.tdept = {}; allTasks = true; allTries = 0; listenTasks(); }).catch(() => {}); }, 600e3); });
      return; }
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
    /* в «Людях» только участники; новые аккаунты ждут одобрения руководителя в S.pending */
    const p = {}, wait = []; sn.docs.forEach(d => { const x = d.data(); if (isMemberP(x)) p[d.id] = x; else wait.push(Object.assign({id:d.id}, x)); });
    S.people = p; S.pending = wait.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)); S.loaded.add('hub_people'); normalizeDepts(); listenTasks();
    const lv = level(); if (lastLevel!==null && lv>lastLevel && !P.calm) { toast(ic('PartyPopper')+' Новый уровень: '+lv); confetti(innerWidth/2, innerHeight/2, 60); } lastLevel = lv;
    schedule();
  }, onErr('hub_people')));
  UNSUB.push(col('hub_log').where('at','>',now()-14*86400e3).orderBy('at','desc').limit(150).onSnapshot(sn => { S.log = docs(sn); schedule(); }, onErr('hub_log')));
  UNSUB.push(col('hub_inbox').where('by','==',S.me).onSnapshot(sn => { S.inbox = docs(sn); schedule(); }, onErr('hub_inbox')));
  UNSUB.push(col('hub_inbox').where('team','==',true).onSnapshot(sn => { S.team = docs(sn).filter(i=>i.by!==S.me); schedule(); }, onErr('hub_inbox_team')));
  UNSUB.push(callListen());
  listenNotifs();
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
/* после объединения отделов: у кого отмечена часть отдела (например, только cef), руководитель один раз дописывает остальные id —
   правила базы сверяют задачи с id из профиля */
let normDone = false;
function normalizeDepts(){
  if (normDone || !isAdmin()) return; normDone = true;
  for (const [uid, p] of Object.entries(S.people)) {
    const cur = p.depts||[], want = ALL_IDS.filter(x => cur.some(c => hd(c)===hd(x)));
    if (want.some(x => !cur.includes(x))) col('hub_people').doc(uid).update({depts:want}).catch(e => console.warn('отделы', uid, e.code));
  }
}
function unlisten(){ UNSUB.forEach(u => { try { u(); } catch (e) {} }); UNSUB = []; listenChat(null); boardLeave();
  Object.values(TASK_UNSUB).forEach(u => { try { u(); } catch (e) {} }); TASK_UNSUB = {}; S.tdept = {}; S.allTasks = []; S.tasks = []; S.notifs = []; S.E = null; S.loaded = new Set(); S.errs = {}; }

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
    await ref.set({name:nameHint || user.displayName || login, login, role:'', depts:[], approved:false, color:PERSON_COLORS[h % PERSON_COLORS.length], xp:0, days:[], top3:[], last:null, focus:null, seen:now(), createdAt:now()});
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
    const mine = await col('hub_people').doc(S.me).get();
    if (!isMemberP(mine.data())) { gateBusy = false; return waitApproval(user); }
    seedIfEmpty().catch(e => console.error('seed', e));
  } catch (e) {
    console.error(e); gateBusy = false;
    $('#gate-card').innerHTML = BRAND + `<div class="gate-err">Вход выполнен, но база не пускает: ${esc(errText(e))}.</div><button class="btn" id="g-out">Выйти</button>`;
    $('#g-out').onclick = () => AUTH.signOut(); return;
  }
  gateBusy = false;
  document.body.classList.remove('locked');
  readHash(); listen(); paint();
  if (window.Notification && Notification.permission==='granted') swReg().then(() => pushToken(false));
  clearInterval(presenceTimer); presenceTimer = setInterval(presence, PRESENCE_MS);
}
/* новый аккаунт ждёт, пока руководитель одобрит его в «Людях»; как только одобрили — входим сами */
let WAIT_UNSUB = null;
function waitApproval(user){
  $('#gate-card').innerHTML = BRAND + `<div class="gate-wait"><b>${ic('Clock')} Заявка отправлена</b><p>Руководитель увидит её в разделе «Люди» и одобрит — хаб откроется сам, обновлять страницу не нужно. Можно написать руководителю, чтобы ускорить.</p></div><button class="btn" id="g-out">${ic('LogOut')} Выйти</button>`;
  $('#g-out').onclick = () => AUTH.signOut();
  if (WAIT_UNSUB) WAIT_UNSUB();
  WAIT_UNSUB = col('hub_people').doc(user.uid).onSnapshot(d => {
    if (!isMemberP(d.data())) return;
    WAIT_UNSUB(); WAIT_UNSUB = null; enter(user);
  }, e => console.warn('ожидание одобрения', e.code));
}
function lock(){ callLeave(true); CALL.raw = {}; CALL.list = {}; CALL.sig = ''; CALL.first = true; callPaint(); if (WAIT_UNSUB) { WAIT_UNSUB(); WAIT_UNSUB = null; } titleBadge(0); S.me = null; unlisten(); clearInterval(presenceTimer); document.body.classList.add('locked'); closeDrawer(); closeOverlay(); gateBusy = false; paintGate(); }
applyPrefs();
try {
  if (!window.firebase || !firebase.auth || !firebase.firestore) throw new Error('sdk');
  firebase.initializeApp(FIREBASE_CONFIG);
  AUTH = firebase.auth(); DB = firebase.firestore();
  /* кэш базы в браузере: при повторном открытии хаб докачивает только изменения, а не все документы заново (меньше чтений) */
  if (DB.enablePersistence) DB.enablePersistence({synchronizeTabs:true}).catch(e => console.warn('Кэш базы выключен:', e.code));
  AUTH.onAuthStateChanged(u => u ? enter(u) : lock());
} catch (e) {
  $('#gate-card').innerHTML = BRAND + '<div class="gate-err">Не загрузился модуль входа. Обнови страницу или проверь, не блокирует ли что-то gstatic.com.</div>';
}
})();
