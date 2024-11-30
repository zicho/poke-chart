<script lang="ts">
  import RoundWinsChart from '$lib/components/charts/RoundWinsChart.svelte';
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import PlayerStatsCard from '$lib/components/PlayerStatsCard.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import RegisterGameDialog from '$lib/dialogs/RegisterGameDialog.svelte';
  import * as Card from '$lib/components/ui/card';
  import {
    getArvidAceRate,
    getArvidAcesTotal,
    getArvidRoundWinsTotal,
    getMartinAceRate,
    getMartinAcesTotal,
    getMartinRoundWinsTotal,
    getTotalAceRate,
    getTotalAces,
    getTotalRoundsPlayed
  } from '$lib/state/RoundWinsState.svelte';
  import {
    addGameResults,
    getArvidGameWins,
    getArvidWinRate,
    getLatestGameDate,
    getLatestGameWinner,
    getMartinGameWins,
    getMartinWinRate,
    getTotalGamesPlayed
  } from '$lib/state/TotalWinState.svelte';
  import type { GameWin } from '$lib/types';
  import OverallStatsCard from '$lib/components/OverallStatsCard.svelte';
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '$lib/components/ui/tooltip';

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

<main class="flex h-screen flex-col bg-zinc-200 px-4 pb-4">
  <section class="flex h-16 items-center space-x-4">
    <Button
      class="w-full"
      onclick={registerNewGame}
      aria-label="Register new game">Register game</Button
    >
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
      <PlayerStatsCard
        playerName="Martin"
        totalGameWins={getMartinGameWins()}
        totalRoundWins={getMartinRoundWinsTotal()}
        totalAces={getMartinAcesTotal()}
        aceRate={getMartinAceRate()}
        winRate={getMartinWinRate()}
        leader={getMartinGameWins() > getArvidGameWins()}
        latestWinner={getLatestGameWinner() === 'martin'}
      />
      <PlayerStatsCard
        playerName="Arvid"
        totalGameWins={getArvidGameWins()}
        totalRoundWins={getArvidRoundWinsTotal()}
        totalAces={getArvidAcesTotal()}
        aceRate={getArvidAceRate()}
        winRate={getArvidWinRate()}
        leader={getArvidGameWins() > getMartinGameWins()}
        latestWinner={getLatestGameWinner() === 'arvid'}
      />
      <OverallStatsCard
        totalGamesPlayed={getTotalGamesPlayed()}
        totalRoundsPlayed={getTotalRoundsPlayed()}
        totalAces={getTotalAces()}
        aceRate={getTotalAceRate()}
        lastGamePlayed={getLatestGameDate()}
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
