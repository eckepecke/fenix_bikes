import data from './trips/all_trips.json' with { type: 'json' };

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
                console.log("coordinates before flip: ", coordinates);

                coordinates = await this.rearrange(coordinates); // now 'await' works
                console.log("coordinates after flip: ", coordinates);
                return { tripKey, coordinates };
            })
        );
    },

    updateLocation: function updateLocation(simulatedTrip) {
        if (simulatedTrip.coordinates && simulatedTrip.coordinates.length > 1) {
            simulatedTrip.coordinates.shift();
            simulatedTrip.bike.location = simulatedTrip.coordinates[0];
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
    }
};

export default simManager;
