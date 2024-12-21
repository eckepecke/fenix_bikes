import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectToDatabase } from "../../db/db.js";
import { getUsers } from '../../db/users.js';
// import { getCities } from '../../db/cities.js';
// import { getBikes } from '../../db/bikes.js';
// import bikeManager from "../../bike-logic/bikeManager.js"
import get from './routes/getDataRoutes.js';
import add from './routes/addDataRoutes.js';
import test from './routes/testRoutes.js';
import service from './routes/serviceRoutes.js';
import { Server } from "socket.io";
import { createServer } from 'http';
import trip from './routes/tripRoutes.js';
import bike from '../../bike-logic/bike.js'


dotenv.config();

if (!process.env.PORT) {
    console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT, 10) || 1338;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/add', add);
app.use('/get', get);
app.use('/service', service);
app.use('/trip', trip);


app.use('/test', test);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173']
    }
});

import simManager from '../../simulation/simulation.js';

io.sockets.on('connection', function (socket) {
    console.log(socket.id); // Nått lång och slumpat

    const simSetup = async () => {

        try {
        // Generate 1000 bikes
        const bikeArray = await simManager.generateBikes();
    
        // Generate 1000 customers (users)
        const userArray = await simManager.generateUsers();
    
        // Create 1000 Trips
        // Below is temporary for testing with only 2 trips
        const tripObjects = await simManager.getSimCoordinates();

        // Put them all together as a simulated trip
        const simulatedTrips = {};

        // Map all bikes to a trip and associate users with bikes and trips
        bikeArray.forEach((bike, index) => {
            const trip = tripObjects[index];
            const user = userArray[index];

            // Ensure that the trip and user exist
            if (trip && user) {
                simulatedTrips[bike.id] = {
                    bike: bike.id,
                    trip: trip.tripKey,
                    coordinates: trip.coordinates,
                    user: user.id,
                    userName: user.name,
                };
            }
        });
        // console.log(simulatedTrips);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    simSetup();

    setInterval(() => {
        // At some Interval send the simulatedTrips with a counter telling Map
        // what coordinate to render
        if (simulatedTrips) {
            socket.emit('location_update', simulatedTrips, coordinateCounter);
        } else {
            console.log("Data is not yet fetched, waiting...");
        }
    }, 5000);
});



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
        const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5lbc.mongodb.net/fenix?retryWrites=true&w=majority&appName=Cluster0`;

        await connectToDatabase(mongoUri);

        // Start the Express server
        const port = process.env.PORT || 1338;
        httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

// Start the server
startServer();
