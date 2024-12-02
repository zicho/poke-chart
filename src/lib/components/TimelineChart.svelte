<script lang="ts">
  import { getRoundWinsByDate } from '$lib/state/RoundWinsState.svelte';
  import {
    barChart as lineChart,
    gameWins,
    getGameWinsByDate
  } from '$lib/state/TotalWinState.svelte';
  import { Utils } from '$lib/utils';
  import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
    type ChartData,
    type ChartDataset
  } from 'chart.js';
  import { onMount } from 'svelte';

  let { ready = $bindable() }: { ready: boolean } = $props();

  // Register necessary controllers and elements
  Chart.register(
    Tooltip,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    LineController,
    LineElement,
    PointElement
  );

  let canvasRef = $state<HTMLCanvasElement>();

  const gameWinsData = getGameWinsByDate();
  const roundWinsData = getRoundWinsByDate();

  const sortedDates = Object.keys(gameWinsData).sort();

  let martinGameTotal = 0;
  let arvidGameTotal = 0;

  const cumulativeGameData = sortedDates.map((date) => {
    martinGameTotal += gameWinsData[date].martinWins;
    arvidGameTotal += gameWinsData[date].arvidWins;

    return {
      date,
      martinGameTotal,
      arvidGameTotal
    };
  });

  let martinRoundTotal = 0;
  let arvidRoundTotal = 0;

  const cumulativeRoundData = sortedDates.map((date) => {
    martinRoundTotal += roundWinsData[date].martinRoundWins;
    arvidRoundTotal += roundWinsData[date].arvidRoundWins;

    return {
      date,
      martinRoundTotal,
      arvidRoundTotal
    };
  });

  const tension = 0.1;
  const borderDash = [5, 5];

  let martinGameWinsDataset: ChartDataset<'line'> = {
    label: 'Player 1 - Game Wins',
    data: cumulativeGameData.map((x) => x.martinGameTotal),
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    tension
  };

  let martinRoundWinsDataset: ChartDataset<'line'> = {
    label: 'Player 1 - Round Wins',
    data: cumulativeRoundData.map((x) => x.martinRoundTotal),
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    borderDash,
    tension,
    yAxisID: 'y2' // Link this dataset to the secondary Y-axis
  };

  let arvidGameWinsDataset: ChartDataset<'line'> = {
    label: 'Player 2 - Game Wins',
    data: cumulativeGameData.map((x) => x.arvidGameTotal),
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    tension
  };

  let arvidRoundWinsDataset: ChartDataset<'line'> = {
    label: 'Player 2 - Round Wins',
    data: cumulativeRoundData.map((x) => x.arvidRoundTotal),
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    borderDash,
    tension,
    yAxisID: 'y2' // Link this dataset to the secondary Y-axis
  };

  let lineChartData: ChartData = {
    labels: sortedDates,
    datasets: [
      martinGameWinsDataset,
      martinRoundWinsDataset,
      arvidGameWinsDataset,
      arvidRoundWinsDataset
    ]
  };

  onMount(() => {
    // Line Chart Initialization with Multiple Y-Axes
    lineChart.ref = new Chart(canvasRef as HTMLCanvasElement, {
      type: 'line',
      data: lineChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category'
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Game Wins',
              font: {
                size: 18,
                weight: 'bold'
              }
            }
          },
          y2: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Round Wins',
              font: {
                size: 18,
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Games won timeline',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: {
              bottom: 20
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 18
              }
            }
          }
        }
      }
    });

    ready = true;
  });
</script>

<canvas class="h-full w-full p-6" bind:this={canvasRef}></canvas>
