import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    name: 'Lisboa',
    latitude: 38.7167,
    longitude: -9.1333,
    country: 'Portugal',
    countryCode: 'PT',
    region: 'Lisboa',
  },
  timeZone: 'Europe/Lisbon',
  receivedAt: '2026-09-30T14:30:00.000Z',
  current: {
    temperatureC: 18,
    weatherCode: 0,
    humidityPercent: 60,
    windSpeedKmh: 10,
    pressureHpa: 1013,
    precipitationMm: 0,
  },
  forecast: [
    {
      localDate: '2026-09-30',
      minTemperatureC: 14,
      maxTemperatureC: 22,
      weatherCode: 0,
      precipitationMm: 0,
    },
    {
      localDate: '2026-10-01',
      minTemperatureC: 15,
      maxTemperatureC: 23,
      weatherCode: 2,
      precipitationMm: 0,
    },
    {
      localDate: '2026-10-02',
      minTemperatureC: 15,
      maxTemperatureC: 21,
      weatherCode: 3,
      precipitationMm: 0.2,
    },
    {
      localDate: '2026-10-03',
      minTemperatureC: 16,
      maxTemperatureC: 19,
      weatherCode: 61,
      precipitationMm: 2.1,
    },
    {
      localDate: '2026-10-04',
      minTemperatureC: 14,
      maxTemperatureC: 20,
      weatherCode: 3,
      precipitationMm: 0,
    },
  ],
};
