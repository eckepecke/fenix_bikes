import fs from 'fs/promises'; // Import the 'promises' API for modern async/await
//const coordinates = generateCoordinates();
// console.log(JSON.stringify(coordinates, null, 2));
const base_url = "https://api.openrouteservice.org/"
const api_key = "5b3ce3597851110001cf624871688ff7e34c4531a456973ad2be2a83"
const requestType = "/v2/directions/cycling-electric?api_key="
let url = base_url + requestType + api_key

const lundCoordinates = [
    [13.16540648625, 55.704613372641894],
    [13.20386456518276, 55.71134038738433],
    [13.163304252346796, 55.718387439389254],
    [13.199970510303404, 55.71851775147559],
    [13.183006690664142, 55.688176976531416],
    [13.240884598135413, 55.69517858956649],
    [13.177321959481572, 55.69894074058605],
    [13.190379411879652, 55.706514277583324],
    [13.20987110672994, 55.69809704639312],
    [13.198600869669994, 55.70795152658692],
    [13.176054540019894, 55.6947728694256],
    [13.18809825900258, 55.70759988276732],
    [13.18194776665895, 55.72321656046095],
    [13.205057678284735, 55.70414999653515],
    [13.182726006303279, 55.69866359083689],
    [13.23879617415771, 55.71013007659702],
    [13.205065698015904, 55.69508729503991],
    [13.188711372623649, 55.72519139343483],
    [13.213219811963725, 55.71429359253357],
    [13.168417799309614, 55.703797637520175],
    [13.179549957528373, 55.72337513121224],
    [13.246317080789826, 55.70674950758903],
    [13.240756628943437, 55.717478481532765],
    [13.20198323681879, 55.699861139468936],
    [13.160249963799998, 55.70389513044752],
    [13.170524704613289, 55.71182683818533],
    [13.209854975106573,55.72448626504974],
    [13.18245038098005, 55.686383374567605],
    [13.156239056202343, 55.719355864987484],
    [13.206450478644777, 55.69243446279338],
    [13.222616904032577, 55.72365802866301],
    [13.192894200667661, 55.70014603803736]
]

const tripGenerator = {

    pickRandomStartAndEnd: function pickRandomStartAndEnd(coordinatesArray, amount) {
        const LundTrips = {};
        const getRandomCoordinate = () => {
            const randomIndex = Math.floor(Math.random() * coordinatesArray.length);
            return coordinatesArray[randomIndex];
        };
    
        for (let i = 1; i <= 50; i++) {
            LundTrips[i] = {
                start: getRandomCoordinate(),
                end: getRandomCoordinate()
            };
        }
    
        return LundTrips;
    },

    // generateCoordinates: function generateCoordinates(count = 10) {
    //     const startStopPairs = [];
    //     const latRange = [55.680, 55.730]; // Latitude range for Lund
    //     const lonRange = [13.180, 13.240]; // Longitude range for Lund

    //     for (let i = 0; i < count; i++) {
    //         const start = [
    //             this.getRandomCoordinate(latRange[0], latRange[1]),
    //             this.getRandomCoordinate(lonRange[0], lonRange[1]),
    //         ];
    //         const end = [
    //             this.getRandomCoordinate(latRange[0], latRange[1]),
    //             this.getRandomCoordinate(lonRange[0], lonRange[1]),
    //         ];
    //         startStopPairs.push({ start, end });
    //     }

    //     return startStopPairs;
    // },

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
                console.error(`Error fetching trip data for trip_${tripCounter}:`, error.message);
                // Skip this trip and continue to the next one
            }
        }
        return trips;
    },

    save: async function save(trips) {
        try {
            // Read the current data from the JSON file
            let currentData = [];
            try {
                const data = await fs.readFile('./trips/all_trips.json', 'utf8');
                currentData = JSON.parse(data); // Parse the current JSON data
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error; // Re-throw the error if it's not "file not found"
                }
                // If the file does not exist, we'll start with an empty array
                console.log('File not found, creating new file...');
            }
    
            // Add the new trips to the current data
            currentData.push(...trips); // Use spread to add new trips
    
            // Write the updated data back to the file
            await fs.writeFile('./trips/all_trips_new.json', JSON.stringify(currentData, null, 2));
            console.log('Trip data appended to all_trips_new.json');
        } catch (error) {
            console.error('Error saving trips to file:', error);
        }
    }

    // save: async function save(trips) {
    //     try {
    //         console.log('Saving trips:', trips); // Log trips before saving
    //         // Write all trips to a single JSON file
    //         await fs.writeFile('./trips/all_trips.json', JSON.stringify(trips, null, 2));
    //         console.log('All trip data saved to all_trips.json');
    //     } catch (error) {
    //         console.error('Error writing all trips to file:', error);
    //     }
    // }
};

