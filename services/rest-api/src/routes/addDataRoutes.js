import express from 'express';
import bikeManager from "../../../bike-logic/bikeManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
    return res.status(200).json({
        message: "These are all the add routes",
        routes: {
            addBike: {
                method: "POST",
                path: "add/bike",
                description: "Add a bike to the database."
            },
            addManyBikes: {
                method: "POST",
                path: "add/many/bikes",
                description: "Add an array of bikes to the database,"
            },
            addUser: {
                method: "POST",
                path: "add/user",
                description: "Add a new user to the database."
            },
        }
    });
});


router.post("/bike", async (req, res) => {
    let newBike = req.body.bike;
    const result = await bikeManager.createBike(newBike);

    res.json(result);
});

// // TEST post /bikes/{city_name}
router.post("/many/bikes", async (req, res) => {
    let bikes = req.body.bikes;
    let city = req.body.city;

    // console.log(bikes);
    // console.log(city);

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
