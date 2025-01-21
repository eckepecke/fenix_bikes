import { getCollection } from "../db/collections.js";
import { getCities } from "../db/cities.js";
import bike from "./bike.js";

const bikeManager = {
    generateBikeId: async function () {
        const counterCollection = getCollection("counters");
    
        // Increment and retrieve the updated counter, create if it doesn't exist
        const counter = await counterCollection.findOneAndUpdate(
            { _id: "bike_id" }, // Filter to find the counter document
            { 
                $inc: { counter_value: 1 }, // Increment the counter_value field
                $setOnInsert: { seq: 0 } // Set the seq field if document is inserted
            },
            {
                returnDocument: "after", // Return the document after the update
                upsert: true, // Insert the document if it doesn't exist
            }
        );
    
        // Ensure counter_value is correctly retrieved
        console.log("counterHÄR: ", counter)
        const counterValue = counter?.counter_value || 1;
        console.log("counterHÄR2: ", counterValue)

    
        // Return formatted bike ID
        return `B${counterValue.toString().padStart(4, "0")}`;
    },

    generateTripId: async function () {
        const counterCollection = getCollection("counters");

        // Increment and retrieve the updated counter
        const counter = await counterCollection.findOneAndUpdate(
            { _id: "trip_id" },
            { $inc: { counter_value: 1 } },
            { returnDocument: "after" }
        );

        return `T${counter.counter_value.toString().padStart(4, "0")}`;
    },

    generateUserId: async function () {
        const counterCollection = getCollection("counters");

        // Increment and retrieve the updated counter
        const counter = await counterCollection.findOneAndUpdate(
            { _id: "user_id" },
            { $inc: { counter_value: 1 } },
            { returnDocument: "after" }
        );

        return `U${counter.counter_value.toString().padStart(4, "0")}`;
    },

    createBike: async function createBike(bike) {
        let bikeCollection = getCollection("bikes");
        let cityCollection = getCollection("cities");

        try {
            // add bike
            const bike_id = await this.generateBikeId();
            bike.bike_id = bike_id;
            const bikeResult = await bikeCollection.insertOne(bike);

            // // add bike to given city
            await cityCollection.updateOne(
                { name: bike.city_name },
                { $push: { bikes: bike.bike_id } }
            );

            return bikeResult;
        } catch (e) {
            console.error("Error creating new bike:", e.message || e);
            throw new Error("Failed to add bike to bike collection.");
        }
    },

    createManyBikes: async function createManyBikes(bikeArray, cityObject) {
        let bikeCollection = getCollection("bikes");
        let cityCollection = getCollection("cities");

        // Map through the array of bikes and prepare multiple bike documents
        const newBikes = await Promise.all(bikeArray.map(async (bike) => {
            // Generate a unique bike_id for each bike
            const currentBikeId = await this.generateBikeId();

            return {
                bike_id: currentBikeId,
                speed: 0,
                location: bike.location,
                city_name: cityObject.name,
                status: {
                    available: bike.available,
                    battery_level: 100,
                    in_service: false,
                },
                red_light: false,
                active_trip: null,
                completed_trips: [],
                plugged_in: false
            };
        }));

        try {
            // Insert the new bikes into the collection
            const result = await bikeCollection.insertMany(newBikes);
            const newBikeIds = newBikes.map((bike) => bike.bike_id);

            // Update the city collection and add bike_ids to the city's bikes array
            await cityCollection.updateOne(
                { name: cityObject.name },
                { $push: { bikes: { $each: newBikeIds } } }
            );

            return result;
        } catch (e) {
            console.error("Error creating multiple new bikes:", e.message || e);
            throw new Error("Failed to add many bikes to bike collection.");
        }
    },

    getAllBikes: async function getAllBikes() {
        let collection = getCollection("bikes");

        try {
            const result = await collection.find({}).toArray();


            return result;
        } catch (e) {
            console.error("Error retrieving bikes:", e.message || e);
            throw new Error("Failed to retrieve bikes from the database.");
        }
    },

    getAllActiveBikes: async function getAllActiveBikes() {
        let collection = getCollection("bikes");

        try {
            // Needs to be tested
            //const result = await collection.find({}).toArray();
            const result = await collection.find({ active_trip: { $ne: null } }).toArray();

            return result;
        } catch (e) {
            console.error("Error retrieving bikes:", e.message || e);
            throw new Error("Failed to retrieve bikes from the database.");
        }
    },

    getAllBikesWithRedLight: async function getAllBikesWithRedLight() {
        let collection = getCollection("bikes");

        try {
            // Needs to be tested
            //const result = await collection.find({}).toArray();
            const result = await collection.find({ red_light: true }).toArray();

            return result;
        } catch (e) {
            console.error("Error retrieving bikes:", e.message || e);
            throw new Error("Failed to retrieve bikes from the database.");
        }
    },

    // för /bikes-vyn i admin
    getBikesPagination: async (filter = {}, skip = 0, limit = 5) => {
        const bikeCollection = getCollection("bikes");

        return await bikeCollection
            .find(filter)
            .skip(skip)
            .limit(Number(limit))
            .toArray();
    },

    // för /bikes-vyn i admin, returnerar antal cyklar
    // baserat på en sökning (används för sidnumrering)
    countBikesPagination: async (filter = {}) => {
        const bikeCollection = getCollection("bikes");
        return await bikeCollection.countDocuments(filter);
    },

    deleteBike: async function deleteBike(bikeId) {
        let bikeCollection = getCollection("bikes");
        let cityCollection = getCollection("cities");

        console.log("Bike to delete: ", bikeId)

        try {
            const bikeToDelete = await bike.reportState(bikeId);
            console.log("Bike to delete: ", bikeToDelete)

            const cityName = bikeToDelete.city_name;
            const filter = { bike_id: bikeId }
            let result = await bikeCollection.deleteOne(filter);
            console.log(result);
            result = await cityCollection.updateOne(
                { name: cityName },
                { $pull: { bikes: bikeId } }
            );
            console.log(result);


            return {
                success: true,
                message: `Bike with id ${bikeId} was deleted.`,
            };
        } catch (e) {
            console.error("Error deleting bike:", e.message || e);
            throw new Error("Failed to delete bike from bike collection.");
        }
    },

    getAllBikesInCity: async function getAllBikesInCity(cityName) {
        let bikeCollection = getCollection("bikes");

        try {
            const cities = await getCities();
            const city = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());

            if (!city) {
                console.error(`City '${cityName}' not found.`);
                throw new Error(`City '${cityName}' not found.`);
            }

            // Find all bikeobjects with the bike_ids and return
            const bikes = await bikeCollection.find({ bike_id: { $in: city.bikes } }).toArray();

            return bikes;
        } catch (e) {
            console.error(`Failed to retrive bikes from ${cityName}.`, e.message || e);
            throw new Error(`Failed to retrive bikes from ${cityName}.`);
        }
    },

    addUser: async function addUser(user) {
        let userCollection = getCollection("users");

        try {
            // add bike
            const userId = await this.generateUserId();
            user.user_id = userId;
            const result = await userCollection.insertOne(user);

            return result;
        } catch (e) {
            console.error("Error creating new user:", e.message || e);
            throw new Error(`Failed to add user ${user} to bike collection.`);
        }
    },

    deleteUser: async function deleteUser(user) {
        let userCollection = getCollection("users");
        try {

            const filter = { user_id: user }
            let result = await userCollection.deleteOne(filter);

            console.log(`User with id ${user} was deleted.`)

            return result;
        } catch (e) {
            console.error("Error deleting user:", e.message || e);
            throw new Error("Failed to delete user from user collection.");
        }
    },

    saveBikesToDb: async function saveBikesToDb(bikeObjects) {
        console.log("Saving bikes..")
        let collection = getCollection("bikes");
    
        for (const bike of bikeObjects) {
            try {
                // console.log("Bike object:", bike);
                // Find bikes where activeTrip is not null, and insert if not found
                const result = await collection.updateOne(
                    { bike_id: bike.bike_id }, // Access bike_id from the nested bike object
                    { $set: bike },
                    { upsert: true }
                );

            } catch (e) {
                console.error("Error saving bikes to db: ", e.message || e);
                throw new Error("Failed to retrieve active bikes from the database.");
            }
        }
    },

    checkBikesForWarning: async function checkBikesForWarning(bikeArray) {
    
        const bikesNeedingWarning = [];
    
        for (const bikeObj of bikeArray) {
            if (bikeObj.status.battery_level < 15) {
                bikesNeedingWarning.push(bikeObj);
            }
        }
    
        return bikesNeedingWarning;
    }
}
export default bikeManager