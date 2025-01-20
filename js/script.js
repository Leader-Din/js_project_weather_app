
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const api_key = "ad51411d878e2c56f89b16bbc868eb6d";

// Elements
const currentWeatherCard = document.querySelector(".weather-left .card");
const sevenDaysForecastContainer = document.querySelector(".day-forecast");
const aqiCard = document.querySelector(".hightlights .card");
const sunriseCard = document.querySelectorAll(".hightlights .card")[1];
const humidityVal = document.getElementById("humidity");
const pressureVal = document.getElementById("pressureVal");
const visibilityVal = document.getElementById("visibilityVal");
const windSpeedVal = document.getElementById("windSpeedVal");
const feelVal = document.getElementById("fellVal");
const hourlyForecastContainer = document.querySelector(".hourly-forecast");  // Fixed typo

// Air Quality Index Descriptions
const aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

const days = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", 
  "September", "October", "November", "December",
];

function getWeatherDetails(cityName, lat, lon, country, state) {
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

  // Fetch Air Pollution Data
  fetch(AIR_POLLUTION_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { pm2_5, pm10, so2, co, no, no2, nh3, o3 } = data.list[0].components;
      const aqiIndex = data.list[0].main.aqi;
      aqiCard.innerHTML = `
        <div class="card-head">
          <p>Air Quality Index</p>
          <p class="air-index aqi-${aqiIndex}" id="api-1">${aqiList[aqiIndex - 1]}</p>
        </div> 
        <div class="air-indices">
          <div class="item"><p>PM2.5</p><p>${pm2_5}</p></div>
          <div class="item"><p>PM10</p><p>${pm10}</p></div>
          <div class="item"><p>SO2</p><p>${so2}</p></div>
          <div class="item"><p>CO</p><p>${co}</p></div>
          <div class="item"><p>NO</p><p>${no}</p></div>
          <div class="item"><p>NO2</p><p>${no2}</p></div>
          <div class="item"><p>NH3</p><p>${nh3}</p></div>
          <div class="item"><p>O3</p><p>${o3}</p></div>
        </div>`;

      // Store air pollution data in localStorage
      localStorage.setItem('airPollution', JSON.stringify(data));
    })
    .catch(() => alert("Failed to fetch air pollution data!"));

  // Fetch Current Weather Data
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.main) {
        const { temp, humidity, pressure, feels_like } = data.main;
        const { speed } = data.wind;
        const { description, icon } = data.weather[0];
        const { sunrise, sunset } = data.sys;
        const { timezone, visibility } = data;

        // Convert Temperature to Celsius
        const tempInCelsius = (temp - 273.15).toFixed(2);
        const feelsLikeInCelsius = (feels_like - 273.15).toFixed(2);

        // Format Sunrise and Sunset Time
        const sunriseTime = new Date((sunrise + timezone) * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const sunsetTime = new Date((sunset + timezone) * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Update the current weather card
        currentWeatherCard.innerHTML = `
        <div class="current-weather">
          <div class="details">
            <p>Now</p>
            <h2>${tempInCelsius}&deg;C</h2>
            <p>${description}</p>
          </div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
          </div>
        </div>
        <hr>
        <div class="card-footer">
          <p><i class="far fa-calendar"></i>${days[new Date().getDay()]}, ${new Date().getDate()} ${months[new Date().getMonth()]}, ${new Date().getFullYear()}</p>
          <p><i class="fas fa-location-dot"></i>${cityName}, ${country}</p>
        </div>`;

        // Update the sunrise and sunset times
        sunriseCard.innerHTML = `
        <div class="card-head">
          <p>Sunrise & Sunset</p>
        </div>
        <div class="sunrise-sunset">
          <div class="item"><p>Sunrise</p><p>${sunriseTime}</p></div>
          <div class="item"><p>Sunset</p><p>${sunsetTime}</p></div>
        </div>`;

        // Update additional weather details
        humidityVal.innerHTML = `Humidity: ${humidity}%`;
        pressureVal.innerHTML = `Pressure: ${pressure} hPa`;
        visibilityVal.innerHTML = `Visibility: ${visibility} meters`;
        windSpeedVal.innerHTML = `Wind Speed: ${speed} m/s`;
        feelVal.innerHTML = `Feels Like: ${feelsLikeInCelsius}&deg;C`;

        // Store current weather data in localStorage
        localStorage.setItem('currentWeather', JSON.stringify(data));
      } else {
        alert("Failed to fetch weather data!");
      }
    })
    .catch(() => alert("Failed to fetch current weather data!"));

  // Fetch 7-Day Forecast Data
  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      sevenDaysForecastContainer.innerHTML = ""; // Clear existing forecast

      // Group data by full date (including day and month)
      const groupedByDay = {};
      data.list.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const fullDate = date.toDateString();  // Use the full date for grouping
        if (!groupedByDay[fullDate]) {
          groupedByDay[fullDate] = [];
        }
        groupedByDay[fullDate].push(forecast);
      });

      // Now, display the 7-day forecast
      let count = 0; // To ensure you only show 7 days
      Object.keys(groupedByDay).forEach((fullDate) => {
        if (count >= 7) return;  // Only display 7 days
        const dayForecasts = groupedByDay[fullDate];
        const dayTemp = (dayForecasts[0].main.temp - 273.15).toFixed(2); // Average or pick first temp
        const dayIcon = dayForecasts[0].weather[0].icon;
        const date = new Date(dayForecasts[0].dt * 1000);
        const dayName = days[date.getDay()];

        sevenDaysForecastContainer.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="">
              <span>${dayTemp}&deg;C</span>
            </div>
            <p>${dayName}</p>
            <p>${fullDate}</p> <!-- This shows the full date (day, month, year) -->
          </div>
        `;

        count++; // Increment day count
      });
      
      // Store forecast data in localStorage
      localStorage.setItem('forecastData', JSON.stringify(data));

      hourlyForecastContainer.innerHTML = ""; // Ensure this is cleared before appending new items

      const hourlyForecast = data.list.filter((item, index) => index % 4 === 0); // Example condition to display hourly data every 4 hours
      hourlyForecast.forEach((hour) => {
        const hourDate = new Date(hour.dt * 1000);
        const hourTemp = (hour.main.temp - 273.15).toFixed(2);
        const hourTime = hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
        hourlyForecastContainer.innerHTML += ` 
          <div class="card">
            <p>${hourTime}</p>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Weather icon">
            <p>${hourTemp}&deg;C</p>
          </div>
        `;
      });
    })
    .catch(() => alert("Failed to fetch forecast data!"));
}

function getCityCoordinates() {
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  const GEO_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEO_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert("City not found!");
        return;
      }
      const { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => alert("Failed to fetch city coordinates!"));
}

function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            alert("Location not found!");
            return;
          }
          const { name, country, state } = data[0];
          getWeatherDetails(name, latitude, longitude, country, state);
        })
        .catch(() => alert("Failed to fetch location data!"));
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("User denied the request for Geolocation.");
      }
    }
  );
}

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);

// Example function to load data from localStorage and display it
function loadStoredData() {
  const currentWeatherData = JSON.parse(localStorage.getItem('currentWeather'));
  const airPollutionData = JSON.parse(localStorage.getItem('airPollution'));
  const forecastData = JSON.parse(localStorage.getItem('forecastData'));

  // Check if data exists in localStorage before updating the UI
  if (currentWeatherData) {
    const { main, weather, wind, sys, visibility } = currentWeatherData;
    const { temp, humidity, pressure, feels_like } = main;
    const { description, icon } = weather[0];
    const { speed } = wind;
    const { sunrise, sunset } = sys;

    // Convert temperature to Celsius
    const tempInCelsius = (temp - 273.15).toFixed(2);
    const feelsLikeInCelsius = (feels_like - 273.15).toFixed(2);

    // Format Sunrise and Sunset Time
    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update the current weather card
    currentWeatherCard.innerHTML = `
      <div class="current-weather">
        <div class="details">
          <p>Now</p>
          <h2>${tempInCelsius}&deg;C</h2>
          <p>${description}</p>
        </div>
        <div class="weather-icon">
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
        </div>
      </div>
      <hr>
      <div class="card-footer">
        <p><i class="far fa-calendar"></i>${days[new Date().getDay()]}, ${new Date().getDate()} ${months[new Date().getMonth()]}, ${new Date().getFullYear()}</p>
        <p><i class="fas fa-location-dot"></i>${currentWeatherData.name}, ${currentWeatherData.sys.country}</p>
      </div>`;

    // Update the sunrise and sunset times
    sunriseCard.innerHTML = `
      <div class="card-head">
        <p>Sunrise & Sunset</p>
      </div>
      <div class="sunrise-sunset">
        <div class="item"><p>Sunrise</p><p>${sunriseTime}</p></div>
        <div class="item"><p>Sunset</p><p>${sunsetTime}</p></div>
      </div>`;

    // Update additional weather details
    humidityVal.innerHTML = `Humidity: ${humidity}%`;
    pressureVal.innerHTML = `Pressure: ${pressure} hPa`;
    visibilityVal.innerHTML = `Visibility: ${visibility} meters`;
    windSpeedVal.innerHTML = `Wind Speed: ${speed} m/s`;
    feelVal.innerHTML = `Feels Like: ${feelsLikeInCelsius}&deg;C`;
  }

  if (airPollutionData) {
    const { list } = airPollutionData;
    const { pm2_5, pm10, so2, co, no, no2, nh3, o3 } = list[0].components;
    const aqiIndex = list[0].main.aqi;

    aqiCard.innerHTML = `
      <div class="card-head">
        <p>Air Quality Index</p>
        <p class="air-index aqi-${aqiIndex}" id="api-1">${aqiList[aqiIndex - 1]}</p>
      </div>
      <div class="air-indices">
        <div class="item"><p>PM2.5</p><p>${pm2_5}</p></div>
        <div class="item"><p>PM10</p><p>${pm10}</p></div>
        <div class="item"><p>SO2</p><p>${so2}</p></div>
        <div class="item"><p>CO</p><p>${co}</p></div>
        <div class="item"><p>NO</p><p>${no}</p></div>
        <div class="item"><p>NO2</p><p>${no2}</p></div>
        <div class="item"><p>NH3</p><p>${nh3}</p></div>
        <div class="item"><p>O3</p><p>${o3}</p></div>
      </div>`;
  }

  if (forecastData) {
    const sevenDaysForecastContainer = document.querySelector(".day-forecast");
    sevenDaysForecastContainer.innerHTML = ""; // Clear existing forecast

    const groupedByDay = {};
    forecastData.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const fullDate = date.toDateString();
      if (!groupedByDay[fullDate]) {
        groupedByDay[fullDate] = [];
      }
      groupedByDay[fullDate].push(forecast);
    });

    let count = 0;
    Object.keys(groupedByDay).forEach((fullDate) => {
      if (count >= 7) return;
      const dayForecasts = groupedByDay[fullDate];
      const dayTemp = (dayForecasts[0].main.temp - 273.15).toFixed(2);
      const dayIcon = dayForecasts[0].weather[0].icon;
      const date = new Date(dayForecasts[0].dt * 1000);
      const dayName = days[date.getDay()];

      sevenDaysForecastContainer.innerHTML += `
        <div class="forecast-item">
          <div class="icon-wrapper">
            <img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="">
            <span>${dayTemp}&deg;C</span>
          </div>
          <p>${dayName}</p>
          <p>${fullDate}</p>
        </div>
      `;

      count++;
    });
  }
}

// Call this function when the page loads to check for stored data
loadStoredData();
window.onload = function () {
  var apiKey = 'ad51411d878e2c56f89b16bbc868eb6d';

  // Initialize map with a default location
  var map = L.map('map').setView([20, 0], 2);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Weather layers
  var temperatureLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, { attribution: '&copy; OpenWeatherMap' });
  var cloudLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, { attribution: '&copy; OpenWeatherMap' });
  var precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, { attribution: '&copy; OpenWeatherMap' });
  var windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, { attribution: '&copy; OpenWeatherMap' });

  var overlayMaps = {
      "🌡 Temperature": temperatureLayer,
      "☁ Clouds": cloudLayer,
      "🌧 Precipitation": precipitationLayer,
      "💨 Wind": windLayer
  };

  L.control.layers(null, overlayMaps).addTo(map);
  temperatureLayer.addTo(map);

  // Get user location and fetch weather
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          function (position) {
              var lat = position.coords.latitude;
              var lon = position.coords.longitude;

              // Update map view to user's location
              map.setView([lat, lon], 10);

              // Fetch weather data
              fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                  .then(response => response.json())
                  .then(data => {
                      var weatherDesc = data.weather[0].description;
                      var temperature = data.main.temp;
                      var humidity = data.main.humidity;
                      var windSpeed = data.wind.speed;

                      // Add a marker with weather info
                      L.marker([lat, lon]).addTo(map)
                          .bindPopup(`📍 You are here!<br>🌡 Temp: ${temperature}°C<br>💧 Humidity: ${humidity}%<br>💨 Wind: ${windSpeed} m/s<br>⛅ ${weatherDesc}`)
                          .openPopup();
                  })
                  .catch(error => console.error("Weather API error:", error));
          },
          function (error) {
              console.error("Geolocation error:", error);
              alert("Geolocation failed. Please allow location access.");
          }
      );
  } else {
      alert("Geolocation is not supported by your browser.");
  }
};
