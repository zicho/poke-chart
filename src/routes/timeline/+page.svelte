<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import TimelineChart from '$lib/components/TimelineChart.svelte';

  let totalWinChartReady = $state(false);
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
