// Initialize map and set view to a default location (centered on the world)
const map = L.map('map').setView([20, 0], 2); // World view to start

// Add satellite map layer from Mapbox (replace 'your_access_token' with a valid token)
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiZGV2ZHV0dDAzIiwiYSI6ImNtM2JyaWp5ejFydjAycXF4NHM1bHptMmMifQ.i6yTVvdvB2M5XyzI7K5ezw', {
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

let userMarker, driverMarker;

// Function to find and display user's location
function findUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Remove old user marker if it exists
            if (userMarker) map.removeLayer(userMarker);

            // Add user marker
            userMarker = L.marker([userLat, userLng]).addTo(map)
                .bindPopup("You are here").openPopup();
            
            // Center map to user's location
            map.setView([userLat, userLng], 14);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to simulate driver location near the user
function simulateDriverLocation() {
    if (!userMarker) {
        alert("Find your location first!");
        return;
    }

    // Get user's current location from the map
    const userLocation = userMarker.getLatLng();
    const driverLat = userLocation.lat + (Math.random() * 0.02 - 0.01);
    const driverLng = userLocation.lng + (Math.random() * 0.02 - 0.01);

    // Remove old driver marker if it exists
    if (driverMarker) map.removeLayer(driverMarker);

    // Add driver marker
    driverMarker = L.marker([driverLat, driverLng], { color: 'blue' }).addTo(map)
        .bindPopup("Driver is nearby").openPopup();
}

//new lines 

// Reference the alcohol level node in Firebase
const alcoholLevelRef = db.ref('alcoholLevel');

// Set a threshold for notifications
const threshold = 500;

alcoholLevelRef.on('value', snapshot => {
    const alcoholLevel = snapshot.val();
    console.log("Alcohol Level: ", alcoholLevel);

    // Update the map with the alcohol level
    alert(`Alcohol Level: ${alcoholLevel}`);

    // Check if the level exceeds the threshold
    if (alcoholLevel > threshold) {
        sendNotification("High Alcohol Level Detected!");
    }
});

// Send a browser notification
function sendNotification(message) {
    if (Notification.permission === "denied") {
        new Notification("DMCabs Services", { body: message });
    } else if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("DMCabs Services", { body: message });
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});





