// Chamber Homepage JavaScript

// OpenWeatherMap API Configuration
const WEATHER_API_KEY = '726ff3939ae190a1ea1a416d5007433d';
const CITY_NAME = 'Timbuktu';
const COUNTRY_CODE = 'ML';

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const spotlightsContainer = document.getElementById('spotlights-container');

// Initialize the page
document.addEventListener('DOMContentLoaded', async function () {
    updateFooterDates();
    setupEventListeners();
    await loadMemberSpotlights();
    await loadWeatherData();
    initializeTheme();
});

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
            navMenu.classList.remove('show');
        }
    });

    // Close mobile menu when window is resized to larger size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
        }
    });
}

// Load member spotlights
async function loadMemberSpotlights() {
    try {
        const members = await getMembersData();

        // Filter for gold and silver members only
        const eligibleMembers = members.filter(
            (member) => member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver'
        );

        if (eligibleMembers.length === 0) {
            spotlightsContainer.innerHTML =
                '<p class="no-spotlights">No eligible member spotlights available.</p>';
            return;
        }

        // Randomly select 2–3 members
        const numberOfSpotlights = Math.min(3, eligibleMembers.length);
        const selectedMembers = getRandomMembers(eligibleMembers, numberOfSpotlights);

        // Display spotlights
        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Error loading member spotlights:', error);
        spotlightsContainer.innerHTML =
            '<p class="error-message">Unable to load member spotlights at this time.</p>';
    }
}

// Get random members for spotlights
function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Display member spotlights
function displaySpotlights(members) {
    const spotlightsHTML = members
        .map((member) => {
            const membershipLevel = member.membershipLevel;
            const membershipClass = membershipLevel.toLowerCase();

            return `
            <div class="spotlight-card ${membershipClass}">
                <div class="spotlight-header">
                    <div class="spotlight-logo">
                        ${member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="spotlight-info">
                        <h3>${member.name}</h3>
                        ${
                            member.otherInfo
                                ? `<p class="spotlight-tagline">${member.otherInfo}</p>`
                                : ''
                        }
                    </div>
                </div>
                <div class="spotlight-details">
                    <p class="spotlight-contact">
                        <strong>📞</strong> <a href="tel:${member.phone}">${member.phone}</a>
                    </p>
                    <p class="spotlight-contact">
                        <strong>🌐</strong> 
                        <a href="${member.website}" target="_blank" rel="noopener">
                            ${member.website.replace('https://', '').replace('www.', '')}
                        </a>
                    </p>
                    <p class="spotlight-address">
                        <strong>📍</strong> ${member.address}
                    </p>
                    <div class="spotlight-membership">
                        <span class="membership-badge level-${membershipClass}">
                            ${membershipLevel} Member
                        </span>
                    </div>
                </div>
            </div>
        `;
        })
        .join('');

    spotlightsContainer.innerHTML = spotlightsHTML;
}

// Load weather data from OpenWeatherMap API
async function loadWeatherData() {
    try {
        if (!WEATHER_API_KEY) {
            console.warn("API key not configured – showing mock weather data");
            displayMockWeatherData();
            return;
        }

        console.log("Fetching live weather data from OpenWeatherMap...");

        // Current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=metric`;
        console.log("Current weather URL:", currentWeatherUrl);

        const currentResponse = await fetch(currentWeatherUrl);
        console.log("Current weather response:", currentResponse);

        if (!currentResponse.ok) throw new Error("Weather data unavailable");

        const currentData = await currentResponse.json();
        console.log("Current weather data:", currentData);

        // 3-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY_NAME},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=metric`;
        console.log("Forecast URL:", forecastUrl);

        const forecastResponse = await fetch(forecastUrl);
        console.log("Forecast response:", forecastResponse);

        if (!forecastResponse.ok) throw new Error("Forecast data unavailable");

        const forecastData = await forecastResponse.json();
        console.log("Forecast data:", forecastData);

        displayWeatherData(currentData, forecastData);
    } catch (error) {
        console.error("Error loading weather data:", error);
        displayMockWeatherData();
    }
}


