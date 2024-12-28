import bike from '../../bike-logic/bike.js';
import request from 'supertest';
import app from '../src/app.js';
// const bike = require('../../bike-logic/bike.js');


describe("GET /", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/")
            .expect(200);

        expect(res.text).toBe("Greetings, friend of Fenix!");
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