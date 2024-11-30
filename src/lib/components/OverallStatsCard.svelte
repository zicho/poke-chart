<script lang="ts">
  import * as Card from '$lib/components/ui/card';

  type StatsCardProps = {
    totalGamesPlayed: number;
    totalRoundsPlayed: number;
    totalAces: number;
    aceRate: number;
    lastGamePlayed: string;
  };

  let {
    totalGamesPlayed,
    totalRoundsPlayed,
    totalAces,
    aceRate,
    lastGamePlayed
  }: StatsCardProps = $props();
</script>

<article class="h-full w-full flex-grow rounded-lg">
  <Card.Root class="flex h-full flex-col rounded-lg shadow-md">
    <Card.Header class="flex flex-row justify-between space-x-2">
      <h2 class="text-2xl font-semibold text-gray-900">Overall stats</h2>
    </Card.Header>

    <Card.Content class="flex-1 space-y-4 text-lg text-gray-700">
      <p class="flex justify-between">
        <span class="font-semibold">Games played:</span>
        {totalGamesPlayed}
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Rounds played:</span>
        {totalRoundsPlayed}
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Aces:</span>
        {totalAces} ({aceRate}%)
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Latest game played at:</span>
        {lastGamePlayed}
      </p>
    </Card.Content>
  </Card.Root>
</article>
