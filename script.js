
// ====================================================
// Task 2 - 30% Complete: Basic API Integration
// Current weather fetch by city name
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
    var cityInput = document.getElementById('cityInput');
    var searchBtn = document.getElementById('searchBtn');
    var weatherInfo = document.getElementById('weatherInfo');
    var errorMsg = document.getElementById('errorMsg');
    var recentSelect = document.getElementById('recentSelect');
    var locationBtn = document.getElementById('locationBtn');

    searchBtn.addEventListener('click', function() {
        var city = cityInput.value.trim();
        if (city === "") {
            showError("Please enter a city name.");
            return;
        }
        fetchWeather(city);
    });
        locationBtn.addEventListener("click", function(){
            getLocationFetchWeather();
        });
        recentSelect.addEventListener("change", function(){
            loadRecentCities();
        }) 
});




async function fetchWeather(city) {
    var apiKey = '9143f882f9b5c6f5c3b164d38ca52005'; // Replace with your actual key
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric';

    try {
        var response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the name.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }
        var data = await response.json();
        displayWeather(data);
        saveCityToStorage(city);
        loadRecentCities();
    } catch (error)  {
            //catch the error send that error to 
            //showError function 
        showError(error.message);
    }
}

function displayWeather(data) {
    var weatherInfo = document.getElementById('weatherInfo');
    var errorMsg = document.getElementById('errorMsg');
    errorMsg.classList.add('hidden');

    
    
    
    // extract temp
        var temp = data.main.temp;
    // extract humidity 
        var humidity = data.main.humidity;
    
    // extract windSpeed
        var windSpeed = data.wind.speed;
    // extract description
        var description = data.weather[0].description;
     // extract city name
        var cityName = data.name;

    // insert the data into HTML 

    weatherInfo.innerHTML = `
        <h2 class="text-xl font-semibold">${cityName}</h2>
        <p class="text-3xl font-bold">${temp}°C</p>
        <p class="capitalize">${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind: ${windSpeed} m/s</p>
    `;
    weatherInfo.classList.remove('hidden');
}

function showError(message) {
    var errorMsg = document.getElementById('errorMsg');
    var weatherInfo = document.getElementById('weatherInfo');

    // hide weather data if user request same city name
    // that he used to get his previous data
        weatherInfo.classList.add('hidden');

    // take the error message and write it in HTML
        errorMsg.textContent = message;
    
    // by default error message are hidden 
        errorMsg.classList.remove('hidden');
}

// function to get user's geolocation 

    function getLocationFetchWeather () {

        // check if the browser supports geolocation feature
            if (typeof(navigator.geolocation) === "undefined") {

                // pass the showError function 
                    showError("Geolocation is not supported by your browser");
                    return;
            }
            // request position 
                navigator.geolocation.getCurrentPosition(

                    // succes callback 
                        function (position) {

                            var lat = position.coords.latitude;
                            var lon = position.coords.longitude;
                        },

                        // error callbacks
                            function (error) {
                                // error-1
                                switch(error.code){
                                    case error.PERMISSION_DENIED:
                                        showError("Location service is denied please enable location service");
                                        break;
                                    case error.POSITION_UNAVAILABLE: 
                                        showError("Location information is not available");
                                        break;
                                    case error.TIMEOUT: 
                                        showError("Location request time out error");
                                        break;
                                default: 
                                    showError("An unknown error occured while getting the location");
                                        break; 
                                }

                            }
                );
    }

// fetch weather from coordinates 

async function fetchWeatherByCoords (lat ,lon) {

    var apiKey = '9143f882f9b5c6f5c3b164d38ca52005';
    var url = '<https://api.openweathermap.org/data/2.5/weather?lat=>' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';

        try {
            
            // check response 
                var response = await fetch(url);
                    if(response.ok === false){

                        showError("Failed to fetch weather data");
                    }
                    // extract the data from url 
                        var data = await response.json()
                    // send the data to displayWeather 
                        displayWeather(data);
        } 
        // catch error if any 
            catch (error) {

                showError.error.message;
        }

}

// save a city to localStorage after they are been searched 
    function saveCityToStorage (cityName) {

        if (Boolean(cityName) === false) {

            return;
        }

        // get existing cities from localStorage or empty array 
            var rawData = localStorage.getItem("recentCities");
            var cities;
            
            //checking if the data is truthy or not empty 
                if (Boolean(rawData) === true){

                    cities = JSON.parse(rawData);
                }
            // if empty 
                else {

                    cities = [];

                }
        // remove duplicate cities 
            cities = cities.filter(function (a) {

                if (a.toLowerCase === cityName.toLowerCase) {

                // if it matches remove it 
                    return false ;
                }

                else {
                // if not save it 
                    return true; 
                }
            });
        
            // add cities to the front 
                cities.unsift(cityName);
            
            // keep only 5 elements 
                if (cities.length > 5) {

                    cities.pop()
                }

                // save cities back 
                    localStorage.setItem("recentCities", JSON.stringify(cities));
                
    }

