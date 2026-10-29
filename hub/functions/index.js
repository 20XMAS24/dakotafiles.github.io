/* Kentucky Hub — пуш-уведомления, когда сайт закрыт.
   hubPush — на каждое новое уведомление в hub_notifs шлёт пуш во все браузеры адресата (токены в hub_push/{uid}).
   hubDue  — каждый день в 9:00 по Москве напоминает ответственным о сроках: просрочено, сегодня, завтра;
             руководителям (admin в hub_people) — одна сводка: просрочено больше 3 дней и задачи со сроком без ответственного.
   Деплой (нужен тариф Blaze у проекта kentucky-economy):  cd hub && firebase deploy --only functions:hub */
const {onDocumentCreated} = require('firebase-functions/v2/firestore');
const {onSchedule} = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const REGION = 'europe-west1';
const KIND = {assign:'назначил(а) тебя ответственным', unassign:'передал(а) задачу другому', comment:'прокомментировал(а)',
  mention:'упомянул(а) тебя', status:'сменил(а) статус', due:'срок задачи'};
const DAY = 86400e3, MSK = 3*3600e3; // в Москве нет перехода на летнее время
const mskDay = t => Math.floor((t + MSK) / DAY);
const ttl = days => ({expireAt:admin.firestore.Timestamp.fromMillis(Date.now() + days*DAY)}); // TTL-политика удалит уведомление сама
const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n-1)+'…' : s; };

exports.hubPush = onDocumentCreated({document:'hub_notifs/{id}', region:REGION}, async ev => {
  const n = ev.data && ev.data.data(); if (!n || !n.to) return;
  const ref = db.doc('hub_push/'+n.to), ps = await ref.get();
  const tokens = (ps.exists && ps.get('tokens')) || []; if (!tokens.length) return;
  let head = 'Срок задачи';
  if (n.by !== 'system') { const p = await db.doc('hub_people/'+n.by).get(); head = (p.exists && p.get('name') || 'Участник')+' '+(KIND[n.kind] || ''); }
  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    data:{title:clip(head, 80), body:clip('«'+(n.title||'')+'»'+(n.text ? '\n'+n.text : ''), 220), tag:ev.params.id, task:String(n.task || '')},
    webpush:{headers:{Urgency:'high', TTL:'86400'}}
  });
  /* токены удалённых или переустановленных браузеров убираем */
  const dead = tokens.filter((t, i) => { const e = res.responses[i].error; return e && /not-registered|invalid-registration-token|invalid-argument/.test(e.code || ''); });
  if (dead.length) await ref.update({tokens:admin.firestore.FieldValue.arrayRemove(...dead)});
});

exports.hubDue = onSchedule({schedule:'0 9 * * *', timeZone:'Europe/Moscow', region:REGION}, async () => {
  const now = Date.now(), today = mskDay(now);
  const sn = await db.collection('hub_tasks').where('due', '<=', (today+2)*DAY - MSK).get();
  const b = db.batch(); let k = 0; const esc = [];
  for (const d of sn.docs) {
    const t = d.data(); if (t.status === 'done' || !t.due) continue;
    const left = mskDay(t.due) - today;
    /* руководителю: просрочено дольше 3 дней (без ограничения давности) или срок есть, а ответственного нет */
    if (left <= -3 || !t.who) esc.push({id:d.id, title:t.title, left, who:t.who});
    if (!t.who) continue;
    if (left < -7) continue; // ответственному о давно просроченных не напоминаем каждый день — это видит руководитель
    const text = left < 0 ? 'Срок прошёл '+(-left)+' дн. назад' : left === 0 ? 'Срок — сегодня' : 'Срок — завтра';
    b.set(db.collection('hub_notifs').doc(), Object.assign({to:t.who, by:'system', at:now, kind:'due', task:d.id, title:clip(t.title, 160), text, read:false}, ttl(60)));
    if (++k >= 400) break;
  }
  if (esc.length) {
    esc.sort((a, b) => a.left - b.left);
    const late = esc.filter(x => x.left <= -3).length, none = esc.filter(x => !x.who).length;
    const title = [late && 'Просрочено больше 3 дней: '+late, none && 'Без ответственного: '+none].filter(Boolean).join(' · ');
    const text = esc.slice(0, 3).map(x => '— '+clip(x.title, 60)+(x.who ? ' ('+(-x.left)+' дн.)' : ' (нет ответственного)')).join('\n')+(esc.length > 3 ? '\nи ещё '+(esc.length-3)+' — в «Обзоре»' : '');
    const leads = await db.collection('hub_people').where('admin', '==', true).get();
    for (const p of leads.docs) { b.set(db.collection('hub_notifs').doc(), Object.assign({to:p.id, by:'system', at:now, kind:'due', task:esc[0].id, title:clip(title, 160), text:clip(text, 300), read:false}, ttl(60))); k++; }
  }
  if (k) await b.commit();
});
