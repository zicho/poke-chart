import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  blue: 'rgb(54, 162, 235)',
  green: 'rgb(75, 192, 192)',
  yellow: 'rgb(255, 205, 86)',
  purple: 'rgb(153, 102, 255)'
};

function transparentize(color: string, opacity: number): string {
  const alpha = 1 - opacity;
  return color.replace(/rgb/i, 'rgba').replace(')', `, ${alpha})`);
}

export const Utils = {
  CHART_COLORS,
  transparentize
};
