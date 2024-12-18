import express from 'express';
import bikeManager from "../../../bike-logic/bikeManager.js"



const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej service routes");
});

router.post("/bike", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B001";
    const result = await bikeManager.bikeToService(bikeId);

    res.json(result);
});

router.post("/complete/bike", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B001";
    const result = await bikeManager.bikeEndService(bikeId);

    res.json(result);
});

router.post("/charge", async (req, res) => {
    const bikeId = req.body.bike_id;
    const result = await bikeManager.chargeBike(bikeId);

    res.json(result);
});

router.post("/stop_charge", async (req, res) => {
    const bikeId = req.body.bike_id;
    const result = await bikeManager.stopCharge(bikeId);

    res.json(result);
});

export default router;
