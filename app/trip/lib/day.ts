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

/** A trip day doesn't end at midnight — it runs until noon the next day,
 * so the 01:00 jacuzzi photo still counts for the evening it belongs to.
 * Implemented by shifting the clock back 12h before reading the date. */
const DAY_ROLLOVER_SHIFT_MS = 12 * 60 * 60 * 1000;

/** Current trip day. Before the trip: day 1 in preview mode (isLive false).
 * An admin dayOverride always wins. */
export function currentDay(override?: 1 | 2 | 3 | null): DayInfo {
  if (override) return { day: override, isLive: true };
  // Liveness follows the real calendar (the trip starts on its real
  // morning); the day NUMBER follows the shifted clock (noon rollover).
  if (jerusalemToday() < TRIP_DATES[1]) return { day: 1, isLive: false };
  const effective = jerusalemDateAt(Date.now() - DAY_ROLLOVER_SHIFT_MS);
  if (effective >= TRIP_DATES[3]) return { day: 3, isLive: true };
  if (effective >= TRIP_DATES[2]) return { day: 2, isLive: true };
  return { day: 1, isLive: true };
}
