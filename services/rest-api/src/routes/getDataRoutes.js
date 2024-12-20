import express from 'express';
import { getCities } from '../../../db/cities.js';
import { getBikes } from '../../../db/bikes.js';
import { getUsers } from '../../../db/users.js';
import { getTrips } from '../../../db/trips.js';
import bikeManager from "../../../bike-logic/bikeManager.js"
import bike from "../../../bike-logic/bike.js"

const router = express.Router();

// GET /bikes
router.get("/", async (req, res) => {
    res.json("hej getData routes");
});

router.get("/all/cities", async (req, res) => {
    const result = await getCities();
    res.json(result);
});

router.get("/all/bikes", async (req, res) => {
    const result = await bikeManager.getAllBikes();

    res.json(result);
});

router.get("/all/users", async (req, res) => {
    const result = await getUsers();
    res.json(result);
});

router.get("/all/trips", async (req, res) => {
    const result = await getTrips();
    res.json(result);
});

// för /bikes-vyn i admin
router.get("/all/bikes/pagination", async (req, res) => {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const limit = 5; // visa 5 cyklar i taget
    const skip = (page - 1) * limit;
  
    // om sökord finns används inbyggda regex och case-insensitive för att söka i db
    const filter = search ? { bike_id: { $regex: search, $options: "i" } } : {};

    try {
      const bikes = await bikeManager.getBikesPagination(filter, skip, limit);
      const totalBikes = await bikeManager.countBikesPagination(filter); // totala antal cyklar baserat på sökning
      const totalPages = Math.ceil(totalBikes / limit);
  
      res.json({ bikes, totalPages });
    } catch (error) {
      console.error("Error fetching bikes:", error);
      res.status(500).send("Error fetching bikes");
    }
});

router.get("/all/bikes/in/city/:city", async (req, res) => {
    const city = req.params.city;
    const result = await bikeManager.getAllBikesInCity(city);

    res.json(result);
});

router.get("/certain/bike/:bike_id", async (req, res) => {
    const bikeId = req.params.bike_id;
    const result = await bike.reportState(bikeId);

    res.json(result);
});

export default router;