import { getDateStringISO } from '$lib/dateUtils';
import type { GameWin } from '$lib/types';
import type { Chart } from 'chart.js';

export function seedResults(gamesCount: number): GameWin[] {
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

    const result: GameWin = {
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

export let gameWins = $state<GameWin[]>(seedResults(5));

export const getMartinRoundWins = () => gameWins.map((x) => x.martinRoundWins);

export const getArvidRoundWins = () => gameWins.map((x) => x.arvidRoundWins);

export const getMartinGameWins = () =>
  gameWins.filter((x) => x.winner === 'martin').length;

export const getArvidGameWins = () =>
  gameWins.filter((x) => x.winner === 'arvid').length;
