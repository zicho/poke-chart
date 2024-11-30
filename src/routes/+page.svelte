<script lang="ts">
  import RoundWinsChart from '$lib/components/charts/RoundWinsChart.svelte';
  import TotalWinChart from '$lib/components/charts/TotalWinChart.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import RegisterGameDialog from '$lib/dialogs/RegisterGameDialog.svelte';
  import { addGameResults } from '$lib/state/TotalWinState.svelte';
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
      <RoundWinsChart />
    </div>
  </section>
</main>

<RegisterGameDialog open={registerGameModalOpen} onSave={onSaveResults} />
