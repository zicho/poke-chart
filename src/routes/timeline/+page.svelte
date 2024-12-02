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
  import TimelineChart from '$lib/components/TimelineChart.svelte';

  let totalWinChartReady = $state(false);
  let totalRoundWinsChartReady = $state(false);
</script>

<section class="flex flex-grow space-x-4 overflow-hidden">
  <Card.Root class="flex-1">
    <TimelineChart bind:ready={totalWinChartReady} />
  </Card.Root>
</section>

{#if !totalWinChartReady}
  <div class="absolute inset-0 z-10 flex items-center justify-center bg-white">
    Loading... Please wait.
  </div>
{/if}
