# Peg It! ☁️

**For when it's fine to dry on the line**

A smart weather-powered app that tells you the best times to hang out your washing based on real weather conditions. No more guessing - know exactly when it's perfect for line drying!

![Peg It! Screenshot](src/img/pegit.png)

🌐 **Live Site:** [pegit.cloud](https://pegit.cloud)

## 🌟 Features

- **Smart Drying Predictions** - Calculates optimal washing times based on temperature, humidity, wind speed, and rain probability
- **Real-Time Weather Data** - Uses OpenWeatherMap API for accurate, up-to-date forecasts
- **Fabric-Specific Advice** - Different recommendations for cotton, heavy items, delicates, and bedding
- **5-Day Forecast** - Plan your laundry week ahead
- **Safe Outdoor Time** - Tells you how long clothes can stay outside before rain
- **Enhanced Time Display** - Beautiful UK timezone-aware time formatting
- **Detailed Wind Visualization** - Visual indicators for wind conditions
- **Mobile-Friendly** - Responsive design works on all devices
- **SEO Optimized** - Comprehensive tips page and search engine optimization
- **Demo Mode** - Works without API key using generated demo data

## 🚀 Quick Start

### Option 1: Visit the Live Site
Visit [pegit.cloud](https://pegit.cloud) - no setup required!

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/JimWardle/WashingLine.git
   cd WashingLine
   ```

2. **Get an OpenWeatherMap API Key (Optional)**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - The app works in demo mode without an API key

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Or simply open `src/index.html` in your browser

## 🔧 Configuration

### Adding Your API Key

#### For Local Development:
Replace `YOUR_API_KEY_HERE` in `src/script.js` with your OpenWeatherMap API key:
```javascript
const WEATHER_API_KEY = 'your_actual_api_key_here';
```

#### For GitHub Pages Deployment:
1. Go to your repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Add a new secret named `WEATHER_API_KEY`
4. Set the value to your OpenWeatherMap API key
5. The GitHub Actions workflow will automatically inject it during deployment

## 📊 How It Works

Peg It! calculates a washing score (0-100) based on four key factors:

### 🌡️ Temperature (25 points max)
- **Ideal**: 15-25°C
- **Good**: 10-30°C
- **Poor**: Below 10°C or above 30°C

### 💧 Humidity (30 points max)
- **Excellent**: ≤50% (clothes dry fastest)
- **Good**: 51-65%
- **Fair**: 66-80%
- **Poor**: >80% (very slow drying)

### 🌬️ Wind Speed (25 points max)
- **Perfect**: 10-25 km/h (optimal air circulation)
- **Good**: 5-35 km/h
- **Poor**: <5 km/h or >35 km/h

### ☔ Rain Probability (20 points max)
- **Safe**: ≤5% chance
- **Caution**: 6-20% chance
- **Risky**: 21-50% chance
- **Avoid**: >50% chance

## 🏗️ Project Structure

```
WashingLine/
├── src/
│   ├── index.html          # Main HTML file with SEO optimization
│   ├── script.js           # Weather API logic & calculations
│   ├── styles.css          # Responsive CSS styling
│   ├── sitemap.xml         # SEO sitemap
│   ├── robots.txt          # Search engine guidance
│   ├── CNAME              # Custom domain configuration
│   ├── tips/
│   │   └── index.html      # Comprehensive drying tips page
│   └── img/
│       └── pegit.png       # App logo
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment
├── package.json            # Project metadata
├── README.md               # This file
├── claude.md               # Technical documentation
└── .gitignore             # Git ignore rules
```

## 🔄 Deployment

### Automatic GitHub Pages Deployment

The project includes automatic deployment to [pegit.cloud](https://pegit.cloud):

1. **Push to main branch** - deployment happens automatically
2. **API key injection** - Securely injects OpenWeatherMap API key
3. **Multi-page deployment** - Builds main app + tips page
4. **Custom domain** - Deploys to pegit.cloud with SSL

The workflow:
- Builds the project from `src/` directory
- Injects your API key securely
- Copies all necessary files (HTML, CSS, JS, images, tips page)
- Deploys to GitHub Pages with custom domain

### Manual Deployment

For other hosting platforms:
1. Copy files from `src/` directory
2. Replace `YOUR_API_KEY_HERE` in `script.js` with your API key
3. Upload to your web server

## 🎯 Usage Tips

### Best Practices
- **Check morning forecasts** for the best daily overview
- **Hang lighter items first** on windy days
- **Bring clothes in** if conditions change unexpectedly
- **Use fabric selector** for accurate drying time estimates
- **Visit the tips page** for comprehensive outdoor drying guidance

### Understanding the Recommendations
- **🌟 BEST** = Highest scoring time period with optimal conditions
- **⏰ TODAY** = Opportunities available today (timezone-aware)
- **📅 GOOD** = Decent conditions in coming days
- **✅ Will dry completely** = Safe to leave out for full drying cycle
- **⚠️ May need bringing in** = Monitor weather changes

## 💰 Monetization & Performance

### Current Implementation
- **Google AdSense** integration ready
- **SEO optimized** for organic traffic growth
- **Professional domain** (pegit.cloud) for credibility

### Planned Optimizations
- **API call caching** - Cache popular locations to reduce OpenWeatherMap API costs
- **Smart caching strategy** - Auto-cache frequently searched UK cities
- **Performance monitoring** - Track usage patterns and optimize accordingly

## 🛠️ Development

### Technologies Used
- **Vanilla JavaScript** - Core functionality with modern ES6+ features
- **OpenWeatherMap API** - Real-time weather data
- **CSS Grid/Flexbox** - Responsive layout with mobile-first design
- **GitHub Actions** - CI/CD deployment pipeline
- **Custom Domain** - Professional branding with pegit.cloud

### API Integration
The app uses OpenWeatherMap's:
- **Geocoding API** - Convert city names to coordinates
- **Current Weather API** - Real-time conditions
- **5-Day Forecast API** - Extended predictions with hourly data

### UK-Specific Features
- **Timezone handling** - Proper UK timezone conversion and display
- **Regional considerations** - Weather advice tailored for UK climate
- **Local cities** - Pre-configured coordinates for major UK locations

### Local Development
```bash
# Install dependencies (minimal)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 SEO & Content Strategy

### Search Optimization
- **Comprehensive meta tags** - Title, description, keywords
- **Structured data** - Schema.org markup for rich snippets
- **Open Graph & Twitter Cards** - Social media optimization
- **Sitemap.xml** - Search engine discovery
- **Tips page** - 2,800+ words of SEO-optimized content

### Target Keywords
- "hang washing outside"
- "best time to dry clothes"
- "weather for drying clothes"
- "UK outdoor drying guide"
- "energy saving laundry tips"

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly** (both with and without API key)
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Maintain compatibility with demo mode
- Test on mobile devices
- Follow existing code style
- Update documentation for new features
- Consider API cost implications

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing weather data API
- **Weather icons** from system emoji
- **Color palette** inspired by fresh laundry and nature
- **GitHub Pages** for free hosting with custom domain support

## 🐛 Support

Having issues? Here's how to get help:

1. **Check the demo mode** - ensure basic functionality works
2. **Verify API key** - common source of issues
3. **Open an issue** - describe the problem with details
4. **Check browser console** - for error messages
5. **Visit the tips page** - for usage guidance

## 🔮 Future Enhancements

### Immediate Priorities
- [ ] **API caching system** - MySQL database for popular locations
- [ ] **Usage analytics** - Track most searched cities
- [ ] **Cost optimization** - Smart API call management

### Long-term Features
- [ ] Historical weather patterns analysis
- [ ] Pollen count integration for allergy sufferers
- [ ] UV index warnings for fabric protection
- [ ] Push notifications for perfect drying conditions
- [ ] Multiple location support for users
- [ ] Offline mode with cached data
- [ ] Premium features (extended forecasts, alerts)

---

**Happy drying!** 🌞👕🧺

Made with ❤️ for UK households | Visit us at [pegit.cloud](https://pegit.cloud)