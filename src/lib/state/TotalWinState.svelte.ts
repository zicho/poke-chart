import { getDateStringISO } from '$lib/dateUtils';
import type { GameWin as GameResults, Winner } from '$lib/types';
import type { Chart } from 'chart.js';
import { lineChart } from './RoundWinsState.svelte';

export let currentDate = $state({
  value: getDateStringISO()
});

export function seedResults(gamesCount: number): GameResults[] {
  let wins = [];

  for (let i = 0; i < gamesCount; i++) {
    let martinRoundWins = 0;
    let arvidRoundWins = 0;

    let martinAces = 0;
    let arvidAces = 0;

    while (martinRoundWins < 3 && arvidRoundWins < 3) {
      let ace = Math.random() < 0.05;

      if (Math.random() < 0.5) {
        martinRoundWins++;
        if (ace) martinAces++;
      } else {
        arvidRoundWins++;
        if (ace) arvidAces++;
      }
    }

    // Determine whether to add a day with 50% chance
    const dayOffset = Math.random() < 0.5 ? 1 : 0;

    const result: GameResults = {
      arvidRoundWins,
      martinRoundWins,
      arvidAces,
      martinAces,
      winner: martinRoundWins > arvidRoundWins ? 'martin' : 'arvid',
      // Only add a day 50% of the time
      dateStamp: getDateStringISO(i + dayOffset)
    };

    currentDate.value = result.dateStamp;

    //@ts-ignore
    wins.push(result);
  }

  return wins;
}

type ChartWrapper = {
  ref?: Chart;
};

export let barChart = $state<ChartWrapper>({
  ref: undefined
});

export let gameWins = $state<GameResults[]>(seedResults(10));

export const getGameWinsByDate = () => {
  const groupedWins = gameWins.reduce(
    (acc, item) => {
      // If the date is not already in the accumulator, initialize it
      if (!acc[item.dateStamp]) {
        acc[item.dateStamp] = {
          martinWins: 0,
          arvidWins: 0
        };
      }

      // Increment the win count for the winner
      if (item.winner === 'martin') {
        acc[item.dateStamp].martinWins++;
      } else if (item.winner === 'arvid') {
        acc[item.dateStamp].arvidWins++;
      }

      return acc;
    },
    {} as Record<string, { martinWins: number; arvidWins: number }>
  );

  return groupedWins;
};

export const getArvidGameWins = () =>
  gameWins.filter((x) => x.winner === 'arvid');

export const getMartinGameWinsTotal = () =>
  gameWins.filter((x) => x.winner === 'martin').length;

export const getArvidGameWinsTotal = () =>
  gameWins.filter((x) => x.winner === 'arvid').length;

export function addGameResults(results: GameResults) {
  gameWins.push(results);

  if (!lineChart?.ref?.data) {
    console.error('Line chart is not initialized');
    return;
  }

  lineChart.ref.data.labels = lineChart.ref.data.labels || [];
  lineChart.ref.data.labels.push(results.dateStamp);

  lineChart.ref.data.datasets[0].data.push(results.martinRoundWins);
  lineChart.ref.data.datasets[1].data.push(results.arvidRoundWins);

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

  const martinData = barChart.ref.data.datasets[0]?.data;
  const arvidData = barChart.ref.data.datasets[1]?.data;

  if (!Array.isArray(martinData) || !Array.isArray(arvidData)) {
    console.error('Bar chart datasets are not properly initialized');
    return;
  }

  const martinWins =
    typeof martinData[lastIndex] === 'number' ? martinData[lastIndex] : 0;
  const arvidWins =
    typeof arvidData[lastIndex] === 'number' ? arvidData[lastIndex] : 0;

  if (results.winner === 'martin') {
    martinData[lastIndex] = martinWins + 1;
  } else {
    arvidData[lastIndex] = arvidWins + 1;
  }

  lineChart.ref.update();
  barChart.ref.update();
}

export const getMartinGameWinRate = () =>
  calculateWinRate(getMartinGameWinsTotal());
export const getArvidGameWinRate = () =>
  calculateWinRate(getArvidGameWinsTotal());

const calculateWinRate = (wins: number) => {
  const totalGames = gameWins.length;
  return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
};

export const getLatestGameWinner = (): Winner | null => {
  if (!gameWins.length) return null;
  return gameWins[gameWins.length - 1].winner;
};

export const getLatestGameDate = (): string => {
  if (!gameWins.length) return 'None played yet!';
  return gameWins[gameWins.length - 1].dateStamp;
};

export const getTotalGamesPlayed = (): number => gameWins.length;
