const submitButton = document.getElementById('searchButton');
const APIkey = "5c3358eba0484c8e4c5d5c151e07269d";

function getWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    
    fetch(weatherUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const today = data.list[0];
        const fiveDay = data.list.slice(1, 6); // Get next 5 days data

        displayBigCard(today);
        displayFiveDayCards(fiveDay);
    });
}

function displayBigCard(data) {
    console.log(data);
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("currentTemp").textContent = `Temperature: ${data.main.temp} K`;
    document.getElementById("currentWind").textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById("currentHumidity").textContent = `Humidity: ${data.main.humidity}%`;
}

function displayFiveDayCards(data) {
    const fiveDayCardsContainer = document.getElementById('fiveDayCards');
    fiveDayCardsContainer.innerHTML = '';

    data.forEach(day => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3 class="card-title">${day.dt_txt}</h3>
            <p class="card-text">Temperature: ${day.main.temp} K</p>
            <p class="card-text">Wind: ${day.wind.speed} m/s</p>
            <p class="card-text">Humidity: ${day.main.humidity}%</p>
        `;
        fiveDayCardsContainer.appendChild(card);
    });
}

function searchPressed() {
    const query = document.querySelector('#city').value;

    const coordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${APIkey}`; 

    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(query);
    localStorage.setItem('cities', JSON.stringify(cities));
    displayMostRecentItemFromLocalStorage();
    
    fetch(coordinatesUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const city = data[0];
        const latitude = city?.lat;
        const longitude = city?.lon;

        getWeather(latitude, longitude);
    });
}

function displayMostRecentItemFromLocalStorage() {
    const storedCities = localStorage.getItem('cities');

    if (storedCities) {
        const citiesArray = JSON.parse(storedCities);

        if (Array.isArray(citiesArray) && citiesArray.length > 1) {
            const buttonContainer = document.getElementById('buttonContainer');
            buttonContainer.innerHTML = '';
            citiesArray.forEach(city => {
                const button = document.createElement('button');
                button.textContent = city;
                buttonContainer.appendChild(button);
            });
        } else if (Array.isArray(citiesArray) && citiesArray.length === 1) {
            const mostRecentCity = citiesArray[citiesArray.length - 1];
            const button = document.createElement('button');
            button.textContent = mostRecentCity;
            const buttonContainer = document.getElementById('buttonContainer');
            buttonContainer.appendChild(button);
        } else {
            console.log('Cities array is empty or not valid.');
        }
    } else {
        console.log('Item not found in local storage');
    }
}

displayMostRecentItemFromLocalStorage();
submitButton.addEventListener('click', searchPressed);

console.log(getWeather);