export type PlayerId =
  | 'abba'
  | 'ima'
  | 'shir'
  | 'moshe'
  | 'tal'
  | 'ahiya'
  | 'netanel'
  | 'hillel';

export interface Player {
  id: PlayerId;
  name: string; // display name, Hebrew
  emoji: string;
}

export const PLAYERS: Player[] = [
  { id: 'abba', name: 'אבא', emoji: '👏' },
  { id: 'ima', name: 'אמא', emoji: '💞' },
  { id: 'shir', name: 'שיר', emoji: '😍' },
  { id: 'moshe', name: 'משה', emoji: '🦷' },
  { id: 'tal', name: 'טל', emoji: '😎' },
  { id: 'ahiya', name: 'אחיה', emoji: '🐙' },
  { id: 'netanel', name: 'נתנאל', emoji: '🍫' },
  { id: 'hillel', name: 'הלל', emoji: '✨' },
];

export const playerById = (id: string): Player | undefined =>
  PLAYERS.find((p) => p.id === id);
