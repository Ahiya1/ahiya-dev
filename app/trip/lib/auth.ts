// Server-only: personal magic-link tokens derived from the admin password.
// Never import from client components.
import { createHmac, timingSafeEqual } from 'crypto';

/** Deterministic 12-hex-char token for a player's personal link. */
export function playerToken(playerId: string): string {
  return createHmac('sha256', process.env.TRIP_ADMIN_PASSWORD || 'dev')
    .update('trip-player:' + playerId)
    .digest('hex')
    .slice(0, 12);
}

/** Timing-safe check that a token belongs to a player. */
export function verifyPlayer(playerId: string, token: string): boolean {
  const expected = Buffer.from(playerToken(playerId));
  const given = Buffer.from(String(token ?? ''));
  if (given.length !== expected.length) return false;
  return timingSafeEqual(given, expected);
}
