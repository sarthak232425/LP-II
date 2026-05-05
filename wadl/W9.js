/*
W9: Create a weather application using JavaScript and AJAX where users enter a city name, and AJAX fetches real-time weather data dynamically from local repository map having city with temperature, humidity, and conditions.
*/

// This file would typically be part of an HTML file.
// For demonstration, the HTML structure is commented out below,
// and the JavaScript logic is provided.

/*
HTML Structure:
<body>
    <h1>Weather App</h1>
    <input type="text" id="cityInput" placeholder="Enter city name">
    <button onclick="getWeather()">Get Weather</button>
    <div id="weatherResult"></div>
</body>
*/

// Local repository of weather data (simulating a server/API)
const weatherData = {
    "pune": {
        temperature: "24°C",
        humidity: "60%",
        conditions: "Partly Cloudy"
    },
    "mumbai": {
        temperature: "28°C",
        humidity: "75%",
        conditions: "Humid"
    },
    "delhi": {
        temperature: "30°C",
        humidity: "40%",
        conditions: "Sunny"
    },
    "bangalore": {
        temperature: "22°C",
        humidity: "70%",
        conditions: "Pleasant"
    }
};

function getWeather() {
    const city = document.getElementById('cityInput').value.toLowerCase();
    const resultDiv = document.getElementById('weatherResult');

    // Basic AJAX request simulation
    const xhr = new XMLHttpRequest();

    // This is a mock "API" endpoint. In a real app, this would be a URL.
    // We use a timeout to simulate network latency.
    setTimeout(() => {
        if (weatherData[city]) {
            const data = weatherData[city];
            const responseText = JSON.stringify(data);

            // Simulate successful response
            Object.defineProperty(xhr, 'readyState', { value: 4, writable: true });
            Object.defineProperty(xhr, 'status', { value: 200, writable: true });
            Object.defineProperty(xhr, 'responseText', { value: responseText, writable: true });
            xhr.onreadystatechange();
        } else {
            // Simulate a "Not Found" error
            Object.defineProperty(xhr, 'readyState', { value: 4, writable: true });
            Object.defineProperty(xhr, 'status', { value: 404, writable: true });
            xhr.onreadystatechange();
        }
    }, 500); // 500ms delay

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                resultDiv.innerHTML = `
                    <h3>Weather in ${city.charAt(0).toUpperCase() + city.slice(1)}</h3>
                    <p><strong>Temperature:</strong> ${data.temperature}</p>
                    <p><strong>Humidity:</strong> ${data.humidity}</p>
                    <p><strong>Conditions:</strong> ${data.conditions}</p>
                `;
            } else {
                resultDiv.innerHTML = `<p>Weather data not found for ${city}. Please try Pune, Mumbai, Delhi, or Bangalore.</p>`;
            }
        } else {
            resultDiv.innerHTML = `<p>Loading...</p>`;
        }
    };

    // In a real scenario, you would open and send the request like this:
    // xhr.open('GET', `https://api.weather.com/data?city=${city}`, true);
    // xhr.send();
}

