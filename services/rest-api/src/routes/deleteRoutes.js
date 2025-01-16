import express from "express";
import { deleteUser } from "../../db/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej deleteRoutes");
});

// DELETE /user/:id
router.delete("/user/:id", async (req, res) => {
    const id = req.params.id;
    const result = await deleteUser(id);

    res.json(result);
});

export default router;