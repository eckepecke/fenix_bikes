import request from 'supertest';
import app from '../src/app.js';

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let connection;
let db;

beforeAll(async () => {
    // Set the MongoDB URI and database name for testing
    global.__MONGO_URI__ = "mongodb://localhost:27017";
    global.__MONGO_DB_NAME__ = "test";

    connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);

    // Clear the collections
    await db.collection('bikes').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('trips').deleteMany({});
    await db.collection('parking_zones').deleteMany({});
    await db.collection('cities').deleteMany({});
    await db.collection('charging_stations').deleteMany({});

    // Read and parse JSON files
    const bikes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addbikes.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addusers.json'), 'utf8'));
    const trips = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addtrips.json'), 'utf8'));
    const parkingZones = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addparking.json'), 'utf8'));
    const cities = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addcities.json'), 'utf8'));
    const chargingStations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addcharging.json'), 'utf8'));

    // Populate the test database
    await db.collection('bikes').insertMany(bikes);
    await db.collection('users').insertMany(users);
    await db.collection('trips').insertMany(trips);
    await db.collection('parking_zones').insertMany(parkingZones);
    await db.collection('cities').insertMany(cities);
    await db.collection('charging_stations').insertMany(chargingStations);
});

afterAll(async () => {
    await connection.close();
});



describe("GET /", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/")
            .expect(200);

        expect(res.text).toBe("Greetings, friend of Fenix!");
    });
});

describe("GET /get/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/get")
            .expect(200);

        expect(res.text).toBe('\"hej getData routes\"');
    });
});

describe("GET /get/all/bikes", () => {
    it("should return all bikes in database", async () => {
        const res = await request(app)
            .get("/get/all/bikes")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(10);
    });
});

describe("GET /get/all/cities", () => {
    it("should return all cities in database", async () => {
        const res = await request(app)
            .get("/get/all/cities")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(3);
    });
});

describe("GET /get/all/users", () => {
    it("should return all users in database", async () => {
        const res = await request(app)
            .get("/get/all/users")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(2);
    });
});

describe("GET /get/all/trips", () => {
    it("should return all trips in database", async () => {
        const res = await request(app)
            .get("/get/all/trips")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(4);
    });
});

describe("GET /get/all/parking-zones", () => {
    it("should return all parkingzones in database", async () => {
        const res = await request(app)
            .get("/get/all/parking-zones")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(23);
    });
});

describe("GET /get/all/charging-stations", () => {
    it("should return all charging stations in database", async () => {
        const res = await request(app)
            .get("/get/all/charging-stations")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(20);
    });
});

describe("GET /get/all/bikes/in/city/lund", () => {
    it("should return all bikes in lund", async () => {
        const res = await request(app)
            .get("/get/all/bikes/in/city/lund")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(4);
    });
});

describe("GET /get/user/:email", () => {
    it("should return a user identified by email", async () => {
        const res = await request(app)
            .get("/get/user/test@test.se")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch("Second TestUser");
    });
});

describe("GET /get/certain/bike/:id", () => {
    it("should return a bike identified by ID", async () => {
        const res = await request(app)
            .get("/get/certain/bike/B0013")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch("B0013");
    });
});

describe("GET /city/:city/parking-zones", () => {
    it("should return all parkingzones in lund", async () => {
        const res = await request(app)
            .get("/get//city/lund/parking-zones")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(12);
    });
});

describe("GET /city/:city/charging-stations", () => {
    it("should return all charging stations in Lund", async () => {
        const res = await request(app)
            .get("/get//city/lund/charging-stations")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(9);
    });
});

describe("GET /get/trip/:id", () => {
    it("should return a trip identified by ID", async () => {
        const res = await request(app)
            .get("/get/trip/T0016")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch("T0016");
    });
});