<script lang="ts">
  import { getDateStringISO } from '$lib/dateUtils';
  import {
    barChart,
    gameWins,
    getArvidGameWins,
    getMartinGameWins
  } from '$lib/state/TotalWinState.svelte';
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

  let barCanvasRef = $state<HTMLCanvasElement>();

  let martinGameWins: ChartDataSet = {
    label: 'Martin',
    data: [getMartinGameWins()],
    backgroundColor: 'red',
    borderColor: 'red',
    fill: false
  };

  let arvidGameWins: ChartDataSet = {
    label: 'Arvid',
    data: [getArvidGameWins()],
    backgroundColor: 'green',
    borderColor: 'green',
    fill: false
  };

  let barChartData: ChartData = {
    labels: [...new Set(gameWins.map((x) => x.dateStamp))],
    datasets: [martinGameWins, arvidGameWins]
  };

  onMount(() => {
    // Bar Chart Initialization
    barChart.ref = new Chart(barCanvasRef as HTMLCanvasElement, {
      type: 'bar',
      data: barChartData,
      options: {
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
            title: { display: true, text: 'Game wins' }
          }
        }
      }
    });
  });
</script>

<canvas class="h-full w-full" bind:this={barCanvasRef}></canvas>
