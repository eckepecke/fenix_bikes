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
import { Server } from "socket.io";
import { createServer } from 'http';
import trip from './routes/tripRoutes.js';
import bike from '../../bike-logic/bike.js'
import simSetup from "../../simulation/simSetup.js";
import { group } from "console";
import bikeManager from '../../bike-logic/bikeManager.js'



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


app.use('/test', test);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
    }
});



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

let simulatedTrips = [];
let flatSimulatedTrips = {};

if (process.env.NODE_ENV === 'simulation') {
    simManager.emptyBikeCollection()
        .then(() => {
            console.log('Bike collection emptied');
        })
        .catch((error) => {
            console.error('Error emptying bike collection:', error);
        });

        simSetup(simManager).then(async (data) => {
            console.log("setting up sim..")
        // Some of this should move simulation model
            simulatedTrips = data;


            const totalBatches = simulatedTrips.length;  // Assuming there are 7 batches

            // Loop over each batch progressively
            for (let i = 0; i < totalBatches; i++) {
                console.log(`Updating batches 1 to ${i + 1}`);  // Log the progress
            
                // Loop through the batches up to the current batch `i`
                for (let j = 0; j <= i; j++) {
                    console.log(`Updating batch ${j + 1}`);
                    for (const trip of simulatedTrips[j]) {
                        simManager.updateLocation(trip);
                    }
                }
                console.log(`Finished updating batches 1 to ${i + 1}`);
                flatSimulatedTrips = simulatedTrips.flat();
                await bikeManager.saveBikesToDb(flatSimulatedTrips);
            }
        })
}

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'simulation') {
    console.log("simulating..")
    // console.log("Is it an array?", Array.isArray(flatSimulatedTrips));

    // await bikeManager.saveBikesToDb(flatSimulatedTrips);


    io.sockets.on('connection', async function (socket) {
        console.log(socket.id);

        setInterval(async () => {
            console.log("getting bikes");
            let activeSimBikes = await bikeManager.getAllActiveSimBikes();

            if (activeSimBikes) {
                console.log("simManager updating locations")
                for (const bike of activeSimBikes) {
                    simManager.updateLocation(bike);
                    // Potentially write to db here

                }
            console.log("bikeManager saving to db");
            await bikeManager.saveBikesToDb(activeSimBikes);
            }
            let activeBikes = await bikeManager.getAllActiveSimBikes();
            console.log("emitting sim bikes");
            console.log(`Number of active bikes: ${activeBikes.length}`);
            socket.emit('location_update', activeBikes);

        }, 5000);
    
    });
} else {
    // This always run to update active bikes location
    // something should happen when it is not a sim

    // io.sockets.on('connection', function (socket) {
    //     console.log(socket.id);

    //     setInterval(async () => {
    //         try {
    //             let activeBikes = await bikeManager.getAllActiveBikes();
    //         } catch (error) {
    //             console.error("Error updating active bikes:", error);
    //         }
    //     }, 5000);
    // });
}


export default app;
