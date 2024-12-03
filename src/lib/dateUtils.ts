import type { DateValue } from '@internationalized/date';

export const getDateStringISO = (addDays: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + addDays);
  return date.toISOString().split('T')[0];
};

// Helper to format DateValue to YYYY-MM-DD
export const formatDateValue = (dateValue: DateValue | undefined) => {
  if (!dateValue) return '';
  const year = dateValue.year.toString().padStart(4, '0');
  const month = dateValue.month.toString().padStart(2, '0');
  const day = dateValue.day.toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
