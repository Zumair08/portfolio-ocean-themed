// Projects Page Dynamic Effects
// Ship splash effect for projects page
const ship = document.getElementById('ship');
if (ship) {
    ship.addEventListener('click', function (e) {
        console.log('Ship clicked on projects page!');
        // Create splash element
        const splash = document.createElement('div');
        splash.className = 'home-splash';
        splash.style.background = 'rgba(0,255,255,0.2)';
        splash.innerHTML = `
            <svg viewBox="0 0 60 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="30" cy="28" rx="24" ry="4" fill="#4a90e2"/>
                <ellipse cx="15" cy="24" rx="6" ry="2" fill="#b3e0ff"/>
                <ellipse cx="45" cy="26" rx="8" ry="3" fill="#b3e0ff"/>
                <ellipse cx="30" cy="20" rx="12" ry="3" fill="#87ceeb"/>
            </svg>
        `;
        ship.appendChild(splash);
        setTimeout(() => splash.remove(), 700);
    });
}

// --- Dynamic Day/Night & Weather Effects ---
// TODO: Add your WeatherAPI.com API key here for weather effects
// const WEATHER_API_KEY = 'your_api_key_here'; // <-- Add your API key here

function setOceanScene(time, weather) {
    const oceanBg = document.querySelector('.ocean-background');
    if (!oceanBg) return;
    
    // Remove old effects
    document.querySelectorAll('.ocean-sun, .ocean-moon, .ocean-rain, .ocean-snow').forEach(e => e.remove());
    
    // Day/Night
    if (time >= 6 && time < 18) {
        // Day
        oceanBg.style.background = 'linear-gradient(180deg, #87ceeb 0%, #4a90e2 100%)';
        // Sun
        const sun = document.createElement('div');
        sun.className = 'ocean-sun';
        oceanBg.appendChild(sun);
    } else {
        // Night
        oceanBg.style.background = 'linear-gradient(180deg, #1e3c72 0%, #232946 100%)';
        // Moon
        const moon = document.createElement('div');
        moon.className = 'ocean-moon';
        oceanBg.appendChild(moon);
    }
    
    // Weather
    if (weather === 'Rain') {
        const rain = document.createElement('div');
        rain.className = 'ocean-rain';
        for (let i = 0; i < 40; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = (Math.random() * 1.5) + 's';
            rain.appendChild(drop);
        }
        oceanBg.appendChild(rain);
    } else if (weather === 'Snow') {
        const snow = document.createElement('div');
        snow.className = 'ocean-snow';
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake';
            flake.style.left = Math.random() * 100 + '%';
            flake.style.animationDelay = (Math.random() * 2) + 's';
            snow.appendChild(flake);
        }
        oceanBg.appendChild(snow);
    }
}

function fetchWeatherAndSetScene() {
    // For now, just use time-based day/night effects
    // TODO: Uncomment and add API key to enable weather effects
    const hour = new Date().getHours();
    setOceanScene(hour, null);
    
    /* Uncomment this when you add your API key:
    if (!navigator.geolocation) {
        const hour = new Date().getHours();
        setOceanScene(hour, null);
        return;
    }
    
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}`)
            .then(res => res.json())
            .then(data => {
                const hour = new Date().getHours();
                let weather = null;
                const condition = data.current?.condition?.text?.toLowerCase() || '';
                if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) weather = 'Rain';
                if (condition.includes('snow')) weather = 'Snow';
                setOceanScene(hour, weather);
            })
            .catch(() => {
                const hour = new Date().getHours();
                setOceanScene(hour, null);
            });
    }, () => {
        const hour = new Date().getHours();
        setOceanScene(hour, null);
    });
    */
}

// Initialize effects when page loads
document.addEventListener('DOMContentLoaded', fetchWeatherAndSetScene); 