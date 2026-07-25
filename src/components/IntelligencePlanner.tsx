import React from 'react';
import {
  Sparkles,
  Shirt,
  ShieldAlert,
  Dumbbell,
  Car,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { ForecastResponse } from '../types/weather';
import { calculateWeatherIntelligence } from '../utils/weatherIntelligence';

interface IntelligencePlannerProps {
  forecast: ForecastResponse;
}

export const IntelligencePlanner: React.FC<IntelligencePlannerProps> = ({ forecast }) => {
  const intelligence = calculateWeatherIntelligence(forecast);

  // Score color badge mapping
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-emerald-500 to-teal-600 text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 65) return 'from-sky-500 to-blue-600 text-sky-500 bg-sky-500/10 border-sky-500/20';
    if (score >= 45) return 'from-amber-500 to-orange-600 text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (score >= 25) return 'from-rose-500 to-red-600 text-rose-500 bg-rose-500/10 border-rose-500/20';
    return 'from-purple-600 to-pink-700 text-purple-500 bg-purple-500/10 border-purple-500/20';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700/80 space-y-6 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-white">
              Weather Intelligence & Planning Hub
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic activity scores, clothing advice, workout timing, and travel safety guidance
          </p>
        </div>

        {/* Activity Score Gauge Pill */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-lg">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 font-black text-xl text-sky-400">
            {intelligence.activityScore}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Outdoor Score</p>
            <p className={`text-sm font-bold ${getScoreColor(intelligence.activityScore).split(' ')[2]}`}>
              {intelligence.activityLevelText} Activity
            </p>
          </div>
        </div>
      </div>

      {/* Active Warnings Alert Box (If Any) */}
      {intelligence.warnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs space-y-2 relative z-10">
          <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
            Active Weather Advisories & Hazards ({intelligence.warnings.length})
          </div>
          <ul className="list-disc list-inside space-y-1 font-medium pl-1 text-slate-300">
            {intelligence.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Narrative */}
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-300 leading-relaxed relative z-10 flex items-start gap-3">
        <Zap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-white">Smart Summary:</p>
          <p className="text-slate-300 mt-0.5">{intelligence.weatherSummaryText}</p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Card 1: Clothing & Outfit */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-2 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2.5 text-sky-400 font-bold text-sm">
            <span className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
              <Shirt className="w-4 h-4" />
            </span>
            Recommended Outfit
          </div>
          <p className="text-xs text-slate-300 leading-normal">
            {intelligence.clothingAdvice}
          </p>
        </div>

        {/* Card 2: UV Protection */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-2 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
            <span className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </span>
            UV Protection Advisory ({intelligence.uvProtection.level})
          </div>
          <p className="text-xs text-slate-300 leading-normal">
            {intelligence.uvProtection.advice}
          </p>
        </div>

        {/* Card 3: Optimal Workout Window */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-2 hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Dumbbell className="w-4 h-4" />
              </span>
              Best Workout Window
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              {intelligence.workoutWindow.bestTime}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-normal">
            {intelligence.workoutWindow.reason}
          </p>
        </div>

        {/* Card 4: Travel & Commute Impact */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-2 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2.5 text-teal-400 font-bold text-sm">
            <span className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <Car className="w-4 h-4" />
            </span>
            Travel & Driving Safety
          </div>
          <p className="text-xs text-slate-300 leading-normal">
            {intelligence.travelCommuteAdvice}
          </p>
        </div>
      </div>
    </div>
  );
};
