import express from 'express';
import { getCities } from '../../../db/cities.js';
import { getBikes } from '../../../db/bikes.js';
import { getUsers } from '../../../db/users.js';
import { getTrips } from '../../../db/trips.js';

import bikeManager from "../../../bike-logic/bikeManager.js"
import bike from "../../../bike-logic/bike.js"


const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej test routes");
});

router.post("/delete", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B0010";
    const result = await bikeManager.deleteBike(bikeId);

    res.json(result);
});


router.get("/generate", async (req, res) => {
    const result1 = await bikeManager.generateTripId();
    const result2 = await bikeManager.generateUserId();

    res.json([result1, result2]);
});

router.post("/location/update", async (req, res) => {
    let bikeId = req.body.bike_id;
    let coordinates = req.body.coordinates;
    // Fake bike id:
    // bikeId = "B0010";
    const result = await bikeManager.deleteBike(bikeId);

    res.json(result);
});

export default router;
