export const getDateStringISO = (addDays: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + addDays);
  return date.toISOString().split('T')[0];
};
