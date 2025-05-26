import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import './App.css';

const WeatherApp = () => {
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState('metric');
  const [darkMode, setDarkMode] = useState(false);
  const [weatherData, setWeatherData] = useState({
    loading: false,
    data: {},
    error: false,
  });
  useEffect(() => {
  document.body.classList.toggle('dark', darkMode);
}, [darkMode]);
  const [forecastData, setForecastData] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [cityOptions, setCityOptions] = useState([]);
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY || 'api-key';

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const searchCities = async (cityName) => {
    if (cityName.length < 3) {
      setCityOptions([]);
      setShowCityOptions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.length > 1) {
        setCityOptions(data);
        setShowCityOptions(true);
      } else if (data.length === 1) {
        setCityOptions([]);
        setShowCityOptions(false);
        fetchWeatherByCoords(data[0].lat, data[0].lon);
      }
    } catch (error) {
      console.error('Error searching cities:', error);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setWeatherData({ ...weatherData, loading: true });
    setForecastData({ ...forecastData, loading: true });
    setShowCityOptions(false);
    
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      );
      const weatherResult = await weatherResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      );
      const forecastResult = await forecastResponse.json();
      
      if (weatherResponse.ok && forecastResponse.ok) {
        setWeatherData({ data: weatherResult, loading: false, error: false });
        setForecastData({ data: forecastResult, loading: false, error: false });
        setInput('');
      } else {
        setWeatherData({ ...weatherData, data: {}, error: true, loading: false });
        setForecastData({ ...forecastData, data: {}, error: true, loading: false });
      }
    } catch (error) {
      setWeatherData({ ...weatherData, data: {}, error: true, loading: false });
      setForecastData({ ...forecastData, data: {}, error: true, loading: false });
      console.error('Error fetching weather:', error);
    }
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      event.preventDefault();
      if (input.trim()) {
        searchCities(input.trim());
      }
    }
  };

  const handleCitySelect = (city) => {
    fetchWeatherByCoords(city.lat, city.lon);
  };

  const handleUnitChange = async (selectedUnit) => {
    setUnit(selectedUnit);
    if (weatherData.data.coord) {
      setWeatherData({ ...weatherData, loading: true });
      setForecastData({ ...forecastData, loading: true });
      
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${weatherData.data.coord.lat}&lon=${weatherData.data.coord.lon}&units=${selectedUnit}&appid=${API_KEY}`
        );
        const weatherResult = await weatherResponse.json();
        
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.data.coord.lat}&lon=${weatherData.data.coord.lon}&units=${selectedUnit}&appid=${API_KEY}`
        );
        const forecastResult = await forecastResponse.json();
        
        if (weatherResponse.ok && forecastResponse.ok) {
          setWeatherData({ data: weatherResult, loading: false, error: false });
          setForecastData({ data: forecastResult, loading: false, error: false });
        } else {
          setWeatherData({ ...weatherData, data: {}, error: true, loading: false });
          setForecastData({ ...forecastData, data: {}, error: true, loading: false });
        }
      } catch (error) {
        setWeatherData({ ...weatherData, data: {}, error: true, loading: false });
        setForecastData({ ...forecastData, data: {}, error: true, loading: false });
      }
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀', '01n': '🌙',
      '02d': '⛅', '02n': '☁',
      '03d': '☁', '03n': '☁',
      '04d': '☁', '04n': '☁',
      '09d': '🌧', '09n': '🌧',
      '10d': '🌦', '10n': '🌧',
      '11d': '⛈', '11n': '⛈',
      '13d': '❄', '13n': '❄',
      '50d': '🌫', '50n': '🌫'
    };
    return iconMap[iconCode] || '🌤';
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        let message = 'Unable to get your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message += 'Location request timed out.';
            break;
          default:
            message += 'An unknown error occurred.';
            break;
        }
        
        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const getDailyForecast = () => {
    if (!forecastData.data.list) return [];
    
    const dailyData = {};
    const today = new Date().toDateString();
    
    forecastData.data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toDateString();
      
      if (dateString === today) return;
      
      if (!dailyData[dateString]) {
        dailyData[dateString] = {
          date: date,
          temps: [item.main.temp],
          weather: item.weather[0],
          items: [item]
        };
      } else {
        dailyData[dateString].temps.push(item.main.temp);
        dailyData[dateString].items.push(item);
      }
    });
    
    return Object.values(dailyData).slice(0, 4).map(day => ({
      date: day.date,
      minTemp: Math.round(Math.min(...day.temps)),
      maxTemp: Math.round(Math.max(...day.temps)),
      weather: day.weather,
      icon: day.items.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 11 && hour <= 14;
      })?.weather[0].icon || day.weather.icon
    }));
  };

  return (
    <div className="weather-container">
      <div className="weather-card">
        
        {/* Header */}
        <div className="header">
          <h1 className="app-title">Weather Now</h1>
          <p className="app-subtitle">Get accurate weather information</p>
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            <i className={`wi ${darkMode ? 'wi-day-sunny' : 'wi-night-clear'}`}></i>
              {darkMode ? ' Light Mode' : ' Dark Mode'}
          </button>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Enter city name..."
              className="search-input"
            />
            <button
              onClick={handleSearch}
              disabled={weatherData.loading}
              className="search-button"
            >
              {weatherData.loading ? '...' : 'Search'}
            </button>
          </div>

          {/* Location and Unit Controls */}
          <div className="controls-section">
            <button
              onClick={getCurrentLocation}
              disabled={locationLoading || weatherData.loading}
              className="location-button"
            >
              <i className="wi wi-barometer"></i>
              {locationLoading ? ' Locating...' : 'Use My Location'}
            </button>

            {/* Unit Toggle */}
            <div className="unit-toggle">
              <button
                onClick={() => handleUnitChange('metric')}
                className={`unit-button ${unit === 'metric' ? 'active' : ''}`}
              >
                Celsius
              </button>
              <button
                onClick={() => handleUnitChange('imperial')}
                className={`unit-button ${unit === 'imperial' ? 'active' : ''}`}
              >
                Fahrenheit
              </button>
            </div>
          </div>

          {/* City Options Dropdown */}
          {showCityOptions && cityOptions.length > 0 && (
            <div className="city-dropdown">
              {cityOptions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="city-option"
                >
                  <div className="city-name">{city.name}</div>
                  <div className="city-details">
                    {city.state && `${city.state}, `}{city.country}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {weatherData.loading && (
          <div className="loading-section">
            <div className="spinner"></div>
            <p className="loading-text">Loading weather data...</p>
          </div>
        )}

        {/* Error State */}
        {weatherData.error && (
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <p className="error-text">City not found. Please try again.</p>
          </div>
        )}

        {/* Weather Display */}
        {weatherData.data && weatherData.data.main && !weatherData.loading && (
          <div className="weather-display">
            {/* Location */}
            <div className="location-section">
              <h2 className="location-name">{weatherData.data.name}</h2>
              <p className="location-country">{weatherData.data.sys.country}</p>
              <p className="location-date">{getCurrentDate()}</p>
            </div>

            {/* Main Weather Info */}
            <div className="main-weather">
              <div className="weather-emoji">
                {getWeatherIcon(weatherData.data.weather[0].icon)}
              </div>
              <div className="temperature">
                {Math.round(weatherData.data.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
              </div>
              <p className="weather-description">
                {weatherData.data.weather[0].description}
              </p>
              <p className="feels-like">
                Feels like {Math.round(weatherData.data.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
              </p>
            </div>

            {/* Additional Info */}
            <div className="weather-details">
              <div className="detail-card">
                <div className="detail-icon"><i className="wi wi-strong-wind"></i></div>
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">
                  {weatherData.data.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon"><i className="wi wi-humidity"></i></div>
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{weatherData.data.main.humidity}%</div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            {forecastData.data.list && (
              <div className="forecast-section">
                <h3 className="forecast-title">5-Day Forecast</h3>
                <div className="forecast-container">
                  {getDailyForecast().map((day, index) => (
                    <div key={index} className="forecast-card">
                      <div className="forecast-day">
                        {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="forecast-icon">
                        {getWeatherIcon(day.icon)}
                      </div>
                      <div className="forecast-temps">
                        <span className="forecast-high">{day.maxTemp}°</span>
                        <span className="forecast-low">{day.minTemp}°</span>
                      </div>
                      <div className="forecast-desc">
                        {day.weather.main}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Welcome Message */}
        {!weatherData.data.main && !weatherData.loading && !weatherData.error && (
          <div className="welcome-section">
            <div className="welcome-icon">🌤</div>
            <h2 className="welcome-title">Welcome!</h2>
            <p className="welcome-text">Search for a city to see current weather conditions</p>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default WeatherApp;