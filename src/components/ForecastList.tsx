import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-heading">
      <h2 className="mb-4 text-xl font-semibold text-white" id="forecast-heading">
        Próximos dias
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.slice(0, 5).map((day, index) => (
          <li key={day.localDate}>
            <ForecastCard day={day} index={index} unit={unit} />
          </li>
        ))}
      </ul>
    </section>
  );
}
