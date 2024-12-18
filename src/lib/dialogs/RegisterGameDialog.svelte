<script lang="ts">
  import Counter from '$lib/components/Counter.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import { currentDate } from '$lib/state/AppState.svelte';
  import type { GameWin } from '$lib/types';

  let {
    open = $bindable(),
    onSave
  }: {
    open: boolean;
    onSave: (results: GameWin) => void;
  } = $props();

  let playerOneRoundWins = $state(0);
  let playerOneAces = $state(0);

  let playerTwoRoundWins = $state(0);
  let playerTwoAces = $state(0);

  let disableWinIncrement = $derived(
    playerTwoRoundWins + playerOneRoundWins >= 5
  );
  let disableAceIncrement = $derived(playerTwoAces + playerOneAces >= 5);

  $effect(() => {
    if (playerOneAces > playerOneRoundWins) {
      playerOneAces = playerOneRoundWins;
    }

    if (playerTwoAces > playerTwoRoundWins) {
      playerTwoAces = playerTwoRoundWins;
    }
  });

  function returnResults(): GameWin {
    let winner = (
      playerOneRoundWins > playerTwoRoundWins ? 'playerOne' : 'playerTwo'
    ) as 'playerOne' | 'playerTwo';

    const results: GameWin = {
      dateStamp: currentDate.value,
      winner,
      playerOneRoundWins,
      playerOneAces,
      playerTwoRoundWins,
      playerTwoAces
    };

    playerOneRoundWins = 0;
    playerOneAces = 0;
    playerTwoRoundWins = 0;
    playerTwoAces = 0;

    return results;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Registering a new game</Dialog.Title>
    </Dialog.Header>

    <div class="grid grid-cols-4 items-center gap-4">
      <Label class="text-lg font-semibold">Player 1</Label>
    </div>
    <Counter
      label="Wins"
      bind:currentVal={playerOneRoundWins}
      max={3}
      disableIncrement={disableWinIncrement}
    />
    <Counter
      label="Aces"
      bind:currentVal={playerOneAces}
      max={3}
      disableIncrement={disableAceIncrement ||
        playerOneAces === playerOneRoundWins}
    />
    <Separator class="mt-4" />
    <div class="grid grid-cols-4 items-center gap-4">
      <Label class="text-lg font-semibold">Player 2</Label>
    </div>
    <Counter
      label="Wins"
      bind:currentVal={playerTwoRoundWins}
      max={3}
      disableIncrement={disableWinIncrement}
    />
    <Counter
      label="Aces"
      bind:currentVal={playerTwoAces}
      max={3}
      disableIncrement={disableAceIncrement ||
        playerTwoAces === playerTwoRoundWins}
    />
    <Separator class="mt-4" />
    <Dialog.Footer>
      <Button
        type="submit"
        onclick={() => onSave(returnResults())}
        disabled={playerOneRoundWins !== 3 && playerTwoRoundWins !== 3}
        class="w-full">Submit scores</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
