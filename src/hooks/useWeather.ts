import { useEffect, useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

type LastOperation = { type: 'search'; query: string } | { type: 'weather'; city: City };

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: WeatherServiceError | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

function normalizeError(error: unknown): WeatherServiceError {
  if (error instanceof WeatherServiceError) {
    return error;
  }

  return new WeatherServiceError('A fonte de dados retornou uma resposta inválida.');
}

export default function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<WeatherServiceError | null>(null);
  const [query, setQuery] = useState('');
  const operationIdRef = useRef(0);
  const lastOperationRef = useRef<LastOperation | null>(null);

  useEffect(() => {
    return () => {
      operationIdRef.current += 1;
    };
  }, []);

  async function loadWeather(city: City, operationId: number) {
    lastOperationRef.current = { type: 'weather', city };
    setStatus('loading');
    setData(null);
    setError(null);

    try {
      const weatherData = await getWeather(city);

      if (operationId !== operationIdRef.current) {
        return;
      }

      setData(weatherData);
      setStatus('success');
    } catch (caughtError) {
      if (operationId !== operationIdRef.current) {
        return;
      }

      setError(normalizeError(caughtError));
      setStatus('error');
    }
  }

  async function search(name: string) {
    const trimmedName = name.trim();
    const operationId = operationIdRef.current + 1;
    operationIdRef.current = operationId;
    setQuery(trimmedName);
    setCities([]);
    setData(null);
    setError(null);

    if (!trimmedName) {
      lastOperationRef.current = null;
      setError(new WeatherServiceError('Digite uma cidade.'));
      setStatus('error');
      return;
    }

    lastOperationRef.current = { type: 'search', query: trimmedName };
    setStatus('loading');

    try {
      const cityResults = await searchCities(trimmedName);

      if (operationId !== operationIdRef.current) {
        return;
      }

      setCities(cityResults);

      if (cityResults.length === 0) {
        setStatus('empty');
        return;
      }

      await loadWeather(cityResults[0], operationId);
    } catch (caughtError) {
      if (operationId !== operationIdRef.current) {
        return;
      }

      setError(normalizeError(caughtError));
      setStatus('error');
    }
  }

  async function selectCity(city: City) {
    const operationId = operationIdRef.current + 1;
    operationIdRef.current = operationId;
    await loadWeather(city, operationId);
  }

  async function retry() {
    const lastOperation = lastOperationRef.current;

    if (!lastOperation) {
      return;
    }

    if (lastOperation.type === 'search') {
      await search(lastOperation.query);
      return;
    }

    await selectCity(lastOperation.city);
  }

  return {
    status,
    data,
    cities,
    error,
    query,
    search,
    selectCity,
    retry,
  };
}
