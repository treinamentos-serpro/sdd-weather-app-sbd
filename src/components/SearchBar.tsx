import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setValidationMessage('Digite uma cidade');
      return;
    }

    setValidationMessage(null);
    onSearch(trimmedCity);
  }

  return (
    <form
      className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md"
      role="search"
      onSubmit={handleSubmit}
    >
      <label className="mb-2 block text-sm font-medium text-white" htmlFor="city-search">
        Buscar cidade
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-describedby={validationMessage ? 'city-search-error' : undefined}
          aria-invalid={validationMessage ? true : undefined}
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-night-800/80 px-4 py-3 text-white placeholder:text-white/50 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id="city-search"
          name="city"
          onChange={(event) => {
            setCity(event.target.value);
            setValidationMessage(null);
          }}
          placeholder="Ex.: Lisboa"
          type="search"
          value={city}
        />
        <button
          className="rounded-md bg-accent-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-[#4b56c9] focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          type="submit"
        >
          Buscar
        </button>
      </div>
      {validationMessage && (
        <p className="mt-2 text-sm text-red-300" id="city-search-error" role="alert">
          {validationMessage}
        </p>
      )}
    </form>
  );
}
