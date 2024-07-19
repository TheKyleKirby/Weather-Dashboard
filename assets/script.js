const apiKey = '5c3358eba0484c8e4c5d5c151e07269d';
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const cityInput = document.getElementById('city-input');
const citySearchForm = document.getElementById('city-search-form');
const currentWeather = document.getElementById('current-weather');
const futureWeather = document.getElementById('future-weather');
const searchHistory = document.getElementById('search-history');

// City form
citySearchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value;
    getWeatherData(city);
    addToSearchHistory(city);
    console.log (city);
});

function getWeatherData(city) {
    const currentWeatherUrl = `${apiBaseUrl}?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();

            currentWeather.innerHTML = `
                <h2>${data.name} (${formattedDate})</h2>
                <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                <p>Temperature: ${data.main.temp}°F</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} MPH</p>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Fetch weather forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            futureWeather.innerHTML = '';
            for (let i = 0; i < data.list.length; i += 8) {
                futureWeather.innerHTML += `
                    <div>
                        <h3>${new Date(data.list[i].dt_txt).toLocaleDateString()}</h3>
                        <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="${data.list[i].weather[0].description}">
                        <p>Temperature: ${data.list[i].main.temp}°F</p>
                        <p>Humidity: ${data.list[i].main.humidity}%</p>
                        <p>Wind Speed: ${data.list[i].wind.speed} MPH</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addToSearchHistory(city) {
    const cityElement = document.createElement('div');
    cityElement.textContent = city;
    cityElement.classList.add('search-result');
    cityElement.addEventListener('click', function() {
        getWeatherData(city);
    });
    searchHistory.appendChild(cityElement);

    let historyArray = localStorage.getItem('searchHistory');
    if(historyArray) {
        historyArray = JSON.parse(historyArray);
        if (!Array.isArray(historyArray)) { 
            historyArray = [];
        }
    } else {
        historyArray = [];
    }
    historyArray.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(historyArray)); 
}