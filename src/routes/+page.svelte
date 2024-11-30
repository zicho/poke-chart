<script lang="ts">
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import RegisterGameDialog from '$lib/dialogs/RegisterGameDialog.svelte';
  import type { ChartData, ChartDataSet, GameResults } from '$lib/types';
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
  let lineCanvasRef = $state<HTMLCanvasElement>();
  let barChart = $state<Chart>();
  let lineChart = $state<Chart>();

  let registerGameModalOpen = $state(false);

  let martinGameWins: ChartDataSet = {
    label: 'Martin',
    data: [],
    backgroundColor: 'red',
    borderColor: 'red',
    fill: false
  };

  let arvidGameWins: ChartDataSet = {
    label: 'Arvid',
    data: [],
    backgroundColor: 'green',
    borderColor: 'green',
    fill: false
  };

  let martinRoundWins: ChartDataSet = {
    label: 'Martin',
    data: [],
    backgroundColor: 'red',
    borderColor: 'red',
    fill: false
  };

  let arvidRoundWins: ChartDataSet = {
    label: 'Arvid',
    data: [],
    backgroundColor: 'green',
    borderColor: 'green',
    fill: false
  };

  const getDate = (addDays: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + addDays);
    return date.toISOString().split('T')[0];
  };

  let barChartData: ChartData = {
    labels: [getDate()],
    datasets: [martinGameWins, arvidGameWins]
  };

  let lineChartData: ChartData = {
    labels: [],
    datasets: [martinRoundWins, arvidRoundWins]
  };

  onMount(() => {
    // Bar Chart Initialization
    barChart = new Chart(barCanvasRef as HTMLCanvasElement, {
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

    // Line Chart Initialization
    lineChart = new Chart(lineCanvasRef as HTMLCanvasElement, {
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

  const addWin = (player: 'Martin' | 'Arvid') => {
    const lastIndex = barChartData.labels.length - 1;
    if (player === 'Martin') {
      barChartData.datasets[0].data[lastIndex]++;
    } else if (player === 'Arvid') {
      barChartData.datasets[1].data[lastIndex]++;
    }

    barChart?.update();
    lineChart?.update();
  };

  const addDay = () => {
    // barChartDataSet.labels.push(getDate(currentDay));
    // currentDay++;
    barChartData.datasets[0].data.push(0);
    barChartData.datasets[1].data.push(0);

    barChart?.update();
    lineChart?.update();
  };

  function registerNewGame() {
    // due to some wrid issue with the data binding i need to explicitly set it to false first in order for it top be opened more than once
    registerGameModalOpen = false;
    registerGameModalOpen = true;
  }

  function seedResults(gamesCount: number) {
    let martinWinsTotal = 0;
    let arvidWinsTotal = 0;

    // Run the specified number of games
    for (let i = 0; i < gamesCount; i++) {
      let martinWins = 0;
      let arvidWins = 0;

      // Simulate a game until one player wins 3 times
      while (martinWins < 3 && arvidWins < 3) {
        if (Math.random() < 0.5) {
          martinWins++;
        } else {
          arvidWins++;
        }
      }

      // Update the total wins for each player
      martinWinsTotal += martinWins;
      arvidWinsTotal += arvidWins;

      // Store the results of the current game
      const results = {
        arvidWins,
        martinWins,
        arvidAces: 0, // You can modify this if needed
        martinAces: 0, // You can modify this if needed
        winner: martinWins > arvidWins ? 'martin' : 'arvid'
      };

      //@ts-ignore
      onSaveResults(results); // Assuming onSaveResults is a function that stores or logs results
    }
  }

  seedResults(20);

  function onSaveResults(results: GameResults): void {
    registerGameModalOpen = false;

    // Add a new label for the new game
    lineChartData.labels.push(getDate());

    if (barChartData.labels.length === 0) {
      barChartData.labels.push(getDate());
    }

    lineChartData.datasets[0].data.push(results.martinWins); // Martin's wins for the new game
    lineChartData.datasets[1].data.push(results.arvidWins); // Arvid's wins for the new game

    const lastIndex = barChartData.labels.length - 1;

    let martinWins = barChartData.datasets[0].data[lastIndex];
    let arvidWins = barChartData.datasets[1].data[lastIndex];

    if (results.winner === 'martin') {
      if (martinWins === undefined) {
        barChartData.datasets[0].data[lastIndex] = 1;
      } else {
        barChartData.datasets[0].data[lastIndex]++;
      }
    } else {
      if (arvidWins === undefined) {
        barChartData.datasets[1].data[lastIndex] = 1;
      } else {
        barChartData.datasets[1].data[lastIndex]++;
      }
    }

    // Update the charts
    barChart?.update();
    lineChart?.update();
  }
</script>

<main class="flex h-screen flex-col p-4">
  <section class="prose flex items-center gap-4 p-4">
    <Button onclick={registerNewGame}>Register game</Button>
  </section>
  <section class="flex w-full flex-grow gap-4 overflow-hidden">
    <!-- Bar Chart -->
    <div class="flex-1">
      <TotalWinChart />
    </div>
    <!-- Line Chart -->
    <div class="flex-1">
      <canvas class="h-full w-full" bind:this={lineCanvasRef}></canvas>
    </div>
  </section>
</main>

<RegisterGameDialog open={registerGameModalOpen} onSave={onSaveResults} />
