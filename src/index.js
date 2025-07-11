// Boat Game Logic
const gamesLink = document.getElementById('games-link');
const ship = document.getElementById('ship');
const gameContainer = document.getElementById('game-container');

// Home screen ship splash effect
const homeShip = document.getElementById('ship');
if (homeShip) {
    homeShip.addEventListener('click', function (e) {
        // Prevent splash if ship is hidden (e.g., during game)
        if (homeShip.style.display === 'none') return;
        console.log('Ship clicked!'); // Debug
        // Create splash element
        const splash = document.createElement('div');
        splash.className = 'home-splash';
        splash.style.background = 'rgba(0,255,255,0.2)'; // Debug background
        splash.innerHTML = `
            <svg viewBox="0 0 60 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="30" cy="28" rx="24" ry="4" fill="#4a90e2"/>
                <ellipse cx="15" cy="24" rx="6" ry="2" fill="#b3e0ff"/>
                <ellipse cx="45" cy="26" rx="8" ry="3" fill="#b3e0ff"/>
                <ellipse cx="30" cy="20" rx="12" ry="3" fill="#87ceeb"/>
            </svg>
        `;
        homeShip.appendChild(splash);
        setTimeout(() => splash.remove(), 700);
    });
}

// Ship SVG for the game (more like a classic ship)
const shipSVG = `
<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="30" cy="50" rx="22" ry="10" fill="#8B4513" stroke="#654321" stroke-width="2"/>
  <rect x="22" y="38" width="16" height="8" rx="3" fill="#deb887" stroke="#b8863b" stroke-width="1.5"/>
  <rect x="28.5" y="15" width="3" height="25" fill="#654321"/>
  <polygon points="30,18 48,38 30,38" fill="#fff8e1" stroke="#b8863b" stroke-width="2"/>
  <polygon points="30,18 12,38 30,38" fill="#e0e0e0" stroke="#b8863b" stroke-width="2"/>
</svg>
`;

// SVGs for obstacles
const rockSVG = `
<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20" cy="28" rx="16" ry="10" fill="#888"/>
  <ellipse cx="14" cy="24" rx="6" ry="4" fill="#aaa"/>
  <ellipse cx="28" cy="26" rx="7" ry="5" fill="#777"/>
  <ellipse cx="22" cy="32" rx="10" ry="4" fill="#666"/>
</svg>
`;

const canSVG = `
<svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="7" y="8" width="16" height="24" rx="6" fill="#b0bec5" stroke="#607d8b" stroke-width="2"/>
  <rect x="10" y="4" width="10" height="6" rx="2" fill="#90a4ae"/>
  <rect x="10" y="32" width="10" height="4" rx="2" fill="#78909c"/>
</svg>
`;

const sharkSVG = `
<svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="30" cy="30" rx="24" ry="8" fill="#607d8b"/>
  <polygon points="10,30 30,10 50,30" fill="#90a4ae"/>
  <ellipse cx="20" cy="32" rx="2" ry="1.5" fill="#fff"/>
  <ellipse cx="40" cy="32" rx="2" ry="1.5" fill="#fff"/>
  <ellipse cx="20" cy="32" rx="0.7" ry="0.7" fill="#222"/>
  <ellipse cx="40" cy="32" rx="0.7" ry="0.7" fill="#222"/>
  <rect x="28" y="34" width="4" height="2" rx="1" fill="#fff"/>
</svg>
`;

const pirateShipSVG = `
<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="60" cy="50" rx="50" ry="10" fill="#6d4c1b" stroke="#3e2723" stroke-width="3"/>
  <rect x="50" y="20" width="20" height="30" fill="#b8863b" stroke="#654321" stroke-width="2"/>
  <rect x="68" y="10" width="4" height="20" fill="#654321"/>
  <polygon points="70,12 110,30 70,30" fill="#fff8e1" stroke="#b8863b" stroke-width="2"/>
  <polygon points="70,12 30,30 70,30" fill="#e0e0e0" stroke="#b8863b" stroke-width="2"/>
  <circle cx="60" cy="35" r="5" fill="#fff" stroke="#b8863b" stroke-width="2"/>
</svg>
`;

let gameActive = false;
let boat, scoreElem, restartBtn;
let boatX = 145; // center
let boatSpeed = 7;
let obstacles = [];
let obstacleSpeed = 3;
let score = 0;
let gameInterval, obstacleInterval;

