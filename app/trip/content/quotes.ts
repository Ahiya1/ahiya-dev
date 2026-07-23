import type { PlayerId } from './players';

export interface TriviaQuote {
  id: string;
  day: 1 | 2 | 3;
  quote: string;
  answer: PlayerId;
}

/** "מי אמר את זה" — real quotes from seven years of הבוטמנים.
 * Curated: nothing from the AVOID list, nothing embarrassing-not-fun. */
export const TRIVIA: TriviaQuote[] = [
  // Day 1
  { id: 't1', day: 1, quote: 'נקנה לך סוס', answer: 'abba' },
  { id: 't2', day: 1, quote: 'היה מצלמות בתקופת הדינוזאורים?', answer: 'netanel' },
  { id: 't3', day: 1, quote: 'אני צריכה ממך עזרה... אני תקועה באמבטיה', answer: 'hillel' },
  { id: 't4', day: 1, quote: 'בגדול / אוכלים / ישנים / אוכלים / ישנים / אוכלים', answer: 'shir' },
  { id: 't5', day: 1, quote: 'ריבה רגיל זה מגעיל', answer: 'ima' },

  // Day 2
  { id: 't6', day: 2, quote: 'אני מצאתי דרך יותר טובה להתפלל בראש השנה. עושה באנגי', answer: 'tal' },
  { id: 't7', day: 2, quote: 'P=np', answer: 'moshe' },
  { id: 't8', day: 2, quote: 'זכוכית אולי תישבר, אבל סיליקון ישבור', answer: 'ahiya' },
  { id: 't9', day: 2, quote: 'שנים חשבתם שכשאתם מסיימים חבילת וופלים ומחזירים את העטיפה הריקה למגירה - העטיפה מתכלה מעצמה. אז לא.', answer: 'abba' },
  { id: 't10', day: 2, quote: 'אני לא יודע מה איתכם אבל אני עשיתי 100 שקל בדקה', answer: 'netanel' },

  // Day 3
  { id: 't11', day: 3, quote: 'אני הכי מתוקה', answer: 'hillel' },
  { id: 't12', day: 3, quote: 'מי שבמקלחת שיזדרז / יש לי פיפי ואני רוצה לצחצח שיניים', answer: 'shir' },
  { id: 't13', day: 3, quote: 'הייתי בטוח שהחיים שלי יפים כשהיו שזיפים היום בחדר האוכל. אבל זה בהחלט נותן פרופורציה.', answer: 'moshe' },
  { id: 't14', day: 3, quote: 'מה היה הלחץ להוליד אותי ב2000', answer: 'tal' },
  { id: 't15', day: 3, quote: 'ב"ה, זכיתי לרחף בעולמות עליונים', answer: 'ima' },
];

export const triviaForDay = (day: 1 | 2 | 3) => TRIVIA.filter((t) => t.day === day);
export const POINTS_PER_CORRECT = 2;
