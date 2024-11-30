<script lang="ts">
  import Counter from '$lib/components/Counter.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import { getDateStringISO } from '$lib/dateUtils';
  import type { GameWin } from '$lib/types';

  let {
    open = $bindable(),
    onSave
  }: {
    open: boolean;
    onSave: (results: GameWin) => void;
  } = $props();

  let martinRoundWins = $state(0);
  let martinAces = $state(0);

  let arvidRoundWins = $state(0);
  let arvidAces = $state(0);

  let disableWinIncrement = $derived(arvidRoundWins + martinRoundWins >= 5);
  let disableAceIncrement = $derived(arvidAces + martinAces >= 5);

  $effect(() => {
    if (martinAces > martinRoundWins) {
      martinAces = martinRoundWins;
    }

    if (arvidAces > arvidRoundWins) {
      arvidAces = arvidRoundWins;
    }
  });

  function returnResults(): GameWin {
    let winner = (martinRoundWins > arvidRoundWins ? 'martin' : 'arvid') as
      | 'martin'
      | 'arvid';

    const results: GameWin = {
      dateStamp: getDateStringISO(),
      winner,
      martinRoundWins,
      martinAces,
      arvidRoundWins,
      arvidAces
    };

    martinRoundWins = 0;
    martinAces = 0;
    arvidRoundWins = 0;
    arvidAces = 0;

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
      bind:currentVal={martinRoundWins}
      max={3}
      disableIncrement={disableWinIncrement}
    />
    <Counter
      label="Aces"
      bind:currentVal={martinAces}
      max={3}
      disableIncrement={disableAceIncrement || martinAces === martinRoundWins}
    />
    <Separator class="mt-4" />
    <div class="grid grid-cols-4 items-center gap-4">
      <Label class="text-lg font-semibold">Player 2</Label>
    </div>
    <Counter
      label="Wins"
      bind:currentVal={arvidRoundWins}
      max={3}
      disableIncrement={disableWinIncrement}
    />
    <Counter
      label="Aces"
      bind:currentVal={arvidAces}
      max={3}
      disableIncrement={disableAceIncrement || arvidAces === arvidRoundWins}
    />
    <Separator class="mt-4" />
    <Dialog.Footer>
      <Button
        type="submit"
        onclick={() => onSave(returnResults())}
        disabled={martinRoundWins !== 3 && arvidRoundWins !== 3}
        class="w-full">Submit scores</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
