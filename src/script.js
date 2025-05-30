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
// If it's 32 characters and starts with alphanumeric, it's likely a real OpenWeatherMap key
const isUsingRealAPI = WEATHER_API_KEY.length === 32 && /^[a-f0-9]{32}$/i.test(WEATHER_API_KEY);

// Debug logging
console.log('Weather API Key configured:', isUsingRealAPI);
console.log('Weather API Key length:', WEATHER_API_KEY.length);
console.log('Weather API Key starts with:', WEATHER_API_KEY.substring(0, 8) + '...');
console.log('Is valid hex format?:', /^[a-f0-9]{32}$/i.test(WEATHER_API_KEY));
console.log('Raw API Key (first 10 chars):', JSON.stringify(WEATHER_API_KEY.substring(0, 10)));
if (isUsingRealAPI) {
    console.log('✅ Ready to use OpenWeatherMap API');
} else {
    console.log('ℹ️ Using demo data - add OpenWeatherMap API key for real forecasts');
}

// ========================================
// DEMO DATA (fallback)
// ========================================
const generateMockWeatherData = (locationName) => {
    // Generate different mock data based on location name for variety
    const seed = locationName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const random = (min, max) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * (max - min + 1)) + min;
    
    const baseTemp = random(12, 22);
    const baseHumidity = random(45, 75);
    const baseWind = random(8, 18);
    
    return {
        current: { 
            temp: baseTemp, 
            humidity: baseHumidity, 
            windSpeed: baseWind, 
            description: "partly cloudy" 
        },
        forecast: [
            { 
                date: "Today", 
                temp: baseTemp + random(-2, 3), 
                humidity: baseHumidity + random(-10, 10), 
                windSpeed: baseWind + random(-5, 8), 
                precipitation: random(0, 20), 
                description: "partly cloudy",
                hourly: [
                    { time: "09:00", temp: baseTemp - 2, humidity: baseHumidity + 5, windSpeed: baseWind - 3, precipitation: random(0, 10) },
                    { time: "12:00", temp: baseTemp + 1, humidity: baseHumidity - 5, windSpeed: baseWind + 2, precipitation: random(0, 5) },
                    { time: "15:00", temp: baseTemp + 3, humidity: baseHumidity - 8, windSpeed: baseWind + 5, precipitation: random(0, 5) },
                    { time: "18:00", temp: baseTemp, humidity: baseHumidity, windSpeed: baseWind, precipitation: random(0, 15) }
                ]
            },
            { date: "Tomorrow", temp: baseTemp + random(-3, 5), humidity: baseHumidity + random(-15, 15), windSpeed: baseWind + random(-5, 10), precipitation: random(0, 30), description: random(0, 1) ? "sunny" : "partly cloudy" },
            { date: "Day 3", temp: baseTemp + random(-4, 4), humidity: baseHumidity + random(-10, 20), windSpeed: baseWind + random(-3, 7), precipitation: random(0, 60), description: random(0, 2) === 0 ? "sunny" : random(0, 1) ? "partly cloudy" : "rainy" },
            { date: "Day 4", temp: baseTemp + random(-2, 6), humidity: baseHumidity + random(-5, 15), windSpeed: baseWind + random(-2, 8), precipitation: random(0, 25), description: "partly cloudy" },
            { date: "Day 5", temp: baseTemp + random(-1, 7), humidity: baseHumidity + random(-20, 10), windSpeed: baseWind + random(0, 12), precipitation: random(0, 15), description: "sunny" }
        ]
    };
};

