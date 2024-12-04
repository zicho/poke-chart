<script lang="ts">
  import { getRoundWinsByDate } from '$lib/state/RoundWinsState.svelte';
  import { getGameWinsByDate } from '$lib/state/TotalWinState.svelte';
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
  import Button from './ui/button/button.svelte';

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

  let playerOneGameTotal = 0;
  let playerTwoGameTotal = 0;

  let mode = $state<'all' | 'games' | 'rounds'>('all');

  const cumulativeGameData = sortedDates.map((date) => {
    playerOneGameTotal += gameWinsData[date].playerOneWins;
    playerTwoGameTotal += gameWinsData[date].playerTwoWins;

    return {
      date,
      playerOneGameTotal,
      playerTwoGameTotal
    };
  });

  let playerOneRoundTotal = 0;
  let playerTwoRoundTotal = 0;

  const cumulativeRoundData = sortedDates.map((date) => {
    playerOneRoundTotal += roundWinsData[date].playerOneRoundWins;
    playerTwoRoundTotal += roundWinsData[date].playerTwoRoundWins;

    return {
      date,
      playerOneRoundTotal,
      playerTwoRoundTotal
    };
  });

  const tension = 0.1;
  const borderDash = [5, 5];

  let playerOneGameWinsDataset: ChartDataset<'line'> = {
    label: 'Player 1 - Game Wins',
    data: cumulativeGameData.map((x) => x.playerOneGameTotal),
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    tension
  };

  let playerOneRoundWinsDataset: ChartDataset<'line'> = {
    label: 'Player 1 - Round Wins',
    data: cumulativeRoundData.map((x) => x.playerOneRoundTotal),
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    borderDash,
    tension,
    yAxisID: 'y2' // Link this dataset to the secondary Y-axis
  };

  let playerTwoGameWinsDataset: ChartDataset<'line'> = {
    label: 'Player 2 - Game Wins',
    data: cumulativeGameData.map((x) => x.playerTwoGameTotal),
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    tension
  };

  let playerTwoRoundWinsDataset: ChartDataset<'line'> = {
    label: 'Player 2 - Round Wins',
    data: cumulativeRoundData.map((x) => x.playerTwoRoundTotal),
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    borderDash,
    tension,
    yAxisID: 'y2' // Link this dataset to the secondary Y-axis
  };

  let datasets = [
    playerOneGameWinsDataset,
    playerOneRoundWinsDataset,
    playerTwoGameWinsDataset,
    playerTwoRoundWinsDataset
  ];

  $effect(() => {
    if (!lineChart) return;

    if (mode === 'all') {
      lineChart.data.datasets = [
        playerOneGameWinsDataset,
        playerOneRoundWinsDataset,
        playerTwoGameWinsDataset,
        playerTwoRoundWinsDataset
      ];
    } else if (mode === 'games') {
      lineChart.data.datasets = [
        playerOneGameWinsDataset,
        playerTwoGameWinsDataset
      ];
    } else {
      lineChart.data.datasets = [
        playerOneRoundWinsDataset,
        playerTwoRoundWinsDataset
      ];
    }

    lineChart?.update();
  });

  let lineChartData: ChartData = {
    labels: sortedDates,
    datasets
  };

  let lineChart = $state<Chart>();

  onMount(() => {
    // Line Chart Initialization with Multiple Y-Axes
    lineChart = new Chart(canvasRef as HTMLCanvasElement, {
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
            text: 'Game & round wins timeline',
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

<div class="box-border flex h-full w-full flex-col justify-between p-6 pb-16">
  <canvas bind:this={canvasRef} class="flex-grow"></canvas>

  <div class="flex space-x-4">
    <Button
      onclick={() => (mode = 'all')}
      variant={mode === 'all' ? 'default' : 'outline'}
      class="mt-4 flex-1">All data</Button
    >
    <Button
      onclick={() => (mode = 'games')}
      variant={mode === 'games' ? 'default' : 'outline'}
      class="mt-4 flex-1">Game data</Button
    >
    <Button
      onclick={() => (mode = 'rounds')}
      variant={mode === 'rounds' ? 'default' : 'outline'}
      class="mt-4 flex-1">Round data</Button
    >
  </div>
</div>
