import type { Chart } from 'chart.js';
import { gameWins } from './TotalWinState.svelte';

type ChartWrapper = {
  ref?: Chart;
};

export let lineChart = $state<ChartWrapper>({
  ref: undefined
});

export const getRoundWinsByDate = () => {
  const groupedWins = gameWins.reduce(
    (acc, item) => {
      // If the date is not already in the accumulator, initialize it
      if (!acc[item.date.toString()]) {
        acc[item.date.toString()] = {
          playerOneWins: 0,
          playerTwoWins: 0
        };
      }

      // Increment the round win count for each player
      // todo: fix this
      acc[item.date.toString()].playerOneWins += item.winner.roundWins;
      acc[item.date.toString()].playerTwoWins += item.loser.roundWins;

      return acc;
    },
    {} as Record<string, { playerOneWins: number; playerTwoWins: number }>
  );

  return groupedWins;
};

export const getMartinRoundWinsTotal = () =>
  gameWins.reduce((total, game) => total + game.martinRoundWins, 0);

export const getArvidRoundWinsTotal = () =>
  gameWins.reduce((total, game) => total + game.arvidRoundWins, 0);

export const getMartinAcesTotal = () =>
  gameWins.reduce((total, game) => total + game.martinAces, 0);

export const getArvidAcesTotal = () =>
  gameWins.reduce((total, game) => total + game.arvidAces, 0);

const calculateAceRate = (wins: number, totalAces: number) => {
  return totalAces > 0 ? Math.round((totalAces / wins) * 100) : 0;
};

export const getMartinAceRate = () =>
  calculateAceRate(getMartinRoundWinsTotal(), getMartinAcesTotal());
export const getArvidAceRate = () =>
  calculateAceRate(getArvidRoundWinsTotal(), getArvidAcesTotal());

export const getTotalRoundsPlayed = () => {
  const totalRoundsPlayed = gameWins.reduce(
    (acc, game) => acc + game.martinRoundWins + game.arvidRoundWins,
    0
  );

  return totalRoundsPlayed;
};

export const getTotalAces = () => {
  const totalRoundsPlayed = gameWins.reduce(
    (acc, game) => acc + game.martinAces + game.arvidAces,
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

export const getMartinRoundWinRate = () =>
  calculateRoundWinRate(getMartinRoundWinsTotal());
export const getArvidRoundWinRate = () =>
  calculateRoundWinRate(getArvidRoundWinsTotal());
