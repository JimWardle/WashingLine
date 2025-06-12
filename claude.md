# Claude Development Documentation 🤖

This document provides detailed technical information about the "Peg It!" washing line weather app for AI assistants and developers working with Claude.

## 📋 Project Overview

**Peg It!** is a weather-based web application that predicts optimal times for hanging laundry outside. It combines real-time weather data with intelligent algorithms to calculate drying conditions and safety recommendations.

**Live Site:** [pegit.cloud](https://pegit.cloud)

### Core Functionality
- **Weather Data Integration**: OpenWeatherMap API with graceful fallback to demo data
- **Washing Score Algorithm**: Multi-factor scoring system (0-100 scale)
- **Fabric-Specific Calculations**: Different drying time estimates for various materials
- **Safety Predictions**: Rain-based timing for bringing clothes indoors
- **UK Timezone Handling**: Proper timezone conversion and display
- **Responsive Web Design**: Mobile-first CSS with accessibility considerations
- **SEO Optimization**: Comprehensive content strategy with tips page

## 🏗️ Technical Architecture

### File Structure & Responsibilities

```
src/
├── index.html          # Main application shell, semantic HTML with SEO
├── script.js           # Core JavaScript logic (8 main sections)
├── styles.css          # Responsive CSS with mobile-first approach
├── sitemap.xml         # SEO sitemap for search engines
├── robots.txt          # Search engine crawling guidance
├── CNAME              # Custom domain configuration
├── tips/
│   └── index.html      # 2,800+ word SEO-optimized tips page
└── img/pegit.png       # Application logo/branding
```

### Key JavaScript Modules (script.js)

1. **Weather API Configuration** (Lines 1-25)
   - OpenWeatherMap API key management with validation
   - Endpoint definitions and API detection
   - Debug logging and status reporting

2. **Time Utility Functions** (Lines 27-75)
   - UK timezone conversion utilities
   - Date comparison and formatting
   - Current time display with proper formatting

3. **Demo Data Generation** (Lines 77-140)
   - Fallback system for offline/API-less operation
   - Location-based pseudo-random data generation
   - Timezone-aware hourly forecast generation

4. **Location Services** (Lines 142-180)
   - Geocoding integration (city name → coordinates)
   - Known UK location database for demo mode
   - Error handling for location resolution

5. **Weather Data Fetching** (Lines 182-220)
   - OpenWeatherMap API integration
   - Current weather + 5-day forecast
   - Response processing and error handling

6. **Data Processing** (Lines 222-320)
   - API response normalization with UK timezone conversion
   - Weather condition categorization
   - Hourly/daily data aggregation with proper date handling
   - Past time filtering and good washing hour detection

7. **Washing Prediction Logic** (Lines 322-420)
   - Core scoring algorithm (temperature, humidity, wind, rain)
   - Fabric-specific drying time calculations
   - Safety time predictions (rain avoidance)
   - Best time recommendation engine

8. **UI Generation** (Lines 422-520)
   - Dynamic HTML generation with enhanced time display
   - Weather visualization components
   - Responsive recommendation cards
   - SEO-friendly content structure

9. **Application Controller** (Lines 522-580)
   - Event handling and state management
   - Error presentation and user feedback
   - Initialization and setup

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

## 🕐 UK Timezone Handling

### Critical Time Functions
```javascript
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
```

**Key Features:**
- **Proper timezone conversion** from UTC to UK time
- **Past time filtering** - no recommendations for times that have passed
- **Good washing hours** - only suggests 7 AM to 6 PM
- **Evening detection** - "too late today" logic after 5 PM
- **Enhanced time display** - beautiful formatted time with animations

## 🌐 API Integration

### OpenWeatherMap Implementation

**Primary APIs Used:**
1. **Geocoding API**: `/geo/1.0/direct` - Location resolution
2. **Current Weather**: `/data/2.5/weather` - Real-time conditions
3. **5-Day Forecast**: `/data/2.5/forecast` - Extended predictions with 3-hour intervals

**API Key Management:**
- Development: Direct replacement in `script.js`
- Production: GitHub Actions secret injection
- Validation: 32-character hexadecimal format check

**Cost Considerations:**
```javascript
// Current implementation makes 2 API calls per search:
// 1. Current weather
// 2. 5-day forecast
// Free tier: 1,000 calls/day = ~500 searches/day maximum
```

**Fallback Strategy:**
```javascript
const isUsingRealAPI = WEATHER_API_KEY.length === 32 && /^[a-f0-9]{32}$/i.test(WEATHER_API_KEY);
```

### Demo Data System

When no valid API key is detected:
- Generates consistent pseudo-random weather data using location name as seed
- Maintains realistic weather patterns and variations
- Provides full feature functionality for testing/development
- Includes proper UK timezone handling

## 💾 Planned Caching Architecture

### Current Performance Challenge
- **Every search = 2 API calls** (current + forecast)
- **Free tier limit**: 1,000 calls/day
- **Cost scaling**: $40/month for 100K calls
- **User experience**: API wait time on every search

### Proposed Caching Solution

**Database Schema (MySQL):**
```sql
CREATE TABLE weather_cache (
    id INT PRIMARY_KEY AUTO_INCREMENT,
    location_name VARCHAR(100),
    latitude DECIMAL(8,5),
    longitude DECIMAL(8,5),
    weather_data JSON,
    cached_at TIMESTAMP,
    expires_at TIMESTAMP,
    search_count INT DEFAULT 1,
    last_accessed TIMESTAMP,
    INDEX idx_location (location_name),
    INDEX idx_coords (latitude, longitude),
    INDEX idx_expires (expires_at)
);

CREATE TABLE popular_locations (
    id INT PRIMARY_KEY AUTO_INCREMENT,
    location_name VARCHAR(100) UNIQUE,
    search_count INT DEFAULT 0,
    last_searched TIMESTAMP,
    auto_cache BOOLEAN DEFAULT FALSE
);
```

**Caching Logic:**
```javascript
async function getWeatherWithCache(location) {
    // 1. Check cache for recent data (< 3 hours old)
    const cached = await checkCache(location);
    if (cached && !isExpired(cached, 3)) {
        return cached.data;
    }
    
    // 2. Make API call if no valid cache
    const freshData = await fetchOpenWeatherData(coords);
    
    // 3. Update cache and popular locations tracking
    await updateCache(location, freshData);
    await incrementSearchCount(location);
    
    return freshData;
}
```

**Smart Caching Features:**
- **Cache Duration**: 3-6 hours (balances freshness vs API costs)
- **Popular Location Auto-Cache**: UK major cities pre-cached
- **Usage-Based Caching**: Auto-cache locations searched 3+ times
- **Off-Peak Refresh**: Update popular caches during low-traffic hours
- **Geographic Clustering**: Cache nearby locations together

**Expected Performance Improvements:**
- **API Cost Reduction**: 70-90% fewer API calls
- **Response Time**: Sub-second responses for cached locations
- **Scalability**: Handle 10,000+ daily users
- **Revenue Impact**: Lower operational costs = higher profit margins

## 🎨 UI/UX Design Patterns

### Enhanced Time Display
```css
.time-info {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 249, 0.95));
    border-radius: 16px;
    padding: 16px 20px;
    margin: 16px 0;
    border: 1px solid rgba(107, 155, 127, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
}

.time-icon {
    font-size: 1.8em;
    animation: pulse 2s infinite;
}
```

### Responsive Design Strategy
- **Mobile-first CSS**: Base styles for mobile, progressive enhancement
- **CSS Grid**: Main layout and forecast cards
- **Flexbox**: Component-level alignment and spacing
- **Breakpoint**: 600px for mobile/desktop transition

### Visual Hierarchy
1. **Logo & Branding**: Central positioning, large on desktop
2. **Enhanced Time Display**: Prominent current UK time with formatting
3. **Input Controls**: Prominent search and fabric selection
4. **Best Times Section**: Primary recommendations with visual priority
5. **5-Day Forecast**: Secondary information in card grid
6. **Tips Section**: Tertiary helpful information with CTA

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

## 🔄 State Management

### Application States
1. **Initial Load**: Default location forecast with UK time display
2. **Loading**: API request in progress with formatted loading message
3. **Success**: Weather data displayed with enhanced time information
4. **Error**: Fallback messaging with suggestions
5. **Demo Mode**: Offline functionality indication
6. **Late Evening**: Special "too late today" state after 5 PM

### Data Flow
```
User Input → Location Resolution → Cache Check → Weather API/Cache → 
Data Processing → UK Timezone Conversion → Score Calculation → 
Enhanced Time Display → UI Rendering
```

## 🚀 Deployment Architecture

### GitHub Actions Workflow Enhancement

**Build Process:**
1. **File Organization**: Copy all `src/` contents including tips page
2. **API Key Injection**: Replace placeholder with secret value
3. **Multi-page Build**: Handle main app + tips page + sitemap
4. **Asset Management**: Copy images, CSS, and all static files
5. **Custom Domain**: Deploy to pegit.cloud with SSL
6. **Validation**: Verify successful deployment

**Security Considerations:**
- API keys stored as GitHub repository secrets
- No API keys committed to version control
- Build-time injection prevents key exposure
- Demo mode ensures functionality without secrets
- Custom domain with enforced HTTPS

### Environment Configuration

**Production Environment (pegit.cloud):**
```yaml
# GitHub Actions - secret injection
env:
  WEATHER_API_KEY: ${{ secrets.WEATHER_API_KEY }}
```

**Custom Domain Setup:**
- **Domain**: pegit.cloud (perfect pun!)
- **DNS**: Properly configured A records and CNAME
- **SSL**: Automatic GitHub Pages SSL certificate
- **CDN**: GitHub's global CDN for fast loading

## 🔍 SEO Implementation

### Content Strategy
- **Main App**: 2,000+ words of SEO content
- **Tips Page**: 2,800+ words of comprehensive outdoor drying guidance
- **Target Keywords**: "hang washing outside", "UK outdoor drying"
- **Long-tail Terms**: "should I hang washing out today"

### Technical SEO
- **Structured Data**: Schema.org markup for rich snippets
- **Meta Tags**: Comprehensive title, description, keywords
- **Open Graph**: Social media optimization
- **Sitemap**: XML sitemap for search engine discovery
- **Robots.txt**: Proper crawling guidance

### Expected SEO Results
- **Month 1-2**: Index new domain and content
- **Month 3-6**: Begin ranking for long-tail keywords
- **Month 6+**: Potential top 10 rankings for niche terms
- **Target Traffic**: 1,000+ monthly organic visitors

## 🧪 Testing Considerations

### Manual Testing Checklist
- [ ] Demo mode functionality (no API key)
- [ ] Real API mode with valid key
- [ ] UK timezone display accuracy
- [ ] Past time filtering (no 1 PM recommendations at 10 PM)
- [ ] Location search for various UK cities
- [ ] Fabric type selector changes
- [ ] Mobile responsive design on actual devices
- [ ] Error handling for invalid locations
- [ ] Network failure graceful degradation
- [ ] Tips page navigation and content
- [ ] Custom domain functionality (pegit.cloud)

### Performance Testing
- **API Response Times**: Monitor OpenWeatherMap latency
- **Time Zone Conversion**: Verify UK time accuracy
- **Mobile Performance**: Test on slower connections
- **Error Recovery**: Ensure graceful fallbacks

### Browser Compatibility
- **Modern Browsers**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **JavaScript Features**: ES6+ (async/await, template literals)
- **CSS Features**: Grid, Flexbox, CSS Variables, backdrop-filter

## 💰 Monetization Strategy

### Current Implementation
- **Google AdSense**: Approved and integrated
- **Custom Domain**: Professional pegit.cloud branding
- **SEO Content**: Comprehensive tips page for organic traffic

### Revenue Optimization
- **Strategic Ad Placement**: After users get value from forecasts
- **Content Marketing**: Tips page drives SEO traffic
- **User Experience**: Ads don't interfere with core functionality

### Future Monetization Opportunities
- **Affiliate Marketing**: Weather stations, outdoor equipment
- **Premium Features**: Extended forecasts, notifications
- **Partnerships**: Energy companies, eco-friendly brands

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

### Timezone Enhancements
1. Support multiple timezones beyond UK
2. Add user timezone detection
3. Handle daylight saving time transitions

## 📊 Analytics & Monitoring

### Key Metrics to Track
- **API Success Rate**: Real vs demo mode usage percentage
- **Location Accuracy**: Successful geocoding percentage
- **User Engagement**: Return visits, session duration
- **Feature Usage**: Fabric selector choices, forecast interactions
- **SEO Performance**: Organic traffic growth, keyword rankings
- **Revenue Metrics**: AdSense earnings, cost per visitor

### Error Monitoring
- **API Failures**: Track OpenWeatherMap service issues
- **Geocoding Errors**: Monitor location resolution problems
- **JavaScript Errors**: Catch and log client-side exceptions
- **Performance Issues**: Monitor load times and responsiveness
- **Timezone Issues**: Verify UK time display accuracy

### Cost Monitoring
- **API Usage**: Track daily/monthly OpenWeatherMap calls
- **Popular Locations**: Identify caching opportunities
- **User Patterns**: Understand peak usage times

## ⚡ Performance Optimizations

### Current Optimizations
- **Efficient API Calls**: Batched current + forecast requests
- **Image Optimization**: Single optimized logo asset
- **CSS Efficiency**: Single stylesheet, efficient selectors
- **JavaScript Performance**: Minimal DOM manipulations

### Planned Improvements
- **API Caching**: MySQL-based location caching system
- **CDN Integration**: Static asset delivery optimization
- **Lazy Loading**: Defer non-critical resource loading
- **Service Worker**: Offline capability and caching

## 🔒 Security & Privacy

### Data Handling
- **No Personal Data Storage**: No user information retained
- **API Key Security**: Secrets management through GitHub Actions
- **HTTPS Only**: Secure transmission of weather data via pegit.cloud
- **No Tracking**: Minimal client-side data collection

### API Security
- **Rate Limiting**: OpenWeatherMap API limits respected
- **Key Rotation**: Support for periodic API key updates
- **Error Handling**: No sensitive information exposed in errors
- **Caching Security**: Planned cache invalidation and cleanup

## 🎯 Success Metrics

### Technical KPIs
- **API Cost Efficiency**: <£20/month for 10,000 users
- **Response Time**: <2 seconds average
- **Uptime**: >99.5% availability
- **Mobile Performance**: <3 second load time

### Business KPIs
- **Monthly Active Users**: Target 1,000+ by month 6
- **SEO Traffic**: 500+ organic visitors monthly
- **Revenue**: £50+ monthly from AdSense + affiliates
- **User Retention**: 30%+ return visitor rate

---

**This documentation is designed to help AI assistants understand the complete technical context of the Peg It! application for maintenance, feature development, and troubleshooting purposes. The application represents a successful evolution from a simple weather app to a professional, monetizable, SEO-optimized business with smart caching architecture planned for scalable growth.**