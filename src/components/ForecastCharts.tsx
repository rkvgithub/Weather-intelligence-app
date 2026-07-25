import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { ForecastResponse, TemperatureUnit } from '../types/weather';
import { convertTemp } from './CurrentWeatherCard';
import { Calendar, Clock, BarChart3, Wind } from 'lucide-react';

interface ForecastChartsProps {
  forecast: ForecastResponse;
  tempUnit: TemperatureUnit;
}

export const ForecastCharts: React.FC<ForecastChartsProps> = ({ forecast, tempUnit }) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'weekly' | 'wind'>('hourly');

  const hourly = forecast.hourly;
  const daily = forecast.daily;

  if (!hourly || !daily) return null;

  // Prepare next 24 hours dataset
  const hourlyData = hourly.time.slice(0, 24).map((timeStr, i) => {
    const date = new Date(timeStr);
    const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const rawTemp = hourly.temperature_2m[i] ?? 0;
    return {
      time: timeLabel,
      temp: convertTemp(rawTemp, tempUnit),
      precipProb: hourly.precipitation_probability[i] ?? 0,
      humidity: hourly.relative_humidity_2m[i] ?? 0,
      windSpeed: Math.round(hourly.wind_speed_10m[i] ?? 0),
      uv: hourly.uv_index[i] ?? 0,
    };
  });

  // Prepare 7-day dataset
  const dailyData = daily.time.map((dateStr, i) => {
    const date = new Date(dateStr);
    const dayName = i === 0 ? 'Today' : date.toLocaleDateString([], { weekday: 'short' });
    const dateFormatted = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const high = convertTemp(daily.temperature_2m_max[i] ?? 0, tempUnit);
    const low = convertTemp(daily.temperature_2m_min[i] ?? 0, tempUnit);
    const precipSum = daily.precipitation_sum[i] ?? 0;
    return {
      day: dayName,
      fullDate: dateFormatted,
      maxTemp: high,
      minTemp: low,
      precip: precipSum,
      uvMax: daily.uv_index_max[i] ?? 0,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
      {/* Chart Header & Tab Switches */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-500" />
            Weather Analytics & Trend Visualization
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive telemetry curves for temperature, rain probability, and wind metrics
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'hourly'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            24h Hourly Curve
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'weekly'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            7-Day Temp Range
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'wind'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind & Humidity
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full pt-2">
        {activeTab === 'hourly' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="temp" domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rain" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#3b82f6' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl border border-slate-700">
                        <p className="font-bold text-sky-400 border-b border-slate-700 pb-1">{data.time}</p>
                        <p>Temperature: <span className="font-bold">{data.temp}°{tempUnit === 'celsius' ? 'C' : 'F'}</span></p>
                        <p>Precipitation Chance: <span className="font-bold text-blue-400">{data.precipProb}%</span></p>
                        <p>Wind Speed: <span className="font-bold">{data.windSpeed} km/h</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="rain" dataKey="precipProb" fill="#60a5fa" opacity={0.35} radius={[4, 4, 0, 0]} name="Rain %" />
              <Area yAxisId="temp" type="monotone" dataKey="temp" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" name="Temp" />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'weekly' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl border border-slate-700">
                        <p className="font-bold text-sky-400 border-b border-slate-700 pb-1">{data.day} ({data.fullDate})</p>
                        <p className="text-rose-400">High Temp: <span className="font-bold">{data.maxTemp}°</span></p>
                        <p className="text-sky-400">Low Temp: <span className="font-bold">{data.minTemp}°</span></p>
                        <p>Rainfall Sum: <span className="font-bold">{data.precip} mm</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line type="monotone" dataKey="maxTemp" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} name="High Temp" />
              <Line type="monotone" dataKey="minTemp" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} name="Low Temp" />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'wind' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl border border-slate-700">
                        <p className="font-bold text-teal-400 border-b border-slate-700 pb-1">{data.time}</p>
                        <p>Wind Speed: <span className="font-bold text-teal-300">{data.windSpeed} km/h</span></p>
                        <p>Humidity: <span className="font-bold text-sky-300">{data.humidity}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="windSpeed" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#windGradient)" name="Wind Speed (km/h)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