// load recentCities from localStorage 
// send it to html page
    function loadRecentCities () {

        var recentContainer = document.getElementById("recentContainer");
        var recentSelect = document.getElementById("recentSelect");

        // loading reccnt cities and populating 
        // the  dropdown 
        var rawData = localStorage.getItem("recentCities");
        var cities;
            
            //checking if the data is truthy or not empty 
                if (Boolean(rawData) === true){

                    cities = JSON.parse(rawData);
                }
            // if empty 
                else {

                    cities = [];

                }
        
        // clearing all the options expect the first place holder 
            while (recentSelect.options.length > 1){
            // remove the element at the number one position
                recentSelect.remove(1);
            }

        // adding cities to select tag 
            for (var i = 0; i < cities.length; i++){
                // add the elements in dropdown 
                    var options = document.createElement("option");
                    options.value = cities[i];
                    options.textContent = cities[i];
                    recentSelect.appendChild(options);

            }

        // show or hide a options 
            if (cities,lenght > 1) {
                recentContainer.classList.remove("hidden");
            }
            else {
                recentContainer.classList.add("hidden");
            }
    }



// if a city has been selected from recentCity then: 
    function onRecentCitySelected () {

        var recentSelect = document.getElementById("recentSelect");
        var selectedCity = recentSelect.value;
        // checking for invaild data 
            if (Boolean(selectedCity === true)){
                // fetch the weather 
                    displayWeather(selectedCity);
                // reset to default 
                    recentSelect.value = "";
            }
    }

// forecasrt weather section 
    function showForecastError (message) {
        var forecastSection = document.getElementById("forecastSection");
        var forecastContainer = document.getElementById("forecastContainer");
        // display the error message 
        forecastContainer.innerHTML = '<p class="text-red-500">' + message + '</p>'; 
        // remove hidden 
        forecastSection.classList.remove("hidden");

    }

// function that will display forecast and render forecast cards
    function displayForecast (dailyForecasts) {
        var forecastSection = document.getElementById("forecastSection");
        var forecastContainer = document.getElementById("forecastContainer");
        //make conatiner blank 
            forecastContainer.innerHTML = "";
    // creating a card based on dailyForecasts 
        for (var i = 0; i < dailyForecasts.length; i++) {
            var day = dailyForecasts[i];
            var card = document.createElement("div");
            card.className = 'bg-gray-50 p-3 rounded-lg shadow text-center';
            // extracting date, dayName, month 
            var date = new Date(day.dt * 1000); 
            var dayName = date.toLocaleDateString("en-US", {weekday: "short"});
            var monthDay = date.toLocaleDateString("en-US", {month: "short", day: "numeric"});

            // make the data 
            card.innerHTML = `
                <p class = "font-semibold">>${dayName}</p>
                <p class = "text-sm text-gray-500">${monthDay}</p>
                <img src="<https://openweathermap.org/img/wn/${day.icon}.png>" alt="weather icon" class="mx-auto">
                <p class = "text-lg font-bold>${Math.round(day.temp)}°C</p>
                <p class = "text-sm">${day.wind}</p>
                <p class = "text-sm">${day.humidity}</p>

            `; 
            forecastContainer.appendChild(card); 
        }        
            forecastSection.classList.remove("hidden");
    }

// function that will group API into daily foreast 
    function processForecastData (data) {
        // group by day 
        var dailyMap = {}; // create a empty drawer 
        // traverse over the data the list that we recieve 
        for (var i = 0; i < data.list.length; i++){
            var item = data.list[i];
            var date = new Date(item.dt * 1000); // get the date so to extract more data from it 
            var dateKey = date.toDateString(); 
            // Only keep one per day: we choose the one closest to noon (12:00)
            var hour = date.getHours();
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
        // converting map to array 
            var days = Object.values(dailyMap);
        // sort the date 
            days.sort(function (a, b ){
                return a.dt - b.dt
        }); 
        // return the first five days 
        return days.slice(0, 5); 
        
    }
// now fetch and display the forecast data 
    async function fetchFiveDayForecast (city) {
        var apiKey = "'9143f882f9b5c6f5c3b164d38ca52005'"; 
        var url = '<https://api.openweathermap.org/data/2.5/forecast?q=>' + city + '&appid=' + apiKey + '&units=metric';
        // now wait for the data to get available 

        try {
            var response = await fetch(url);
            if (response.ok === false) {
                throw new Error('Unable to fetch forecast. Please try again.');
            }
            // if data is true then transfer it to variable 
            // convert the data into json 
            var data = await response.json();
            // pass the data to processForecastData function and save it's result 
            var dailyForecasts = processForecastData(data);
            // pass dailyForecasts data to displayForecast 
            displayForecast(dailyForecasts);
        }
        // catch the error if any 
        catch (error){
            showForecastError(error.message);
        }
    }

    // function to display forecast data based on geoloation 
        async function fetchFiveDayForecastByCoords(lat, lon) {
        var apiKey = 'YOUR_API_KEY_HERE';
        var url = '<https://api.openweathermap.org/data/2.5/forecast?lat=>' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';

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