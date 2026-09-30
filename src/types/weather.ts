export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string | null;
  countryCode: string | null;
  region: string | null;
}

export interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  pressureHpa: number | null;
  precipitationMm: number | null;
}

export interface ForecastDay {
  localDate: string;
  minTemperatureC: number | null;
  maxTemperatureC: number | null;
  weatherCode: number | null;
  precipitationMm: number | null;
}

export interface WeatherData {
  city: City;
  timeZone: string;
  receivedAt: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

