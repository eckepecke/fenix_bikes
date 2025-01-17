import express from 'express';
import bikeManager from "../../../bike-logic/bikeManager.js";
import bike from "../../../bike-logic/bike.js";


const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej test routes");
});


router.get("/generate", async (req, res) => {
    const result1 = await bikeManager.generateTripId();
    const result2 = await bikeManager.generateUserId();

    res.json([result1, result2]);
});

router.post("/location/update", async (req, res) => {
    let bikeId = req.body.bike_id;
    let location = req.body.location;
    // Fake bike id:
    // bikeId = "B0010";
    const result = await bike.updateLocation(bikeId, location);

    res.json(result);
    // console.log(bikeId, coordinates);
});

router.get("/location/report/:bikeId", async (req, res) => {
    let bikeId = req.params.bikeId;
    // Fake bike id:
    // bikeId = "B0010";
    // setTimeout(() => {
    //     const result = bike.sendLocation(bikeId);
    //     res.json(result);
    // }, 10000)

    const result = await bike.sendLocation(bikeId);

    res.json(result.location);
})



export default router;