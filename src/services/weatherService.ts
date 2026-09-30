import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;
const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'wind_speed_10m',
  'surface_pressure',
  'precipitation',
  'weather_code',
];
const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_min',
  'temperature_2m_max',
  'precipitation_sum',
];

export type WeatherServiceErrorKind = 'api' | 'network' | 'timeout';

export class WeatherServiceError extends Error {
  readonly kind: WeatherServiceErrorKind;

  constructor(message: string, kind: WeatherServiceErrorKind = 'api') {
    super(message);
    this.name = 'WeatherServiceError';
    this.kind = kind;
  }
}

async function fetchWithTimeout(input: RequestInfo | URL): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(input, { signal: controller.signal });

    if (controller.signal.aborted) {
      throw new DOMException('A requisição foi abortada.', 'AbortError');
    }

    return response;
  } catch (error) {
    if (isRecord(error) && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.', 'timeout');
    }

    throw new WeatherServiceError('Falha de rede.', 'network');
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: unknown;
  country_code?: unknown;
  admin1?: unknown;
}

interface GeocodingResponse {
  results?: unknown;
  error?: unknown;
  reason?: unknown;
}

interface ForecastResponse {
  timezone?: unknown;
  current?: unknown;
  daily?: unknown;
  error?: unknown;
  reason?: unknown;
}

function isGeocodingResult(value: unknown): value is GeocodingResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const result = value as Record<string, unknown>;
  return (
    typeof result.name === 'string' &&
    typeof result.latitude === 'number' &&
    Number.isFinite(result.latitude) &&
    typeof result.longitude === 'number' &&
    Number.isFinite(result.longitude)
  );
}

function optionalString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function valueAt(value: unknown, index: number): unknown {
  return Array.isArray(value) ? value[index] : undefined;
}

function isValidLocalDate(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

function mapCurrentWeather(current: Record<string, unknown>): CurrentWeather {
  return {
    temperatureC: finiteNumber(current.temperature_2m),
    weatherCode: finiteNumber(current.weather_code),
    humidityPercent: finiteNumber(current.relative_humidity_2m),
    windSpeedKmh: finiteNumber(current.wind_speed_10m),
    pressureHpa: finiteNumber(current.surface_pressure),
    precipitationMm: finiteNumber(current.precipitation),
  };
}

function mapForecast(daily: Record<string, unknown>): ForecastDay[] {
  if (
    !Array.isArray(daily.time) ||
    daily.time.length !== 5 ||
    !daily.time.every(isValidLocalDate)
  ) {
    throw new WeatherServiceError('A fonte de dados retornou uma previsão incompleta.');
  }

  if (new Set(daily.time).size !== daily.time.length) {
    throw new WeatherServiceError('A fonte de dados retornou datas duplicadas.');
  }

  return daily.time.map((localDate, index) => ({
    localDate,
    minTemperatureC: finiteNumber(valueAt(daily.temperature_2m_min, index)),
    maxTemperatureC: finiteNumber(valueAt(daily.temperature_2m_max, index)),
    weatherCode: finiteNumber(valueAt(daily.weather_code, index)),
    precipitationMm: finiteNumber(valueAt(daily.precipitation_sum, index)),
  }));
}

export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return [];
  }

  const encodedName = encodeURIComponent(trimmedName);
  const url = `${GEOCODING_URL}?name=${encodedName}&count=100&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar cidades. Tente novamente.');
  }

  const payload = (await response.json()) as GeocodingResponse;

  if (payload.error === true) {
    const reason = optionalString(payload.reason);
    throw new WeatherServiceError(reason ?? 'A fonte de dados retornou um erro.');
  }

  if (payload.results === undefined) {
    return [];
  }

  if (!Array.isArray(payload.results) || !payload.results.every(isGeocodingResult)) {
    throw new WeatherServiceError('A fonte de dados retornou uma resposta inválida.');
  }

  return payload.results
    .map((result) => ({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: optionalString(result.country),
      countryCode: optionalString(result.country_code),
      region: optionalString(result.admin1),
    }))
    .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'))
    .slice(0, 5);
}

export async function getWeather(city: City): Promise<WeatherData> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', String(city.latitude));
  url.searchParams.set('longitude', String(city.longitude));
  url.searchParams.set('current', CURRENT_FIELDS.join(','));
  url.searchParams.set('daily', DAILY_FIELDS.join(','));
  url.searchParams.set('forecast_days', '5');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('temperature_unit', 'celsius');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('precipitation_unit', 'mm');

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível carregar os dados. Tente novamente.');
  }

  const payload = (await response.json()) as ForecastResponse;

  if (payload.error === true) {
    const reason = optionalString(payload.reason);
    throw new WeatherServiceError(reason ?? 'A fonte de dados retornou um erro.');
  }

  if (!isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new WeatherServiceError('A fonte de dados retornou uma resposta incompleta.');
  }

  if (typeof payload.timezone !== 'string' || !payload.timezone) {
    throw new WeatherServiceError('A fonte de dados não informou o fuso horário.');
  }

  return {
    city,
    timeZone: payload.timezone,
    receivedAt: new Date().toISOString(),
    current: mapCurrentWeather(payload.current),
    forecast: mapForecast(payload.daily),
  };
}
