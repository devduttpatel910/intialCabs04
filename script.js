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

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqJyVR0OkWJLysPR02vurdq8deqX7RjGQ",
  authDomain: "dmcabs0202.firebaseapp.com",
  databaseURL: "https://dmcabs0202-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dmcabs0202",
  storageBucket: "dmcabs0202.firebasestorage.app",
  messagingSenderId: "456338813399",
  appId: "1:456338813399:web:27f2edfa7e8c85f0105b92"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const database = firebase.database(app);

// Request permission for push notifications
messaging.requestPermission().then(() => {
    console.log("Notification permission granted.");
    return messaging.getToken();
}).then(token => {
    console.log("FCM Token: ", token);

    // Optionally, you can send this token to your server or Firebase for later use
}).catch(error => {
    console.error("Error getting permission for notifications", error);
});

// Handle incoming messages
messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // Show a notification
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon
    });
});

// Listen for changes to alcohol level in Firebase
const alcoholRef = database.ref("/sensors/alcoholLevel");

alcoholRef.on("value", (snapshot) => {
    const alcoholLevel = snapshot.val();
    if (alcoholLevel > 120) {  // Trigger notification when the threshold is crossed
        // Send a push notification via FCM
        messaging.send({
            notification: {
                title: "Warning!",
                body: `High alcohol level detected: ${alcoholLevel}`,
                icon: "/path/to/icon.png"  // You can provide the path to an icon
            },
            to: "your-fcm-token"  // You can target a specific device or topic
        }).then(response => {
            console.log("Notification sent successfully:", response);
        }).catch(error => {
            console.error("Error sending notification:", error);
        });
    }
});




