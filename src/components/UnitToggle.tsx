import { type KeyboardEvent, useRef } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const celsiusButtonRef = useRef<HTMLButtonElement>(null);
  const fahrenheitButtonRef = useRef<HTMLButtonElement>(null);

  function selectUnit(nextUnit: Unit) {
    if (nextUnit !== unit) {
      onChange(nextUnit);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let nextUnit: Unit | null = null;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'Home':
        nextUnit = 'celsius';
        break;
      case 'ArrowRight':
      case 'ArrowDown':
      case 'End':
        nextUnit = 'fahrenheit';
        break;
      default:
        return;
    }

    event.preventDefault();
    selectUnit(nextUnit);

    const nextButton =
      nextUnit === 'celsius' ? celsiusButtonRef.current : fahrenheitButtonRef.current;
    nextButton?.focus();
  }

  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
      role="group"
    >
      <button
        aria-label="Celsius (°C)"
        aria-pressed={unit === 'celsius'}
        className={`min-h-10 min-w-12 rounded-md px-3 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
          unit === 'celsius'
            ? 'bg-accent-600 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => selectUnit('celsius')}
        onKeyDown={handleKeyDown}
        ref={celsiusButtonRef}
        tabIndex={unit === 'celsius' ? 0 : -1}
        type="button"
      >
        °C
      </button>
      <button
        aria-label="Fahrenheit (°F)"
        aria-pressed={unit === 'fahrenheit'}
        className={`min-h-10 min-w-12 rounded-md px-3 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
          unit === 'fahrenheit'
            ? 'bg-accent-600 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => selectUnit('fahrenheit')}
        onKeyDown={handleKeyDown}
        ref={fahrenheitButtonRef}
        tabIndex={unit === 'fahrenheit' ? 0 : -1}
        type="button"
      >
        °F
      </button>
    </div>
  );
}
