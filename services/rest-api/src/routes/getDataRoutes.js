import express from "express";
import { getCities } from "../../db/cities.js";
import { getParking, getAllParking } from "../../db/parkingZones.js";
import { getChargingStations, getAllChargingStations } from "../../db/chargingStations.js";
import { getUsers, getUser, getUserByUserId, getUserByEmail } from "../../db/users.js";
import { getTrip, getTrips } from "../../db/trips.js";
import bikeManager from "../../bike-logic/bikeManager.js";
import bike from "../../bike-logic/bike.js";

const router = express.Router();

// GET /bikes
router.get("/", async (req, res) => {
    return res.status(200).json({
        message: "These are all the get routes",
        routes: {
            getAllCities: {
                method: "GET",
                path: "get/all/cities",
                description: "Returns all cities"
            },
            getAllBikes: {
                method: "GET",
                path: "get/all/bikes",
                description: "Returns all bikes"
            },
            getAllUsers: {
                method: "GET",
                path: "get/all/users",
                description: "Returns all users."
            },
            getUserByEmail: {
                method: "GET",
                path: "get/user/email/:email",
                description: "Returns the user via email."
            },
            getUserById: {
                method: "GET",
                path: "get/user/id/:id",
                description: "Returns the user via _id"
            },
            getAllTrips: {
                method: "GET",
                path: "get/all/trips",
                description: "Returns all trips."
            },
            getBikesInPagination: {
                method: "GET",
                path: "get/all/bikes/pagination",
                description: "Returns all bikes in groups of five."
            },
            getAllBikesInCity: {
                method: "GET",
                path: "get/all/bikes/in/city/:city",
                description: "Returns all bikes in the city given in the URL."
            },
            getCertainBike: {
                method: "GET",
                path: "get/certain/bike/:bike_id",
                description: "Returns a bike via bike_id."
            },
            getCityParkingZones: {
                method: "GET",
                path: "get/city/:city/parking-zones",
                description: "Returns all parkingzones in the city given in the URL."
            },
            getAllParkingZones: {
                method: "GET",
                path: "get/all/parking-zones",
                description: "Returns all parkingzones."
            },
            getAllChargingStations: {
                method: "GET",
                path: "get/all/charging-stations",
                description: "Returns all charging stations."
            },
            getCityChargingStations: {
                method: "GET",
                path: "get/city/:city/charging-stations",
                description: "Returns all charging stations in the city given in the URL."
            },
            getTripById: {
                method: "GET",
                path: "get/trip/:trip_id",
                description: "Returns a trip via tripId"
            },
            getAllBikesWithRedLight: {
                method: "GET",
                path: "get/bikes/with/warning",
                description: "Returns all bikes with a red light/low battery."
            },
            getAllAdmins: {
                method: "GET",
                path: "get/all/admins",
                description: "Returns all admins."
            },
        }
    });
});

router.get("/all/cities", async (req, res) => {
    const result = await getCities();

    res.json(result);
});

// GET /all/bikes
router.get("/all/bikes", async (req, res) => {
    const result = await bikeManager.getAllBikes();

    res.json(result);
});

router.get("/all/users", async (req, res) => {
    const result = await getUsers();

    res.json(result);
});

// GET /user/email/:email
router.get("/user/email/:email", async (req, res) => {
    const email = req.params.email;
    const result = await getUserByEmail(email);

    res.json(result);
});

// GET /user/:id
router.get("/user/id/:id", async (req, res) => {
    const id = req.params.id;
    const result = await getUser(id);

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
        // totala antal cyklar baserat på sökning
        const totalBikes = await bikeManager.countBikesPagination(filter);
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

// GET /trip/:id
router.get("/trip/:id", async (req, res) => {
    const id = req.params.id;
    const result = await getTrip(id);

    res.json(result);
});

// GET /bikes/with/warning
router.get("/bikes/with/warning", async (req, res) => {
    const result = await bikeManager.getAllBikesWithRedLight();

    res.json(result);
});

// GET /all/admins
router.get("/all/admins", async (req, res) => {
    const result = await getAdmins();

    res.json(result);
});


export default router;
