// ========================================
// WEATHER API CONFIGURATION
// ========================================
// This will be replaced by GitHub Actions with the real API key
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';

// OpenWeatherMap API endpoints
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org';
const GEOCODING_ENDPOINT = '/geo/1.0/direct';
const CURRENT_WEATHER_ENDPOINT = '/data/2.5/weather';
const FORECAST_ENDPOINT = '/data/2.5/forecast';

// Check if we're using real API key
const isUsingRealAPI = WEATHER_API_KEY.length === 32 && /^[a-f0-9]{32}$/i.test(WEATHER_API_KEY);

// Debug logging
console.log('=== PEG IT DEBUG INFO ===');
console.log('Current time:', new Date().toISOString());
console.log('UK time:', new Date().toLocaleString("en-GB", {timeZone: "Europe/London"}));
console.log('Weather API Key configured:', isUsingRealAPI);
if (isUsingRealAPI) {
    console.log('✅ Ready to use OpenWeatherMap API');
} else {
    console.log('ℹ️ Using demo data - add OpenWeatherMap API key for real forecasts');
}

// ========================================
// TIME UTILITY FUNCTIONS
// ========================================
function getCurrentUKTime() {
    return new Date().toLocaleString("en-GB", {
        timeZone: "Europe/London",
        hour12: false
    });
}

function getCurrentUKHour() {
    const ukTime = new Date().toLocaleString("en-GB", {
        timeZone: "Europe/London",
        hour: '2-digit',
        hour12: false
    });
    return parseInt(ukTime);
}

function getTodayUKDateString() {
    return new Date().toLocaleDateString("en-GB", {timeZone: "Europe/London"});
}

function getTomorrowUKDateString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-GB", {timeZone: "Europe/London"});
}

function getDateFromUKString(ukDateString) {
    // Convert "DD/MM/YYYY" to Date object
    const [day, month, year] = ukDateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

function getDayNameFromUKDate(ukDateString) {
    const today = getTodayUKDateString();
    const tomorrow = getTomorrowUKDateString();
    
    console.log(`Comparing dates - Input: ${ukDateString}, Today: ${today}, Tomorrow: ${tomorrow}`);
    
    if (ukDateString === today) {
        return 'Today';
    } else if (ukDateString === tomorrow) {
        return 'Tomorrow';
    } else {
        const date = getDateFromUKString(ukDateString);
        return date.toLocaleDateString('en-GB', { weekday: 'long' });
    }
}

function isGoodTimeToHangWashing(hour) {
    return hour >= 7 && hour <= 18;
}

// ========================================
// DEMO DATA (fallback with proper dates)
// ========================================
const generateMockWeatherData = (locationName) => {
    const seed = locationName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const random = (min, max) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * (max - min + 1)) + min;
    
    const baseTemp = random(12, 22);
    const baseHumidity = random(45, 75);
    const baseWind = random(8, 18);
    const currentHour = getCurrentUKHour();
    
    console.log('=== GENERATING DEMO DATA ===');
    console.log('Current hour:', currentHour);
    
    // Create forecast for the next 5 days starting from today
    const forecast = [];
    
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + dayOffset);
        const ukDateString = forecastDate.toLocaleDateString("en-GB", {timeZone: "Europe/London"});
        const dayName = getDayNameFromUKDate(ukDateString);
        
        console.log(`Day ${dayOffset}: ${dayName} (${ukDateString})`);
        
        // Generate hourly data
        const hourlyData = [];
        const isToday = dayOffset === 0;
        
        // For today, only include future hours that are good for washing
        // For other days, include good washing hours
        const startHour = isToday ? Math.max(currentHour + 1, 7) : 8;
        const endHour = 18;
        
        for (let hour = startHour; hour <= endHour; hour++) {
            if (isToday && hour <= currentHour) continue; // Skip past hours
            if (!isGoodTimeToHangWashing(hour)) continue; // Skip bad hours
            
            hourlyData.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                temp: baseTemp + random(-3, 4) + (dayOffset * random(-1, 2)),
                humidity: baseHumidity + random(-10, 15) + (dayOffset * random(-5, 5)),
                windSpeed: baseWind + random(-5, 8) + (dayOffset * random(-2, 3)),
                precipitation: random(0, 15) + (dayOffset * random(0, 10)),
                isToday: isToday
            });
        }
        
        // Only add day if it has viable hours
        if (hourlyData.length > 0 || !isToday) {
            const dayTemp = baseTemp + random(-2, 3) + (dayOffset * random(-1, 2));
            const dayHumidity = baseHumidity + random(-10, 10) + (dayOffset * random(-5, 5));
            const dayWind = baseWind + random(-5, 8) + (dayOffset * random(-2, 3));
            const dayPrecip = random(0, 20) + (dayOffset * random(0, 15));
            
            forecast.push({
                date: dayName,
                temp: dayTemp,
                humidity: dayHumidity,
                windSpeed: dayWind,
                precipitation: dayPrecip,
                description: dayPrecip > 30 ? 'rainy' : dayHumidity > 70 ? 'overcast' : 'partly cloudy',
                hourly: hourlyData,
                rawDate: ukDateString,
                dayOffset: dayOffset
            });
        }
    }
    
    console.log('Generated forecast:', forecast.map(d => `${d.date} (${d.rawDate})`));
    
    return {
        current: { 
            temp: baseTemp, 
            humidity: baseHumidity, 
            windSpeed: baseWind, 
            description: "partly cloudy" 
        },
        forecast: forecast
    };
};

