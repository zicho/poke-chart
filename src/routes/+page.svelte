<script lang="ts">
  import RoundWinsChart from '$lib/components/charts/RoundWinsChart.svelte';
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import StatsCard from '$lib/components/PlayerStatsCard.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import RegisterGameDialog from '$lib/dialogs/RegisterGameDialog.svelte';
  import {
    getArvidAceRate,
    getArvidAcesTotal,
    getArvidRoundWinsTotal,
    getMartinAceRate,
    getMartinAcesTotal,
    getMartinRoundWins,
    getMartinRoundWinsTotal
  } from '$lib/state/RoundWinsState.svelte';
  import {
    addGameResults,
    gameWins,
    getArvidGameWins,
    getArvidGameWinRate,
    getLatestGameWinner,
    getMartinGameWins,
    getMartinGameWinRate
  } from '$lib/state/TotalWinState.svelte';
  import type { GameWin } from '$lib/types';

  let registerGameModalOpen = $state(false);

  function registerNewGame() {
    registerGameModalOpen = false;
    registerGameModalOpen = true;
  }
  function onSaveResults(results: GameWin): void {
    registerGameModalOpen = false;
    addGameResults(results);
  }

  let totalWinChartReady = $state(false);
  let totalRoundWinsChartReady = $state(false);
</script>

<main class="flex h-screen flex-col overflow-hidden">
  <section class="prose flex items-center gap-4 p-4">
    <Button onclick={registerNewGame}>Register game</Button>
  </section>
  <section class="relative flex w-full flex-grow gap-4 overflow-hidden">
    {#if !totalRoundWinsChartReady || !totalWinChartReady}
      <div
        class="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80"
      >
        Loading... Please wait.
      </div>
    {/if}
    <!-- Bar Chart -->
    <div class="flex-1 shadow-md">
      <TotalWinChart bind:ready={totalWinChartReady} />
    </div>
    <!-- Line Chart -->
    <div class="flex-1">
      <RoundWinsChart bind:ready={totalRoundWinsChartReady} />
    </div>
  </section>

  <section class="w-full flex-grow overflow-hidden px-4 pb-8">
    {#if totalRoundWinsChartReady && totalWinChartReady}
      <h1 class="mb-4 text-2xl font-semibold">Stats</h1>
      <div class="flex h-full items-stretch space-x-4 pb-8">
        <StatsCard
          playerName="Player 1"
          totalGameWins={getMartinGameWins()}
          totalRoundWins={getMartinRoundWinsTotal()}
          totalAces={getMartinAcesTotal()}
          aceRate={getMartinAceRate()}
          winRate={getMartinGameWinRate()}
          leader={getMartinGameWins() > getArvidGameWins()}
          latestWinner={getLatestGameWinner() === 'martin'}
        />
        <StatsCard
          playerName="Player 2"
          totalGameWins={getArvidGameWins()}
          totalRoundWins={getArvidRoundWinsTotal()}
          totalAces={getArvidAcesTotal()}
          aceRate={getArvidAceRate()}
          winRate={getArvidGameWinRate()}
          leader={getArvidGameWins() > getMartinGameWins()}
          latestWinner={getLatestGameWinner() === 'arvid'}
        />
      </div>
    {/if}
  </section>
</main>

<RegisterGameDialog open={registerGameModalOpen} onSave={onSaveResults} />
