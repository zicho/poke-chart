<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Crown, Magnet } from 'lucide-svelte';

  type StatsCardProps = {
    playerName: string;
    totalGameWins: number;
    totalRoundWins: number;
    winRate: number;
    leader: boolean;
    latestWinner: boolean;
  };

  let {
    playerName,
    totalGameWins,
    totalRoundWins,
    winRate,
    leader = $bindable(),
    latestWinner = $bindable()
  }: StatsCardProps = $props();
</script>

<article class="w-full rounded-lg bg-gray-50 shadow-lg">
  <Card.Root class="rounded-lg bg-white shadow-md">
    <Card.Header class="flex flex-row justify-between space-x-2">
      <h2 class="text-2xl font-semibold text-gray-900">
        {playerName}
        {#if leader}(leader){/if}
      </h2>
      <div class="flex space-x-2">
        {#if latestWinner}
          <Magnet />
        {/if}
        {#if leader}
          <Crown />
        {/if}
      </div>
    </Card.Header>

    <Card.Content class="space-y-4 text-lg text-gray-700">
      <p class="flex justify-between">
        <span class="font-semibold">Game wins:</span>
        {totalGameWins}
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Rounds won:</span>
        {totalRoundWins}
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Win rate:</span>
        {winRate}%
      </p>
    </Card.Content>
  </Card.Root>
</article>
