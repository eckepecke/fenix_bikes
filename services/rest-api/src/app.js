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
import auth from './routes/authRoutes.js';
import { Server } from "socket.io";
import { createServer } from 'http';
import trip from './routes/tripRoutes.js';
import bike from '../../bike-logic/bike.js';


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
app.use('/auth', auth);


app.use('/test', test);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173']
    }
});


io.sockets.on('connection', function (socket) {
    console.log(socket.id); // Nått lång och slumpat


    // socket.timeout(5000).serverSideEmit("location_update", bike.sendLocation('B0013'), (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
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

        let mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5lbc.mongodb.net/fenix?retryWrites=true&w=majority&appName=Cluster0`;

        if (process.env.NODE_ENV === 'test') {
            // We can even use MongoDB Atlas for testing
            mongoUri = "mongodb://localhost:27017/test";
        }

        await connectToDatabase(mongoUri);

        // Start the Express server
        const port = process.env.PORT || 1338;

        httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log('Error starting server:', error);
    }
};

// Start the server
startServer();

export default app;
