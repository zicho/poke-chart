export type Player = 'playerOne' | 'playerTwo';

export type GameWin = {
  winner: Player;
  dateStamp: string;
  playerOneRoundWins: number;
  playerOneAces: number;
  playerTwoRoundWins: number;
  playerTwoAces: number;
};