// ========================================
// LOCATION LOOKUP FUNCTIONS
// ========================================
async function getCoordinatesFromLocation(locationName) {
    if (!isUsingRealAPI) {
        // For demo mode, return some reasonable coordinates based on location
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
            'belfast': { lat: 54.5973, lon: -5.9301 },
            'new york': { lat: 40.7128, lon: -74.0060 },
            'paris': { lat: 48.8566, lon: 2.3522 },
            'berlin': { lat: 52.5200, lon: 13.4050 },
            'tokyo': { lat: 35.6762, lon: 139.6503 },
            'sydney': { lat: -33.8688, lon: 151.2093 }
        };
        
        const normalized = locationName.toLowerCase().trim();
        return knownLocations[normalized] || knownLocations['birmingham, uk'];
    }

    try {
        // Use OpenWeatherMap Geocoding API to get coordinates for any location
        const geocodingUrl = `${OPENWEATHER_BASE_URL}${GEOCODING_ENDPOINT}?` +
            `q=${encodeURIComponent(locationName)}&limit=1&appid=${WEATHER_API_KEY}`;
        
        console.log('Fetching coordinates for:', locationName);
        console.log('Geocoding URL:', geocodingUrl);
        
        const response = await fetch(geocodingUrl);
        
        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error(`Location "${locationName}" not found`);
        }
        
        const result = { lat: data[0].lat, lon: data[0].lon };
        console.log('✅ Found coordinates:', result);
        return result;
        
    } catch (error) {
        console.error('Error getting coordinates:', error);
        // Fallback to Birmingham if geocoding fails
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
        // Fetch current weather
        const currentUrl = `${OPENWEATHER_BASE_URL}${CURRENT_WEATHER_ENDPOINT}?` +
            `lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        // Fetch 5-day forecast
        const forecastUrl = `${OPENWEATHER_BASE_URL}${FORECAST_ENDPOINT}?` +
            `lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        console.log('Fetching OpenWeatherMap data for coordinates:', lat, lon);

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok) {
            throw new Error(`OpenWeatherMap current weather error: ${currentResponse.status} ${currentResponse.statusText}`);
        }

        if (!forecastResponse.ok) {
            throw new Error(`OpenWeatherMap forecast error: ${forecastResponse.status} ${forecastResponse.statusText}`);
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        console.log('✅ Successfully fetched OpenWeatherMap data');
        console.log('Current weather:', currentData.name, currentData.main.temp + '°C');
        console.log('Forecast points:', forecastData.list.length);
        
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

    const current = weatherData.current;
    const forecastList = weatherData.forecast.list;

    // Process current conditions
    const currentConditions = {
        temp: Math.round(current.main.temp),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
        description: getWeatherDescriptionFromOpenWeather(current.weather[0])
    };

    // Group forecast data by day
    const dailyGroups = {};
    
    forecastList.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!dailyGroups[dateKey]) {
            dailyGroups[dateKey] = [];
        }
        
        dailyGroups[dateKey].push({
            time: date.getHours().toString().padStart(2, '0') + ':00',
            temp: Math.round(item.main.temp),
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            precipitation: Math.round((item.pop || 0) * 100) // Probability of precipitation
        });
    });

    // Create daily forecast summaries
    const forecastData = [];
    const dateKeys = Object.keys(dailyGroups);
    
    dateKeys.forEach((dateKey, index) => {
        const dayData = dailyGroups[dateKey];
        const dayName = index === 0 ? 'Today' : 
                       index === 1 ? 'Tomorrow' : 
                       `Day ${index + 1}`;

        // Calculate daily averages
        const avgTemp = Math.round(dayData.reduce((sum, h) => sum + h.temp, 0) / dayData.length);
        const avgHumidity = Math.round(dayData.reduce((sum, h) => sum + h.humidity, 0) / dayData.length);
        const avgWind = Math.round(dayData.reduce((sum, h) => sum + h.windSpeed, 0) / dayData.length);
        const maxPrecip = Math.max(...dayData.map(h => h.precipitation));

        const dayForecast = {
            date: dayName,
            temp: avgTemp,
            humidity: avgHumidity,
            windSpeed: avgWind,
            precipitation: maxPrecip,
            description: getWeatherDescription({
                screenTemperature: avgTemp,
                screenRelativeHumidity: avgHumidity,
                probOfPrecipitation: maxPrecip / 100
            })
        };

        // Add hourly data for today
        if (index === 0) {
            dayForecast.hourly = dayData.slice(0, 8); // Next 8 hours
        }

        forecastData.push(dayForecast);
    });

    return {
        current: currentConditions,
        forecast: forecastData.slice(0, 5) // 5-day forecast
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
    const bestTimes = [];
    
    if (forecast[0].hourly) {
        forecast[0].hourly.forEach(hour => {
            const score = calculateWashingScore(hour.temp, hour.humidity, hour.windSpeed, hour.precipitation);
            if (score >= 60) {
                const dryingTime = calculateDryingTime(hour.temp, hour.humidity, hour.windSpeed, fabricType);
                const safeTime = getSafeOutdoorTime(forecast, parseInt(hour.time.split(':')[0]));
                
                bestTimes.push({
                    time: `Today ${hour.time}`,
                    score: score,
                    conditions: `${hour.temp}°C, ${hour.humidity}% humidity, ${getWindVisualization(hour.windSpeed)}`,
                    dryingTime: dryingTime,
                    safeTime: safeTime,
                    canFullyDry: dryingTime <= safeTime
                });
            }
        });
    }
    
    forecast.slice(1).forEach(day => {
        const score = calculateWashingScore(day.temp, day.humidity, day.windSpeed, day.precipitation);
        if (score >= 60) {
            const dryingTime = calculateDryingTime(day.temp, day.humidity, day.windSpeed, fabricType);
            const safeTime = getSafeOutdoorTime([day], 9);
            
            bestTimes.push({
                time: day.date,
                score: score,
                conditions: `${day.temp}°C, ${day.humidity}% humidity, ${getWindVisualization(day.windSpeed)}`,
                dryingTime: dryingTime,
                safeTime: safeTime,
                canFullyDry: dryingTime <= safeTime
            });
        }
    });
    
    return bestTimes.sort((a, b) => b.score - a.score).slice(0, 3);
}

