# Claude Development Documentation 🤖

This document provides detailed technical information about the "Peg It!" washing line weather app for AI assistants and developers working with Claude.

## 📋 Project Overview

**Peg It!** is a weather-based web application that predicts optimal times for hanging laundry outside. It combines real-time weather data with intelligent algorithms to calculate drying conditions and safety recommendations.

### Core Functionality
- **Weather Data Integration**: OpenWeatherMap API with graceful fallback to demo data
- **Washing Score Algorithm**: Multi-factor scoring system (0-100 scale)
- **Fabric-Specific Calculations**: Different drying time estimates for various materials
- **Safety Predictions**: Rain-based timing for bringing clothes indoors
- **Responsive Web Design**: Mobile-first CSS with accessibility considerations

## 🏗️ Technical Architecture

### File Structure & Responsibilities

```
src/
├── index.html          # Main application shell, semantic HTML
├── script.js           # Core JavaScript logic (8 main sections)
├── styles.css          # Responsive CSS with mobile-first approach
└── img/pegit.png       # Application logo/branding
```

### Key JavaScript Modules (script.js)

1. **Weather API Configuration** (Lines 1-20)
   - OpenWeatherMap API key management
   - Endpoint definitions
   - API key validation logic

2. **Demo Data Generation** (Lines 22-60)
   - Fallback system for offline/API-less operation
   - Location-based pseudo-random data generation
   - Consistent mock weather patterns

3. **Location Services** (Lines 62-100)
   - Geocoding integration (city name → coordinates)
   - Known location database for demo mode
   - Error handling for location resolution

4. **Weather Data Fetching** (Lines 102-180)
   - OpenWeatherMap API integration
   - Current weather + 5-day forecast
   - Response processing and error handling

5. **Data Processing** (Lines 182-250)
   - API response normalization
   - Weather condition categorization
   - Hourly/daily data aggregation

6. **Washing Prediction Logic** (Lines 252-350)
   - Core scoring algorithm
   - Fabric-specific drying time calculations
   - Safety time predictions (rain avoidance)

7. **UI Generation** (Lines 352-450)
   - Dynamic HTML generation
   - Weather visualization components
   - Responsive recommendation cards

8. **Application Controller** (Lines 452-500)
   - Event handling
   - State management
   - Error presentation

## 🧮 Scoring Algorithm Details

### Weather Score Calculation (0-100 scale)

```javascript
function calculateWashingScore(temp, humidity, windSpeed, precipitation) {
    // Temperature component (25 points max)
    // Humidity component (30 points max) - most important factor
    // Wind speed component (25 points max)
    // Precipitation component (20 points max)
}
```

**Temperature Scoring:**
- Optimal range: 15-25°C (25 points)
- Acceptable: 10-30°C (15 points)
- Poor: Outside range (5 points)

**Humidity Scoring (Primary Factor):**
- Excellent: ≤50% (30 points) - rapid evaporation
- Good: 51-65% (20 points) - standard drying
- Fair: 66-80% (10 points) - slow drying
- Poor: >80% (0 points) - minimal evaporation

**Wind Speed Scoring:**
- Perfect: 10-25 km/h (25 points) - optimal air circulation
- Good: 5-35 km/h (15 points) - adequate airflow
- Poor: <5 or >35 km/h (5 points) - too little/too much

**Precipitation Scoring:**
- Safe: ≤5% (20 points) - very low rain risk
- Caution: 6-20% (10 points) - moderate risk
- Risky: 21-50% (5 points) - significant risk
- Avoid: >50% (0 points) - high rain probability

### Fabric-Specific Drying Times

```javascript
const baseTimes = {
    'cotton': 4,      // T-shirts, underwear - standard fabrics
    'thick': 6,       // Jeans, towels - dense materials
    'delicate': 3,    // Synthetic fabrics - quick-dry materials
    'bedding': 8      // Sheets, duvet covers - large surface area
};
```

**Adjustment Factors:**
- **Temperature Factor**: 0.8x (≥20°C) to 1.6x (<10°C)
- **Humidity Factor**: 0.7x (≤40%) to 1.6x (>70%)
- **Wind Factor**: 0.7x (≥20 km/h) to 1.2x (<6 km/h)

## 🌐 API Integration

### OpenWeatherMap Implementation

**Primary APIs Used:**
1. **Geocoding API**: `/geo/1.0/direct` - Location resolution
2. **Current Weather**: `/data/2.5/weather` - Real-time conditions
3. **5-Day Forecast**: `/data/2.5/forecast` - Extended predictions

**API Key Management:**
- Development: Direct replacement in `script.js`
- Production: GitHub Actions secret injection
- Validation: 32-character hexadecimal format check

**Fallback Strategy:**
```javascript
const isUsingRealAPI = WEATHER_API_KEY.length === 32 && /^[a-f0-9]{32}$/i.test(WEATHER_API_KEY);
```

### Demo Data System

When no valid API key is detected:
- Generates consistent pseudo-random weather data
- Uses location name as seed for reproducible results
- Maintains realistic weather patterns and variations
- Provides full feature functionality for testing/development

