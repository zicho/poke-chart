import { getDateStringISO } from '$lib/dateUtils';
import {
  getLocalTimeZone,
  today,
  type DateValue
} from '@internationalized/date';

export const currentDate = $state({
  value: getDateStringISO()
});

type DataIntervalState = {
  from: DateValue;
  to: DateValue;
};

export const dataInterval = $state<DataIntervalState>({
  from: today(getLocalTimeZone()),
  to: today(getLocalTimeZone()).add({ days: 8 }) // Add 14 days
});
