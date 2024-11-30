import type { Chart } from 'chart.js';
import { gameWins } from './TotalWinState.svelte';

type ChartWrapper = {
  ref?: Chart;
};

export let lineChart = $state<ChartWrapper>({
  ref: undefined
});

export const getMartinRoundWins = () => gameWins.map((x) => x.martinRoundWins);
export const getArvidRoundWins = () => gameWins.map((x) => x.arvidRoundWins);
