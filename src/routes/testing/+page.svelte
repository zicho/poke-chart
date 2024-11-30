<script lang="ts">
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<main class="flex h-screen flex-col p-4">
  <section class="flex w-full flex-grow gap-4 overflow-hidden">
    <!-- Bar Chart -->
    <div class="flex-1">
      <TotalWinChart />
    </div>
  </section>
</main>
