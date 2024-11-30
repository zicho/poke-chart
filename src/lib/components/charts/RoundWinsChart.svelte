<script lang="ts">
  import { getDateStringISO } from '$lib/dateUtils';
  import {
    getArvidRoundWins,
    getMartinRoundWins,
    lineChart
  } from '$lib/state/RoundWinsState.svelte';
  import { Utils } from '$lib/utils';
  import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
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
    LinearScale,
    LineController,
    LineElement,
    PointElement
  );

  let lineCanvasRef = $state<HTMLCanvasElement>();

  let opts = {
    fill: false,
    pointStyle: 'circle',
    pointRadius: 5,
    pointHoverRadius: 10,
    cursor: 'pointer',
    tension: 0.15
  };

  let martinRoundWins: ChartDataset<'line'> = {
    label: 'Martin',
    data: getMartinRoundWins(),
    borderColor: Utils.CHART_COLORS.red,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.2),
    ...opts
  };

  let arvidRoundWins: ChartDataset<'line'> = {
    label: 'Arvid',
    data: getArvidRoundWins(),
    borderColor: Utils.CHART_COLORS.green,
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.2),
    ...opts
  };

  const generateLabels = (length: number): string[] => {
    return Array.from({ length }, () => getDateStringISO());
  };

  let lineChartData: ChartData = {
    labels: generateLabels(martinRoundWins.data.length),
    datasets: [martinRoundWins, arvidRoundWins]
  };

  onMount(() => {
    lineChart.ref = new Chart(lineCanvasRef as HTMLCanvasElement, {
      type: 'line',
      data: lineChartData,
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
                return `Game played at ${tooltipItem[0].label}`;
              }
            }
          },
          title: {
            display: true,
            text: 'Rounds won',
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
        scales: {
          x: {
            type: 'category'
          },
          y: {
            type: 'linear',
            beginAtZero: false,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Rounds won per game',
              font: {
                size: 18,
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

<canvas class="h-full w-full p-6" bind:this={lineCanvasRef}></canvas>
