import { TRIP_DATES } from '../content/missions';

export interface DayInfo {
  day: 1 | 2 | 3;
  isLive: boolean;
}

/** The date (YYYY-MM-DD) in Asia/Jerusalem at a given moment. */
function jerusalemDateAt(ms: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
  }).format(new Date(ms));
}

/** Today's date (YYYY-MM-DD) in Asia/Jerusalem. */
export function jerusalemToday(): string {
  return jerusalemDateAt(Date.now());
}

/** Current trip day, on the real Jerusalem calendar: a new day's missions
 * open at midnight. Before the trip: day 1 in preview mode (isLive false).
 * An admin dayOverride always wins. */
export function currentDay(override?: 1 | 2 | 3 | null): DayInfo {
  if (override) return { day: override, isLive: true };
  const today = jerusalemToday();
  if (today < TRIP_DATES[1]) return { day: 1, isLive: false };
  if (today >= TRIP_DATES[3]) return { day: 3, isLive: true };
  if (today >= TRIP_DATES[2]) return { day: 2, isLive: true };
  return { day: 1, isLive: true };
}

/** The trivia day lags 12h behind the calendar: yesterday's quiz stays
 * answerable until 12:00 today (late-night evenings deserve a morning
 * grace window), and today's quiz appears at noon. Missions are NOT
 * affected — they open at midnight via currentDay. */
const TRIVIA_GRACE_MS = 12 * 60 * 60 * 1000;

export function currentTriviaDay(override?: 1 | 2 | 3 | null): 1 | 2 | 3 {
  if (override) return override;
  if (jerusalemToday() < TRIP_DATES[1]) return 1;
  const effective = jerusalemDateAt(Date.now() - TRIVIA_GRACE_MS);
  if (effective >= TRIP_DATES[3]) return 3;
  if (effective >= TRIP_DATES[2]) return 2;
  return 1;
}
