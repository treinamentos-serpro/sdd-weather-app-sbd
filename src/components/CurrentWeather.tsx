import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | null, suffix: string): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(value);

  return `${formattedValue} ${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const condition = getWeatherCondition(current.weatherCode);
  const region = city.region?.localeCompare(city.name, 'pt-BR', { sensitivity: 'base' })
    ? city.region
    : null;
  const location = [city.name, region, city.country].filter(Boolean).join(', ');

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-glass backdrop-blur-md"
    >
      <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-accent-400">Clima atual</p>
          <h2 className="text-2xl font-semibold text-white" id="current-weather-heading">
            {location}
          </h2>
          <p className="mt-5 text-5xl font-semibold text-white sm:text-6xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
        </div>

        <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:text-right">
          <span aria-hidden="true" className="text-6xl leading-none sm:text-7xl">
            {condition.icon}
          </span>
          <p className="text-lg font-medium text-white">{condition.label}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 border-t border-white/10 bg-night-800/40 sm:grid-cols-4">
        <div className="border-b border-r border-white/10 p-4 sm:border-b-0">
          <dt className="text-sm text-white/60">Umidade</dt>
          <dd className="mt-1 font-semibold text-white">
            {formatMetric(current.humidityPercent, '%')}
          </dd>
        </div>
        <div className="border-b border-white/10 p-4 sm:border-b-0 sm:border-r">
          <dt className="text-sm text-white/60">Vento</dt>
          <dd className="mt-1 font-semibold text-white">
            {formatMetric(current.windSpeedKmh, 'km/h')}
          </dd>
        </div>
        <div className="border-r border-white/10 p-4">
          <dt className="text-sm text-white/60">Precipitação</dt>
          <dd className="mt-1 font-semibold text-white">
            {formatMetric(current.precipitationMm, 'mm')}
          </dd>
        </div>
        <div className="p-4">
          <dt className="text-sm text-white/60">Pressão</dt>
          <dd className="mt-1 font-semibold text-white">
            {formatMetric(current.pressureHpa, 'hPa')}
          </dd>
        </div>
      </dl>
    </section>
  );
}
