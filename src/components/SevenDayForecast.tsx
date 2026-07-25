import React, { useState } from 'react';
import { Calendar, Umbrella, ChevronRight, X, Clock } from 'lucide-react';
import { ForecastResponse, TemperatureUnit } from '../types/weather';
import { getWMOCondition } from '../utils/wmoCodes';
import { convertTemp, WeatherIcon } from './CurrentWeatherCard';

interface SevenDayForecastProps {
  forecast: ForecastResponse;
  tempUnit: TemperatureUnit;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ forecast, tempUnit }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const daily = forecast.daily;
  const hourly = forecast.hourly;

  if (!daily) return null;

  // Calculate min and max temps across the whole 7 days to size the temperature visual bar proportionally
  const allMaxs = daily.temperature_2m_max.map((t) => convertTemp(t, tempUnit));
  const allMins = daily.temperature_2m_min.map((t) => convertTemp(t, tempUnit));
  const globalMax = Math.max(...allMaxs);
  const globalMin = Math.min(...allMins);
  const globalRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          7-Day Detailed Outlook
        </h3>
        <span className="text-xs text-slate-400 font-medium">Click any day for hourly breakdown</span>
      </div>

      {/* Daily List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {daily.time.map((dateStr, idx) => {
          const date = new Date(dateStr);
          const isToday = idx === 0;
          const dayName = isToday ? 'Today' : date.toLocaleDateString([], { weekday: 'short' });
          const dateFormatted = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

          const code = daily.weather_code[idx] ?? 0;
          const condition = getWMOCondition(code, true);

          const maxT = convertTemp(daily.temperature_2m_max[idx] ?? 0, tempUnit);
          const minT = convertTemp(daily.temperature_2m_min[idx] ?? 0, tempUnit);
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const precipSum = daily.precipitation_sum[idx] ?? 0;

          // Bar offset calculation
          const leftPercent = ((minT - globalMin) / globalRange) * 100;
          const barWidthPercent = Math.max(10, ((maxT - minT) / globalRange) * 100);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDayIndex(idx)}
              className="w-full text-left py-3.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all grid grid-cols-12 items-center gap-2 group"
            >
              {/* Day & Date */}
              <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <WeatherIcon iconName={condition.iconName} className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {dayName} {isToday && <span className="text-[10px] text-sky-500 uppercase ml-1">(Now)</span>}
                  </p>
                  <p className="text-xs text-slate-400">{dateFormatted}</p>
                </div>
              </div>

              {/* Condition Label */}
              <div className="hidden md:block md:col-span-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {condition.label}
                </p>
                {precipSum > 0 && (
                  <p className="text-[11px] text-sky-500 flex items-center gap-1 font-medium">
                    <Umbrella className="w-3 h-3" /> {precipSum} mm ({precipProb}%)
                  </p>
                )}
              </div>

              {/* Temperature Visual Bar & Range */}
              <div className="col-span-7 sm:col-span-8 md:col-span-5 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-8 text-right font-mono">
                  {minT}°
                </span>

                {/* Progress bar container */}
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                    style={{
                      left: `${Math.max(0, leftPercent)}%`,
                      width: `${Math.min(100 - leftPercent, barWidthPercent)}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-900 dark:text-white w-8 font-mono">
                  {maxT}°
                </span>
              </div>

              {/* Arrow icon */}
              <div className="col-span-1 flex justify-end text-slate-300 group-hover:text-sky-500 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Hourly Detail Modal for Selected Day */}
      {selectedDayIndex !== null && hourly && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-500" />
                  Hourly Breakdown for {new Date(daily.time[selectedDayIndex]).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDayIndex(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 24 Hours list for selected day */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hourly.time.slice(selectedDayIndex * 24, (selectedDayIndex + 1) * 24).map((hTime, idx) => {
                const hourDate = new Date(hTime);
                const hourLabel = hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const globalHourIdx = selectedDayIndex * 24 + idx;
                const hCode = hourly.weather_code[globalHourIdx] ?? 0;
                const hCond = getWMOCondition(hCode, hourDate.getHours() >= 6 && hourDate.getHours() < 20);
                const hTemp = convertTemp(hourly.temperature_2m[globalHourIdx] ?? 0, tempUnit);
                const hRain = hourly.precipitation_probability[globalHourIdx] ?? 0;

                return (
                  <div
                    key={hTime}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{hourLabel}</p>
                      <p className="text-[11px] text-slate-400">{hCond.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm text-slate-900 dark:text-white">{hTemp}°</p>
                      {hRain > 0 && <p className="text-[10px] text-sky-500 font-semibold">{hRain}% rain</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
