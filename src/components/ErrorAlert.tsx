import React from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onSelectDefaultCity?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onSelectDefaultCity,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 shadow-lg space-y-4 max-w-2xl mx-auto my-6 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 mx-auto flex items-center justify-center">
        <AlertCircle className="w-6 h-6 animate-pulse" />
      </div>

      <div>
        <h4 className="font-extrabold text-lg text-rose-900 dark:text-rose-100">
          Weather Data Fetch Failed
        </h4>
        <p className="text-sm mt-1 text-rose-700 dark:text-rose-300 max-w-lg mx-auto">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Request
          </button>
        )}

        {onSelectDefaultCity && (
          <button
            onClick={onSelectDefaultCity}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <Search className="w-4 h-4 text-sky-500" />
            Load Sample City (London)
          </button>
        )}
      </div>
    </div>
  );
};
