import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectToDatabase } from "../../db/db.js";
import { getUsers } from '../../db/users.js';
// import { getCities } from '../../db/cities.js';
// import { getBikes } from '../../db/bikes.js';
import simManager from "../../simulation/simManager.js"
import get from './routes/getDataRoutes.js';
import add from './routes/addDataRoutes.js';
import test from './routes/testRoutes.js';
import service from './routes/serviceRoutes.js';
import auth from './routes/authRoutes.js';
import edit from './routes/updateRoutes.js';
import deleteRoutes from './routes/deleteRoutes.js';
import { Server } from "socket.io";
import { createServer } from 'http';
import trip from './routes/tripRoutes.js';
import bike from '../../bike-logic/bike.js'
import simSetup from "../../simulation/simSetup.js";
import { group } from "console";
import bikeManager from '../../bike-logic/bikeManager.js'
import { startSimulation } from "../../simulation/runSim.js";



import stripe from "./routes/stripe.js";



dotenv.config();

if (!process.env.PORT) {
    console.log(`No port value specified...`);
}


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
}));
app.use(helmet());

app.use('/add', add);
app.use('/get', get);
app.use('/service', service);
app.use('/trip', trip);
app.use('/auth', auth);
app.use('/stripe', stripe);
app.use('/edit', edit);
app.use('/delete', deleteRoutes);


app.use('/test', test);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
    }
});

app.get("/", (req, res) => {
    res.send("Greetings, friend of Fenix!");
});


// Start the server after connecting to the database
const startServer = async () => {
    try {
        // Connect to the database

        let mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5lbc.mongodb.net/fenix?retryWrites=true&w=majority&appName=Cluster0`;

        if (process.env.NODE_ENV === 'test') {
            // We can even use MongoDB Atlas for testing
            mongoUri = "mongodb://localhost:27017/test";
        }

        if (process.env.NODE_ENV === 'simulation') {
            // Use a different database for simulation
            mongoUri = "mongodb://localhost:27017/simulation";
        }

        await connectToDatabase(mongoUri);

        // Start the Express server
        const port = process.env.PORT || 1338;

        if (process.env.NODE_ENV !== 'test') {
            httpServer.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
    } catch (error) {
        console.log('Error starting server:', error);
    }
};

// Start the server
await startServer();

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'simulation') {
    console.log("Simulation environment detected, starting simulation...");
    await startSimulation(io);  // Pass io to startSimulation
}

if (process.env.NODE_ENV === 'production') {
    io.sockets.on('connection', async function (socket) {
        console.log(socket.id);

        setInterval(async () => {
            console.log("getting bikes");
            let allBikes = await bikeManager.getAllBikes();

            console.log(`Number of bikes: ${allBikes.length}`);
            socket.emit('location_update', allBikes);

        }, 5000);

    });
}


export default app;