// ========================================
// LOCATION LOOKUP FUNCTIONS
// ========================================
async function getCoordinatesFromLocation(locationName) {
    if (!isUsingRealAPI) {
        const knownLocations = {
            'birmingham': { lat: 52.4862, lon: -1.8904 },
            'birmingham, uk': { lat: 52.4862, lon: -1.8904 },
            'london': { lat: 51.5074, lon: -0.1278 },
            'london, uk': { lat: 51.5074, lon: -0.1278 },
            'manchester': { lat: 53.4808, lon: -2.2426 },
            'manchester, uk': { lat: 53.4808, lon: -2.2426 },
            'leeds': { lat: 53.8008, lon: -1.5491 },
            'bristol': { lat: 51.4545, lon: -2.5879 },
            'liverpool': { lat: 53.4084, lon: -2.9916 },
            'edinburgh': { lat: 55.9533, lon: -3.1883 },
            'glasgow': { lat: 55.8642, lon: -4.2518 },
            'cardiff': { lat: 51.4816, lon: -3.1791 },
            'belfast': { lat: 54.5973, lon: -5.9301 }
        };
        
        const normalized = locationName.toLowerCase().trim();
        return knownLocations[normalized] || knownLocations['birmingham, uk'];
    }

    try {
        const geocodingUrl = `${OPENWEATHER_BASE_URL}${GEOCODING_ENDPOINT}?` +
            `q=${encodeURIComponent(locationName)}&limit=1&appid=${WEATHER_API_KEY}`;
        
        const response = await fetch(geocodingUrl);
        
        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error(`Location "${locationName}" not found`);
        }
        
        return { lat: data[0].lat, lon: data[0].lon };
        
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return { lat: 52.4862, lon: -1.8904 };
    }
}

// ========================================
// OPENWEATHERMAP API FUNCTIONS
// ========================================
async function fetchOpenWeatherData(lat, lon) {
    if (!isUsingRealAPI) {
        console.log('Using demo data - OpenWeatherMap API key not configured');
        return null;
    }

    try {
        const currentUrl = `${OPENWEATHER_BASE_URL}${CURRENT_WEATHER_ENDPOINT}?` +
            `lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        const forecastUrl = `${OPENWEATHER_BASE_URL}${FORECAST_ENDPOINT}?` +
            `lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        console.log('Fetching OpenWeatherMap data for coordinates:', lat, lon);

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('API request failed');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        console.log('✅ Successfully fetched OpenWeatherMap data');
        
        return { current: currentData, forecast: forecastData };

    } catch (error) {
        console.error('Error fetching OpenWeatherMap data:', error);
        return null;
    }
}

