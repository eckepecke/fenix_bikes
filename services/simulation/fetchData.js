import fs from 'fs/promises'; // Import the 'promises' API for modern async/await
//const coordinates = generateCoordinates();
// console.log(JSON.stringify(coordinates, null, 2));
const base_url = "https://api.openrouteservice.org/"
const api_key = "5b3ce3597851110001cf624871688ff7e34c4531a456973ad2be2a83"
const requestType = "/v2/directions/cycling-electric?api_key="
let url = base_url + requestType + api_key

const lundCoords = [
    { start: [13.19075, 55.70529], end: [13.197062, 55.70142] },
    { start: [13.19463, 55.70457], end: [13.19657, 55.70273] },
    // { start: [55.70196, 13.19684], end: [55.7015, 13.19703] },
    // { start: [55.70447, 13.19458], end: [55.70517, 13.19268] },
    // { start: [55.70528, 13.19074], end: [55.70511, 13.19341] },
    // { start: [55.70487, 13.19484], end: [55.70529, 13.19075] }
];

const tripGenerator = {

    getRandomCoordinate(min, max) {
        return (Math.random() * (max - min) + min).toFixed(5); // 5 decimal precision
    },

    generateCoordinates(count = 10) {
        const startStopPairs = [];
        const latRange = [55.680, 55.730]; // Latitude range for Lund
        const lonRange = [13.180, 13.240]; // Longitude range for Lund

        for (let i = 0; i < count; i++) {
            const start = [
                this.getRandomCoordinate(latRange[0], latRange[1]),
                this.getRandomCoordinate(lonRange[0], lonRange[1]),
            ];
            const end = [
                this.getRandomCoordinate(latRange[0], latRange[1]),
                this.getRandomCoordinate(lonRange[0], lonRange[1]),
            ];
            startStopPairs.push({ start, end });
        }

        return startStopPairs;
    },

    getTrip: async function getTrip(start, end) {
        try {
            const response = await fetch(`${url}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            // Extract the geometry object
            const geometry = data.features[0].geometry;
    
            return geometry;
        } catch (error) {
            console.error('Error fetching trip data:', error);
        }
    },

    createTripsFromStartAndEnd: async function createTripsFromStartAndEnd(coordinates) {
        let trips = [];
        let tripCounter = 1; // For naming trips like trip1, trip2, etc.
        
        for (const { start, end } of coordinates) {
            console.log(start, end);
            try {
                const response = await fetch(`${url}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched trip data:', data); // Log fetched data
                const geometry = data.features[0]?.geometry?.coordinates;
    
                if (geometry) {
                    trips.push({
                        [`trip_${tripCounter}`]: { coords: geometry } // Add trip as an object inside the array
                    });
                    tripCounter++; // Increment trip counter for the next trip
                }
            } catch (error) {
                console.error('Error fetching trip data:', error);
                return null; // Return null on error
            }
        }
        return trips;
    },

    save: async function save(trips) {
        try {
            console.log('Saving trips:', trips); // Log trips before saving
            // Write all trips to a single JSON file
            await fs.writeFile('./trips/all_trips.json', JSON.stringify(trips, null, 2));
            console.log('All trip data saved to all_trips.json');
        } catch (error) {
            console.error('Error writing all trips to file:', error);
        }
    }
};

// const coordinates = tripGenerator.generateCoordinates(10);
const trips = await tripGenerator.createTripsFromStartAndEnd(lundCoords);
console.log("Returned: ", trips)
console.log(trips.length);

tripGenerator.save(trips);
