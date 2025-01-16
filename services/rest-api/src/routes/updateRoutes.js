import express from "express";
import { getUser, banUser, unbanUser } from "../../../db/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    return res.status(200).json({
        message: "These are all the update routes for the user",
        routes: {
            banUser: {
                method: "PUT",
                path: "edit/user/ban/:id",
                description: "Bans the user via _id"
            },
            unbanUser: {
                method: "PUT",
                path: "edit/user/unban/:id",
                description: "Revokes the ban the user via _id"
            },
            changeBanStatus: {
                method: "PUT",
                path: "edit/user/ban/change/:id",
                description: "Changes the ban status for a user, if banned the user gets unbanned and vice versa."
            },
        }
    });
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
    const result = await banUser(id);

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