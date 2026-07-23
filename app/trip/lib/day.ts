import { TRIP_DATES } from '../content/missions';

export interface DayInfo {
  day: 1 | 2 | 3;
  isLive: boolean;
}

/** Today's date (YYYY-MM-DD) in Asia/Jerusalem. */
export function jerusalemToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
  }).format(new Date());
}

/** Current trip day. Before the trip: day 1 in preview mode (isLive false).
 * An admin dayOverride always wins. */
export function currentDay(override?: 1 | 2 | 3 | null): DayInfo {
  if (override) return { day: override, isLive: true };
  const today = jerusalemToday();
  if (today < TRIP_DATES[1]) return { day: 1, isLive: false };
  if (today >= TRIP_DATES[3]) return { day: 3, isLive: true };
  if (today >= TRIP_DATES[2]) return { day: 2, isLive: true };
  return { day: 1, isLive: true };
}
