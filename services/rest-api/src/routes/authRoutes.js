import express from "express";
import axios from "axios";

import { getUserByEmail, createUser } from "../../../db/users.js";
import { getAdminByEmail, createAdmin } from "../../../db/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (req, res) => {
    return res.status(200).json({
        message: "These are all the auth routes",
        routes: {
            env: {
                method: "GET",
                path: "auth/env",
                description: "Returns Github details."
            },
            authUser: {
                method: "GET",
                path: "auth/user",
                description: "Authenticates a user using Github."
            },
            authAppUser: {
                method: "POST",
                path: "auth/app/user",
                description: "Checks if user is already in database and if not registers a new user. This route is only used from the app."
            },
            admninLogin: {
                method: "POST",
                path: "auth/admin/login",
                description: "Admin Login route, checks against JSW-token."
            },
            admninSignup: {
                method: "POST",
                path: "auth/admin/signup",
                description: "Creates a new admin-user."
            },
        }
    });
});

router.get("/env", (req, res) => {
    res.json({
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
    });
});

router.get("/user", async (req, res) => {
    const code = req.query.code;
    const path = req.query.path || "/";

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    const clientId = process.env.UI_GITHUB_CLIENT_ID;
    const clientSecret = process.env.UI_GITHUB_CLIENT_SECRET;

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
                balance: 0,
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

router.post("/app/user", async (req, res) => {
    let email = req.body.userEmail;
    let name = req.body.userName;
    // Create a new user if it doesn't exist

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            console.log("Creating new user:", name);
            const newUser = {
                name: name,
                email: email,
                payment_method: "prepaid",
                password: "",
                banned: false,
                completed_trips: [],
            };

            await createUser(newUser);
        }

    } catch (error) {
        console.error("Error during Google OAuth:", error);

        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

});

// Jason Webtoken login with email and password in admin app
router.post("/admin/login", async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const email = req.body.email;
    const password = req.body.password;

    const user = await getAdminByEmail(email);

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({
        user: {
            name: user.name,
            email: user.email,
        },
        token,
    });
});

// Jason Webtoken signup with email and password in admin app
router.post("/admin/signup", async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const email = req.body.email;
    const password = req.body.password;

    const user = await getAdminByEmail(email);

    if (user) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        email,
        password: hashedPassword,
    };

    await createAdmin(newUser);

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({
        user: {
            email: newUser.email,
        },
        token,
    });
});


export default router;
