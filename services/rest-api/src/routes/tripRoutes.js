import express from 'express';
import bikeManager from "../../../bike-logic/bikeManager.js";
import bike from "../../../bike-logic/bike.js";
import tripManager from '../../../trips/tripManager.js';

const router = express.Router();

router.get("/", async (req, res) => {
    return res.status(200).json({
        message: "These are all the trip routes",
        routes: {
            startTrip: {
                method: "POST",
                path: "trip/start",
                description: "Start a new trip with a userId and a bikeId."
            },
            endTrip: {
                method: "POST",
                path: "trip/end",
                description: "Ends a trip with a userId and a bikeId."
            },
            calculateTrip: {
                method: "GET",
                path: "trip/calculate/:trip_id",
                description: "Calculates the cost of a trip with the given tripId."
            },
        }
    });

});

router.post("/start", async (req, res) => {
    const bikeId = req.body.bike_id;
    const userId = req.body.user_id;

    const tripId = await bikeManager.generateTripId();
    const result = await bike.start(bikeId, tripId, userId);

    res.json(result);
});

router.post("/end", async (req, res) => {
    const bikeId = req.body.bike_id;
    const userId = req.body.user_id;

    const result = await bike.stop(bikeId, userId);

    res.json(result);
});

router.get("/calculate/:trip_id", async (req, res) => {
    const tripId = req.params.trip_id;
    const result = await tripManager.calculateTrip(tripId);

    res.json(result);
});

export default router;
