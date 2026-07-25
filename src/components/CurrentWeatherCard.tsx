import React from 'react';
import {
  MapPin,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Gauge,
  Sun,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Cloud,
  Moon,
  CloudSun,
  CloudMoon,
  Compass,
  Eye,
  Umbrella,
} from 'lucide-react';
import { ForecastResponse, GeocodingResult, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { getWMOCondition } from '../utils/wmoCodes';

interface CurrentWeatherCardProps {
  city: GeocodingResult;
  forecast: ForecastResponse;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

// Convert C to F
export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

// Convert km/h to mph or m/s
export function convertWind(kmh: number, unit: WindSpeedUnit): string {
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  if (unit === 'ms') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

// Map icon name to Lucide Icon
export function WeatherIcon({ iconName, className }: { iconName: string; className?: string }) {
  const props = { className: className || 'w-6 h-6' };
  switch (iconName) {
    case 'Sun':
      return <Sun {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'CloudMoon':
      return <CloudMoon {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudRain':
      return <CloudRain {...props} />;
    case 'CloudRainWind':
      return <CloudRain {...props} />;
    case 'Snowflake':
      return <Snowflake {...props} />;
    case 'CloudSnow':
      return <Snowflake {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    default:
      return <Cloud {...props} />;
  }
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  forecast,
  tempUnit,
  windUnit,
}) => {
  const current = forecast.current;
  const daily = forecast.daily;

  if (!current) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        No current weather data available for this location.
      </div>
    );
  }

  const isDay = Boolean(current.is_day);
  const condition = getWMOCondition(current.weather_code, isDay);

  const displayTemp = convertTemp(current.temperature_2m, tempUnit);
  const displayFeelsLike = convertTemp(current.apparent_temperature, tempUnit);
  const highTemp = daily?.temperature_2m_max[0] !== undefined ? convertTemp(daily.temperature_2m_max[0], tempUnit) : '--';
  const lowTemp = daily?.temperature_2m_min[0] !== undefined ? convertTemp(daily.temperature_2m_min[0], tempUnit) : '--';

  // Time formatters
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    try {
      return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const sunriseTime = formatTime(daily?.sunrise[0]);
  const sunsetTime = formatTime(daily?.sunset[0]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${condition.bgGradient} border border-slate-200/80 dark:border-slate-700/80 shadow-xl backdrop-blur-xl transition-all duration-500`}
    >
      {/* Background Decorative Atmosphere Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-sky-500/10 dark:bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Location Name & Timezone info */}
      <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {city.name}
            </h2>
            {city.country_code && (
              <span className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono">
                {city.country_code}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            {[city.admin1, city.country].filter(Boolean).join(', ')}
            <span className="text-slate-400 ml-2 font-mono text-xs">
              ({forecast.timezone_abbreviation || 'UTC'}, {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°)
            </span>
          </p>
        </div>

        {/* Condition Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-sm backdrop-blur-md">
          <div className="p-1 text-sky-500">
            <WeatherIcon iconName={condition.iconName} className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Condition</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{condition.label}</p>
          </div>
        </div>
      </div>

      {/* Main Temperature Hero Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Temperature Number */}
        <div className="md:col-span-6 flex items-baseline gap-4">
          <span className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
            {displayTemp}°
          </span>
          <div>
            <span className="text-lg font-bold text-sky-600 dark:text-sky-400 uppercase">
              {tempUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              Feels like <span className="font-bold text-slate-800 dark:text-white">{displayFeelsLike}°</span>
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold mt-1 text-slate-500 dark:text-slate-400">
              <span className="text-rose-500">H: {highTemp}°</span>
              <span className="text-sky-500">L: {lowTemp}°</span>
            </div>
          </div>
        </div>

        {/* Sun Times & Condition Description */}
        <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-around text-xs">
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Sunrise</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{sunriseTime}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <Sunset className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Sunset</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{sunsetTime}</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs flex flex-col justify-center">
            <p className="text-slate-400 text-[10px] uppercase font-bold">Atmospheric Status</p>
            <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5 line-clamp-2">
              {condition.description}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 6 Weather Metrics */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
        {/* Metric 1: Humidity */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {current.relative_humidity_2m}%
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-1.5 rounded-full"
              style={{ width: `${current.relative_humidity_2m}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Wind Speed */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Wind</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {convertWind(current.wind_speed_10m, windUnit)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <Compass className="w-3 h-3 text-teal-500" style={{ transform: `rotate(${current.wind_direction_10m}deg)` }} />
            Dir: {current.wind_direction_10m}°
          </p>
        </div>

        {/* Metric 3: Pressure */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {Math.round(current.pressure_msl)} <span className="text-xs font-normal text-slate-500">hPa</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {current.pressure_msl > 1013 ? 'High Pressure' : 'Low Pressure'}
          </p>
        </div>

        {/* Metric 4: Precipitation */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Precipitation</span>
            <Umbrella className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {current.precipitation} <span className="text-xs font-normal text-slate-500">mm</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {current.precipitation > 0 ? 'Active Rain' : 'Dry Currently'}
          </p>
        </div>

        {/* Metric 5: Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cloud Cover</span>
            <Eye className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {current.cloud_cover}%
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-slate-500 h-1.5 rounded-full"
              style={{ width: `${current.cloud_cover}%` }}
            />
          </div>
        </div>

        {/* Metric 6: UV Index Max */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">UV Max</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {daily?.uv_index_max[0] ?? '--'}
          </p>
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
            {(daily?.uv_index_max[0] ?? 0) >= 8
              ? 'Very High Risk'
              : (daily?.uv_index_max[0] ?? 0) >= 5
              ? 'Moderate Risk'
              : 'Low Risk'}
          </p>
        </div>
      </div>
    </div>
  );
};
