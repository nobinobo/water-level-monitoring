const THINGSPEAK_CHANNEL_ID = '2869639';
const THINGSPEAK_API_KEY = '80WKAD6IYAFUI99J';
const ALARM_THRESHOLD = 5; // 5 inches

async function fetchWaterLevel() {
    const url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds/last.json?api_key=${THINGSPEAK_API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return parseFloat(data.field2); // Use field2 for ultrasonic sensor
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function updateDisplay(level) {
    const statusDiv = document.getElementById('status');
    const alarmSound = document.getElementById('alarm');

    if (level < ALARM_THRESHOLD) {
        statusDiv.innerHTML = `ALARM! Water Level: ${level.toFixed(1)} inches`;
        statusDiv.className = 'alarm-active';
        alarmSound.play();
    } else {
        statusDiv.innerHTML = `Normal - Water Level: ${level.toFixed(1)} inches`;
        statusDiv.className = '';
        alarmSound.pause();
    }
}

// Check water level every 5 seconds
setInterval(async () => {
    const waterLevel = await fetchWaterLevel();
    if (waterLevel !== null) updateDisplay(waterLevel);
}, 5000);

// Initial load
fetchWaterLevel().then(updateDisplay);