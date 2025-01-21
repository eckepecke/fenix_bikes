import express from 'express';
import bike from "../../../bike-logic/bike.js";
import bikeManager from "../../../bike-logic/bikeManager.js";


const router = express.Router();

router.get("/", async (req, res) => {
    return res.status(200).json({
        message: "These are all the service routes",
        routes: {
            serviceBike: {
                method: "POST",
                path: "service/bike",
                description: "Starts service mode on a bike and makes it unavailable."
            },
            ServiceCompleteBike: {
                method: "POST",
                path: "service/complete/bike",
                description: "Ends service mode on a bike and makes it available."
            },
            chargeBike: {
                method: "POST",
                path: "service/charge",
                description: "Sets a bike to charge and makes it unavailable."
            },
            stopChargeBike: {
                method: "POST",
                path: "service/stop_charge",
                description: "Ends charging and makes it available."
            },
            updateRedLight: {
                method: "GET",
                path: "service/update/red_light",
                description: "Checks battery level onn all bikes and turns on a red light if the battery level is to low."
            },
        }
    });
});

router.post("/bike", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B001";
    const result = await bike.startService(bikeId);

    res.json(result);
});

router.post("/complete/bike", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B001";
    const result = await bike.endService(bikeId);

    res.json(result);
});

router.post("/charge/bike", async (req, res) => {
    const bikeId = req.body.bike_id;
    const result = await bike.charge(bikeId);

    res.json(result);
});

router.post("/stop_charge/bike", async (req, res) => {
    const bikeId = req.body.bike_id;
    const result = await bike.stopCharge(bikeId);

    res.json(result);
});

router.get("/update/red_light", async (req, res) => {
    try {
        const allBikes = await bikeManager.getAllBikes();
        // const bikesWithLowBattery = await bikeManager.checkBikesForWarning(allBikes);
        // console.log("bikesWithLowBattery: ", bikesWithLowBattery)

        for (const bikeObj of allBikes) {
            console.log("Updating red: ", bikeObj);
            await bike.warning(bikeObj);
        }

        res.json({ message: "Updated bikes" });
    } catch (error) {
        console.error("Error updating bikes:", error);
        res.status(500).json({ error: "An error occurred while updating bikes" });
    }
});

export default router;