function startGame() {
    gameActive = true;
    score = 0;
    boatX = 145;
    obstacles = [];
    gameContainer.innerHTML = `
        <div class="score" id="score">Score: 0</div>
        <div class="boat" id="game-boat">${shipSVG}</div>
        <button class="restart-btn" id="restart-btn">Restart</button>
        <button class="quit-btn" id="quit-btn">Quit</button>
    `;
    boat = document.getElementById('game-boat');
    scoreElem = document.getElementById('score');
    restartBtn = document.getElementById('restart-btn');
    const quitBtn = document.getElementById('quit-btn');
    boat.style.left = boatX + 'px';
    restartBtn.style.display = 'none';
    restartBtn.onclick = restartGame;
    quitBtn.onclick = quitGame;
    document.addEventListener('keydown', handleKey);
    gameInterval = setInterval(gameLoop, 16);
    obstacleInterval = setInterval(spawnObstacle, 1200);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    document.removeEventListener('keydown', handleKey);
    restartBtn.style.display = 'block';
}

function restartGame() {
    startGame();
}

function quitGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    document.removeEventListener('keydown', handleKey);
    gameContainer.style.display = 'none';
    ship.style.display = '';
}

function handleKey(e) {
    if (!gameActive) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        boatX = Math.max(0, boatX - boatSpeed);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        boatX = Math.min(290, boatX + boatSpeed);
    }
    boat.style.left = boatX + 'px';
}

function spawnObstacle() {
    if (!gameActive) return;
    // Randomly pick obstacle type
    const types = ['rock', 'can', 'shark', 'pirate'];
    let type = types[Math.floor(Math.random() * 12)]; // pirate is rare
    if (type === undefined) type = 'rock';
    if (type === 'pirate' && Math.random() < 0.7) type = types[Math.floor(Math.random() * 3)]; // pirate is rare
    let obsX, obsW, obsH, svg;
    if (type === 'rock') {
        obsW = 40; obsH = 40; svg = rockSVG;
        obsX = Math.floor(Math.random() * (310 - obsW));
    } else if (type === 'can') {
        obsW = 30; obsH = 40; svg = canSVG;
        obsX = Math.floor(Math.random() * (320 - obsW));
    } else if (type === 'shark') {
        obsW = 60; obsH = 40; svg = sharkSVG;
        obsX = Math.floor(Math.random() * (290 - obsW));
    } else if (type === 'pirate') {
        obsW = 120; obsH = 60; svg = pirateShipSVG;
        obsX = Math.floor(Math.random() * 2) === 0 ? 0 : 230; // left or right half
    }
    const obs = document.createElement('div');
    obs.className = 'obstacle ' + type;
    obs.style.left = obsX + 'px';
    obs.style.top = '-60px';
    obs.style.width = obsW + 'px';
    obs.style.height = obsH + 'px';
    obs.innerHTML = svg;
    gameContainer.appendChild(obs);
    obstacles.push({el: obs, x: obsX, y: -obsH, w: obsW, h: obsH, type, wiggle: Math.random() * Math.PI * 2});
}

function gameLoop() {
    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        // Shark wiggle
        if (obstacles[i].type === 'shark') {
            obstacles[i].wiggle += 0.08;
            obstacles[i].x += Math.sin(obstacles[i].wiggle) * 1.5;
            obstacles[i].el.style.left = obstacles[i].x + 'px';
        }
        obstacles[i].y += obstacleSpeed;
        obstacles[i].el.style.top = obstacles[i].y + 'px';
        // Collision with smaller hitboxes
        const boatHitbox = { x: boatX + 10, y: 440 + 10, w: 40, h: 40 };
        const obsHitbox = {
            x: obstacles[i].x + 0.15 * obstacles[i].w,
            y: obstacles[i].y + 0.15 * obstacles[i].h,
            w: obstacles[i].w * 0.7,
            h: obstacles[i].h * 0.7
        };
        if (
            boatHitbox.x < obsHitbox.x + obsHitbox.w &&
            boatHitbox.x + boatHitbox.w > obsHitbox.x &&
            boatHitbox.y < obsHitbox.y + obsHitbox.h &&
            boatHitbox.y + boatHitbox.h > obsHitbox.y
        ) {
            endGame();
        }
        // Remove off-screen
        if (obstacles[i].y > 500) {
            gameContainer.removeChild(obstacles[i].el);
            obstacles.splice(i, 1);
        }
    }
    // Update score
    if (gameActive) {
        score++;
        scoreElem.textContent = 'Score: ' + score;
    }
}

gamesLink.addEventListener('click', function(e) {
    e.preventDefault();
    // Hide ship, show game
    ship.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

// --- Dynamic Day/Night & Weather Effects ---
// TODO: Add your WeatherAPI.com API key here for weather effects
// const WEATHER_API_KEY = 'your_api_key_here'; // <-- Add your API key here

function setOceanScene(time, weather) {
    const oceanBg = document.querySelector('.ocean-background');
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

document.addEventListener('DOMContentLoaded', fetchWeatherAndSetScene);

// --- Ocean Sun/Moon/Rain/Snow CSS will be added in styles.css ---
