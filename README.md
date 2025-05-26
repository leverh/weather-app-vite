# Weather Now 🌤️

A modern, responsive weather application built with React and Vite. Get current weather conditions and 5-day forecasts for any city worldwide, with automatic location detection and dark/light mode support.

## Features

- **Current Weather**: Real-time weather data including temperature, humidity, wind speed, and conditions
- **5-Day Forecast**: Daily weather predictions with high/low temperatures
- **Location Services**: One-click weather for your current location using geolocation API
- **City Search with Disambiguation**: City search that handles multiple cities with the same name
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Unit Conversion**: Switch between Celsius/Fahrenheit and metric/imperial units

## Demo

[Live Demo](https://stellular-otter-9b2ef9.netlify.app/)

## Screenshots

![Dark Mode](/public/ws-2.png)

![Light Mode](/public/ws-1.png)

## Technologies Used

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **CSS Variables** - For theming and consistent styling
- **OpenWeatherMap API** - Weather data provider
- **Geolocation API** - For current location detection

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/leverh/weather-app-vite
   cd weather-app-vite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Create a `.env` file in the root directory:
   ```bash
   VITE_API_KEY=your_openweathermap_api_key_here
   ```
   - Add you .env to the `.gitignore` file (unless you want the world to know your secrets)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## API Endpoints Used

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
- **Geocoding**: `https://api.openweathermap.org/geo/1.0/direct`

## Features in Detail

### Smart City Search
- Type any city name and get disambiguated results
- Handles cities with the same name in different countries/states
- Shows city, state, and country information for clarity

### Location Detection
- One-click weather for the user's current location
- Handles location permission requests
- Provides clear error messages for location issues

### Theme Support
- Clean light mode for daytime use
- Dark mode for low-light environments
- Smooth transitions between themes

### Responsive Design
- Optimized layouts for all screen sizes
- Touch-friendly interface elements

## 📁 Project Structure

```
weather-app-vite/
├── public/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Styles with CSS variables
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
├── package.json
├── vite.config.js
└── README.md
```

## Design Principles

- **Clean & Modern**: Minimalist interface with focus on content
- **Accessible**: High contrast ratios and semantic HTML
- **Fast**: Lightweight bundle with optimized assets
- **Intuitive**: Clear navigation and familiar UI patterns

## 📝 License

This project is licensed under the MIT License. Copy or share - I really don't care 🖖✌️

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Poppins Font](https://fonts.google.com/specimen/Poppins) for the typography

## Contact

Website - [PixelSummit.dev](https://pixelsummit.dev/)

Email - [contact@pixelsummit.dev](mailto:contact@pixelsummit.dev)

Live Project Link - [https://stellular-otter-9b2ef9.netlify.app/](https://stellular-otter-9b2ef9.netlify.app/)

---

⭐ Star this repo if you found it helpful!