import request from 'supertest';
import app from '../src/app.js';

describe("GET /api/v1/trip/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/api/v1/trip")
            .expect(200);

        expect(res.text).toMatch('\"These are all the trip routes\"');
    });
});

describe('POST /api/v1/trip/start', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/api/v1/trip/start')
            .send({ bike_id: 'B0017', user_id: 'U0012' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                return done();
            });
    });
});

describe("GET /api/v1/get/certain/bike/:id", () => {
    it("should return a bike with available false", async () => {
        const res = await request(app)
            .get("/api/v1/get/certain/bike/B0017")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"available\":false');
    });
});


describe('POST /api/v1/trip/end', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/api/v1/trip/end')
            .send({ bike_id: 'B0017', user_id: 'U0012' })
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                return done();
            });
    });
});

describe("GET /api/v1/get/certain/bike/:id", () => {
    it("should return a bike with available true", async () => {
        const res = await request(app)
            .get("/api/v1/get/certain/bike/B0017")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"available\":true');
    });
});

