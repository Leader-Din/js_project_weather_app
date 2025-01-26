// Ensure no code is duplicating the form
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is already registered
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.email) {
        window.location.href = 'app.html';
        return;
    }

    // Variable
    const formContainer = document.getElementById('formContainer');
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = {};

        const fields = [
            'firstName',
            'lastName',
            'email',
            'password',
            'confirmPassword'
        ];

        fields.forEach(field => {
            formData[field] = document.getElementById(field).value;
        });

        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
        } else {
            // Store data in localStorage
            localStorage.setItem('userData', JSON.stringify(formData));

            alert("Registration Successful!");

            // Fetch and display weather data immediately after registration
            getUserCoordinates();
        }
    });
});

const api_key = "ad51411d878e2c56f89b16bbc868eb6d";

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
                    // Redirect to app.html after fetching weather details
                    window.location.href = 'app.html';
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

                // Define the Cambodia time offset
                const cambodiaTimeOffset = 7 * 60 * 60 * 1000; // UTC +7 in milliseconds

                // Format Sunrise and Sunset Time
                const sunriseTime = new Date((sunrise + timezone) * 1000 + cambodiaTimeOffset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const sunsetTime = new Date((sunset + timezone) * 1000 + cambodiaTimeOffset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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

            // Group data by day
            const groupedByDay = {};
            data.list.forEach((forecast) => {
                const date = new Date(forecast.dt * 1000);
                const day = date.getDate();
                if (!groupedByDay[day]) {
                    groupedByDay[day] = [];
                }
                groupedByDay[day].push(forecast);
            });

            // Now, display the 7-day forecast
            let count = 0; // To ensure you only show 7 days
            Object.keys(groupedByDay).forEach((day) => {
                if (count >= 7) return;  // Only display 7 days
                const dayForecasts = groupedByDay[day];
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
                    <p>${date.getDate()} ${months[date.getMonth()]}</p> <!-- This shows the day and month -->
                </div>`;

                count++; // Increment day count
            });
            
            // Store forecast data in localStorage
            localStorage.setItem('forecastData', JSON.stringify(data));

            hourlyForecastContainer.innerHTML = ""; // Ensure this is cleared before appending new items

            const hourlyForecast = data.list.filter((item, index) => index % 3 === 0); // Example condition to display hourly data every 3 hours
            hourlyForecast.forEach((hour) => {
                const hourDate = new Date(hour.dt * 1000);
                const hourTemp = (hour.main.temp - 273.15).toFixed(2);
                const hourTime = hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
                hourlyForecastContainer.innerHTML += ` 
                <div class="card">
                    <p>${hourTime}</p>
                    <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Weather icon">
                    <p>${hourTemp}&deg;C</p>
                </div>`;
            });
        })
        .catch(() => alert(""));
}
