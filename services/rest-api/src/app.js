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

// if env.process = "simulation" {}
// let simulatedTrips = [];
// let flatSimulatedTrips = {};

// simSetup(simManager).then((data) => {
//     // Some of this should move simulation model
//     simulatedTrips = data;
//     console.log("Object amount: ", simulatedTrips.length);
//     console.log(simulatedTrips[6].length)

//     const totalBatches = simulatedTrips.length;  // Assuming there are 7 batches

//     // Loop over each batch progressively
//     for (let i = 0; i < totalBatches; i++) {
//         console.log(`Updating batches 1 to ${i + 1}`);  // Log the progress
    
//         // Loop through the batches up to the current batch `i`
//         for (let j = 0; j <= i; j++) {
//             console.log(`Updating batch ${j + 1}`);
//             for (const trip of simulatedTrips[j]) {
//                 simManager.updateLocation(trip);
//             }
//         }
//         console.log(`Finished updating batches 1 to ${i + 1}`);
//         flatSimulatedTrips = simulatedTrips.flat();
//     }
// })

// io.sockets.on('connection', function (socket) {
//     console.log(socket.id);

//     setInterval(() => {
//         if (simulatedTrips) {

//         for (const batch of simulatedTrips) {
//             batch.forEach((simTrip) => {
//                 simManager.updateLocation(simTrip);
//                 // Potentially write to db here
//             });
//         }

//         console.log("emitting!!")

//         // const flatSimulatedTrips = simulatedTrips.flat();

//         socket.emit('location_update', flatSimulatedTrips);

//         } else {
//             console.log("Data is not yet fetched, waiting...");
//         }
//     }, 5000);
// });



app.get("/", (req, res) => {
    res.send("Greetings, friend of Fenix!");
});

// GET /users
app.get("/users", async (req, res) => {
    const result = await getUsers();

    res.json(result);
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
startServer();

export default app;