// ========================================
// DATA PROCESSING FUNCTIONS
// ========================================
function processOpenWeatherData(weatherData) {
    if (!weatherData || !weatherData.current || !weatherData.forecast) {
        return null;
    }

    console.log('=== PROCESSING OPENWEATHER DATA ===');
    
    const current = weatherData.current;
    const forecastList = weatherData.forecast.list;
    const currentUKHour = getCurrentUKHour();
    const todayUK = getTodayUKDateString();
    const tomorrowUK = getTomorrowUKDateString();

    console.log('Today UK:', todayUK);
    console.log('Tomorrow UK:', tomorrowUK);
    console.log('Current UK hour:', currentUKHour);

    const currentConditions = {
        temp: Math.round(current.main.temp),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        description: getWeatherDescriptionFromOpenWeather(current.weather[0])
    };

    // Group forecast by UK date
    const dailyGroups = {};
    
    forecastList.forEach((item, index) => {
        const utcDate = new Date(item.dt * 1000);
        const ukDateStr = utcDate.toLocaleDateString("en-GB", {timeZone: "Europe/London"});
        const ukTimeStr = utcDate.toLocaleTimeString("en-GB", {timeZone: "Europe/London", hour12: false});
        const ukHour = parseInt(ukTimeStr.split(':')[0]);
        
        if (index < 5) { // Debug first few items
            console.log(`Item ${index}: UTC=${utcDate.toISOString()}, UK=${ukDateStr} ${ukTimeStr}, Hour=${ukHour}`);
        }
        
        if (!dailyGroups[ukDateStr]) {
            dailyGroups[ukDateStr] = [];
        }
        
        const isToday = ukDateStr === todayUK;
        const shouldInclude = !isToday || (ukHour > currentUKHour && isGoodTimeToHangWashing(ukHour));
        
        if (shouldInclude && isGoodTimeToHangWashing(ukHour)) {
            dailyGroups[ukDateStr].push({
                time: `${ukHour.toString().padStart(2, '0')}:00`,
                temp: Math.round(item.main.temp),
                humidity: item.main.humidity,
                windSpeed: Math.round(item.wind.speed * 3.6),
                precipitation: Math.round((item.pop || 0) * 100),
                isToday: isToday
            });
        }
    });

    // Sort dates chronologically and create forecast
    const sortedDates = Object.keys(dailyGroups).sort((a, b) => {
        const dateA = getDateFromUKString(a);
        const dateB = getDateFromUKString(b);
        return dateA - dateB;
    });

    console.log('Sorted dates:', sortedDates);

    const forecastData = [];
    
    sortedDates.forEach((dateStr) => {
        const dayData = dailyGroups[dateStr];
        const dayName = getDayNameFromUKDate(dateStr);
        
        console.log(`Processing ${dayName} (${dateStr}) with ${dayData.length} hours`);
        
        if (dayData.length === 0) return;

        const avgTemp = Math.round(dayData.reduce((sum, h) => sum + h.temp, 0) / dayData.length);
        const avgHumidity = Math.round(dayData.reduce((sum, h) => sum + h.humidity, 0) / dayData.length);
        const avgWind = Math.round(dayData.reduce((sum, h) => sum + h.windSpeed, 0) / dayData.length);
        const maxPrecip = Math.max(...dayData.map(h => h.precipitation));

        forecastData.push({
            date: dayName,
            temp: avgTemp,
            humidity: avgHumidity,
            windSpeed: avgWind,
            precipitation: maxPrecip,
            description: getWeatherDescription({
                screenTemperature: avgTemp,
                screenRelativeHumidity: avgHumidity,
                probOfPrecipitation: maxPrecip / 100
            }),
            hourly: dayData.slice(0, 8),
            rawDate: dateStr
        });
    });

    console.log('Final forecast order:', forecastData.map(d => `${d.date} (${d.rawDate})`));

    return {
        current: currentConditions,
        forecast: forecastData.slice(0, 5)
    };
}

