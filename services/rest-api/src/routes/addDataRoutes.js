import express from 'express';
import bikeManager from "../../../bike-logic/bikeManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej add data routes");
});

// räcker för att lägga till cykel i city
// och vice versa
router.post("/bike", async (req, res) => {
    let newBike = req.body.bike;


    // let city = req.body.city;

    // fake new test bike
    // newBike =  {
    //     location: [55.7047,13.191],
    //     city_name: "Lund",
    //     speed: 0,
    //     status: {
    //         available: true,
    //         battery_level: 100,
    //         in_service: false
    //     },
    //     red_light: false,
    //     active_trip: null,
    //     completed_trips: []
    // }

    const result = await bikeManager.createBike(newBike);
    // const result = await bikeManager.createBike(newBike, city);

    // console.log(result);
    res.json(result);
});

// TEST post /bikes/{city_name}
router.post("/many/bikes", async (req, res) => {
    let bikes = req.body.bikes;
    let city = req.body.city;


    // Fake test bike array
    // bikes = [
    //     {
    //         speed: 0,
    //         location: [59.3588, 18.0287],
    //         // city_id: null,
    //         city_name: null,
    //         status: {
    //             available: true,
    //             battery_level: 100,
    //             in_service: false
    //         },
    //         red_light: false,
    //         completed_trips: []
    //     },

    //     {
    //         speed: 0,
    //         location: [59.3595, 18.0295],
    //         // city_id: "6e2b9a679b7e1f2387d06399",
    //         city_name: null,
    //         status: {
    //             available: true,
    //             battery_level: 85,
    //             in_service: false
    //         },
    //         red_light: false,
    //         completed_trips: []
    //     },
    //     {
    //         speed: 0,
    //         location: [59.3560, 18.0280],
    //         // city_id: "4cf3dbfd6d43423e9d125ad1",
    //         city_name: null,
    //         status: {
    //             available: false,
    //             battery_level: 50,
    //             in_service: true
    //         },
    //         red_light: true,
    //         completed_trips: []
    //     }
    // ];

    // // fake new test city object
    // city =  {
    //     _id: "67616e4cd798f99595d5b9b4",
    //     name: "Solna",
    // }

    const result = await bikeManager.createManyBikes(bikes, city);

    res.json(result);
});

// This needs to be adjusted later how id is generated
router.post("/user", async (req, res) => {
    let newUser = req.body.user;
    // let city = req.body.city;

    // fake new test user
    // newUser =  {
    //     name: "Test User",
    //     payment_method: "prepaid",
    //     password: "1234",
    //     email: "test@email.se",
    //     banned: false,
    //     completed_trips: [],
    //     user_id: null
    // }

    const result = await bikeManager.addUser(newUser);

    res.json(result);
});

export default router;
