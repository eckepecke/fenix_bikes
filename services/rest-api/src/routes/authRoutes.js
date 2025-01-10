import express from "express";
import axios from "axios";
import { getUserByEmail, createUser } from "../../../db/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json("hej authRoutes");
});

router.get("/env", (req, res) => {
    res.json({
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    });
});

router.get("/user", async (req, res) => {
    const code = req.query.code;
    const path = req.query.path || "/";

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
            },
            {
                headers: {
                    accept: "application/json",
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        const githubUser = userResponse.data;

        const user = await getUserByEmail(githubUser.email);

        // Create a new user if it doesn't exist
        if (!user) {
            console.log("Creating new user:", githubUser);
            const newUser = {
                name: githubUser.name || githubUser.login,
                email: githubUser.email,
                payment_method: "prepaid",
                password: "",
                banned: false,
                completed_trips: [],
            };

            await createUser(newUser);
        }

        try {
            const user = await getUserByEmail(githubUser.email);

            if (!user) {
                console.log("Creating new user:", githubUser);
                const newUser = {
                    name: githubUser.name || githubUser.login,
                    email: githubUser.email,
                    payment_method: "prepaid",
                    password: "",
                    banned: false,
                    completed_trips: [],
                };

                await createUser(newUser);
            }

            // Check if response has already been sent
            if (!res.headersSent) {
                res.cookie(
                    "user",
                    JSON.stringify({
                        name: githubUser.name || githubUser.login,
                        email: githubUser.email,
                    }),
                    {
                        httpOnly: false,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "Lax",
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    }
                );

                res.redirect(`http://localhost:5174${path}`);
            }
        } catch (error) {
            console.error("Error during GitHub OAuth:", error);

            if (!res.headersSent) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    } catch (error) {
        console.error("Error during GitHub OAuth:", error);

        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

router.get("/app/user", async (req, res) => {
    const code = req.query.code;
    const path = req.query.path || "/";

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
            },
            {
                headers: {
                    accept: "application/json",
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        const githubUser = userResponse.data;

        const user = await getUserByEmail(githubUser.email);

        // Create a new user if it doesn't exist
        if (!user) {
            console.log("Creating new user:", githubUser);
            const newUser = {
                name: githubUser.name || githubUser.login,
                email: githubUser.email,
                payment_method: "prepaid",
                password: "",
                banned: false,
                completed_trips: [],
            };

            await createUser(newUser);
        }

        try {
            const user = await getUserByEmail(githubUser.email);

            if (!user) {
                console.log("Creating new user:", githubUser);
                const newUser = {
                    name: githubUser.name || githubUser.login,
                    email: githubUser.email,
                    payment_method: "prepaid",
                    password: "",
                    banned: false,
                    completed_trips: [],
                };

                await createUser(newUser);
            }

            // Check if response has already been sent
            if (!res.headersSent) {
                res.cookie(
                    "user",
                    JSON.stringify({
                        name: githubUser.name || githubUser.login,
                        email: githubUser.email,
                    }),
                    {
                        httpOnly: false,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "Lax",
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    }
                );

                res.redirect(`http://localhost:43785`);
            }
        } catch (error) {
            console.error("Error during GitHub OAuth:", error);

            if (!res.headersSent) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    } catch (error) {
        console.error("Error during GitHub OAuth:", error);

        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

export default router;