function getWeatherDescriptionFromOpenWeather(weather) {
    const main = weather.main.toLowerCase();
    const description = weather.description.toLowerCase();
    
    if (main.includes('rain') || description.includes('rain')) {
        if (description.includes('light')) return 'light rain';
        if (description.includes('heavy')) return 'heavy rain';
        return 'rainy';
    }
    
    if (main.includes('cloud')) {
        if (description.includes('few') || description.includes('scattered')) return 'partly cloudy';
        return 'overcast';
    }
    
    if (main.includes('clear') || main.includes('sun')) return 'sunny';
    
    return 'partly cloudy';
}

function getWeatherDescription(data) {
    const temp = data.screenTemperature || 15;
    const humidity = data.screenRelativeHumidity || 65;
    const precipProb = (data.probOfPrecipitation || 0) * 100;
    
    if (precipProb > 60) return 'rainy';
    if (precipProb > 30) return 'light rain';
    if (humidity > 80) return 'overcast';
    if (humidity < 50 && temp > 18) return 'sunny';
    return 'partly cloudy';
}

// ========================================
// WASHING PREDICTION FUNCTIONS
// ========================================
function calculateWashingScore(temp, humidity, windSpeed, precipitation) {
    let score = 0;
    
    if (temp >= 15 && temp <= 25) {
        score += 25;
    } else if (temp >= 10 && temp <= 30) {
        score += 15;
    } else {
        score += 5;
    }
    
    if (humidity <= 50) {
        score += 30;
    } else if (humidity <= 65) {
        score += 20;
    } else if (humidity <= 80) {
        score += 10;
    } else {
        score += 0;
    }
    
    if (windSpeed >= 10 && windSpeed <= 25) {
        score += 25;
    } else if (windSpeed >= 5 && windSpeed <= 35) {
        score += 15;
    } else {
        score += 5;
    }
    
    if (precipitation <= 5) {
        score += 20;
    } else if (precipitation <= 20) {
        score += 10;
    } else if (precipitation <= 50) {
        score += 5;
    } else {
        score += 0;
    }
    
    return Math.min(score, 100);
}

function calculateDryingTime(temp, humidity, windSpeed, fabricType = 'cotton') {
    const baseTimes = {
        'cotton': 4,
        'thick': 6,
        'delicate': 3,
        'bedding': 8
    };
    
    let baseTime = baseTimes[fabricType] || 4;
    
    let tempFactor = 1;
    if (temp >= 20) tempFactor = 0.8;
    else if (temp >= 15) tempFactor = 1.0;
    else if (temp >= 10) tempFactor = 1.3;
    else tempFactor = 1.6;
    
    let humidityFactor = 1;
    if (humidity <= 40) humidityFactor = 0.7;
    else if (humidity <= 55) humidityFactor = 0.9;
    else if (humidity <= 70) humidityFactor = 1.2;
    else humidityFactor = 1.6;
    
    let windFactor = 1;
    if (windSpeed >= 20) windFactor = 0.7;
    else if (windSpeed >= 12) windFactor = 0.8;
    else if (windSpeed >= 6) windFactor = 1.0;
    else windFactor = 1.2;
    
    const totalTime = baseTime * tempFactor * humidityFactor * windFactor;
    return Math.round(totalTime * 10) / 10;
}

function formatDryingTime(hours) {
    if (hours >= 24) {
        return `${Math.round(hours / 24 * 10) / 10} days`;
    } else if (hours >= 1) {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        if (minutes === 0) {
            return `${wholeHours}h`;
        } else {
            return `${wholeHours}h ${minutes}m`;
        }
    } else {
        return `${Math.round(hours * 60)}m`;
    }
}

