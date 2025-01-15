import express from "express";
import { deleteUser } from "../../../db/users.js";

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

        }
    });
});

// DELETE /user/:id
router.delete("/user/:id", async (req, res) => {
    const id = req.params.id;
    const result = await deleteUser(id);

    res.json(result);
});

export default router;