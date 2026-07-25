import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, History, X, Loader2, Globe } from 'lucide-react';
import { GeocodingResult } from '../types/weather';
import { POPULAR_CITIES, searchCities } from '../services/weatherApi';

interface CitySearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
  selectedCity: GeocodingResult | null;
  isLoading: boolean;
}

export const CitySearchBar: React.FC<CitySearchBarProps> = ({
  onSelectCity,
  selectedCity,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>([]);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent_weather_cities');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce API calls for suggestions
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('City search failed', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);

    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id);
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('recent_weather_cities', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_weather_cities');
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGeoLoading(false);
        const geoCity: GeocodingResult = {
          id: Date.now(),
          name: 'Current Location',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: 'GPS Detected',
          admin1: `Lat: ${pos.coords.latitude.toFixed(2)}°, Lon: ${pos.coords.longitude.toFixed(2)}°`,
        };
        handleSelect(geoCity);
      },
      (err) => {
        setIsGeoLoading(false);
        alert(`Location permission denied or unavailable: ${err.message}`);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3" ref={dropdownRef}>
      {/* Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center shadow-lg shadow-slate-200/50 dark:shadow-none rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-sky-500 transition-all overflow-hidden">
          <div className="pl-4 text-slate-400">
            {isSearching || isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0 || recentSearches.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Search city name (e.g. London, Tokyo, New York, Mumbai)..."
            className="w-full px-4 py-3.5 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="p-2 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleUseLocation}
            disabled={isGeoLoading}
            className="mr-2 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900 text-sky-600 dark:text-sky-400 text-xs font-semibold flex items-center gap-1.5 transition-all border border-sky-200/60 dark:border-sky-800 shrink-0"
            title="Locate me using GPS"
          >
            {isGeoLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Use Location</span>
          </button>
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-sky-500" />
                  Search Results ({suggestions.length})
                </div>
                {suggestions.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-700/70 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                          {city.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {[city.admin1, city.country].filter(Boolean).join(', ')}
                          {city.elevation !== undefined && ` • ${city.elevation}m elev`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-400 font-mono">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results found state */}
            {query.trim().length >= 2 && !isSearching && suggestions.length === 0 && (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  No cities found matching "{query}"
                </p>
                <p className="text-xs mt-1 text-slate-400">
                  Please double-check spelling or try searching for a major capital city.
                </p>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="px-3 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> Recent Searches
                  </span>
                  <button
                    onClick={handleClearRecent}
                    className="hover:text-rose-500 text-[10px] lowercase transition-colors"
                  >
                    clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-1">
                  {recentSearches.map((city) => (
                    <button
                      key={`recent-${city.id}`}
                      onClick={() => handleSelect(city)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-sky-500" />
                      {city.name}
                      <span className="text-[10px] text-slate-400">{city.country_code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Presets Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] uppercase tracking-wider">
          Popular Cities:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = selectedCity?.name === city.name;
          return (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all border ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