function getWashingTips(forecast) {
    const tips = [];
    
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
    
    resultsDiv.innerHTML = '<div class="loading">Fetching weather data for optimal washing times...</div>';
    
    try {
        console.log('=== Starting weather forecast for:', location, '===');
        
        // Get coordinates for the location
        const coords = await getCoordinatesFromLocation(location);
        console.log('Coordinates found:', coords);
        
        // Fetch weather data (OpenWeatherMap or demo)
        let weatherData = null;
        let processedData = null;
        let dataSource = '';
        
        if (isUsingRealAPI) {
            weatherData = await fetchOpenWeatherData(coords.lat, coords.lon);
            
            if (weatherData) {
                // Use real OpenWeatherMap data
                processedData = processOpenWeatherData(weatherData);
                dataSource = '<div class="api-status api-live">📡 Live OpenWeatherMap Data</div>';
                console.log('✅ Using real OpenWeatherMap data for', location);
            }
        }
        
        if (!processedData) {
            // Fall back to generated demo data
            processedData = generateMockWeatherData(location);
            dataSource = '<div class="api-status api-demo">🎭 Demo Data - Add OpenWeatherMap API key for real forecasts</div>';
            console.log('📱 Using generated demo data for', location);
        }
        
        const bestTimes = findBestTimes(processedData.forecast, fabricType);
        const tips = getWashingTips(processedData.forecast);
        
        let html = '';
        
        html += dataSource;
        
        if (bestTimes.length > 0) {
            const fabricSelect = document.getElementById('fabricType');
            const fabricText = fabricSelect.options[fabricSelect.selectedIndex].text.toLowerCase();
            
            html += `
                <div class="best-times">
                    <h2>🎯 Best Times to Hang Washing</h2>
                    <p>Optimal times for ${fabricText} in <strong>${location}</strong>:</p>
                    <div class="time-slots">
            `;
            
            bestTimes.forEach(time => {
                const scoreInfo = getScoreCategory(time.score);
                const safeIndicator = time.canFullyDry ? 
                    `<span class="safe-indicator safe-yes">✓ Will dry completely</span>` :
                    `<span class="safe-indicator safe-partial">⚠ May need bringing in</span>`;
                
                html += `
                    <div class="time-slot ${scoreInfo.category}">
                        <h3>${time.time}</h3>
                        <div class="washing-score score-${scoreInfo.category}">${scoreInfo.label} (${time.score}/100)</div>
                        <p>${time.conditions}</p>
                        <div class="time-info">
                            <div><strong>🕐 Drying time:</strong> ${formatDryingTime(time.dryingTime)}</div>
                            <div><strong>☔ Safe outside:</strong> ${formatDryingTime(time.safeTime)}</div>
                            <div class="drying-estimate">
                                ${safeIndicator}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        } else {
            html += `
                <div class="best-times" style="background: linear-gradient(135deg, #e17055, #fd79a8);">
                    <h2>⚠️ Poor Washing Conditions</h2>
                    <p>Weather conditions aren't ideal for outdoor drying in <strong>${location}</strong> over the next few days. Consider indoor alternatives.</p>
                </div>
            `;
        }
        
        html += '<div class="forecast-grid">';
        processedData.forecast.forEach(day => {
            const score = calculateWashingScore(day.temp, day.humidity, day.windSpeed, day.precipitation);
            const scoreInfo = getScoreCategory(score);
            const icon = getWeatherIcon(day.description);
            const dryingTime = calculateDryingTime(day.temp, day.humidity, day.windSpeed, fabricType);
            const safeTime = getSafeOutdoorTime([day], 9);
            
            html += `
                <div class="day-card">
                    <div class="day-header">
                        <h3>${day.date}</h3>
                        <span class="washing-score score-${scoreInfo.category}">${score}/100</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <span class="weather-icon">${icon}</span>
                        <div>
                            <div style="font-weight: bold;">${day.temp}°C</div>
                            <div style="text-transform: capitalize; color: #666;">${day.description}</div>
                        </div>
                    </div>
                    <div class="weather-details">
                        <div class="detail-item">💧 ${day.humidity}% humidity</div>
                        <div class="detail-item">${getWindVisualization(day.windSpeed)}</div>
                        <div class="detail-item">🌧️ ${day.precipitation}% rain</div>
                        <div class="detail-item">👕 ${scoreInfo.label} for drying</div>
                        <div class="detail-item">🕐 ${formatDryingTime(dryingTime)} to dry</div>
                        <div class="detail-item">☔ ${formatDryingTime(safeTime)} safe outside</div>
                    </div>
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
        html += '</ul></div>';
        
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