<script lang="ts">
  import { getDateStringISO } from '$lib/dateUtils';
  import {
    getPlayerTwoRoundWins,
    getPlayerOneRoundWins,
    getRoundWinsByDate,
    lineChart
  } from '$lib/state/RoundWinsState.svelte';
  import { gameWins } from '$lib/state/TotalWinState.svelte';
  import { Utils } from '$lib/utils';
  import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Title,
    Tooltip,
    type ChartData,
    type ChartDataset
  } from 'chart.js';
  import { onMount } from 'svelte';

  let { ready = $bindable() }: { ready: boolean } = $props();

  // Register necessary controllers and elements
  Chart.register(
    Tooltip,
    Legend,
    Title,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale
  );

  let barCanvasRef = $state<HTMLCanvasElement>();

  const chartData = gameWins.map((x) => ({
    dateStamp: x.dateStamp,
    playerOneRoundWins: x.playerOneRoundWins,
    playerTwoRoundWins: x.playerTwoRoundWins
  }));

  const labels = chartData.map((x) => x.dateStamp);

  // Step 2: Extract PlayerOne's and PlayerTwo's wins into separate arrays
  const playerOneWins = chartData.map((x) => x.playerOneRoundWins);
  const playerTwoWins = chartData.map((x) => x.playerTwoRoundWins);

  let playerOneRoundWins: ChartDataset<'bar'> = {
    label: 'Player 1',
    data: playerOneWins,
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    borderWidth: 1,
    borderRadius: 10
  };

  let playerTwoRoundWins: ChartDataset<'bar'> = {
    label: 'Player 2',
    data: playerTwoWins,
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    borderWidth: 1,
    borderRadius: 10
  };

  const generateLabels = (length: number): string[] => {
    return Array.from({ length }, (_, i) => getDateStringISO());
  };

  let barChartData: ChartData<'bar'> = {
    labels,
    datasets: [playerOneRoundWins, playerTwoRoundWins]
  };

  onMount(() => {
    lineChart.ref = new Chart(barCanvasRef as HTMLCanvasElement, {
      type: 'bar',
      data: barChartData,
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const label = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw; // the value of the data point
                return `${label}: ${value} wins`;
              },
              title: function (tooltipItem) {
                return tooltipItem[0].label; // Label for the round
              }
            }
          },
          title: {
            display: true,
            text: 'Rounds won per game',
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
            position: 'bottom', // Adjust legend position if needed
            labels: {
              font: {
                size: 18 // Customize font size
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Wins',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          }
        }
      }
    });

    ready = true;
  });
</script>

<canvas class="h-full w-full p-6" bind:this={barCanvasRef}></canvas>