// Display current weather and forecast
function displayWeatherData(currentData, forecastData) {
    const temp = Math.round(currentData.main.temp);
    const description = currentData.weather[0].description;
    const humidity = currentData.main.humidity;
    const windSpeed = Math.round(currentData.wind.speed * 3.6); // m/s → km/h
    const iconCode = currentData.weather[0].icon;

    document.getElementById('current-temp').textContent = `${temp}°C`;
    document.getElementById('weather-description').textContent = capitalizeWords(description);
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    document.getElementById('weather-icon').innerHTML = `
    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" 
         alt="${description}" 
         title="${capitalizeWords(description)}">
`;


    // Forecast
    const forecastHTML = getForecastHTML(forecastData);
    document.getElementById('weather-forecast').innerHTML = forecastHTML;
}

// Display mock weather data if API fails
function displayMockWeatherData() {
    document.getElementById('current-temp').textContent = '32°C';
    document.getElementById('weather-description').textContent = 'Partly Cloudy';
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed}`; 
    document.getElementById('weather-icon').textContent = '⛅';

    document.getElementById('weather-forecast').innerHTML = `
        <div class="forecast-day">
            <div class="forecast-date">Today</div>
            <div class="forecast-icon">☀️</div>
            <div class="forecast-temps"><span class="forecast-high">35°</span><span class="forecast-low">24°</span></div>
        </div>
        <div class="forecast-day">
            <div class="forecast-date">Tomorrow</div>
            <div class="forecast-icon">⛅</div>
            <div class="forecast-temps"><span class="forecast-high">33°</span><span class="forecast-low">22°</span></div>
        </div>
        <div class="forecast-day">
            <div class="forecast-date">Thu</div>
            <div class="forecast-icon">🌤️</div>
            <div class="forecast-temps"><span class="forecast-high">31°</span><span class="forecast-low">20°</span></div>
        </div>`;
}

// Build forecast HTML from API data
function getForecastHTML(forecastData) {
    const dailyForecasts = getDailyForecasts(forecastData.list);

    return dailyForecasts
        .map((day, index) => {
            const date =
                index === 0
                    ? 'Today'
                    : index === 1
                    ? 'Tomorrow'
                    : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });

            return `
            <div class="forecast-day">
                <div class="forecast-date">${date}</div>
                <div class="forecast-icon">${getWeatherEmoji(day.weather[0].icon)}</div>
                <div class="forecast-temps">
                    <span class="forecast-high">${Math.round(day.main.temp_max)}°</span>
                    <span class="forecast-low">${Math.round(day.main.temp_min)}°</span>
                </div>
            </div>`;
        })
        .join('');
}

// Extract daily forecast from 5-day/3-hour data
function getDailyForecasts(forecastList) {
    const dailyData = {};

    forecastList.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();

        if (!dailyData[date]) {
            dailyData[date] = {
                dt: item.dt,
                weather: item.weather,
                main: { temp_max: item.main.temp_max, temp_min: item.main.temp_min },
            };
        } else {
            dailyData[date].main.temp_max = Math.max(dailyData[date].main.temp_max, item.main.temp_max);
            dailyData[date].main.temp_min = Math.min(dailyData[date].main.temp_min, item.main.temp_min);
        }
    });

    return Object.values(dailyData).slice(0, 3); // only 3 days
}

// Map OpenWeather icon → emoji
function getWeatherEmoji(iconCode) {
    const iconMap = {
        '01d': '☀️',
        '01n': '🌙',
        '02d': '⛅',
        '02n': '☁️',
        '03d': '☁️',
        '03n': '☁️',
        '04d': '☁️',
        '04n': '☁️',
        '09d': '🌧️',
        '09n': '🌧️',
        '10d': '🌦️',
        '10n': '🌧️',
        '11d': '⛈️',
        '11n': '⛈️',
        '13d': '❄️',
        '13n': '❄️',
        '50d': '🌫️',
        '50n': '🌫️',
    };
    return iconMap[iconCode] || '☀️';
}

// Get members data
async function getMembersData() {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

// Helper functions
function getMembershipLevel(level) {
    const levels = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
    return levels[level] || 'Member';
}

function capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('chamber-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('chamber-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
}

// Update footer dates
function updateFooterDates() {
    const currentYear = new Date().getFullYear();
    const lastModified = new Date(document.lastModified);

    document.getElementById('currentYear').textContent = currentYear;
    document.getElementById('lastModified').textContent = lastModified.toLocaleString();
}
