import { getDayLabel, getShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

function formatPrecipitation(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(value);

  return `${formattedValue} mm`;
}

export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const condition = getWeatherCondition(day.weatherCode);
  const dayLabel = getDayLabel(day.localDate, index);

  return (
    <article
      aria-label={`Previsão para ${dayLabel}, ${getShortDate(day.localDate)}`}
      className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-4 text-center shadow-glass backdrop-blur-md"
    >
      <h3 className="font-semibold text-white">{dayLabel}</h3>
      <p className="mt-1 text-xs text-white/60">{getShortDate(day.localDate)}</p>

      <span aria-hidden="true" className="mt-4 text-4xl leading-none">
        {condition.icon}
      </span>
      <p className="mt-2 min-h-10 text-sm text-white/80">{condition.label}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
        <div>
          <dt className="text-xs text-white/60">
            <span aria-hidden="true">Máx.</span>
            <span className="sr-only">Temperatura máxima</span>
          </dt>
          <dd className="mt-1 text-sm font-semibold text-white">
            {formatTemperature(day.maxTemperatureC, unit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">
            <span aria-hidden="true">Mín.</span>
            <span className="sr-only">Temperatura mínima</span>
          </dt>
          <dd className="mt-1 text-sm text-white/80">
            {formatTemperature(day.minTemperatureC, unit)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-accent-400">
        <span className="block text-xs text-white/60">Precipitação</span>
        <span className="font-semibold">{formatPrecipitation(day.precipitationMm)}</span>
      </p>
    </article>
  );
}
