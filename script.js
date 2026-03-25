
// ====================================================
// Task 2 - 30% Complete: Basic API Integration
// Current weather fetch by city name
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
    var cityInput = document.getElementById('cityInput');
    var searchBtn = document.getElementById('searchBtn');
    var weatherInfo = document.getElementById('weatherInfo');
    var errorMsg = document.getElementById('errorMsg');

    searchBtn.addEventListener('click', function() {
        var city = cityInput.value.trim();
        if (city === "") {
            showError("Please enter a city name.");
            return;
        }
        fetchWeather(city);
    });
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