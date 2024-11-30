export type Winner = 'martin' | 'arvid';

export type GameWin = {
  winner: Winner;
  dateStamp: string;
  martinRoundWins: number;
  martinAces: number;
  arvidRoundWins: number;
  arvidAces: number;
};
