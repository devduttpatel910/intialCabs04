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

// Add Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqJyVR0OkWJLysPR02vurdq8deqX7RjGQ",
    authDomain: "dmcabs0202-default-rtdb.asia-southeast1.firebasedatabase.app",
    databaseURL: "https://dmcabs0202-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dmcabs0202",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// Listen for notifications in the Firebase database
function listenForNotifications() {
    const alertsRef = database.ref("/alerts/notification");

    alertsRef.on("value", (snapshot) => {
        const message = snapshot.val();
        if (message) {
            alert(`Notification: ${message}`);
        }
    });
}

// Call the function to start listening for notifications
listenForNotifications();

