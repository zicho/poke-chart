import { getDateStringISO } from '$lib/dateUtils';
import type { Player } from '$lib/types';
import {
  getLocalTimeZone,
  today,
  type DateValue
} from '@internationalized/date';

let playerOne: Player = {
  id: crypto.randomUUID(),
  name: 'Player 1',
  gameWins: 0,
  roundWins: 0,
  aces: 0
};

let playerTwo: Player = {
  id: crypto.randomUUID(),
  name: 'Player 2',
  gameWins: 0,
  roundWins: 0,
  aces: 0
};

export const players = $state({
  playerOne,
  playerTwo
});

export const currentDate = $state<{ value: DateValue }>({
  value: today(getLocalTimeZone())
});

type DataIntervalState = {
  from: DateValue;
  to: DateValue;
};

export const dataInterval = $state<DataIntervalState>({
  from: today(getLocalTimeZone()),
  to: today(getLocalTimeZone()).add({ days: 8 })
});
