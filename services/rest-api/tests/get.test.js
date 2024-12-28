import bike from '../../bike-logic/bike.js';
import request from 'supertest';
import app from '../src/app.js';
// const bike = require('../../bike-logic/bike.js');


describe("GET /", () => {
    it("should greet the world when no name is provided", async () => {
        const res = await request(app)
            .get("/")
            .expect(200);

        expect(res.text).toBe("Greetings, friend of Fenix!");
    });
});
