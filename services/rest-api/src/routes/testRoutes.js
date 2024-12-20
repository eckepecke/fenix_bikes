import express from 'express';
import { getCities } from '../../../db/cities.js';
import { getBikes } from '../../../db/bikes.js';
import { getParking, getAllParking } from '../../../db/parkingZones.js';
import { getChargingStations, getAllChargingStations } from '../../../db/chargingStations.js';
import bikeManager from "../../../bike-logic/bikeManager.js"
import bike from "../../../bike-logic/bike.js"


const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej test routes");
});

//this route will not exist, only to test 
// trigger bike object without a socket
router.get("/report", async (req, res) => {
    // Fake bike id:
    const bikeId = "B002"
    const result = await bike.reportState(bikeId);
    console.log(result);
    res.json(result);
});


// This should according to SDS first go through Manager
router.post("/report", async (req, res) => {
    let bikeId = req.body.bike_id;
    console.log(bikeId);

    const result = await bike.reportState(bikeId);
    res.json(result);
});


router.post("/start", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B001";
    const result = await bikeManager.startBike(bikeId);
    res.json(result);
});

router.post("/stop", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B001";
    const result = await bikeManager.stopBike(bikeId);

    res.json(result);
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
