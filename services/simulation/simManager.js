import data from './trips/all_trips_new.json' with { type: 'json' };
import { getCollection } from "../db/collections.js";

const simManager = {
    generateBikes: function generateBikes(count) {
        const bikes = [];
        for (let i = 1; i <= count; i++) {
            const bikeId = `B${String(i).padStart(4, '0')}`; // e.g., "B0001", "B0012", etc.
            const bike = {
                bike_id: bikeId,
                speed: 0,
                location: null, // Adjust as needed for variety
                city_name: "Lund",
                status: {
                    available: false,
                    battery_level: null,
                    in_service: null,
                },
                active_trip: null,
                red_light: false,
                completed_trips: [],
            };
            bikes.push(bike);
        }
        return bikes;
    },

    generateUsers: function generateUsers(count) {
        const users = [];
        for (let i = 1; i <= count; i++) {
            const userId = `U${String(i).padStart(4, '0')}`; // e.g., "U0001", "U0011"
            const user = {
                name: `Test User ${i}`, // Unique name for each user
                payment_method: i % 2 === 0 ? "prepaid" : "postpaid", // Alternate payment methods
                password: "1234", // Default password
                email: `test${i}@email.se`, // Unique email address
                banned: false, // Default value
                completed_trips: Array.from({ length: 3 }, (_, index) => `T${String(i * 10 + index).padStart(4, '0')}`), // Generate 3 unique trip IDs
                user_id: userId,
            };
            users.push(user);
        }
        return users;
    },

    getSimCoordinates: async function getSimCoordinates() {
        // return data.map((trip) => {
        //     const tripKey = Object.keys(trip)[0];
        //     let coordinates = trip[tripKey].coords;
        //     coordinates = await this.rearrange(coordinates);
        //     //console.log(coordinates[0])

        //     return { tripKey, coordinates };
        // });

        return Promise.all(
            data.map(async (trip) => {
                const tripKey = Object.keys(trip)[0];
                let coordinates = trip[tripKey].coords;
                coordinates = await this.rearrange(coordinates); // now 'await' works
                return { tripKey, coordinates };
            })
        );
    },

    updateLocation: function updateLocation(simulatedTrip) {
        if (simulatedTrip.coordinates && simulatedTrip.coordinates.length > 1) {
            simulatedTrip.coordinates.shift();
            simulatedTrip.location = simulatedTrip.coordinates[0];
        }
    },

    rearrange: async function rearrange(coordinates) {
        //console.log(coordinates[0])

        coordinates.forEach((pair, index) => {
            // Swap the values at index 0 and 1 in the pair
            coordinates[index] = [pair[1], pair[0]];
        });
        // console.log(coordinates[0])

        return coordinates;
    },

    group: async function group(trips, batchSize) {
        let groupedTrips = {};
        let group = {};
        let batchIndex = 0;

        // console.log("group");
        // console.log(trips[0]);
        // console.log(typeof trips);

        Object.keys(trips).forEach((tripKey, index) => {
            group[tripKey] = trips[tripKey];

            // If the group reaches the batch size, add it to groupedTrips
            if ((index + 1) % batchSize === 0 || index === Object.keys(trips).length - 1) {
                groupedTrips[`batch_${batchIndex}`] = group;
                group = {}; // Reset group for the next batch
                batchIndex++;
            }
        });

        console.log(groupedTrips); // Check the grouped trips
        return groupedTrips;
    },

    renameTripKeys: function renameTripKeys(tripObjects) {
        let renamedTrips = [];
        let tripCounter = {}; // To track duplicate trip names

        tripObjects.forEach((trip, index) => {
            let newTripKey = trip.tripKey;

            // Check if this tripKey already exists, and make it unique
            if (tripCounter[newTripKey]) {
                tripCounter[newTripKey] += 1;
                newTripKey = `${newTripKey}_${tripCounter[newTripKey]}`;
            } else {
                tripCounter[newTripKey] = 1;
            }

            // Create a new trip object with the renamed key
            const renamedTrip = {
                ...trip,
                tripKey: newTripKey, // Assign new unique key
            };

            renamedTrips.push(renamedTrip);
        });

        return renamedTrips;
    },

    emptyBikeCollection: async function emptyBikeCollection() {
        let collection = getCollection("bikes");

        try {
            await collection.deleteMany({}); // Removes all documents from the bike collection
        } catch (error) {
            console.error('Error clearing bike collection:', error);
        }
    }
};

export default simManager;
