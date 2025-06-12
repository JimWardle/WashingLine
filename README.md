# Peg It! 🧺

**For when it's fine to dry on the line**

A smart weather-powered app that tells you the best times to hang out your washing based on real weather conditions. No more guessing - know exactly when it's perfect for line drying!

![Peg It! Screenshot](src/img/pegit.png)

## 🌟 Features

- **Smart Drying Predictions** - Calculates optimal washing times based on temperature, humidity, wind speed, and rain probability
- **Real-Time Weather Data** - Uses OpenWeatherMap API for accurate, up-to-date forecasts
- **Fabric-Specific Advice** - Different recommendations for cotton, heavy items, delicates, and bedding
- **5-Day Forecast** - Plan your laundry week ahead
- **Safe Outdoor Time** - Tells you how long clothes can stay outside before rain
- **Detailed Wind Visualization** - Visual indicators for wind conditions
- **Mobile-Friendly** - Responsive design works on all devices
- **Demo Mode** - Works without API key using generated demo data

## 🚀 Quick Start

### Option 1: Use the Live Demo
Visit the deployed version at: `https://your-username.github.io/washingline/`

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/washingline.git
   cd washingline
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
washingline/
├── src/
│   ├── index.html          # Main HTML file
│   ├── script.js           # Weather API logic & calculations
│   ├── styles.css          # Responsive CSS styling
│   └── img/
│       └── pegit.png       # App logo
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment
├── package.json            # Project metadata
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## 🔄 Deployment

### GitHub Pages (Recommended)

The project includes automatic GitHub Pages deployment:

1. **Fork/Clone this repository**
2. **Add your API key** as a repository secret named `WEATHER_API_KEY`
3. **Enable GitHub Pages** in repository settings
4. **Push to main branch** - deployment happens automatically

The workflow:
- Builds the project
- Injects your API key securely
- Deploys to GitHub Pages
- Updates on every push to main

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

### Understanding the Recommendations
- **🌟 BEST** = Highest scoring time period
- **⏰ TODAY** = Opportunities available today
- **📅 GOOD** = Decent conditions in coming days
- **✅ Will dry completely** = Safe to leave out
- **⚠️ May need bringing in** = Monitor weather changes

## 🛠️ Development

### Technologies Used
- **Vanilla JavaScript** - Core functionality
- **OpenWeatherMap API** - Weather data
- **CSS Grid/Flexbox** - Responsive layout
- **GitHub Actions** - CI/CD deployment

### API Integration
The app uses OpenWeatherMap's:
- **Geocoding API** - Convert city names to coordinates
- **Current Weather API** - Real-time conditions
- **5-Day Forecast API** - Extended predictions

### Local Development
```bash
# Install dependencies (minimal)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing weather data API
- **Weather icons** from system emoji
- **Color palette** inspired by fresh laundry and nature
- **GitHub Pages** for free hosting

## 🐛 Support

Having issues? Here's how to get help:

1. **Check the demo mode** - ensure basic functionality works
2. **Verify API key** - common source of issues
3. **Open an issue** - describe the problem with details
4. **Check browser console** - for error messages

## 🔮 Future Enhancements

- [ ] Historical weather patterns
- [ ] Pollen count integration
- [ ] UV index warnings
- [ ] Washing reminders/notifications
- [ ] Multiple location support
- [ ] Offline mode with cached data

---

**Happy drying!** 🌞👕🧺