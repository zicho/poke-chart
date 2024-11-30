export type ChartData = {
  labels: string[];
  datasets: ChartDataSet[];
};

export type ChartDataSet = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor?: string;
  fill?: boolean;
};

export type Winner = 'martin' | 'arvid';

export type GameWin = {
  winner: Winner;
  dateStamp: string;
  martinRoundWins: number;
  martinAces: number;
  arvidRoundWins: number;
  arvidAces: number;
};
