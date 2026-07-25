import { WeatherConditionInfo } from '../types/weather';

export function getWMOCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        description: 'Sunny and clear conditions with high visibility.',
        category: 'clear',
        bgGradient: isDay
          ? 'from-amber-500/20 via-sky-500/10 to-blue-600/10'
          : 'from-indigo-900/30 via-slate-900/20 to-blue-950/20',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        iconName: isDay ? 'SunDim' : 'MoonStar',
        description: 'Mostly clear skies with occasional thin light clouds.',
        category: 'clear',
        bgGradient: 'from-sky-400/20 via-blue-500/10 to-indigo-500/10',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        description: 'Scattered clouds mixed with fair periods.',
        category: 'cloudy',
        bgGradient: 'from-sky-500/20 via-slate-400/15 to-blue-600/10',
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        description: 'Dense cloud layer covering the sky.',
        category: 'cloudy',
        bgGradient: 'from-slate-500/20 via-gray-600/15 to-zinc-700/10',
      };
    case 45:
    case 48:
      return {
        label: code === 45 ? 'Foggy' : 'Depositing Rime Fog',
        iconName: 'CloudFog',
        description: 'Reduced visibility due to atmospheric fog or mist.',
        category: 'fog',
        bgGradient: 'from-zinc-500/20 via-slate-500/20 to-gray-600/15',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        iconName: 'CloudDrizzle',
        description: 'Light fine rain drops falling consistently.',
        category: 'drizzle',
        bgGradient: 'from-teal-500/20 via-sky-600/15 to-blue-700/15',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'CloudSnow',
        description: 'Freezing drizzle forming thin ice layers on surfaces.',
        category: 'snow',
        bgGradient: 'from-cyan-500/20 via-blue-600/20 to-indigo-800/20',
      };
    case 61:
      return {
        label: 'Slight Rain',
        iconName: 'CloudRain',
        description: 'Light rainfall with calm conditions.',
        category: 'rain',
        bgGradient: 'from-blue-500/20 via-indigo-500/15 to-sky-700/15',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        description: 'Steady rain showers. Carrying an umbrella is recommended.',
        category: 'rain',
        bgGradient: 'from-blue-600/25 via-indigo-600/20 to-sky-800/20',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        iconName: 'CloudRainWind',
        description: 'Heavy precipitation. Expect localized water buildup.',
        category: 'rain',
        bgGradient: 'from-blue-700/30 via-indigo-800/25 to-slate-900/25',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        iconName: 'CloudSnow',
        description: 'Rain freezing instantly upon surface contact. Hazardous roads.',
        category: 'rain',
        bgGradient: 'from-cyan-600/25 via-blue-700/20 to-indigo-900/25',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snow',
        iconName: 'Snowflake',
        description: 'Snowfall accumulation expected. Cold conditions.',
        category: 'snow',
        bgGradient: 'from-cyan-400/20 via-sky-300/15 to-blue-500/15',
      };
    case 77:
      return {
        label: 'Snow Grains',
        iconName: 'Snowflake',
        description: 'Very small white icy grains falling.',
        category: 'snow',
        bgGradient: 'from-cyan-500/20 via-slate-400/15 to-sky-600/15',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        iconName: 'CloudRain',
        description: 'Passing rain showers with intermittent clear breaks.',
        category: 'rain',
        bgGradient: 'from-sky-600/25 via-blue-600/20 to-indigo-700/20',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        iconName: 'CloudSnow',
        description: 'Frequent snow bursts with reduced visibility.',
        category: 'snow',
        bgGradient: 'from-cyan-500/20 via-blue-500/20 to-slate-700/20',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        description: 'Electrical thunderstorm activity with rain.',
        category: 'thunderstorm',
        bgGradient: 'from-purple-600/30 via-indigo-800/25 to-slate-900/30',
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm with Hail',
        iconName: 'CloudLightning',
        description: 'Severe thunderstorm accompanied by icy hail. Stay indoors.',
        category: 'thunderstorm',
        bgGradient: 'from-purple-800/35 via-violet-900/30 to-zinc-950/35',
      };
    default:
      return {
        label: 'Unknown Condition',
        iconName: 'Cloud',
        description: 'Weather data available.',
        category: 'cloudy',
        bgGradient: 'from-slate-500/15 via-gray-500/10 to-zinc-600/10',
      };
  }
}
