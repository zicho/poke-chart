import type { Chart } from 'chart.js';
import { gameWins } from './TotalWinState.svelte';

type ChartWrapper = {
  ref?: Chart;
};

export let lineChart = $state<ChartWrapper>({
  ref: undefined
});

export const getPlayerOneRoundWins = () =>
  gameWins.map((x) => x.playerOneRoundWins);
export const getPlayerTwoRoundWins = () =>
  gameWins.map((x) => x.playerTwoRoundWins);

export const getRoundWinsByDate = () => {
  const groupedWins = gameWins.reduce(
    (acc, item) => {
      // If the date is not already in the accumulator, initialize it
      if (!acc[item.dateStamp]) {
        acc[item.dateStamp] = {
          playerOneRoundWins: 0,
          playerTwoRoundWins: 0
        };
      }

      // Increment the round win count for each player
      acc[item.dateStamp].playerOneRoundWins += item.playerOneRoundWins;
      acc[item.dateStamp].playerTwoRoundWins += item.playerTwoRoundWins;

      return acc;
    },
    {} as Record<
      string,
      { playerOneRoundWins: number; playerTwoRoundWins: number }
    >
  );

  return groupedWins;
};

export const getPlayerOneRoundWinsTotal = () =>
  gameWins.reduce((total, game) => total + game.playerOneRoundWins, 0);

export const getPlayerTwoRoundWinsTotal = () =>
  gameWins.reduce((total, game) => total + game.playerTwoRoundWins, 0);

export const getPlayerOneAcesTotal = () =>
  gameWins.reduce((total, game) => total + game.playerOneAces, 0);

export const getPlayerTwoAcesTotal = () =>
  gameWins.reduce((total, game) => total + game.playerTwoAces, 0);

const calculateAceRate = (wins: number, totalAces: number) => {
  return totalAces > 0 ? Math.round((totalAces / wins) * 100) : 0;
};

export const getPlayerOneAceRate = () =>
  calculateAceRate(getPlayerOneRoundWinsTotal(), getPlayerOneAcesTotal());
export const getPlayerTwoAceRate = () =>
  calculateAceRate(getPlayerTwoRoundWinsTotal(), getPlayerTwoAcesTotal());

export const getTotalRoundsPlayed = () => {
  const totalRoundsPlayed = gameWins.reduce(
    (acc, game) => acc + game.playerOneRoundWins + game.playerTwoRoundWins,
    0
  );

  return totalRoundsPlayed;
};

export const getTotalAces = () => {
  const totalRoundsPlayed = gameWins.reduce(
    (acc, game) => acc + game.playerOneAces + game.playerTwoAces,
    0
  );

  return totalRoundsPlayed;
};

export const getTotalAceRate = () =>
  calculateAceRate(getTotalRoundsPlayed(), getTotalAces());

const calculateRoundWinRate = (wins: number) => {
  const totalRounds = getTotalRoundsPlayed();
  return totalRounds > 0 ? Math.round((wins / totalRounds) * 100) : 0;
};

export const getPlayerOneRoundWinRate = () =>
  calculateRoundWinRate(getPlayerOneRoundWinsTotal());
export const getPlayerTwoRoundWinRate = () =>
  calculateRoundWinRate(getPlayerTwoRoundWinsTotal());
