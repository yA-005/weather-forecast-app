

// OpenWeatherMap API key (replace with your own)
var API_KEY = '9143f882f9b5c6f5c3b164d38ca52005'; 
// Track temperature unit: true = Celsius, false = Fahrenheit
var isCelsius = true;   
// Store the current temperature in Celsius for unit toggling
var currentCelsiusTemp = null;  

// ---------- DOM Content Loaded: set up event listeners ----------
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var cityInput = document.getElementById('cityInput');
    var searchBtn = document.getElementById('searchBtn');
    var locationBtn = document.getElementById('locationBtn');
    var unitToggle = document.getElementById('unitToggle');
    var recentSelect = document.getElementById('recentSelect');
    var clearRecentBtn = document.getElementById('clearRecentBtn');

    // Search button: validate input, then fetch weather and forecast
    searchBtn.addEventListener('click', function() {
        var city = cityInput.value.trim();
        if (city === "") {
            showError("Please enter a city name.");
            return;
        }
        showLoading(true);
        fetchWeather(city);
        fetchFiveDayForecast(city);
    });

    // My Location button: use browser geolocation
    locationBtn.addEventListener('click', function() {
        getLocationAndFetchWeather();
    });

    // Unit toggle: switch between °C and °F for current temperature only
    unitToggle.addEventListener('click', function() {
        toggleTemperatureUnit();
    });

    // When user selects a city from the recent dropdown, fetch its weather
    recentSelect.addEventListener('change', onRecentCitySelected);

    // Clear recent cities button: remove all stored cities
    if (clearRecentBtn !== null) {
        clearRecentBtn.addEventListener('click', function() {
            clearRecentCities();
        });
    }

    // Load any previously stored recent cities from localStorage
    loadRecentCities();
});

// ---------- Helper Functions ----------
// Show/hide the loading spinner
function showLoading(show) {
    var spinner = document.getElementById('loadingSpinner');
    if (show === true) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

// Display an error message in the styled error div (no alert())
function showError(message) {
    var errorMsg = document.getElementById('errorMsg');
    var weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.classList.add('hidden');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    showLoading(false);
}

// Hide the error message div
function hideError() {
    var errorMsg = document.getElementById('errorMsg');
    errorMsg.classList.add('hidden');
}

// ---------- Dynamic Background (changes with weather condition) ----------
function updateBackground(condition) {
    var body = document.getElementById('appBody');
    // Reset classes to avoid conflicts
    body.className = '';
    body.classList.add('min-h-screen', 'flex', 'items-center', 'justify-center', 'p-4', 'transition-all', 'duration-500');

    // Apply gradient based on condition (full if-else, no shorthand)
    if (condition === 'Clear') {
        body.classList.add('bg-gradient-to-br', 'from-yellow-400', 'to-orange-500');
    } else if (condition === 'Clouds') {
        body.classList.add('bg-gradient-to-br', 'from-gray-400', 'to-gray-600');
    } else if (condition === 'Rain') {
        body.classList.add('bg-gradient-to-br', 'from-blue-800', 'to-gray-700');
    } else if (condition === 'Snow') {
        body.classList.add('bg-gradient-to-br', 'from-blue-200', 'to-white');
    } else if (condition === 'Thunderstorm') {
        body.classList.add('bg-gradient-to-br', 'from-purple-800', 'to-black');
    } else {
        // Default gradient
        body.classList.add('bg-gradient-to-br', 'from-blue-400', 'to-purple-500');
    }
}

// ---------- Extreme Temperature Alert (>=40°C or <=0°C) ----------
function showExtremeAlert(tempCelsius) {
    var alertBanner = document.getElementById('alertBanner');
    var alertText = document.getElementById('alertText');
    if (tempCelsius > 40) {
        alertText.textContent = '⚠️ Extreme heat alert! Temperature is ' + tempCelsius + '°C. Stay hydrated and avoid sun exposure.';
        alertBanner.classList.remove('hidden');
    } else if (tempCelsius < 0) {
        alertText.textContent = '⚠️ Extreme cold alert! Temperature is ' + tempCelsius + '°C. Dress warmly and stay indoors if possible.';
        alertBanner.classList.remove('hidden');
    } else {
        alertBanner.classList.add('hidden');
    }
}

// ---------- Display Current Weather (populates the weather card) ----------
function displayWeather(data) {
    var weatherInfo = document.getElementById('weatherInfo');
    var errorMsg = document.getElementById('errorMsg');
    errorMsg.classList.add('hidden');
    hideError();

    // Extract data from API response
    var tempC = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var description = data.weather[0].description;
    var cityName = data.name;
    var iconCode = data.weather[0].icon;
    var iconUrl = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
    var condition = data.weather[0].main;

    // Store for unit toggle
    currentCelsiusTemp = tempC;
    // Update background and alert based on weather
    updateBackground(condition);
    showExtremeAlert(tempC);

    // Format temperature according to current unit
    var displayTemp = isCelsius ? Math.round(tempC) + '°C' : Math.round((tempC * 9/5) + 32) + '°F';

    // Inject HTML into the weather card
    weatherInfo.innerHTML = `
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-800">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="w-16 h-16">
        </div>
        <div class="mt-2">
            <p class="text-4xl font-bold text-blue-600">${displayTemp}</p>
            <p class="text-gray-600 capitalize">${description}</p>
        </div>
        <div class="mt-4 flex justify-between text-gray-700">
            <p>💧 Humidity: ${humidity}%</p>
            <p>🌬️ Wind: ${windSpeed} m/s</p>
        </div>
    `;
    weatherInfo.classList.remove('hidden');
    showLoading(false);
}

// ---------- Temperature Unit Toggle (only for current temperature) ----------
function toggleTemperatureUnit() {
    if (currentCelsiusTemp === null || currentCelsiusTemp === undefined) {
        return; // No weather data yet
    }
    isCelsius = !isCelsius;
    var weatherInfo = document.getElementById('weatherInfo');
    if (weatherInfo && weatherInfo.classList.contains('hidden') === false) {
        var tempElement = weatherInfo.querySelector('.text-4xl');
        if (tempElement) {
            var newTemp = isCelsius ? Math.round(currentCelsiusTemp) + '°C' : Math.round((currentCelsiusTemp * 9/5) + 32) + '°F';
            tempElement.textContent = newTemp;
        }
    }
}

// ---------- Current Weather by City Name ----------
async function fetchWeather(city) {
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API_KEY + '&units=metric';
    try {
        var response = await fetch(url);
        // Check if response is not OK (full condition, no ! operator)
        if (response.ok === false) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the name.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }
        var data = await response.json();
        displayWeather(data);
        // Save this city to recent searches and refresh dropdown
        saveCityToStorage(city);
        loadRecentCities();
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

// ---------- Current Weather by Geolocation ----------
function getLocationAndFetchWeather() {
    // Check if browser supports geolocation
    if (navigator.geolocation === undefined) {
        showError("Geolocation is not supported by your browser.");
        return;
    }
    showError("Fetching your location...");
    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        },
        function(error) {
            // Handle different geolocation errors
            if (error.code === error.PERMISSION_DENIED) {
                showError("Location permission denied. Please enable location services.");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                showError("Location information is unavailable.");
            } else if (error.code === error.TIMEOUT) {
                showError("Location request timed out.");
            } else {
                showError("An unknown error occurred while getting location.");
            }
            showLoading(false);
        }
    );
}

