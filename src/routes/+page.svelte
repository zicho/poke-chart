<script lang="ts">
  import RoundWinsChart from '$lib/components/charts/RoundWinsChart.svelte';
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import PlayerStatsCard from '$lib/components/PlayerStatsCard.svelte';
  import * as Card from '$lib/components/ui/card';
  import {
    getArvidAceRate,
    getArvidAcesTotal,
    getArvidRoundWinRate,
    getArvidRoundWinsTotal,
    getMartinAceRate,
    getMartinAcesTotal,
    getMartinRoundWinRate,
    getMartinRoundWinsTotal,
    getTotalAceRate,
    getTotalAces,
    getTotalRoundsPlayed
  } from '$lib/state/RoundWinsState.svelte';
  import {
    getArvidGameWinsTotal,
    getArvidGameWinRate,
    getLatestGameDate,
    getLatestGameWinner,
    getMartinGameWinsTotal,
    getMartinGameWinRate,
    getTotalGamesPlayed
  } from '$lib/state/TotalWinState.svelte';
  import OverallStatsCard from '$lib/components/OverallStatsCard.svelte';

  let totalWinChartReady = $state(false);
  let totalRoundWinsChartReady = $state(false);
</script>

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
      playerName="Player 1"
      totalGameWins={getMartinGameWinsTotal()}
      totalRoundWins={getMartinRoundWinsTotal()}
      totalAces={getMartinAcesTotal()}
      aceRate={getMartinAceRate()}
      gameWinRate={getMartinGameWinRate()}
      roundWinRate={getMartinRoundWinRate()}
      leader={getMartinGameWinsTotal() > getArvidGameWinsTotal()}
      latestWinner={getLatestGameWinner() === 'martin'}
    />
    <PlayerStatsCard
      playerName="Player 2"
      totalGameWins={getArvidGameWinsTotal()}
      totalRoundWins={getArvidRoundWinsTotal()}
      totalAces={getArvidAcesTotal()}
      aceRate={getArvidAceRate()}
      gameWinRate={getArvidGameWinRate()}
      roundWinRate={getArvidRoundWinRate()}
      leader={getArvidGameWinsTotal() > getMartinGameWinsTotal()}
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
