import type { Unit } from '../types/weather';

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

function roundToOneDecimal(value: number): number {
  const absoluteValue = Math.abs(value);
  return Math.sign(value) * (Math.round((absoluteValue + Number.EPSILON) * 10) / 10);
}

export function formatTemperature(valueC: number | null, unit: Unit): string {
  if (valueC === null || !Number.isFinite(valueC)) {
    return '—';
  }

  const value = unit === 'fahrenheit' ? toFahrenheit(valueC) : valueC;
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(roundToOneDecimal(value));
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';

  return `${formattedValue} ${symbol}`;
}
