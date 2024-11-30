<script lang="ts">
  import { getDateStringISO } from '$lib/dateUtils';
  import {
    getArvidRoundWins,
    getMartinRoundWins,
    lineChart
  } from '$lib/state/RoundWinsState.svelte';
  import type { ChartData, ChartDataSet } from '$lib/types';
  import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip
  } from 'chart.js';
  import { onMount } from 'svelte';

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

  let lineCanvasRef = $state<HTMLCanvasElement>();

  let martinRoundWins: ChartDataSet = {
    label: 'Martin',
    data: getMartinRoundWins(),
    backgroundColor: 'red',
    borderColor: 'red',
    fill: false
  };

  let arvidRoundWins: ChartDataSet = {
    label: 'Arvid',
    data: getArvidRoundWins(),
    backgroundColor: 'green',
    borderColor: 'green',
    fill: false
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
              // Customize the label content
              label: function (tooltipItem) {
                console.dir(tooltipItem.chart.data);
                // tooltipItem contains the data for the tooltip
                const label = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw; // the value of the data point
                return `${label}: ${value} wins`;
              },
              // Customize the title content (optional)
              title: function (tooltipItem) {
                return `Custom Title: ${tooltipItem[0].label}`;
              }
            }
          }
        },
        responsive: true,
        scales: {
          x: {
            type: 'category',
            title: { display: true, text: 'Day' }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Total round wins' }
          }
        }
      }
    });
  });
</script>

<canvas class="h-full w-full" bind:this={lineCanvasRef}></canvas>
