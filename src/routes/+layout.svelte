<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Plus } from 'lucide-svelte';
  import '../app.css';
  import { Separator } from '$lib/components/ui/separator';
  import { page } from '$app/stores';
  import RegisterGameDialog from '$lib/dialogs/RegisterGameDialog.svelte';
  import { addGameResults } from '$lib/state/TotalWinState.svelte';
  import type { GameWin } from '$lib/types';

  let { children } = $props();

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

<svelte:head><title>Pokémon Score Chart!</title></svelte:head>

{#snippet menuNavItem(label: string, href: string)}
  <a
    {href}
    class:bg-neutral-400={$page.route.id === href}
    class="rounded-sm bg-opacity-60 px-4 py-2 transition-colors hover:bg-zinc-400"
    >{label}</a
  >
{/snippet}

<main class="flex h-screen flex-col bg-neutral-200 px-4 pb-4">
  <menu class="flex h-16 items-center space-x-2">
    <Button
      variant="default"
      onclick={registerNewGame}
      aria-label="Register new game"
      ><Plus /><span class="font-semibold">Register game</span></Button
    >

    <nav class="flex h-5 items-center space-x-2">
      <Separator orientation="vertical" class="bg-neutral-500" />
      {@render menuNavItem('Dashboard', '/')}
      {@render menuNavItem('Timeline', '/timeline')}
    </nav>
  </menu>
  {@render children()}
</main>

<RegisterGameDialog open={registerGameModalOpen} onSave={onSaveResults} />