function getSafeOutdoorTime(forecast, startHour = 9) {
    let safeHours = 0;
    
    if (forecast[0] && forecast[0].hourly) {
        for (let hour of forecast[0].hourly) {
            if (parseInt(hour.time.split(':')[0]) >= startHour) {
                if (hour.precipitation > 20) {
                    break;
                }
                safeHours++;
            }
        }
        
        if (safeHours >= (24 - startHour)) {
            for (let i = 1; i < forecast.length; i++) {
                if (forecast[i].precipitation > 20) {
                    break;
                }
                safeHours += 12;
            }
        }
    } else {
        for (let day of forecast) {
            if (day.precipitation > 20) {
                break;
            }
            safeHours += 12;
        }
    }
    
    return Math.max(safeHours, 2);
}

function getScoreCategory(score) {
    if (score >= 80) return { category: 'excellent', label: 'Excellent' };
    if (score >= 60) return { category: 'good', label: 'Good' };
    if (score >= 40) return { category: 'fair', label: 'Fair' };
    return { category: 'poor', label: 'Poor' };
}

function getWeatherIcon(description) {
    const icons = {
        'sunny': '☀️',
        'partly cloudy': '⛅',
        'overcast': '☁️',
        'rainy': '🌧️',
        'light rain': '🌦️',
        'heavy rain': '⛈️'
    };
    return icons[description] || '🌤️';
}

function getWeatherEmoji(description, score) {
    if (score >= 80) {
        return description === 'sunny' ? '☀️💯' : '⛅💯';
    } else if (score >= 60) {
        return description === 'sunny' ? '☀️✨' : '⛅👍';
    } else if (score >= 40) {
        return description.includes('rain') ? '🌧️⚠️' : '☁️🤔';
    } else {
        return description.includes('rain') ? '🌧️❌' : '☁️👎';
    }
}

function getWindVisualization(windSpeed) {
    let level = 1;
    let description = '';
    let emoji = '';
    
    if (windSpeed <= 5) {
        level = 1;
        description = 'Calm';
        emoji = '🍃';
    } else if (windSpeed <= 12) {
        level = 2;
        description = 'Light breeze';
        emoji = '🌬️';
    } else if (windSpeed <= 20) {
        level = 3;
        description = 'Moderate';
        emoji = '💨';
    } else if (windSpeed <= 30) {
        level = 4;
        description = 'Strong breeze';
        emoji = '🌪️';
    } else {
        level = 5;
        description = 'Strong wind';
        emoji = '⛈️';
    }
    
    const bars = Array.from({length: 5}, (_, i) => 
        `<div class="wind-bar${i < level ? ' active' : ''}"></div>`
    ).join('');
    
    return `
        <div class="wind-indicator">
            ${emoji}
            <div class="wind-bars wind-level-${level}">
                ${bars}
            </div>
            <span class="wind-speed">${windSpeed} km/h</span>
            <span class="wind-description">${description}</span>
        </div>
    `;
}

