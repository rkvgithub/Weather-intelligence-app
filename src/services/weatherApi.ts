import { ForecastResponse, GeocodingResponse, GeocodingResult } from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Search for cities by query string using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const url = new URL(GEOCODING_API_URL);
    url.searchParams.append('name', trimmed);
    url.searchParams.append('count', '10');
    url.searchParams.append('language', 'en');
    url.searchParams.append('format', 'json');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new WeatherApiError(
        `Geocoding API failed with status ${response.status}`,
        response.status
      );
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    if (error instanceof WeatherApiError) throw error;
    throw new WeatherApiError('Failed to fetch city results. Please check your network connection.');
  }
}

/**
 * Fetch detailed current and forecast weather data by coordinates
 */
export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  timezone: string = 'auto'
): Promise<ForecastResponse> {
  try {
    const url = new URL(FORECAST_API_URL);
    url.searchParams.append('latitude', lat.toString());
    url.searchParams.append('longitude', lon.toString());
    url.searchParams.append(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m'
    );
    url.searchParams.append(
      'hourly',
      'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index'
    );
    url.searchParams.append(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max'
    );
    url.searchParams.append('timezone', timezone || 'auto');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new WeatherApiError(
        `Forecast API failed with status ${response.status}`,
        response.status
      );
    }

    const data: ForecastResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof WeatherApiError) throw error;
    throw new WeatherApiError('Unable to load weather forecast. Please check API connection and retry.');
  }
}

/**
 * Preset popular cities for quick selection
 */
export const POPULAR_CITIES: GeocodingResult[] = [
  { id: 1001, name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, country_code: 'GB', admin1: 'England' },
  { id: 1002, name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917, country_code: 'JP', admin1: 'Tokyo' },
  { id: 1003, name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, country_code: 'US', admin1: 'New York' },
  { id: 1004, name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, country_code: 'FR', admin1: 'Île-de-France' },
  { id: 1005, name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, country_code: 'AU', admin1: 'New South Wales' },
  { id: 1006, name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, country_code: 'IN', admin1: 'Maharashtra' },
  { id: 1007, name: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405, country_code: 'DE', admin1: 'Berlin' },
];
