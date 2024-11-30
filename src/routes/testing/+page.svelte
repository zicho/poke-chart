<script lang="ts">
  import RoundWinsChart from '$lib/components/charts/RoundWinsChart.svelte';
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import StatsCard from '$lib/components/StatsCard.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import RegisterGameDialog from '$lib/dialogs/RegisterGameDialog.svelte';
  import * as Card from '$lib/components/ui/card';
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
    getArvidWinRate,
    getLatestGameWinner,
    getMartinGameWins,
    getMartinWinRate
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

<main class="flex h-screen flex-col bg-zinc-200 px-8 pb-4">
  <section class="flex h-16 items-center justify-center">
    <Button onclick={registerNewGame}>Register game</Button>
  </section>

  <section class="mb-4 flex flex-1 space-x-4">
    <div class="flex-1">
      <Card.Root>
        <TotalWinChart bind:ready={totalWinChartReady} />
      </Card.Root>
    </div>
    <div class="flex-1">
      <Card.Root>
        <RoundWinsChart bind:ready={totalRoundWinsChartReady} />
      </Card.Root>
    </div>
  </section>

  <section class="flex flex-1 space-x-4">
    {#if totalRoundWinsChartReady && totalWinChartReady}
      <StatsCard
        playerName="Martin"
        totalGameWins={getMartinGameWins()}
        totalRoundWins={getMartinRoundWinsTotal()}
        totalAces={getMartinAcesTotal()}
        aceRate={getMartinAceRate()}
        winRate={getMartinWinRate()}
        leader={getMartinGameWins() > getArvidGameWins()}
        latestWinner={getLatestGameWinner() === 'martin'}
      />
      <StatsCard
        playerName="Arvid"
        totalGameWins={getArvidGameWins()}
        totalRoundWins={getArvidRoundWinsTotal()}
        totalAces={getArvidAcesTotal()}
        aceRate={getArvidAceRate()}
        winRate={getArvidWinRate()}
        leader={getArvidGameWins() > getMartinGameWins()}
        latestWinner={getLatestGameWinner() === 'arvid'}
      />
    {:else}
      <div
        class="absolute inset-0 z-10 flex items-center justify-center bg-white"
      >
        Loading... Please wait.
      </div>
    {/if}
  </section>
</main>

<RegisterGameDialog open={registerGameModalOpen} onSave={onSaveResults} />
