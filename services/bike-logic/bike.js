import { getCollection } from "../db/collections.js"
import { getCities } from "../db/cities.js"

const bike = {
    reportState: async function reportState(bikeId) {
        let bikeCollection = getCollection("bikes");
        console.log(bikeId);

        try {
            const result = await bikeCollection.findOne({ bike_id: bikeId });
            //const warning = await this.checkForWarning(result)

            // if (warning) {
            //     // do something
            // }
            return result;
        } catch (e) {
            console.error("Error retrieving bike:", e.message || e);
            throw new Error(`Failed to find bike with bike_id: ${bikeId}.`);
        }
    },

    start: async function start(bikeId, tripId, userId) {
        let bikeCollection = getCollection("bikes");
        let tripCollection = getCollection("trips");

        try {
            const bikeObject = await bikeCollection.findOne({ bike_id: bikeId });

            if (!bikeObject || bikeObject.active_trip != null) {
                throw new Error(
                    !bikeObject
                        ? `Bike with bike_id: ${bikeId} not found.`
                        : `Bike with bike_id: ${bikeId} already has an active trip ${bikeObject.active_trip}`
                );
            }

            const tripResult = await tripCollection.insertOne(
                {
                    trip_id: tripId,
                    start_time: new Date(),
                    end_time: null,
                    start_location: bikeObject.location,
                    end_location: null,
                    user_id: userId
                }
            )

            // Update the bike's status
            const result = await bikeCollection.updateOne(
                { bike_id: bikeId },
                {
                    $set: {
                        "status.available": false,
                        active_trip: tripId
                    }
                },
                { returnDocument: "after" }
            );

            console.log(result);

            return result;

        } catch (e) {
            console.error(e);
            throw new Error(`Failed to start bike with bike_id: ${bikeId}.`);

        }
    },

    stop: async function stop(bikeId, userId) {
        let bikeCollection = getCollection("bikes");
        let tripCollection = getCollection("trips");
        let userCollection = getCollection("users");

        try {
            const bikeObject = await bikeCollection.findOne({ bike_id: bikeId });

            if (!bikeObject) {
                throw new Error(`Bike with bike_id: ${bikeId} not found.`);
            }

            if (!bikeObject.active_trip) {
                throw new Error(`Bike with bike_id: ${bikeId} has no active trip.`);
            }

            const tripObject = await tripCollection.findOne({ trip_id: bikeObject.active_trip });

            console.log(`Ending trip for bike_id: ${bikeId}, located at:`, bikeObject.location);

            // Complete the trip
            const tripResult = await tripCollection.updateOne(
                { trip_id: bikeObject.active_trip },
                {
                    $set: {
                        end_time: new Date(),
                        end_location: bikeObject.location
                    }
                },
            )

            // Append completed trip in user
            const userResult = await userCollection.updateOne(
                { user_id: userId },
                {
                    $push: {
                        completed_trips: tripObject.trip_id,
                    },
                }
            );

            // Update the bike's status
            const result = await bikeCollection.updateOne(
                { bike_id: bikeId },
                {
                    $set: {
                        "status.available": true,
                        active_trip: null,
                    },
                    $push: {
                        completed_trips: tripObject.trip_id,
                    },
                },
                { returnDocument: "after" }
            );

            return result;

        } catch (e) {
            console.error(e);
            throw new Error(`Failed to stop bike with bike_id: ${bikeId}.`);
        }
    },

    charge: async function charge(bikeId) {
        let bikeCollection = getCollection("bikes");

        try {
            const result = await bikeCollection.updateOne(
                { bike_id: bikeId },
                {
                    $set: {
                        "status.available": false,
                        "status.in_service": true
                    }
                },
                { returnDocument: "after" }
            );

            return result;

        } catch (e) {
            console.error(e);
            throw new Error(`Failed to start charging bike with bike_id: ${bikeId}.`);
        }
    },

    stopCharge: async function stopCharge(bikeId) {
        let bikeCollection = getCollection("bikes");

        try {
            const result = await bikeCollection.updateOne(
                { bike_id: bikeId },
                {
                    $set: {
                        "status.available": true,
                        "status.in_service": false
                    }
                },
                { returnDocument: "after" }
            );

            return result;

        } catch (e) {
            console.error(e);
            throw new Error(`Failed to stop charging bike with bike_id: ${bikeId}.`);
        }
    },

    // Not yet refactored
    checkForWarning: async function checkForWarning(bike) {
        let db = await database.getDb();
        const city = await db.cityCollection.findOne(bike.city_id)

        if (!city) {
            throw new Error(`City not found for city_id: ${bike.city_id}`);
        }

        const cityZone = city.area
        const citySpeedLimit = city.speedLimit

        let warning = false;

        if (!cityZone.includes(bike.location)) {

            warning = true;
            // stop bike or something
        }

        // I guess bike speed is already capped?

        // if (bike.speed > citySpeedLimit) {
        //     // stop bike or something
        //     warning = true;
        // }

        if (bike.status.battery_level < 15) {
            warning = true;
        }

        return warning
    },

    startService: async function startService(bikeId) {
        let bikeCollection = getCollection("bikes");

        try {

            // Then update `status.in_service`
            const result = await bikeCollection.updateOne(
                { bike_id: bikeId },
                {
                    $set: {
                        "status.available": false,
                        "status.in_service": true
                    }
                },
                { returnDocument: "after" }
            );

            return result;
        } catch (e) {
            console.error(e)
            throw new Error(`Failed to start service for bike with bike_id: ${bikeId}.`);
        }
    },

    endService: async function serviceCompleted(bikeId) {
        let bikeCollection = getCollection("bikes");

        try {
            const result = await bikeCollection.updateOne(
                { bike_id: bikeId },
                {
                    $set: {
                        "status.available": true,
                        "status.in_service": false
                    }
                },
                { returnDocument: "after" }
            );

            return result;
        } catch (e) {
            console.error(e);
            throw new Error(`Failed to ebd service for bike with bike_id: ${bikeId}.`);
        }
    },

    saveTrip: async function saveTrip() {

    }
}

export default bike;