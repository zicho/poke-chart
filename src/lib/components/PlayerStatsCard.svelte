<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Award, Crown, Magnet, Trophy } from 'lucide-svelte';

  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '$lib/components/ui/tooltip';
  import { tweened } from 'svelte/motion';

  type StatsCardProps = {
    playerName: string;
    totalGameWins: number;
    totalRoundWins: number;
    totalAces: number;
    gameWinRate: number;
    roundWinRate: number;
    aceRate: number;
    leader: boolean;
    latestWinner: boolean;
  };

  let {
    playerName,
    totalGameWins,
    totalRoundWins,
    totalAces,
    gameWinRate,
    roundWinRate,
    aceRate,
    leader = $bindable(),
    latestWinner = $bindable()
  }: StatsCardProps = $props();

  const roundsTween = tweened(totalRoundWins);
  const aceTween = tweened(totalAces);

  $effect(() => {
    $roundsTween = totalRoundWins;
    $aceTween = totalAces;
  });
</script>

<article class="h-full w-full flex-grow rounded-lg">
  <Card.Root class="flex h-full flex-col rounded-lg shadow-md">
    <Card.Header class="flex flex-row justify-between space-x-2">
      <h1 class="text-2xl font-semibold text-primary">
        {playerName}
      </h1>
      <div class="flex space-x-2">
        {#if latestWinner}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><Award class="text-slate-600" /></TooltipTrigger>
              <TooltipContent>
                <p>Won last game</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        {/if}
        {#if leader}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Crown class="text-amber-600" /></TooltipTrigger
              >
              <TooltipContent>
                <p>Season leader</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        {/if}
      </div>
    </Card.Header>

    <Card.Content class="flex-1 space-y-4 text-lg text-gray-700">
      <p class="flex justify-between">
        <span class="font-semibold">Game wins:</span>
        {totalGameWins}
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Rounds won:</span>
        {Math.round($roundsTween)}
      </p>
      {#if totalAces > 0}
        <p class="flex justify-between">
          <span class="font-semibold">Aces:</span>
          {Math.round($aceTween)} ({aceRate}%)
        </p>
      {/if}
      <p class="flex justify-between">
        <span class="font-semibold">Game win rate:</span>
        {gameWinRate}%
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Round win rate:</span>
        {roundWinRate}%
      </p>
    </Card.Content>
  </Card.Root>
</article>
