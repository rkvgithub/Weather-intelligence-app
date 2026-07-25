import { ForecastResponse, IntelligenceRecommendation } from '../types/weather';

export function calculateWeatherIntelligence(forecast: ForecastResponse): IntelligenceRecommendation {
  const current = forecast.current;
  const hourly = forecast.hourly;
  const daily = forecast.daily;

  if (!current || !hourly || !daily) {
    return {
      activityScore: 70,
      activityLevelText: 'Moderate',
      clothingAdvice: 'Wear comfortable layered clothing suitable for general outdoor conditions.',
      uvProtection: {
        level: 'Moderate',
        advice: 'Apply sunscreen if spending extended time outdoors.',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      },
      travelCommuteAdvice: 'Normal travel conditions expected.',
      workoutWindow: {
        bestTime: 'Morning or late afternoon',
        reason: 'Optimal balance of temperature and atmospheric comfort.',
      },
      weatherSummaryText: 'Weather conditions are stable across the region.',
      warnings: [],
    };
  }

  const temp = current.temperature_2m; // in Celsius
  const wind = current.wind_speed_10m; // in km/h
  const humidity = current.relative_humidity_2m;
  const precip = current.precipitation;
  const weatherCode = current.weather_code;
  const maxUvToday = daily.uv_index_max[0] ?? 3;

  const warnings: string[] = [];

  // --- 1. Outdoor Activity Score (0 - 100) ---
  let score = 100;

  // Temperature penalties (Ideal range: 18°C - 26°C)
  if (temp < 0) {
    score -= 35;
    warnings.push('Sub-zero temperature alert: extreme cold outdoors.');
  } else if (temp < 10) {
    score -= 15;
  } else if (temp > 35) {
    score -= 35;
    warnings.push('Heat warning: High temperatures above 35°C.');
  } else if (temp > 30) {
    score -= 20;
  }

  // Precipitation penalties
  if (precip > 5) {
    score -= 40;
    warnings.push('Heavy precipitation active.');
  } else if (precip > 0.5) {
    score -= 20;
  }

  // Wind speed penalties
  if (wind > 45) {
    score -= 35;
    warnings.push('High wind warning: Gusts exceeding 45 km/h.');
  } else if (wind > 25) {
    score -= 15;
  }

  // Thunderstorm / Severe WMO codes
  if ([95, 96, 99].includes(weatherCode)) {
    score -= 60;
    warnings.push('Thunderstorm & lightning danger. Remain indoors.');
  } else if ([65, 67, 75, 82, 86].includes(weatherCode)) {
    score -= 35;
    warnings.push('Hazardous precipitation in effect.');
  }

  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));

  let activityLevelText: IntelligenceRecommendation['activityLevelText'] = 'Good';
  if (score >= 85) activityLevelText = 'Excellent';
  else if (score >= 65) activityLevelText = 'Good';
  else if (score >= 45) activityLevelText = 'Moderate';
  else if (score >= 25) activityLevelText = 'Poor';
  else activityLevelText = 'Hazardous';

  // --- 2. Clothing Advice ---
  let clothingAdvice = '';
  if (precip > 1 || [61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    clothingAdvice = 'Waterproof rain jacket or umbrella required. Wear non-slip shoes.';
  } else if (temp <= 5) {
    clothingAdvice = 'Heavy winter coat, thermal layers, gloves, and a beanie scarf recommended.';
  } else if (temp <= 15) {
    clothingAdvice = 'Light jacket, sweater, or hoodie over jeans/trousers.';
  } else if (temp <= 25) {
    clothingAdvice = 'Breathable cotton t-shirt, shorts or light trousers. Comfortable sneakers.';
  } else {
    clothingAdvice = 'Lightweight, loose-fitting clothing. Wear a hat, sunglasses, and stay hydrated.';
  }

  // --- 3. UV Protection ---
  let uvLevel = 'Low';
  let uvAdvice = 'Minimal sun protection needed.';
  let uvColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

  if (maxUvToday >= 11) {
    uvLevel = 'Extreme (11+)';
    uvAdvice = 'Avoid sun exposure between 10 AM and 4 PM. High risk of skin damage.';
    uvColor = 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    warnings.push('Extreme UV Index today: Take immediate sun precautions.');
  } else if (maxUvToday >= 8) {
    uvLevel = 'Very High (8-10)';
    uvAdvice = 'Wear SPF 50+ sunscreen, wide-brim hat, and UV-blocking sunglasses.';
    uvColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  } else if (maxUvToday >= 6) {
    uvLevel = 'High (6-7)';
    uvAdvice = 'Apply SPF 30+ sunscreen every 2 hours. Seek shade during midday.';
    uvColor = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  } else if (maxUvToday >= 3) {
    uvLevel = 'Moderate (3-5)';
    uvAdvice = 'Wear sunscreen and sunglasses if outdoors for over 30 minutes.';
    uvColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  }

  // --- 4. Travel & Commute Advice ---
  let travelCommuteAdvice = 'Ideal driving and transit conditions.';
  if ([45, 48].includes(weatherCode)) {
    travelCommuteAdvice = 'Foggy conditions: Drive with low-beam headlights and maintain extra distance.';
  } else if (precip > 5 || [65, 82, 95].includes(weatherCode)) {
    travelCommuteAdvice = 'Heavy rain alert: Expect reduced roadway visibility and potential traffic delays.';
  } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode) || temp < 0) {
    travelCommuteAdvice = 'Icy or snowy roads possible: Drive with caution and check tire grip.';
  } else if (wind > 40) {
    travelCommuteAdvice = 'Strong crosswinds: Hold steering wheel firmly, especially on bridges/highways.';
  }

  // --- 5. Optimal Outdoor Workout Window Calculation ---
  let bestHourIndex = 7; // Default 7 AM
  let minPenalty = 999;

  // Scan next 24 hours of hourly data
  const next24 = hourly.time.slice(0, 24);
  next24.forEach((timeStr, idx) => {
    const hourDate = new Date(timeStr);
    const hourNum = hourDate.getHours();
    // Prefer daytime hours between 6 AM and 8 PM
    if (hourNum < 6 || hourNum > 20) return;

    const hTemp = hourly.temperature_2m[idx] ?? temp;
    const hPrecipProb = hourly.precipitation_probability[idx] ?? 0;
    const hUv = hourly.uv_index[idx] ?? 0;
    const hWind = hourly.wind_speed_10m[idx] ?? wind;

    // Penalty score for workout
    const tempDist = Math.abs(hTemp - 20); // 20°C ideal workout temp
    const penalty = tempDist * 1.5 + hPrecipProb * 0.8 + hUv * 3 + hWind * 0.5;

    if (penalty < minPenalty) {
      minPenalty = penalty;
      bestHourIndex = idx;
    }
  });

  const bestHourTime = hourly.time[bestHourIndex]
    ? new Date(hourly.time[bestHourIndex]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '07:00 AM';

  const workoutWindow = {
    bestTime: `${bestHourTime} - ${bestHourTime.replace(/(\d+):/, (_m, p1) => `${(parseInt(p1) + 1) % 12 || 12}:`)}`,
    reason: `Lowest rain risk (${hourly.precipitation_probability[bestHourIndex] ?? 0}%), comfortable temperature (${Math.round(hourly.temperature_2m[bestHourIndex] ?? temp)}°C), and safe UV index.`,
  };

  // --- 6. Weather Summary Text ---
  const todayHigh = Math.round(daily.temperature_2m_max[0] ?? temp);
  const todayLow = Math.round(daily.temperature_2m_min[0] ?? temp);
  const weatherSummaryText = `Today's temperatures range from ${todayLow}°C to ${todayHigh}°C with ${humidity}% humidity and ${Math.round(wind)} km/h winds. Overall activity conditions score ${score}/100 (${activityLevelText}).`;

  return {
    activityScore: score,
    activityLevelText,
    clothingAdvice,
    uvProtection: {
      level: uvLevel,
      advice: uvAdvice,
      color: uvColor,
    },
    travelCommuteAdvice,
    workoutWindow,
    weatherSummaryText,
    warnings,
  };
}
