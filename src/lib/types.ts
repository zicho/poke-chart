import type { DateValue } from '@internationalized/date';

export type PlayerDeprecated = 'martin' | 'arvid';

export type GameWinDeprecated = {
  winner: PlayerDeprecated;
  dateStamp: string;
  martinRoundWins: number;
  martinAces: number;
  arvidRoundWins: number;
  arvidAces: number;
};

export type Player = {
  id: string; // uuid
  name: string;
  gameWins: number;
  roundWins: number;
  aces: number;
};

export type PlayerResult = {
  playerId: string;
  roundWins: number;
  aces: number;
};

export type GameResult = {
  winner: PlayerResult;
  loser: PlayerResult;
  date: DateValue;
};
