document.addEventListener("DOMContentLoaded", function() {


    
    // Initialize the map and set its view to Bangalore
    var initialCoordinates = [12.977705, 77.572355];
    var initialZoom = 17.48;

    var map = L.map('map').setView(initialCoordinates, initialZoom);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the center of Bangalore
    var marker = L.marker(initialCoordinates).addTo(map);

    // Add a popup to the marker
    //marker.bindPopup("<b>Welcome to majestic!</b><br />.").openPopup();

    
    



    // Function to reset the view
    function resetView() {
        map.setView(initialCoordinates, initialZoom);
    }

    // Function to add a new marker
    /*
    function addMarker() {
        var newMarkerCoordinates = [12.977705, 77.572355]; // New marker location (Bangalore)
        var newMarker = L.marker(newMarkerCoordinates).addTo(map);
        newMarker.bindPopup("<b>New Marker Added!</b><br />This is a new location.").openPopup();
    }

    */

    // Add event listener to the reset button
    document.getElementById('resetButton').addEventListener('click', resetView);

    // Add event listener to the user view button
    //document.getElementById('userButton').addEventListener('click', locateUser);

    document.getElementById('userButton').addEventListener('click', function() {
        if (navigator.geolocation) {
            var watchID = navigator.geolocation.watchPosition(showPosition, handleError, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
    
    function showPosition(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var userCoordinates = [latitude, longitude];
        map.setView(userCoordinates, initialZoom);
        marker.setLatLng(userCoordinates).bindPopup("You are here!").openPopup();
    }
    
    function handleError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }
    
    // Optional: To stop watching the position when no longer needed
    function stopWatching() {
        navigator.geolocation.clearWatch(watchID);
    }
    

    // Handle map resizing when window is resized
    /*window.addEventListener('resize', function() {
        map.invalidateSize(); // This forces the map to re-render based on the current container size
    });
    */

    // Function to add a new marker with user-provided coordinates
function addMarker() {
    // Get the value from the input field
    var input = document.getElementById('coordinatesInput').value;
    
    if (input) {
        // Split the input string by comma
        var coordinates = input.split(",");
        
        // Parse latitude and longitude from the split strings
        var lat = parseFloat(coordinates[0].trim());
        var lng = parseFloat(coordinates[1].trim());
        
        // Check if the user provided valid numbers for both latitude and longitude
        if (!isNaN(lat) && !isNaN(lng)) {
            var newMarkerCoordinates = [lat, lng]; // User inputted marker location
            var newMarker = L.marker(newMarkerCoordinates).addTo(map);
            newMarker.bindPopup("<b>Platform Location</b><br />Bus departe here  ").openPopup();
        } else {
            alert("Please enter valid coordinates in the format: latitude,longitude");
        }
    } else {
        alert("No coordinates entered.");
    }
}

// Add event listener to the button to call addMarker function on click
document.getElementById('addMarkerButton').addEventListener('click', addMarker);
    

    // Add event listener to the add marker button
    //document.getElementById('addMarkerButton').addEventListener('click', addMarker);
});


// Scroll to Top Button Functionality
var scrollToTopButton = document.getElementById('scrollToTopButton');

// Show or hide the button based on scroll position
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) { // Show button after scrolling down 300px
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

// Smooth scroll to top on button click
scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


let buses = [];

document.addEventListener('DOMContentLoaded', () => {
    // Fetch the data from the JSON file
    fetch('bmtc.json')
        .then(response => response.json())
        .then(data => {
            buses = data;
        })
        .catch(error => {
            console.error('Error fetching bus data:', error);
        });
});

function applyFilter() {
    const routeNumber = document.getElementById('route_number').value.trim().toLowerCase();
    const platformNumber = document.getElementById('platform_number').value.trim();
    const finalStop = document.getElementById('final_stop').value.trim().toLowerCase();

    const filteredBuses = filterBuses({
        route_number: routeNumber,
        platform_number: platformNumber,
        final_stop: finalStop
    });

    displayResults(filteredBuses);
}

function filterBuses(criteria) {
    return buses.filter(bus => {
        const routeNumberMatch = !criteria.route_number || bus.route_number.toLowerCase().includes(criteria.route_number);
        const platformNumberMatch = !criteria.platform_number || bus.platform_number.toString() === criteria.platform_number;
        const finalStopMatch = !criteria.final_stop || bus.final_stop.toLowerCase().includes(criteria.final_stop) || bus.sub_stops.some(stop => stop.toLowerCase().includes(criteria.final_stop));

        return routeNumberMatch && platformNumberMatch && finalStopMatch;
    });
}

function displayResults(buses) {
    const tableBody = document.getElementById('busTableBody');
    tableBody.innerHTML = '';

    if (buses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No buses found</td></tr>';
        return;
    }

    buses.forEach(bus => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bus.platform_number}</td>
            <td>${bus.route_number}</td>
            <td>${bus.coordinates}</td>
            <td>${bus.final_stop}</td>
            <td>${bus.sub_stops.join(', ')}</td>
        `;
        tableBody.appendChild(row);
    });
}
