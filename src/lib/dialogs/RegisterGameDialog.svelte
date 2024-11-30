<script lang="ts">
  import Counter from '$lib/components/Counter.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import type { GameResults } from '$lib/types';

  let {
    open = $bindable(),
    onSave
  }: {
    open: boolean;
    onSave: (results: GameResults) => void;
  } = $props();

  let martinWins = $state(0);
  let martinAces = $state(0);

  let arvidWins = $state(0);
  let arvidAces = $state(0);

  let disableWinIncrement = $derived(arvidWins + martinWins >= 5);
  let disableAceIncrement = $derived(arvidAces + martinAces >= 5);

  $effect(() => {
    if (martinAces > martinWins) {
      martinAces = martinWins;
    }

    if (arvidAces > arvidWins) {
      arvidAces = arvidWins;
    }
  });

  function returnResults(): GameResults {
    let winner = (martinWins > arvidWins ? 'martin' : 'arvid') as
      | 'martin'
      | 'arvid';

    const results: GameResults = {
      winner,
      martinWins,
      martinAces,
      arvidWins,
      arvidAces
    };

    martinWins = 0;
    martinAces = 0;
    arvidWins = 0;
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
      <Label class="text-lg font-semibold">Martin</Label>
    </div>
    <Counter
      label="Wins"
      bind:currentVal={martinWins}
      max={3}
      disableIncrement={disableWinIncrement}
    />
    <Counter
      label="Aces"
      bind:currentVal={martinAces}
      max={3}
      disableIncrement={disableAceIncrement || martinAces === martinWins}
    />
    <Separator class="mt-4" />
    <div class="grid grid-cols-4 items-center gap-4">
      <Label class="text-lg font-semibold">Arvid</Label>
    </div>
    <Counter
      label="Wins"
      bind:currentVal={arvidWins}
      max={3}
      disableIncrement={disableWinIncrement}
    />
    <Counter
      label="Aces"
      bind:currentVal={arvidAces}
      max={3}
      disableIncrement={disableAceIncrement || arvidAces === arvidWins}
    />
    <Separator class="mt-4" />
    <Dialog.Footer>
      <Button
        type="submit"
        onclick={() => onSave(returnResults())}
        disabled={martinWins !== 3 && arvidWins !== 3}
        class="w-full">Submit scores</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
