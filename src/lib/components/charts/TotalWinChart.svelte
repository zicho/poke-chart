<script lang="ts">
  import { dataInterval } from '$lib/state/AppState.svelte';
  import {
    barChart,
    gameWins,
    getGameWinsByDate
  } from '$lib/state/TotalWinState.svelte';
  import { Utils } from '$lib/utils';
  import { getLocalTimeZone } from '@internationalized/date';
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

  let martinGameWins: ChartDataset<'bar'> = {
    label: 'Player 1',
    data: martinWins,
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    borderRadius: 10
  };

  let arvidGameWins: ChartDataset<'bar'> = {
    label: 'Player 2',
    data: arvidWins,
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    borderRadius: 10
  };

  const date1 = new Date(dataInterval.from.toDate(getLocalTimeZone()));
  const date2 = new Date(dataInterval.to.toDate(getLocalTimeZone()));

  console.dir(date1);

  const filteredLabels = labels.filter((x) => {
    const date = new Date(x); // Convert the string to a Date object
    return date >= date1 && date <= date2; // Check if it's in the range
  });

  console.dir(filteredLabels);

  let barChartData: ChartData = {
    labels,
    datasets: [martinGameWins, arvidGameWins]
  };

  onMount(() => {
    // Bar Chart Initialization
    barChart.ref = new Chart(barCanvasRef as HTMLCanvasElement, {
      type: 'bar',
      data: barChartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
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
