import React from 'react';
import { CloudSun, Terminal, Cpu, RefreshCw, Thermometer } from 'lucide-react';
import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

interface HeaderProps {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  onToggleTempUnit: () => void;
  onToggleWindUnit: () => void;
  onOpenDockerGuide: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  tempUnit,
  windUnit,
  onToggleTempUnit,
  onToggleWindUnit,
  onOpenDockerGuide,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                Weather Intelligence
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Open-Meteo API
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Geocoding, 7-Day Forecast & Smart AI Planning Engine
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            title="Refresh Weather Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Unit Switchers */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={onToggleTempUnit}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                tempUnit === 'celsius'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              °C
            </button>
            <button
              onClick={onToggleTempUnit}
              className={`px-2.5 py-1 rounded-md transition-all ${
                tempUnit === 'fahrenheit'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          <button
            onClick={onToggleWindUnit}
            className="hidden md:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
            title="Toggle wind unit"
          >
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{windUnit}</span>
          </button>

          {/* Docker Setup Evidence Button */}
          <button
            onClick={onOpenDockerGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">Docker & WSL Guide</span>
            <span className="sm:hidden">Docker</span>
          </button>
        </div>
      </div>
    </header>
  );
};
