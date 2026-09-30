function parseLocalDate(localDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(localDate);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

export function getDayLabel(localDate: string, index: number): string {
  if (index === 0) {
    return 'Hoje';
  }

  if (index === 1) {
    return 'Amanhã';
  }

  const date = parseLocalDate(localDate);

  if (!date) {
    return '—';
  }

  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
  return weekday.charAt(0).toLocaleUpperCase('pt-BR') + weekday.slice(1);
}

export function getShortDate(localDate: string): string {
  const date = parseLocalDate(localDate);

  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