// const coordinates = tripGenerator.generateCoordinates(10);
// const trips = await tripGenerator.createTripsFromStartAndEnd(LundCoords);
// console.log("Returned: ", trips)
// console.log(trips.length);

// tripGenerator.save(trips);

// const LundTrips =  {
//     1 : {
//     start: [13.16540648625, 55.704613372641894],
//     end: [13.176054540019894, 55.6947728694256]
//     },
//     2 : {
//         start: [13.20386456518276, 55.71134038738433],
//         end: [13.18809825900258, 55.70759988276732]
//     },
//     3 : {
//         start: [13.163304252346796, 55.718387439389254],
//         end: [13.18194776665895, 55.72321656046095]
//     },
//     4 : {
//         start: [13.199970510303404, 55.71851775147559],
//         end: [13.205057678284735, 55.70414999653515]
//     },
//     5 : {
//         start: [13.183006690664142, 55.688176976531416],
//         end: [13.182726006303279, 55.69866359083689]
//     },
//     6 : {
//         start: [13.240884598135413, 55.69517858956649],
//         end: [13.23879617415771, 55.71013007659702]
//     },
//     7 : {
//         start: [13.177321959481572, 55.69894074058605],
//         end: [13.205065698015904, 55.69508729503991]
//     },
//     8 : {
//         start: [13.190379411879652, 55.706514277583324],
//         end: [13.188711372623649, 55.72519139343483]
//     },
//     9 : {
//         start: [13.20987110672994, 55.69809704639312],
//         end: [13.213219811963725, 55.71429359253357]
//     },
//     10 : {
//         start: [13.198600869669994, 55.70795152658692],
//         end: [13.168417799309614, 55.703797637520175]
//     }
// }

// const lundCoordinates = [
//     [13.16540648625, 55.704613372641894],
//     [13.20386456518276, 55.71134038738433],
//     [13.163304252346796, 55.718387439389254],
//     [13.199970510303404, 55.71851775147559],
//     [13.183006690664142, 55.688176976531416],
//     [13.240884598135413, 55.69517858956649],
//     [13.177321959481572, 55.69894074058605],
//     [13.190379411879652, 55.706514277583324],
//     [13.20987110672994, 55.69809704639312],
//     [13.198600869669994, 55.70795152658692],
//     [13.176054540019894, 55.6947728694256],
//     [13.18809825900258, 55.70759988276732],
//     [13.18194776665895, 55.72321656046095],
//     [13.205057678284735, 55.70414999653515],
//     [13.182726006303279, 55.69866359083689],
//     [13.23879617415771, 55.71013007659702],
//     [13.205065698015904, 55.69508729503991],
//     [13.188711372623649, 55.72519139343483],
//     [13.213219811963725, 55.71429359253357],
//     [13.168417799309614, 55.703797637520175]
// ]
const startAndEndObjects = tripGenerator.pickRandomStartAndEnd(lundCoordinates, 50)

const LundTripsArray = Object.values(startAndEndObjects);

// const coordinates = tripGenerator.generateCoordinates(10);
const trips = await tripGenerator.createTripsFromStartAndEnd(LundTripsArray);
console.log("Returned: ", trips)
console.log(trips.length);

tripGenerator.save(trips);