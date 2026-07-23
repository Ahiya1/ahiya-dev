/** Local judge calibration harness. Not imported by the app; run with:
 *  npx tsx app/trip/test-judges.ts   (needs ANTHROPIC_API_KEY in env) */
import { judgeSubmission } from './lib/judge';
import { JUDGES } from './content/judges';

const CASES = [
  {
    label: 'טל — משימת אפס שגיאות (עם שגיאות בכוונה)',
    playerName: 'טל',
    missionTitle: 'משימה אישית: אפס שגיאות',
    missionDescription:
      'כתוב פסקה שלמה על הטיול בלי שגיאת כתיב אחת. השופטים יבדקו בזכוכית מגדלת.',
    text: 'הטיול הזה מטורףףף רצח. הצימר נדיר, הגקוזי מפנק רצחח ואני תכלס נהנתי מכל רגע. בסדר גמוק, אולי היו שתי שגיעות אבל זה בגלל התיקון האוטומטי',
  },
  {
    label: 'אבא — נחתנו כעת (הגשה חזקה)',
    playerName: 'אבא',
    missionTitle: 'נחתנו כעת',
    missionDescription:
      'כתבו דיווח הגעה לצימר בסגנון הליווי הצמוד של אבא מהטיסות: עדכוני דרך, אחוזי מזוודות, ואפס נקודות.',
    text: 'יצאנו כעת מפתח תקווה לפי וויז 1132 בצומת גולני עצרנו בארומה תחנה ראשונה נחתנו כעת באמירי הגליל הגיעו 7 מתוך 8 בוטמנים סהכ אחוז מרשים טל בדרך נפרדת כרגיל התפקדו',
  },
];

async function main() {
  for (const c of CASES) {
    console.log(`\n=== ${c.label} ===`);
    const t0 = Date.now();
    const result = await judgeSubmission(c);
    console.log(`(judged in ${((Date.now() - t0) / 1000).toFixed(1)}s, avg ${result.avg})`);
    for (const v of result.verdicts) {
      const j = JUDGES.find((x) => x.id === v.judge)!;
      console.log(`\n${j.emoji} ${j.name} — ${v.score}/10`);
      console.log(v.comment);
    }
  }
}

main().catch((e) => {
  console.error('FAILED:', e?.message || e);
  process.exit(1);
});
