import { getDateStringISO } from '$lib/dateUtils';
import type { GameWin as GameResults, Player } from '$lib/types';
import type { Chart } from 'chart.js';
import { lineChart } from './RoundWinsState.svelte';
import { currentDate, dataInterval } from './AppState.svelte';
import { getLocalTimeZone } from '@internationalized/date';

export function seedResults(gamesCount: number): GameResults[] {
  const wins = [];

  for (let i = 0; i < gamesCount; i++) {
    let playerOneRoundWins = 0;
    let playerTwoRoundWins = 0;

    let playerOneAces = 0;
    let playerTwoAces = 0;

    while (playerOneRoundWins < 3 && playerTwoRoundWins < 3) {
      const ace = Math.random() < 0.05;

      if (Math.random() < 0.5) {
        playerOneRoundWins++;
        if (ace) playerOneAces++;
      } else {
        playerTwoRoundWins++;
        if (ace) playerTwoAces++;
      }
    }

    // Determine whether to add a day with 50% chance
    const dayOffset = Math.random() < 0.5 ? 1 : 0;

    const result: GameResults = {
      playerTwoRoundWins,
      playerOneRoundWins,
      playerTwoAces,
      playerOneAces,
      winner:
        playerOneRoundWins > playerTwoRoundWins ? 'playerOne' : 'playerTwo',
      // Only add a day 50% of the time
      dateStamp: getDateStringISO(i + dayOffset)
    };

    currentDate.value = result.dateStamp;

    wins.push(result);
  }

  return wins;
}

type ChartWrapper = {
  ref?: Chart;
};

export const barChart = $state<ChartWrapper>({
  ref: undefined
});

export const gameWins = $state<GameResults[]>(seedResults(10));

export const filteredWins = (() => {
  const from = new Date(dataInterval.from.toDate(getLocalTimeZone()));
  const to = new Date(dataInterval.to.toDate(getLocalTimeZone()));

  const filteredGames = gameWins.filter((x) => {
    const date = new Date(x.dateStamp);
    return date >= from && date <= to; // Check if it's in the range
  });

  return filteredGames;
})();

export const getGameWinsByDate = () => {
  const groupedWins = filteredWins.reduce(
    (acc, item) => {
      // If the date is not already in the accumulator, initialize it
      if (!acc[item.dateStamp]) {
        acc[item.dateStamp] = {
          playerOneWins: 0,
          playerTwoWins: 0
        };
      }

      // Increment the win count for the winner
      if (item.winner === 'playerOne') {
        acc[item.dateStamp].playerOneWins++;
      } else if (item.winner === 'playerTwo') {
        acc[item.dateStamp].playerTwoWins++;
      }

      return acc;
    },
    {} as Record<string, { playerOneWins: number; playerTwoWins: number }>
  );

  return groupedWins;
};

export const getPlayerGameWins = (player: Player) =>
  gameWins.filter((x) => x.winner === player);

export const getPlayerGameWinsTotal = (player: Player) =>
  getPlayerGameWins(player).length;

export function addGameResults(results: GameResults) {
  gameWins.push(results);

  if (!lineChart?.ref?.data) {
    console.error('Line chart is not initialized');
    return;
  }

  lineChart.ref.data.labels = lineChart.ref.data.labels || [];
  lineChart.ref.data.labels.push(results.dateStamp);

  lineChart.ref.data.datasets[0].data.push(results.playerOneRoundWins);
  lineChart.ref.data.datasets[1].data.push(results.playerTwoRoundWins);

  if (!barChart?.ref?.data) {
    console.error('Bar chart is not initialized');
    return;
  }

  barChart.ref.data.labels = barChart.ref.data.labels || [];

  if (!barChart.ref.data.labels.length) {
    barChart.ref.data.labels.push(results.dateStamp);
    barChart.ref.update();
  }

  const lastIndex = barChart.ref.data.labels.length - 1;

  const playerOneData = barChart.ref.data.datasets[0]?.data;
  const playerTwoData = barChart.ref.data.datasets[1]?.data;

  if (!Array.isArray(playerOneData) || !Array.isArray(playerTwoData)) {
    console.error('Bar chart datasets are not properly initialized');
    return;
  }

  const playerOneWins =
    typeof playerOneData[lastIndex] === 'number' ? playerOneData[lastIndex] : 0;
  const playerTwoWins =
    typeof playerTwoData[lastIndex] === 'number' ? playerTwoData[lastIndex] : 0;

  if (results.winner === 'playerOne') {
    playerOneData[lastIndex] = playerOneWins + 1;
  } else {
    playerTwoData[lastIndex] = playerTwoWins + 1;
  }

  lineChart.ref.update();
  barChart.ref.update();
}

export const getPlayerGameWinRate = (player: Player) =>
  calculateWinRate(getPlayerGameWinsTotal(player));

const calculateWinRate = (wins: number) => {
  const totalGames = gameWins.length;
  return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
};

export const getLatestGameWinner = (): Player | null => {
  if (!gameWins.length) return null;
  return gameWins[gameWins.length - 1].winner;
};

export const getLatestGameDate = (): string => {
  if (!gameWins.length) return 'None played yet!';
  return gameWins[gameWins.length - 1].dateStamp;
};

export const getTotalGamesPlayed = (): number => gameWins.length;
