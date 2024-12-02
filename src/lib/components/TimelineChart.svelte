<script lang="ts">
  import {
    barChart,
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

  let barCanvasRef = $state<HTMLCanvasElement>();

  const chartData = getGameWinsByDate();

  const labels = Object.keys(chartData);

  // Step 2: Extract Martin's and Arvid's wins into separate arrays
  const martinWins = labels.map((date) => chartData[date].martinWins);
  const arvidWins = labels.map((date) => chartData[date].arvidWins);

  let martinGameWins: ChartDataset<'line'> = {
    label: 'Player 1',
    data: martinWins,
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    tension: 0.1
  };

  let arvidGameWins: ChartDataset<'line'> = {
    label: 'Player 2',
    data: arvidWins,
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    tension: 0.1
  };

  let lineChartData: ChartData = {
    labels,
    datasets: [martinGameWins, arvidGameWins]
  };

  onMount(() => {
    // Bar Chart Initialization
    barChart.ref = new Chart(barCanvasRef as HTMLCanvasElement, {
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
              text: 'Total wins per day',
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
            text: 'Games won',
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
        }
      }
    });

    ready = true;
  });
</script>

<canvas class="h-full w-full p-6" bind:this={barCanvasRef}></canvas>
