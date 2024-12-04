import { getDateStringISO } from '$lib/dateUtils';
import type {
  GameResult,
  GameWinDeprecated as GameResults,
  PlayerDeprecated,
  PlayerResult
} from '$lib/types';
import type { Chart } from 'chart.js';
import { lineChart } from './RoundWinsState.svelte';
import { currentDate, dataInterval, players } from './AppState.svelte';
import { getLocalTimeZone, today } from '@internationalized/date';

export function seedResults(gamesCount: number): GameResults[] {
  const wins = [];

  for (let i = 0; i < gamesCount; i++) {
    let martinRoundWins = 0;
    let arvidRoundWins = 0;

    let martinAces = 0;
    let arvidAces = 0;

    while (martinRoundWins < 3 && arvidRoundWins < 3) {
      const ace = Math.random() < 0.05;

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

    // currentDate.value = result.dateStamp;

    wins.push(result);
  }

  return wins;
}

export function seedResultsRefactor(gamesCount: number): GameResult[] {
  const wins = [];

  for (let i = 0; i < gamesCount; i++) {
    let playerOne: PlayerResult = {
      playerId: players.playerOne.id,
      ...players.playerOne
    };

    let playerTwo: PlayerResult = {
      playerId: players.playerTwo.id,
      ...players.playerTwo
    };

    while (playerOne.roundWins < 3 && playerTwo.roundWins < 3) {
      const ace = Math.random() < 0.05;

      if (Math.random() < 0.5) {
        playerOne.roundWins++;
        if (ace) playerOne.aces++;
      } else {
        playerTwo.roundWins++;
        if (ace) playerOne.aces++;
      }
    }

    // Determine whether to add a day with 50% chance
    const dayOffset = Math.random() < 0.5 ? 1 : 0;

    const result: GameResult = {
      winner: playerOne.roundWins > playerTwo.roundWins ? playerOne : playerTwo,
      loser: playerOne.roundWins < playerTwo.roundWins ? playerOne : playerTwo,
      date: today(getLocalTimeZone()).add({ days: dayOffset ? 1 : 0 })
    };

    currentDate.value = result.date;

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

export const gameWins = $state<GameResult[]>(seedResultsRefactor(10));

export const filteredWins = (() => {
  const filteredGames = gameWins.filter((x) => {
    const date = x.date;
    return date >= dataInterval.from && date <= dataInterval.to; // Check if it's in the range
  });

  return filteredGames;
})();

export const getPlayerGameWins = (winnerId: string) =>
  gameWins.filter((x) => x.winner.playerId === winnerId);

export const getPlayerGameWinCount = (winnerId: string) =>
  getPlayerGameWins(winnerId).length;

export function addGameResults(results: GameResult) {
  gameWins.push(results);

  if (!lineChart?.ref?.data) {
    console.error('Line chart is not initialized');
    return;
  }

  let playerOneRoundWins = 0;
  let playerTwoRoundWins = 0;

  const isPlayerOneWinner = results.winner.playerId === players.playerOne.id;

  playerOneRoundWins = isPlayerOneWinner
    ? results.winner.roundWins
    : results.loser.roundWins;
  playerTwoRoundWins = isPlayerOneWinner
    ? results.loser.roundWins
    : results.winner.roundWins;

  lineChart.ref.data.labels = lineChart.ref.data.labels || [];
  lineChart.ref.data.labels.push(results.date);

  lineChart.ref.data.datasets[0].data.push(playerOneRoundWins);
  lineChart.ref.data.datasets[1].data.push(playerTwoRoundWins);

  if (!barChart?.ref?.data) {
    console.error('Bar chart is not initialized');
    return;
  }

  barChart.ref.data.labels = barChart.ref.data.labels || [];

  if (!barChart.ref.data.labels.length) {
    barChart.ref.data.labels.push(results.date);
    barChart.ref.update();
  }

  const lastIndex = barChart.ref.data.labels.length - 1;

  const playerOneWinData = barChart.ref.data.datasets[0]?.data;
  const playerTwoWinData = barChart.ref.data.datasets[1]?.data;

  if (!Array.isArray(playerOneWinData) || !Array.isArray(playerTwoWinData)) {
    console.error('Bar chart datasets are not properly initialized');
    return;
  }

  const playerOneWins =
    typeof playerOneWinData[lastIndex] === 'number'
      ? playerOneWinData[lastIndex]
      : 0;
  const playerTwoWins =
    typeof playerTwoWinData[lastIndex] === 'number'
      ? playerTwoWinData[lastIndex]
      : 0;

  if (results.winner.playerId === players.playerOne.id) {
    playerOneWinData[lastIndex] = playerOneWins + 1;
  } else {
    playerTwoWinData[lastIndex] = playerTwoWins + 1;
  }

  lineChart.ref.update();
  barChart.ref.update();
}

export const getPlayerGameWinRate = (player: PlayerDeprecated) =>
  calculateWinRate(getPlayerGameWinCount(player));

const calculateWinRate = (wins: number) => {
  const totalGames = gameWins.length;
  return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
};

export const getLatestGameWinner = (): PlayerResult | null => {
  if (!gameWins.length) return null;
  return gameWins[gameWins.length - 1].winner;
};

export const getLatestGameDate = (): string => {
  if (!gameWins.length) return 'None played yet!';
  return gameWins[gameWins.length - 1].date.toString();
};

export const getTotalGamesPlayed = (): number => gameWins.length;
