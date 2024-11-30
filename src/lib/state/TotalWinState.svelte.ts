import { getDateStringISO } from '$lib/dateUtils';
import type { GameWin as GameResults, Winner } from '$lib/types';
import type { Chart } from 'chart.js';
import { lineChart } from './RoundWinsState.svelte';

export function seedResults(gamesCount: number): GameResults[] {
  let martinWinsTotal = 0;
  let arvidWinsTotal = 0;

  let wins = [];

  for (let i = 0; i < gamesCount; i++) {
    let martinRoundWins = 0;
    let arvidRoundWins = 0;

    while (martinRoundWins < 3 && arvidRoundWins < 3) {
      if (Math.random() < 0.5) {
        martinRoundWins++;
      } else {
        arvidRoundWins++;
      }
    }

    martinWinsTotal += martinRoundWins;
    arvidWinsTotal += arvidRoundWins;

    const result: GameResults = {
      arvidRoundWins,
      martinRoundWins,
      arvidAces: 0,
      martinAces: 0,
      winner: martinRoundWins > arvidRoundWins ? 'martin' : 'arvid',
      dateStamp: getDateStringISO()
    };

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

export let gameWins = $state<GameResults[]>(seedResults(5));

export const getMartinGameWins = () =>
  gameWins.filter((x) => x.winner === 'martin').length;

export const getArvidGameWins = () =>
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

  console.log(
    'barChart.ref.data.labels.length',
    barChart.ref.data.labels.length
  );

  if (!barChart.ref.data.labels.length) {
    console.log('adding label');
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

export const getMartinWinRate = () => calculateWinRate(getMartinGameWins());
export const getArvidWinRate = () => calculateWinRate(getArvidGameWins());

const calculateWinRate = (wins: number) => {
  const totalGames = gameWins.length;
  return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
};

export const getLatestGameWinner = (): Winner | null => {
  if (!gameWins.length) return null;
  return gameWins[gameWins.length - 1].winner;
};
