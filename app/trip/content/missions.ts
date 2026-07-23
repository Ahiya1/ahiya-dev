import type { PlayerId } from './players';

export type MissionType = 'photo' | 'text';

export interface Mission {
  id: string;
  day: 1 | 2 | 3; // 1=Wed 29.7, 2=Thu 30.7, 3=Fri 31.7
  type: MissionType;
  title: string;
  description: string;
  personalFor?: PlayerId; // personal missions: only this player sees & submits it
}

export const TRIP_DATES: Record<1 | 2 | 3, string> = {
  1: '2026-07-29',
  2: '2026-07-30',
  3: '2026-07-31',
};

export const MISSIONS: Mission[] = [
  // ---- Day 1: Wednesday, arrival ----
  {
    id: 'd1-family-photo',
    day: 1,
    type: 'photo',
    title: 'הכי יפים באמירי הגליל',
    description:
      'התמונה המשפחתית הראשונה של הטיול. כמה שיותר בוטמנים בפריים, כמה שיותר גליל ברקע. השופטים מודדים קומפוזיציה, חיוכים, ומי מצמץ.',
  },
  {
    id: 'd1-arrival-time',
    day: 1,
    type: 'photo',
    title: 'שעון בוטמן תקני',
    description:
      'צלמו הוכחה לשעת ההגעה האמיתית שלכם (שעון, וויז, כל ראיה קבילה). השופטים ישוו לשעה שאבא הכריז עליה. דיוק יתוגמל. איחור אופייני יתועד לדורות.',
  },
  {
    id: 'd1-nahatnu',
    day: 1,
    type: 'text',
    title: 'נחתנו כעת',
    description:
      'כתבו דיווח הגעה לצימר בסגנון הליווי הצמוד של אבא מהטיסות: עדכוני דרך, אחוזי מזוודות, וכל משפט נגמר בנקודה. השופטים מעריכים נאמנות לסגנון.',
  },

  // ---- Day 2: Thursday, full day ----
  {
    id: 'd2-airborne',
    day: 2,
    type: 'photo',
    title: 'כולם באוויר',
    description:
      'תמונה שבה כמה שיותר בני משפחה באוויר בו־זמנית. רגליים על הקרקע = נקודות יורדות. סבא־סטייל קפיצה סמלית מתקבלת בהבנה.',
  },
  {
    id: 'd2-forgery',
    day: 2,
    type: 'text',
    title: 'זיוף כתב יד',
    description:
      'כתבו הודעה קצרה בסגנון של בן משפחה אחר (ציינו מי!). השופטים, שקראו שבע שנים של הקבוצה, ידרגו אותנטיות. שגיאות כתיב מכוונות במקומות הנכונים = אמנות.',
  },
  {
    id: 'd2-jacuzzi',
    day: 2,
    type: 'photo',
    title: "הג'קוזי הדרמטי",
    description:
      "התמונה הכי דרמטית שאפשר להפיק בג'קוזי של אמירי הגליל. אדים, מבטים לאופק, סלואו־מושן נפשי. השופטים מעריכים מחויבות לרגע.",
  },
  {
    id: 'd2-lachalashim',
    day: 2,
    type: 'photo',
    title: 'זה לחלשים',
    description:
      'מצאו וצלמו דבר אחד בטיול שאבא היה מכריז עליו "זה לחלשים". נימוק קצר יצורף. השופט המחמיר שומר לעצמו את זכות הווטו הדוקטרינרית.',
  },

  // ---- Day 3: Friday, finale ----
  {
    id: 'd3-lobby',
    day: 3,
    type: 'photo',
    title: 'צילום משפחתי בלובי',
    description:
      'המסורת מחייבת: תמונה משפחתית מסודרת בנקודת היציאה, בסגנון "צילום משפחתי בלובי עוד עשר דקות". מי שמארגן את כולם מקבל בונוס אישי מהשופטים.',
  },
  {
    id: 'd3-haiku',
    day: 3,
    type: 'text',
    title: 'הייקו על הטיול',
    description:
      'שלוש שורות, 5-7-5 הברות (בערך, אנחנו משפחה, לא אקדמיה). המשורר שופט את זה אישית ולכן הציפיות גבוהות ולא מובנות.',
  },
  {
    id: 'd3-lift',
    day: 3,
    type: 'photo',
    title: 'אבא מרים את אמא',
    description:
      'המסורת הוותיקה, מהדורת הגליל. כמו פעם: "אני הולך להרים את אמא בהפתעה, תהיו מוכנים עם המצלמה". נקודות על ביצוע, אבל בעיקר על התיעוד.',
  },

  // ---- Personal missions (one per player, submit any day) ----
  {
    id: 'p-abba',
    day: 1,
    type: 'text',
    title: 'משימה אישית: בלי נקודות',
    description:
      'כתוב הודעת ארגון שלמה בלי אף נקודה בסוף משפט. אף לא אחת. אנחנו יודעים בדיוק כמה אנחנו מבקשים ממך, והשופטים ימדדו את הרעד ביד.',
    personalFor: 'abba',
  },
  {
    id: 'p-ima',
    day: 1,
    type: 'text',
    title: "משימה אישית: צום אימוג'י",
    description:
      "כתבי ברכה שלמה ומרגשת בלי אף אימוג'י. אפילו לא 💞 אחד. השופטים ימדדו את עומק ההקרבה.",
    personalFor: 'ima',
  },
  {
    id: 'p-shir',
    day: 1,
    type: 'text',
    title: 'משימה אישית: הודעה אחת',
    description:
      'תמצתי את כל היום להודעה אחת. אחת. לא שתיים. לא חמש. השופטים סופרים, והם יודעים בדיוק כמה הודעות זה בדרך כלל.',
    personalFor: 'shir',
  },
  {
    id: 'p-tal',
    day: 1,
    type: 'text',
    title: 'משימה אישית: אפס שגיאות',
    description:
      'כתוב פסקה שלמה על הטיול בלי שגיאת כתיב אחת. השופטים יבדקו בזכוכית מגדלת. "בסדר גמוק" לא יתקבל הפעם.',
    personalFor: 'tal',
  },
  {
    id: 'p-netanel',
    day: 1,
    type: 'photo',
    title: 'משימה אישית: לא לגעת',
    description:
      'הנח חטיף באזור המשותף עם פתק "לא לגעת", וצלם הוכחה שהוא שרד ארבע שעות. תיעוד לפני + אחרי. שרידות החטיף באחריותך.',
    personalFor: 'netanel',
  },
  {
    id: 'p-hillel',
    day: 1,
    type: 'text',
    title: 'משימה אישית: מילה אחת',
    description:
      'סכמי את הטיול עד כה במילה אחת בדיוק. השופטים ימצאו בה עומק. או שלא. מילה אחת.',
    personalFor: 'hillel',
  },
  {
    id: 'p-moshe',
    day: 1,
    type: 'text',
    title: 'משימה אישית: נימוס קיצוני',
    description:
      'כתוב מחמאה לבן משפחה, כל כך מנומסת שהשופטים יתחילו לחשוד בסרקזם. בונוס: לצרף חידה למשפחה. P=NP לא נחשב, כבר היה.',
    personalFor: 'moshe',
  },
  {
    id: 'p-ahiya',
    day: 3,
    type: 'text',
    title: 'משימה אישית: צחוק מרחוק',
    description:
      'ביום שישי, מרחוק: להצחיק לפחות בן משפחה אחד בהודעה. ההוכחה: צילום מסך של התגובה, או עדות שופטת מוסמכת מהשטח.',
    personalFor: 'ahiya',
  },
];

export const missionById = (id: string): Mission | undefined =>
  MISSIONS.find((m) => m.id === id);

/** Missions visible to a given player on a given day: shared missions of that
 * day (and earlier days — late submissions allowed) + their personal mission. */
export function missionsFor(playerId: PlayerId, day: 1 | 2 | 3): Mission[] {
  return MISSIONS.filter(
    (m) =>
      (!m.personalFor && m.day <= day) ||
      (m.personalFor === playerId && (m.personalFor !== 'ahiya' || day >= 1)),
  );
}