function findBestTimes(forecast, fabricType = 'cotton') {
    console.log('=== FINDING BEST TIMES ===');
    console.log('Input forecast:', forecast.map(d => `${d.date} (${d.rawDate || 'no raw date'})`));
    
    const bestTimes = [];
    const currentHour = getCurrentUKHour();
    
    // Check if it's too late today for new washing
    const tooLateToday = currentHour >= 17;
    
    forecast.forEach((day, index) => {
        console.log(`Checking ${day.date}: hourly=${day.hourly ? day.hourly.length : 0} items`);
        
        const isToday = day.date === 'Today';
        
        if (isToday && !tooLateToday && day.hourly) {
            // Add today's hourly recommendations
            day.hourly.forEach(hour => {
                const hourNum = parseInt(hour.time.split(':')[0]);
                
                if (hourNum > currentHour && isGoodTimeToHangWashing(hourNum)) {
                    const score = calculateWashingScore(hour.temp, hour.humidity, hour.windSpeed, hour.precipitation);
                    if (score >= 60) {
                        const dryingTime = calculateDryingTime(hour.temp, hour.humidity, hour.windSpeed, fabricType);
                        const safeTime = getSafeOutdoorTime(forecast, hourNum);
                        
                        bestTimes.push({
                            time: `Today ${hour.time}`,
                            score: score,
                            temp: hour.temp,
                            dryingTime: dryingTime,
                            safeTime: safeTime,
                            canFullyDry: dryingTime <= safeTime,
                            isToday: true,
                            sortOrder: 0 // Today gets priority
                        });
                    }
                }
            });
        } else if (!isToday) {
            // Add future day recommendations
            const score = calculateWashingScore(day.temp, day.humidity, day.windSpeed, day.precipitation);
            if (score >= 60) {
                const dryingTime = calculateDryingTime(day.temp, day.humidity, day.windSpeed, fabricType);
                const safeTime = getSafeOutdoorTime([day], 9);
                
                bestTimes.push({
                    time: day.date,
                    score: score,
                    temp: day.temp,
                    dryingTime: dryingTime,
                    safeTime: safeTime,
                    canFullyDry: dryingTime <= safeTime,
                    isToday: false,
                    sortOrder: index // Maintain chronological order
                });
            }
        }
    });
    
    // Sort by chronological order first, then by score within same day
    const sorted = bestTimes.sort((a, b) => {
        // Tomorrow always comes first
        if (a.time.includes('Tomorrow') && !b.time.includes('Tomorrow')) return -1;
        if (!a.time.includes('Tomorrow') && b.time.includes('Tomorrow')) return 1;
        
        // Today items first (if any)
        if (a.isToday && !b.isToday) return -1;
        if (!a.isToday && b.isToday) return 1;
        
        // Then by chronological order (sortOrder represents the day index)
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        
        // Finally by score within the same day
        return b.score - a.score;
    }).slice(0, 3);
    
    console.log('Best times found:', sorted.map(t => `${t.time} (score: ${t.score})`));
    
    return sorted;
}

function getWashingTips(forecast) {
    const tips = [];
    const currentHour = getCurrentUKHour();
    
    if (currentHour >= 18) {
        tips.push("It's getting late - consider washing tomorrow morning for best drying results");
    } else if (currentHour <= 6) {
        tips.push("Early bird! Wait until 7-8 AM for optimal drying conditions");
    }
    
    const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length;
    const avgWind = forecast.reduce((sum, day) => sum + day.windSpeed, 0) / forecast.length;
    const rainyDays = forecast.filter(day => day.precipitation > 20).length;
    
    if (avgHumidity > 70) {
        tips.push("High humidity expected - consider using indoor drying or wait for drier conditions");
    }
    
    if (avgWind > 20) {
        tips.push("Strong winds forecasted - secure lighter items well or bring them inside");
    }
    
    if (rainyDays > 2) {
        tips.push("Several rainy days ahead - plan indoor drying alternatives");
    }
    
    if (avgHumidity < 50 && avgWind > 10) {
        tips.push("Great drying conditions! Perfect time to wash heavier items like bedding");
    }
    
    tips.push("For fastest drying, hang clothes in single layers with good air circulation");
    tips.push("Turn dark clothes inside out to prevent fading in direct sunlight");
    
    return tips;
}

