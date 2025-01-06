const base_url = "https://api.openrouteservice.org/"
const api_key = "5b3ce3597851110001cf624871688ff7e34c4531a456973ad2be2a83"
const requestType = "/v2/directions/cycling-electric?api_key="
let url = base_url + requestType + api_key

async function getTrip(start, end) {
    try {
        const response = await fetch(`${url}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Extract the geometry object
        const geometry = data.features[0].geometry;
        console.log('Geometry object:', geometry);

        return geometry
    } catch (error) {
        console.error('Error fetching trip data:', error);
    }
}


// Test the function
const start = [13.19075, 55.70529];
const end = [13.19706, 55.70142];

const trip = getTrip(start, end);
console.log(trip)