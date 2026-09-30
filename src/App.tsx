import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import useWeather from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, error, query, search, retry } = useWeather();

  function renderContent() {
    switch (status) {
      case 'idle':
        return (
          <EmptyState
            hint="Informe uma cidade no campo acima para consultar as condições meteorológicas."
            title="Consulte o clima de uma cidade"
          />
        );
      case 'loading':
        return <LoadingState message={`Buscando clima para ${query}...`} />;
      case 'empty':
        return (
          <EmptyState
            hint="Confira o nome informado e tente uma nova busca."
            title="Nenhuma cidade encontrada"
          />
        );
      case 'error':
        return (
          <ErrorState
            message={error?.message ?? 'Não foi possível carregar os dados. Tente novamente.'}
            onRetry={() => void retry()}
          />
        );
      case 'success': {
        if (!data) {
          return null;
        }

        return (
          <div className="space-y-8">
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </div>
        );
      }
    }
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="text-3xl leading-none">
                ☀️
              </span>
              <div>
                <h1 className="text-xl font-semibold">Tempo</h1>
                <p className="text-xs text-white/60">Previsão local</p>
              </div>
            </div>
            <UnitToggle onChange={setUnit} unit={unit} />
          </div>
          <SearchBar disabled={status === 'loading'} onSearch={(name) => void search(name)} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {renderContent()}
      </main>
    </div>
  );
}