// ========================================
// MAIN APPLICATION FUNCTION
// ========================================
async function getWeatherForecast() {
    const location = document.getElementById('locationInput').value.trim();
    const fabricType = document.getElementById('fabricType').value;
    const resultsDiv = document.getElementById('results');
    
    if (!location) {
        resultsDiv.innerHTML = '<div class="error">Please enter a location</div>';
        return;
    }
    
    const currentUKTime = getCurrentUKTime();
    const currentHour = getCurrentUKHour();
    
    resultsDiv.innerHTML = `<div class="loading">Fetching weather data for optimal washing times...<br><small>Current UK time: ${currentUKTime}</small></div>`;
    
    try {
        console.log('=== Starting weather forecast for:', location, '===');
        console.log('Current UK time:', currentUKTime);
        console.log('Current UK hour:', currentHour);
        
        const coords = await getCoordinatesFromLocation(location);
        console.log('Coordinates found:', coords);
        
        let weatherData = null;
        let processedData = null;
        let dataSource = '';
        
        if (isUsingRealAPI) {
            weatherData = await fetchOpenWeatherData(coords.lat, coords.lon);
            
            if (weatherData) {
                processedData = processOpenWeatherData(weatherData);
                dataSource = '<div class="api-status api-live">📡 Live OpenWeatherMap Data</div>';
                console.log('✅ Using real OpenWeatherMap data for', location);
            }
        }
        
        if (!processedData) {
            processedData = generateMockWeatherData(location);
            dataSource = '<div class="api-status api-demo">🎭 Demo Data - Add OpenWeatherMap API key for real forecasts</div>';
            console.log('📱 Using generated demo data for', location);
        }
        
        const bestTimes = findBestTimes(processedData.forecast, fabricType);
        const tips = getWashingTips(processedData.forecast);
        
        let html = '';
        
        html += dataSource;
        
        // Add current time info with better formatting
        const currentTime = getCurrentUKTime();
        const [datePart, timePart] = currentTime.split(', ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const date = new Date(year, month - 1, day);
        const dayName = dayNames[date.getDay()];
        const monthName = monthNames[month - 1];
        
        const displayHour = parseInt(hour);
        const ampm = displayHour >= 12 ? 'PM' : 'AM';
        const displayHour12 = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour;
        
        html += `
            <div class="time-info">
                <div class="current-time">
                    <span class="time-icon">🕐</span>
                    <div class="time-details">
                        <div class="time-main">${displayHour12}:${minute} ${ampm}</div>
                        <div class="time-date">${dayName}, ${day} ${monthName} ${year}</div>
                    </div>
                </div>
            </div>
        `;
        
        if (bestTimes.length > 0) {
            const fabricSelect = document.getElementById('fabricType');
            const fabricText = fabricSelect.options[fabricSelect.selectedIndex].text.toLowerCase();
            
            html += `
                <div class="best-times">
                    <h2>🎯 When to Hang Your Washing</h2>
                    <p>Best times for ${fabricText} in <strong>${location}</strong>:</p>
                    <div class="time-recommendations">
            `;
            
            bestTimes.forEach((time, index) => {
                const isToday = time.isToday;
                const bestOverallScore = Math.max(...bestTimes.map(t => t.score));
                const isBestOverall = time.score === bestOverallScore;
                
                let emoji, hangTime, timeDisplay;
                
                if (isToday) {
                    emoji = '⏰';
                    const hourMatch = time.time.match(/(\d{2}):00/);
                    if (hourMatch) {
                        const hour = parseInt(hourMatch[1]);
                        const timeStr = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
                        if (hour === 12) timeStr = '12:00 PM';
                        if (hour === 0) timeStr = '12:00 AM';
                        timeDisplay = `Today ${timeStr}`;
                        hangTime = `Hang out at ${timeStr}`;
                    } else {
                        timeDisplay = time.time;
                        hangTime = 'Hang out later today';
                    }
                } else {
                    emoji = isBestOverall ? '🌟' : '📅';
                    timeDisplay = time.time;
                    hangTime = 'Hang out after 8 AM';
                }
                
                const urgency = isToday ? 'today-item' : 'future-item';
                const badge = isBestOverall ? 'best-choice' : isToday ? 'today-choice' : 'good-choice';
                const badgeText = isBestOverall ? 'BEST' : isToday ? 'TODAY' : 'GOOD';
                
                html += `
                    <div class="recommendation ${urgency}">
                        <div class="rec-header">
                            <span class="rec-emoji">${emoji}</span>
                            <span class="rec-time">${timeDisplay}</span>
                            <span class="rec-badge ${badge}">${badgeText}</span>
                        </div>
                        <div class="rec-hang-time">
                            🧺 ${hangTime}
                        </div>
                        <div class="rec-verdict">
                            ${time.canFullyDry ? 
                                '✅ Will dry completely before any rain' : 
                                '⚠️ May need bringing in if weather changes'}
                        </div>
                        <div class="rec-summary">
                            ${time.temp}°C • ${formatDryingTime(time.dryingTime)} drying time
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        } else {
            // Check if it's too late today
            if (currentHour >= 17) {
                html += `
                    <div class="best-times late-today">
                        <h2>🌙 Too Late Today</h2>
                        <p>It's getting late (${currentHour > 12 ? (currentHour - 12) + ':00 PM' : currentHour + ':00 AM'}) to hang washing in <strong>${location}</strong>.</p>
                        <div class="late-advice">
                            <div class="advice-item">🌅 Try tomorrow morning after 8 AM</div>
                            <div class="advice-item">🏠 Consider indoor drying tonight</div>
                            <div class="advice-item">⏰ Set a reminder for tomorrow</div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="best-times poor-conditions">
                        <h2>⚠️ Not Great for Washing</h2>
                        <p>Weather in <strong>${location}</strong> isn't ideal for outdoor drying over the next few days.</p>
                        <div class="poor-advice">
                            <div class="advice-item">🏠 Consider indoor drying</div>
                            <div class="advice-item">⏳ Wait for better conditions</div>
                            <div class="advice-item">🌡️ Use a heated drying rack</div>
                        </div>
                    </div>
                `;
            }
        }
        
        html += '<div class="forecast-grid">';
        processedData.forecast.forEach(day => {
            const score = calculateWashingScore(day.temp, day.humidity, day.windSpeed, day.precipitation);
            const scoreInfo = getScoreCategory(score);
            const icon = getWeatherEmoji(day.description, score);
            const dryingTime = calculateDryingTime(day.temp, day.humidity, day.windSpeed, fabricType);
            const safeTime = getSafeOutdoorTime([day], 9);
            
            html += `
                <div class="day-card">
                    <div class="day-header">
                        <h3>${day.date}</h3>
                        <span class="washing-score score-${scoreInfo.category}">${scoreInfo.label}</span>
                    </div>
                    <div class="weather-summary">
                        <span class="weather-icon-large">${icon}</span>
                        <div class="weather-main">
                            <div class="temperature">${day.temp}°C</div>
                            <div class="description">${day.description}</div>
                            <div class="washing-verdict">
                                ${score >= 80 ? '🧺 Perfect for washing!' : 
                                  score >= 60 ? '👕 Good washing day' : 
                                  score >= 40 ? '⚠️ Fair conditions' : 
                                  '❌ Poor drying weather'}
                            </div>
                        </div>
                    </div>
                    <div class="key-info">
                        <div class="info-item">
                            <span class="info-icon">🕐</span>
                            <span class="info-text">Dries in ${formatDryingTime(dryingTime)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">☔</span>
                            <span class="info-text">Safe for ${formatDryingTime(safeTime)}</span>
                        </div>
                    </div>
                    <details class="weather-details">
                        <summary>Show detailed conditions</summary>
                        <div class="detail-grid">
                            <div class="detail-item">💧 ${day.humidity}% humidity</div>
                            <div class="detail-item">${getWindVisualization(day.windSpeed)}</div>
                            <div class="detail-item">🌧️ ${day.precipitation}% rain chance</div>
                            <div class="detail-item">📊 ${score}/100 washing score</div>
                        </div>
                    </details>
                </div>
            `;
        });
        html += '</div>';
        
        html += `
            <div class="tips">
                <h3>🎯 Smart Drying Tips</h3>
                <ul>
        `;
        tips.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += `
                </ul>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="tips/" style="display: inline-block; background: linear-gradient(45deg, #4a7c59, #2d5a27); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        📚 View Complete Drying Guide
                    </a>
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        
        console.log('=== Weather forecast completed successfully ===');
        
    } catch (error) {
        console.error('Error getting weather forecast:', error);
        resultsDiv.innerHTML = `
            <div class="error">
                <strong>Error:</strong> Could not fetch weather data for "${location}". ${error.message}
                <br><br>
                Please check the location name and try again, or contact support if the issue persists.
            </div>
        `;
    }
}

// ========================================
// INITIALIZATION
// ========================================
window.addEventListener('load', () => {
    getWeatherForecast();
});

document.getElementById('locationInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherForecast();
    }
});