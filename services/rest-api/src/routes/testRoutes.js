import express from 'express';
import { getCities } from '../../../db/cities.js';
import { getBikes } from '../../../db/bikes.js';
import { getParking, getAllParking } from '../../../db/parkingZones.js';
import { getChargingStations, getAllChargingStations } from '../../../db/chargingStations.js';
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


// GET /city/:city/parking-zones
router.get("/city/:city/parking-zones", async (req, res) => {
    const city = req.params.city;
    const result = await getParking(city);
    res.json(result);
});

// GET /all/parking-zones
router.get("/all/parking-zones", async (req, res) => {
    const result = await getAllParking();
    res.json(result);
});

// GET /city/:city/charging-stations
router.get("/city/:city/charging-stations", async (req, res) => {
    const city = req.params.city;
    const result = await getChargingStations(city);
    res.json(result);
});

// GET /all/charging-stations
router.get("/all/charging-stations", async (req, res) => {
    const result = await getAllChargingStations();
    res.json(result);
});

export default router;
