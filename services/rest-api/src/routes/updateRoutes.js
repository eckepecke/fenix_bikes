import express from "express";
import { getUser, banUser, unbanUser } from "../../db/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej updateRoutes");
});

// PUT /user/ban/:id
router.put("/user/ban/:id", async (req, res) => {
    const id = req.params.id;
    const result = await banUser(id);

    res.json(result);
});

// PUT /user/unban/:id
router.put("/user/unban/:id", async (req, res) => {
    const id = req.params.id;
    const result = await banUser(id, false);

    res.json(result);
});

// PUT /user/ban/change/:id
router.put("/user/ban/change/:id", async (req, res) => {
    const id = req.params.id;
    const user = await getUser(id);

    if (user.banned) {
        const result = await unbanUser(id);
        res.json(result);
        return;
    } else {
        const result = await banUser(id);
        res.json(result);
        return;
    }
});

export default router;