<script lang="ts">
  import { getDateStringISO } from '$lib/dateUtils';
  import {
    barChart,
    gameWins,
    getArvidGameWins,
    getMartinGameWins
  } from '$lib/state/TotalWinState.svelte';
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

  let martinGameWins: ChartDataset<'bar'> = {
    label: 'Martin',
    data: [getMartinGameWins()],
    backgroundColor: 'red',
    borderColor: 'red',
    borderRadius: 10
  };

  let arvidGameWins: ChartDataset<'bar'> = {
    label: 'Arvid',
    data: [getArvidGameWins()],
    backgroundColor: 'green',
    borderColor: 'green',
    borderRadius: 10
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
