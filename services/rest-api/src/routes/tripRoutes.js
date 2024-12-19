import express from 'express';
import { getCities } from '../../../db/cities.js';
import { getBikes } from '../../../db/bikes.js';
import bikeManager from "../../../bike-logic/bikeManager.js"
import bike from "../../../bike-logic/bike.js"

const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej tripRoutes");
});

router.post("/start/trip", async (req, res) => {
    const bikeId = req.body.bike_id;
    const result = await bike.start(bikeId);
    res.json(result);
});


router.post("/end/trip", async (req, res) => {
    const bikeId = req.body.bike_id;
    const result = await bike.stop(bikeId);
    res.json(result);
});

export default router;