<script lang="ts">
  import RoundWinsChart from '$lib/components/charts/RoundWinsChart.svelte';
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import * as Card from '$lib/components/ui/card';
  import {
    getTotalAceRate,
    getTotalAces,
    getTotalRoundsPlayed
  } from '$lib/state/RoundWinsState.svelte';
  import {
    getLatestGameDate,
    getTotalGamesPlayed
  } from '$lib/state/TotalWinState.svelte';
  import OverallStatsCard from '$lib/components/OverallStatsCard.svelte';
  import PlayerStatsCardAlt from '$lib/components/PlayerStatsCardAlt.svelte';
  import TimelineChart from '$lib/components/TimelineChart.svelte';

  let totalWinChartReady = $state(false);
  let totalRoundWinsChartReady = $state(false);
</script>

<section class="mb-4 flex flex-1 space-x-4 overflow-hidden">
  <Card.Root class="h-full w-full">
    <TotalWinChart bind:ready={totalWinChartReady} />
  </Card.Root>
  <Card.Root class="h-full w-full">
    <RoundWinsChart bind:ready={totalRoundWinsChartReady} />
  </Card.Root>
</section>

<section class="flex flex-1 space-x-4 overflow-hidden">
  {#if totalRoundWinsChartReady && totalWinChartReady}
    <div class="flex flex-1 space-x-4">
      <PlayerStatsCardAlt />

      <OverallStatsCard
        totalGamesPlayed={getTotalGamesPlayed()}
        totalRoundsPlayed={getTotalRoundsPlayed()}
        totalAces={getTotalAces()}
        aceRate={getTotalAceRate()}
        lastGamePlayed={getLatestGameDate()}
      />
    </div>
    <div class="flex-1">
      <Card.Root class="h-full w-full">
        <TimelineChart bind:ready={totalRoundWinsChartReady} />
      </Card.Root>
    </div>
  {:else}
    <div
      class="absolute inset-0 z-10 flex items-center justify-center bg-white"
    >
      Loading... Please wait.
    </div>
  {/if}
</section>
