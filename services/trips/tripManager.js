import { getCollection } from "../db/collections.js"
import { getChargingStations, getAllChargingStations } from "../db/chargingStations.js";
import { getAllParking } from "../db/parkingZones.js";
import { getCities } from "../db/cities.js"
import pointInPolygon from 'point-in-polygon';


const tripManager = {


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

    calculateTrip: async function calculateTrip(tripId) {
        let tripCollection = getCollection("trips");

        try {
            const tripObject = await tripCollection.findOne({ trip_id: tripId });

            if (!tripObject) {
                throw new Error(`Trip with trip_id: ${tripId} not found.`);
            }

            const startLocation = tripObject.start_location;
            const stopLocation = tripObject.end_location;
            const startTime = tripObject.start_time;
            const endTime = tripObject.end_time;

            const duration = (endTime - startTime) / 1000;
            const minutes = duration / 60;
            const startFee = 10;
            const runningFee = 3;
            let discount = 0;
            let penalty = 0;
            const cost = (minutes * runningFee) + startFee;

            if (await this.checkParking(startLocation) === false) {
                if (await this.checkParking(stopLocation) === true) {
                    discount = -5;
                }
            }

            if (await this.checkParking(stopLocation) === false) {
                penalty = 5;
            }

            // console.log("kostnad", cost);
            // console.log("straffavgift", penalty);
            // console.log("rabatt", discount);

            let total = cost + penalty + discount;

            let roundCost = Math.round(total * 100) / 100

            return roundCost;

        } catch (e) {
            // console.error(e);
            throw new Error(`Failed to calculate trip with trip_id: ${tripId}.`);
        }
    },

    checkParking: async function checkParking(location) {
        const parkingZones = await getAllParking();
        // console.log(parkingZones);
        let flag = false
        for (var key in parkingZones) {
            // console.log(parkingZones[key].area);
            let answer = pointInPolygon(location, parkingZones[key].area);
            if (answer) {
                // console.log("På parkering");
                flag = true;
            }
        }
        // console.log("Ej på parkering");
        return flag;
    }
}

export default tripManager