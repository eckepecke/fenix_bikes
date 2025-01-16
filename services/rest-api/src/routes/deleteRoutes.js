import express from "express";
import { deleteUser } from "../../../db/users.js";
import bikeManager from "../../../bike-logic/bikeManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
    return res.status(200).json({
        message: "These are all the delete routes",
        routes: {
            deleteUser: {
                method: "DELETE",
                path: "delete/user/:id",
                description: "Delete a user with _id."
            },
            deleteBike: {
                method: "DELETE",
                path: "delete/bike/",
                description: "Delete a user with posted bike_id."
            },

        }
    });
});

// DELETE /user/:id
router.delete("/user/:id", async (req, res) => {
    const id = req.params.id;
    const result = await deleteUser(id);

    res.json(result);
});

router.post("/bike", async (req, res) => {
    let bikeId = req.body.bike_id;
    // Fake bike id:
    // bikeId = "B0010";
    const result = await bikeManager.deleteBike(bikeId);

    res.json(result);
});

export default router;