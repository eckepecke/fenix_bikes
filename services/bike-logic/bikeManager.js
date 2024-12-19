import { getCollection } from "../db/collections.js"
import { getCities } from "../db/cities.js"
import bike from "./bike.js"

const bikeManager = {
    generateBikeId: async function () {
        const counterCollection = getCollection("counters");

        // Increment and retrieve the updated counter
        const counter = await counterCollection.findOneAndUpdate(
            { _id: "bike_id" },
            { $inc: { counter_value: 1 } },
            { returnDocument: "after" }
        );

        return `B${counter.counter_value.toString().padStart(4, "0")}`;
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
                speed: bike.speed,
                location: bike.location,
                city_name: cityObject.name,
                status: {
                    available: bike.available,
                    battery_level: bike.battery_level,
                    in_service: bike.in_service,
                },
                red_light: false,
                completed_trips: []
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

        try {
            const bikeToDelete = await bike.reportState(bikeId);
            const cityName = bikeToDelete.city_name;
            console.log(cityName);
            const filter = { bike_id: bikeId }
            let result = await bikeCollection.deleteOne(filter);
            result = await cityCollection.updateOne(
                { name: cityName },
                { $pull: { bikes: bikeId } }
            );

            console.log(`Bike with id ${bikeId} was deleted.`)

        return result;
        } catch (e) {
            console.error("Error deleting bike:", e.message || e);
            throw new Error("Failed to delete bike from bike collection.");
        }
    },

    // Not yet refactored
    getAllBikesInCity: async function getAllBikesInCity(cityName) {
        try {
            const cities = await getCities();
            const city = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());


            if (!city) {
                console.error(`City '${cityName}' not found.`);
                throw new Error(`City '${cityName}' not found.`);
            }

            // Return the bikes for the found city
            return city.bikes;
        } catch (e) {
            console.error(`Failed to retrive bikes from ${cityName}.`, e.message || e);
            throw new Error(`Failed to retrive bikes from ${cityName}.`);
        }
    }
}

export default bikeManager