## 🎨 UI/UX Design Patterns

### Responsive Design Strategy
- **Mobile-first CSS**: Base styles for mobile, progressive enhancement
- **CSS Grid**: Main layout and forecast cards
- **Flexbox**: Component-level alignment and spacing
- **Breakpoint**: 600px for mobile/desktop transition

### Visual Hierarchy
1. **Logo & Branding**: Central positioning, large on desktop
2. **Input Controls**: Prominent search and fabric selection
3. **Best Times Section**: Primary recommendations with visual priority
4. **5-Day Forecast**: Secondary information in card grid
5. **Tips Section**: Tertiary helpful information

### Color Scheme
```css
:root {
    --primary-green: #6b9b7f;
    --secondary-green: #8db4a0;
    --accent-teal: #a8e6cf;
    --warm-orange: #d4927b;
    --neutral-gray: #f8f9fa;
}
```

**Color Psychology:**
- Green tones: Natural, fresh, eco-friendly (line drying)
- Gradient backgrounds: Modern, engaging visual appeal
- High contrast text: Accessibility compliance
- Status colors: Green (good), Orange (caution), Red (poor)

## 🔄 State Management

### Application States
1. **Initial Load**: Default location forecast
2. **Loading**: API request in progress
3. **Success**: Weather data displayed
4. **Error**: Fallback messaging with suggestions
5. **Demo Mode**: Offline functionality indication

### Data Flow
```
User Input → Location Resolution → Weather API → Data Processing → Score Calculation → UI Rendering
     ↓
Location Storage → Cache Coordinates → Fallback Demo → Error Handling → Status Display
```

## 🚀 Deployment Architecture

### GitHub Actions Workflow

**Build Process:**
1. **File Organization**: Copy `src/` contents to `build/`
2. **API Key Injection**: Replace placeholder with secret value
3. **Asset Management**: Copy images and static files
4. **Validation**: Verify successful key injection
5. **Deployment**: Upload to GitHub Pages

**Security Considerations:**
- API keys stored as GitHub repository secrets
- No API keys committed to version control
- Build-time injection prevents key exposure
- Demo mode ensures functionality without secrets

### Environment Configuration

**Development Environment:**
```javascript
// Local development - direct key replacement
const WEATHER_API_KEY = 'your_development_key_here';
```

**Production Environment:**
```yaml
# GitHub Actions - secret injection
env:
  WEATHER_API_KEY: ${{ secrets.WEATHER_API_KEY }}
```

## 🧪 Testing Considerations

### Manual Testing Checklist
- [ ] Demo mode functionality (no API key)
- [ ] Real API mode with valid key
- [ ] Location search for various cities
- [ ] Fabric type selector changes
- [ ] Mobile responsive design
- [ ] Error handling for invalid locations
- [ ] Network failure graceful degradation

### Browser Compatibility
- **Modern Browsers**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **JavaScript Features**: ES6+ (async/await, template literals, destructuring)
- **CSS Features**: Grid, Flexbox, CSS Variables, backdrop-filter

### Performance Considerations
- **API Calls**: Batched requests for current + forecast data
- **Caching**: Browser caches API responses (standard HTTP headers)
- **Image Optimization**: Single logo asset, optimized PNG
- **CSS**: Single stylesheet, efficient selectors, minimal repaints

## 🔧 Customization Guidelines

### Adding New Weather Factors
1. Modify `calculateWashingScore()` function
2. Update scoring weights to maintain 100-point scale
3. Add new UI elements for factor display
4. Update tips/recommendations accordingly

### Extending Fabric Types
1. Add entry to `baseTimes` object in `calculateDryingTime()`
2. Update HTML `<select>` options in `index.html`
3. Consider additional adjustment factors if needed

### Styling Modifications
1. Update CSS custom properties for color schemes
2. Maintain mobile-first responsive approach
3. Test accessibility with screen readers
4. Validate contrast ratios for text readability

## 📊 Analytics & Monitoring

### Key Metrics to Track
- **API Success Rate**: Real vs demo mode usage
- **Location Accuracy**: Successful geocoding percentage
- **User Engagement**: Return visits, session duration
- **Feature Usage**: Fabric selector choices, forecast interactions

### Error Monitoring
- **API Failures**: Track OpenWeatherMap service issues
- **Geocoding Errors**: Monitor location resolution problems
- **JavaScript Errors**: Catch and log client-side exceptions
- **Performance Issues**: Monitor load times and responsiveness

## 🔒 Security & Privacy

### Data Handling
- **No Personal Data Storage**: No user information retained
- **API Key Security**: Secrets management through GitHub Actions
- **HTTPS Only**: Secure transmission of weather data
- **No Tracking**: Minimal client-side data collection

### API Security
- **Rate Limiting**: OpenWeatherMap API limits respected
- **Key Rotation**: Support for periodic API key updates
- **Error Handling**: No sensitive information exposed in errors

---

**This documentation is designed to help AI assistants understand the complete technical context of the Peg It! application for maintenance, feature development, and troubleshooting purposes.**