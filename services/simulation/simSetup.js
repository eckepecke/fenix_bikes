// simSetup.js
function renameTripKeys(tripObjects) {
    let renamedTrips = [];

    tripObjects.forEach((trip, index) => {
        // Assign a sequential trip key (trip_1, trip_2, ..., trip_160)
        const newTripKey = `trip_${index + 1}`;

        // Create a new trip object with the renamed key
        const renamedTrip = {
            ...trip,
            tripKey: newTripKey, // Assign the new sequential key
        };

        renamedTrips.push(renamedTrip);
    });

    return renamedTrips;
}

const simSetup = async (simManager) => {
    let simulatedTrips = [];

    try {
        // Generate 1000 bikes
        const bikeArray = await simManager.generateBikes(1000);
    
        // Generate 1000 customers (users)
        const userArray = await simManager.generateUsers(1000);
    
        // Create 1000 Trips
        let tripObjects = await simManager.getSimCoordinates();
        tripObjects = renameTripKeys(tripObjects);
        // console.log(tripObjects[159]);
        // console.log(tripObjects[39]);



        console.log(`Number of trips: ${tripObjects.length}`);
        // Process each bike, associate it with a trip and user
        let tripIndex = 0;
        let batch = []
        let groupCount = 0;
        const lastBike = bikeArray.length - 1

        bikeArray.forEach((bike, index) => {

            const originalTrip = tripObjects[tripIndex];
            const trip = JSON.parse(JSON.stringify(originalTrip)); // Deep clone

            const lastCoordinate = trip.coordinates[trip.coordinates.length - 1];
            const user = userArray[index];
           if (trip && user) {
                bike.location = trip.coordinates[0]; // Starting location
                bike.active_trip = trip.tripKey; // Active trip ID
                batch.push({
                    bike: bike,
                    trip: trip.tripKey,
                    coordinates: trip.coordinates,
                    user: user.user_id,
                    start_location: trip.coordinates[0],
                    end_location: lastCoordinate,
                    city: bike.city_name
                });
            }

            tripIndex++;
            if (tripIndex >= tripObjects.length || index === lastBike) {
                tripIndex = 0; // Reset trip index
                simulatedTrips.push([...batch]); // Push a copy of the batch
                groupCount++; // Increment group count
                batch = []; // Properly reset batch to a new array
            }
        });
        // const groupedTrips = await simManager.group(simulatedTrips, 40);
        // console.log(JSON.stringify(simulatedTrips, null, 2));
        return simulatedTrips; // Return the simulatedTrips array

    } catch (error) {
        console.error("Error fetching data:", error);
        return {}; // Return an empty object if an error occurs
    }
};

export default simSetup;