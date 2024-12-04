<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Award, Crown } from 'lucide-svelte';

  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '$lib/components/ui/tooltip';

  import {
    getLatestGameWinner,
    getPlayerGameWinRate,
    getPlayerGameWinsTotal
  } from '$lib/state/TotalWinState.svelte';

  import {
    getPlayerTwoAceRate,
    getPlayerTwoAcesTotal,
    getPlayerTwoRoundWinRate,
    getPlayerTwoRoundWinsTotal,
    getPlayerOneAceRate,
    getPlayerOneAcesTotal,
    getPlayerOneRoundWinRate,
    getPlayerOneRoundWinsTotal
  } from '$lib/state/RoundWinsState.svelte';

  type PlayerStats = {
    playerName: string;
    totalGameWins: number;
    totalRoundWins: number;
    totalAces: number;
    gameWinRate: number;
    roundWinRate: number;
    aceRate: number;
    leader: boolean;
    latestGameWinner: boolean;
  };

  let player1 = $derived<PlayerStats>({
    playerName: 'Player 1',
    totalGameWins: getPlayerGameWinsTotal('playerOne'),
    totalRoundWins: getPlayerTwoRoundWinsTotal(),
    totalAces: getPlayerTwoAcesTotal(),
    gameWinRate: getPlayerGameWinRate('playerOne'),
    roundWinRate: getPlayerTwoRoundWinRate(),
    aceRate: getPlayerTwoAceRate(),
    leader:
      getPlayerGameWinsTotal('playerOne') > getPlayerGameWinsTotal('playerOne'),
    latestGameWinner: getLatestGameWinner() === 'playerOne'
  });

  let player2 = $derived<PlayerStats>({
    playerName: 'Player 2',
    totalGameWins: getPlayerGameWinsTotal('playerTwo'),
    totalRoundWins: getPlayerTwoRoundWinsTotal(),
    totalAces: getPlayerTwoAcesTotal(),
    gameWinRate: getPlayerGameWinRate('playerTwo'),
    roundWinRate: getPlayerTwoRoundWinRate(),
    aceRate: getPlayerTwoAceRate(),
    leader:
      getPlayerGameWinsTotal('playerTwo') > getPlayerGameWinsTotal('playerOne'),
    latestGameWinner: getLatestGameWinner() === 'playerTwo'
  });
</script>

{#snippet playerStat(
  label: string,
  player1Stat: number,
  player2Stat: number,
  suffix?: string
)}
  <div class="text-left">{player1Stat}{suffix}</div>
  <div class="text-center font-semibold">{label}</div>
  <div class="text-right">{player2Stat}{suffix}</div>
{/snippet}

{#snippet crown()}
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
{/snippet}

{#snippet latestWinner()}
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger><Award class="text-slate-600" /></TooltipTrigger>
      <TooltipContent>
        <p>Won last game</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
{/snippet}

<article class="h-full w-full flex-grow rounded-lg">
  <Card.Root class="flex h-full flex-col rounded-lg shadow-md">
    <Card.Content class="flex-1 space-y-4 text-lg text-gray-700">
      <div class="grid grid-cols-3 gap-2">
        <div class="flex items-center justify-start space-x-2 text-left">
          <p class="font-semibold">{player1.playerName}</p>
          {#if player1.latestGameWinner}{@render latestWinner()}{/if}
          {#if player1.leader}{@render crown()}{/if}
        </div>

        <!-- Center Section (Empty) -->
        <div class="text-center"></div>

        <!-- Player 2 Section (Right-Aligned) -->
        <div class="flex items-center justify-end space-x-2 text-right">
          {#if player2.latestGameWinner}{@render latestWinner()}{/if}
          {#if player2.leader}{@render crown()}{/if}
          <p class="font-semibold">{player2.playerName}</p>
        </div>

        {@render playerStat(
          'Game wins',
          player1.totalGameWins,
          player2.totalGameWins
        )}

        {@render playerStat(
          'Round wins',
          player1.totalRoundWins,
          player2.totalRoundWins
        )}

        {@render playerStat(
          'Game win rate',
          player1.gameWinRate,
          player2.gameWinRate,
          ' %'
        )}

        {@render playerStat(
          'Round win rate',
          player1.roundWinRate,
          player2.roundWinRate,
          ' %'
        )}

        {@render playerStat('Aces', player1.totalAces, player2.totalAces)}
        {@render playerStat('Ace rate', player1.aceRate, player2.aceRate, ' %')}
      </div>
    </Card.Content>
  </Card.Root>
</article>
