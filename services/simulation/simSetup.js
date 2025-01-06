// simSetup.js

const simSetup = async (simManager) => {
    let simulatedTrips = {}; // Initialize the simulatedTrips object

    try {
        // Generate 1000 bikes
        const bikeArray = await simManager.generateBikes(2);
    
        // Generate 1000 customers (users)
        const userArray = await simManager.generateUsers(2);
    
        // Create 1000 Trips
        const tripObjects = await simManager.getSimCoordinates();
        console.log("tripObjects: ", tripObjects);

        // Process each bike, associate it with a trip and user
        bikeArray.forEach((bike, index) => {
            const trip = tripObjects[index];
            const lastCoordinate = trip.coordinates[trip.coordinates.length - 1];
            const user = userArray[index];

            if (trip && user) {
                bike.location = trip.coordinates[0]; // Starting location
                bike.active_trip = trip.tripKey; // Active trip ID
                simulatedTrips[index] = {
                    bike: bike,
                    trip: trip.tripKey,
                    coordinates: trip.coordinates,
                    user: user.user_id,
                    start_location: trip.coordinates[0],
                    end_location: lastCoordinate,
                    city: bike.city_name
                };
            }
        });

        console.log(simulatedTrips);
        return simulatedTrips; // Return the simulatedTrips object

    } catch (error) {
        console.error("Error fetching data:", error);
        return {}; // Return an empty object if an error occurs
    }
};

export default simSetup;