import request from 'supertest';
import app from '../src/app.js';

describe("GET /service/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/service")
            .expect(200);

        expect(res.text).toBe('\"hej service routes\"');
    });
});

describe('POST /service/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/service/bike')
            .send({ bike_id: 'B0012' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe("GET /get/certain/bike/:id", () => {
    it("should return a bike with service true", async () => {
        const res = await request(app)
            .get("/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"in_service\":true');
    });
});

describe('POST /service/complete/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/service/complete/bike')
            .send({ bike_id: 'B0012' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe("GET /get/certain/bike/:id", () => {
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"in_service\":false');
    });
});

describe('POST /service/charge', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/service/charge')
            .send({ bike_id: 'B0012' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe("GET /get/certain/bike/:id", () => {
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"available\":false');
    });
});

describe('POST /service/stop_charge', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/service/stop_charge')
            .send({ bike_id: 'B0012' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

describe("GET /get/certain/bike/:id", () => {
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"available\":true');
    });
});