// Fetch weather using latitude and longitude
async function fetchWeatherByCoords(lat, lon) {
    var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric';
    try {
        var response = await fetch(url);
        if (response.ok === false) {
            throw new Error('Failed to fetch weather data for your location.');
        }
        var data = await response.json();
        displayWeather(data);
        // Also fetch 5-day forecast for these coordinates
        fetchFiveDayForecastByCoords(lat, lon);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

// ---------- 5-Day Forecast Functions ----------
// Display forecast error inside the forecast section
function showForecastError(message) {
    var forecastSection = document.getElementById('forecastSection');
    var forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '<p class="text-red-500">' + message + '</p>';
    forecastSection.classList.remove('hidden');
    showLoading(false);
}

// Render forecast cards from processed daily data
function displayForecast(dailyForecasts) {
    var forecastSection = document.getElementById('forecastSection');
    var forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    for (var i = 0; i < dailyForecasts.length; i++) {
        var day = dailyForecasts[i];
        var card = document.createElement('div');
        card.className = 'bg-gray-50 p-3 rounded-xl shadow hover:shadow-md transition-shadow text-center';
        var date = new Date(day.dt * 1000);
        var dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        var monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        var iconUrl = 'https://openweathermap.org/img/wn/' + day.icon + '.png';
        // Each card shows: day, date, weather icon, temperature, wind, humidity
        card.innerHTML = `
            <p class="font-semibold text-gray-700">${dayName}</p>
            <p class="text-xs text-gray-500">${monthDay}</p>
            <img src="${iconUrl}" alt="weather icon" class="w-12 h-12 mx-auto my-2">
            <p class="text-lg font-bold text-blue-600">🌡️ ${Math.round(day.temp)}°C</p>
            <p class="text-sm text-gray-600">🌬️ ${Math.round(day.wind)} m/s</p>
            <p class="text-sm text-gray-600">💧 ${day.humidity}%</p>
        `;
        forecastContainer.appendChild(card);
    }
    forecastSection.classList.remove('hidden');
    showLoading(false);
}

// Process raw API forecast data into daily summaries (pick reading closest to noon)
function processForecastData(data) {
    var dailyMap = {};
    for (var i = 0; i < data.list.length; i++) {
        var item = data.list[i];
        var date = new Date(item.dt * 1000);
        var dateKey = date.toDateString();
        var hour = date.getHours();
        // If this day not yet recorded, or this reading is closer to noon (12:00) than the previous one
        if (dailyMap[dateKey] === undefined || Math.abs(hour - 12) < Math.abs(dailyMap[dateKey].hour - 12)) {
            dailyMap[dateKey] = {
                dt: item.dt,
                temp: item.main.temp,
                humidity: item.main.humidity,
                wind: item.wind.speed,
                icon: item.weather[0].icon,
                hour: hour
            };
        }
    }
    var days = Object.values(dailyMap);
    days.sort(function(a, b) { return a.dt - b.dt; });
    return days.slice(0, 5); // Return only first 5 days
}

// Fetch 5-day forecast by city name
async function fetchFiveDayForecast(city) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + API_KEY + '&units=metric';
    try {
        var response = await fetch(url);
        if (response.ok === false) {
            throw new Error('Unable to fetch forecast. Please try again.');
        }
        var data = await response.json();
        var dailyForecasts = processForecastData(data);
        displayForecast(dailyForecasts);
    } catch (error) {
        showForecastError(error.message);
    }
}

// Fetch 5-day forecast by coordinates (used after geolocation)
async function fetchFiveDayForecastByCoords(lat, lon) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric';
    try {
        var response = await fetch(url);
        if (response.ok === false) {
            throw new Error('Unable to fetch forecast for your location.');
        }
        var data = await response.json();
        var dailyForecasts = processForecastData(data);
        displayForecast(dailyForecasts);
    } catch (error) {
        showForecastError(error.message);
    }
}

