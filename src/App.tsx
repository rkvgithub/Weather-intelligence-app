import { useState, useEffect, useCallback } from 'react';
import { GeocodingResult, ForecastResponse, TemperatureUnit, WindSpeedUnit } from './types/weather';
import { POPULAR_CITIES, fetchWeatherForecast } from './services/weatherApi';
import { Header } from './components/Header';
import { CitySearchBar } from './components/CitySearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastCharts } from './components/ForecastCharts';
import { SevenDayForecast } from './components/SevenDayForecast';
import { IntelligencePlanner } from './components/IntelligencePlanner';
import { DockerGuideModal } from './components/DockerGuideModal';
import { ErrorAlert } from './components/ErrorAlert';
import { Loader2, Globe, Cpu } from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeocodingResult>(POPULAR_CITIES[0]); // Default to London
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('celsius');
  const [windUnit, setWindUnit] = useState<WindSpeedUnit>('kmh');
  const [isDockerGuideOpen, setIsDockerGuideOpen] = useState<boolean>(false);

  // Load weather for selected city
  const loadForecast = useCallback(async (city: GeocodingResult, showRefreshSpinner = false) => {
    if (showRefreshSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherForecast(city.latitude, city.longitude, city.timezone);
      setForecast(data);
    } catch (err: unknown) {
      console.error('Forecast fetch error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to connect to Open-Meteo weather servers.';
      setError(msg);
      setForecast(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch forecast whenever selectedCity changes
  useEffect(() => {
    loadForecast(selectedCity);
  }, [selectedCity, loadForecast]);

  const handleCitySelect = (city: GeocodingResult) => {
    setSelectedCity(city);
  };

  const handleToggleTempUnit = () => {
    setTempUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleToggleWindUnit = () => {
    setWindUnit((prev) => {
      if (prev === 'kmh') return 'mph';
      if (prev === 'mph') return 'ms';
      return 'kmh';
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-sky-500 selection:text-white font-sans pb-16">
      {/* Header Bar */}
      <Header
        tempUnit={tempUnit}
        windUnit={windUnit}
        onToggleTempUnit={handleToggleTempUnit}
        onToggleWindUnit={handleToggleWindUnit}
        onOpenDockerGuide={() => setIsDockerGuideOpen(true)}
        onRefresh={() => loadForecast(selectedCity, true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Search & Location Bar */}
        <section>
          <CitySearchBar
            onSelectCity={handleCitySelect}
            selectedCity={selectedCity}
            isLoading={isLoading}
          />
        </section>

        {/* Error Alert Display */}
        {error && (
          <ErrorAlert
            message={error}
            onRetry={() => loadForecast(selectedCity)}
            onSelectDefaultCity={() => setSelectedCity(POPULAR_CITIES[0])}
          />
        )}

        {/* Loading Spinner Skeleton */}
        {isLoading && !error && (
          <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 max-w-xl mx-auto my-12">
            <Loader2 className="w-10 h-10 animate-spin text-sky-500 mx-auto" />
            <div>
              <p className="font-bold text-lg text-slate-800 dark:text-slate-100">
                Fetching Real-time Telemetry for {selectedCity.name}...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Querying Open-Meteo Geocoding & Forecast APIs (Lat: {selectedCity.latitude.toFixed(2)}°, Lon: {selectedCity.longitude.toFixed(2)}°)
              </p>
            </div>
          </div>
        )}

        {/* Main Dashboard View */}
        {!isLoading && forecast && (
          <div className="space-y-8">
            {/* 1. Hero Current Weather Card */}
            <CurrentWeatherCard
              city={selectedCity}
              forecast={forecast}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* 2. Intelligence Planning Recommendations Hub */}
            <IntelligencePlanner forecast={forecast} />

            {/* 3. Interactive Recharts Telemetry Charts */}
            <ForecastCharts forecast={forecast} tempUnit={tempUnit} />

            {/* 4. 7-Day Detailed Forecast List */}
            <SevenDayForecast forecast={forecast} tempUnit={tempUnit} />
          </div>
        )}
      </main>

      {/* Docker Setup & Evidence Modal */}
      <DockerGuideModal
        isOpen={isDockerGuideOpen}
        onClose={() => setIsDockerGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2 font-medium">
          <Globe className="w-4 h-4 text-sky-500" />
          <span>Powered by Open-Meteo Public API</span>
          <span>•</span>
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span>Docker Ready (Multi-stage Nginx Container)</span>
        </div>
        <p>Weather Intelligence App • Designed for Google AI Studio Docker Deployment Assignment</p>
      </footer>
    </div>
  );
}
