import request from 'supertest';
import app from '../src/app.js';

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let connection;
let db;

beforeAll(async () => {
    // Set the MongoDB URI and database name for testing
    global.__MONGO_URI__ = "mongodb://db:27017";
    global.__MONGO_DB_NAME__ = "test";

    console.log("Adress i test");

    console.log(`${global.__MONGO_URI__}/${global.__MONGO_DB_NAME__}`);


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
    await db.collection('counters').deleteMany({});

    // Read and parse JSON files
    const bikes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addbikes.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addusers.json'), 'utf8'));
    const trips = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addtrips.json'), 'utf8'));
    const parkingZones = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addparking.json'), 'utf8'));
    const cities = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addcities.json'), 'utf8'));
    const chargingStations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addcharging.json'), 'utf8'));
    const counters = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdb/addcounter.json'), 'utf8'));

    // Populate the test database
    await db.collection('bikes').insertMany(bikes);
    await db.collection('users').insertMany(users);
    await db.collection('trips').insertMany(trips);
    await db.collection('parking_zones').insertMany(parkingZones);
    await db.collection('cities').insertMany(cities);
    await db.collection('charging_stations').insertMany(chargingStations);
    await db.collection('counters').insertMany(counters);
});

// Give time to any async operation to complete after each test
// afterEach(async () => {
//     console.log("Sleeping")
//     await sleep(2000);
// });

afterAll(async () => {
    // setTimeout( async () => {
    //     console.log("closing db");
    //   }, 1000); 
    await connection.close();

});

describe("GET /add/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/add")
            .expect(200);

        expect(res.text).toMatch('These are all the add routes');
    });
});

describe("GET /delete/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/delete")
            .expect(200);

        expect(res.text).toMatch('\"These are all the delete routes\"');
    });
});

describe('POST /add/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/add/bike')
            .send({
                bike: {
                    speed: 0,
                    location: [
                        59.356,
                        18.028
                    ],
                    city_name: "Solna",
                    status: {
                        available: true,
                        battery_level: null,
                        in_service: false
                    },
                    red_light: false,
                    completed_trips: [],
                    active_trip: null
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /add/many/bikes', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/add/many/bikes')
            .send({
                bikes: [
                    {
                        speed: 0,
                        location: [
                            59.356,
                            18.028
                        ],
                        city_name: null,
                        status: {
                            available: true,
                            battery_level: null,
                            in_service: false
                        },
                        red_light: false,
                        completed_trips: [],
                        active_trip: null
                    },
                    {
                        speed: 0,
                        location: [
                            59.356,
                            18.028
                        ],
                        city_name: null,
                        status: {
                            available: true,
                            battery_level: null,
                            in_service: false
                        },
                        red_light: false,
                        completed_trips: [],
                        active_trip: null
                    },
                ],
                city: {
                    _id: "67616e4cd798f99595d5b9b4",
                    name: "Solna",
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST add and find user + change banned status', function () {
    let user_id;
    it('Add user and respond with json object', function (done) {
        request(app)
            .post('/add/user')
            .send({
                user: {
                    name: "Test Add User",
                    payment_method: "prepaid",
                    password: "12345",
                    email: "testAdd@email.se",
                    banned: false,
                    completed_trips: [],
                    user_id: null
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                user_id = res.body.insertedId;
                return done();
            });
    });

    it("should return a user identified by _id", async () => {
        const res = await request(app)
            .get(`/get/user/id/${user_id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch("Test Add User");
    });

    it('change user status', function (done) {
        request(app)
            .put(`/edit/user/ban/change/${user_id}`)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                return done();
            });
    });

    it('change user status', function (done) {
        request(app)
            .put(`/edit/user/ban/change/${user_id}`)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                return done();
            });
    });
});

describe('POST /delete/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/delete/bike')
            .send({ bike_id: 'B0025' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /test/delete/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/delete/bike')
            .send({ bike_id: 'B0026' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /test/delete/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/delete/bike')
            .send({ bike_id: 'B0027' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /delete/user', function () {
    it('responds with json', function (done) {
        request(app)
            .delete('/delete/user/6787cf8db3c577b81eef4fb5')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});