// ---------- Recent Searches (localStorage) ----------
// Save a city to localStorage, keep only last 5 unique entries
function saveCityToStorage(cityName) {
    if (cityName === undefined || cityName === null || cityName === "") {
        return;
    }
    var cities = localStorage.getItem('recentCities');
    if (cities === null) {
        cities = [];
    } else {
        cities = JSON.parse(cities);
    }
    // Remove duplicate if exists
    var filtered = [];
    for (var i = 0; i < cities.length; i++) {
        if (cities[i].toLowerCase() !== cityName.toLowerCase()) {
            filtered.push(cities[i]);
        }
    }
    // Add new city at the beginning
    filtered.unshift(cityName);
    if (filtered.length > 5) {
        filtered.pop();
    }
    localStorage.setItem('recentCities', JSON.stringify(filtered));
}

// Load recent cities from localStorage and populate the dropdown
function loadRecentCities() {
    var recentContainer = document.getElementById('recentContainer');
    var recentSelect = document.getElementById('recentSelect');
    var cities = localStorage.getItem('recentCities');
    if (cities === null) {
        cities = [];
    } else {
        cities = JSON.parse(cities);
    }
    // Clear existing options except the placeholder
    while (recentSelect.options.length > 1) {
        recentSelect.remove(1);
    }
    for (var i = 0; i < cities.length; i++) {
        var option = document.createElement('option');
        option.value = cities[i];
        option.textContent = cities[i];
        recentSelect.appendChild(option);
    }
    // Show dropdown only if there are cities
    if (cities.length > 0) {
        recentContainer.classList.remove('hidden');
    } else {
        recentContainer.classList.add('hidden');
    }
}

// When user selects a city from the dropdown, fetch its weather and forecast
function onRecentCitySelected() {
    var recentSelect = document.getElementById('recentSelect');
    var selectedCity = recentSelect.value;
    if (selectedCity !== undefined && selectedCity !== null && selectedCity !== "") {
        showLoading(true);
        fetchWeather(selectedCity);
        fetchFiveDayForecast(selectedCity);
        recentSelect.value = ""; // reset to placeholder
    }
}

// Clear all recent cities from localStorage and hide dropdown
function clearRecentCities() {
    localStorage.removeItem('recentCities');
    var recentSelect = document.getElementById('recentSelect');
    while (recentSelect.options.length > 1) {
        recentSelect.remove(1);
    }
    var recentContainer = document.getElementById('recentContainer');
    recentContainer.classList.add('hidden');
}