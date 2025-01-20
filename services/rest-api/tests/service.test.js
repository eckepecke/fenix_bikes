import request from 'supertest';
import app from '../src/app.js';

describe("GET /api/v1/service/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/api/v1/service")
            .expect(200);

        expect(res.text).toMatch('"These are all the service routes"');
    });
});

describe('POST /api/v1/service/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/api/v1/service/bike')
            .send({ bike_id: 'B0012' })
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
    it("should return a bike with service true", async () => {
        const res = await request(app)
            .get("/api/v1/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"in_service\":true');
    });
});

describe('POST /api/v1/service/complete/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/api/v1/service/complete/bike')
            .send({ bike_id: 'B0012' })
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
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/api/v1/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"in_service\":false');
    });
});

describe('POST /api/v1/service/charge/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/api/v1/service/charge/bike')
            .send({ bike_id: 'B0012' })
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
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/api/v1/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"available\":false');
    });
});

describe('POST /api/v1/service/stop_charge/bike', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/api/v1/service/stop_charge/bike')
            .send({ bike_id: 'B0012' })
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
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/api/v1/get/certain/bike/B0012")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"available\":true');
    });
});

describe("GET /api/v1service/update/red_light", () => {
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/api/v1/service/update/red_light")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"Updated bikes"');
    });
});
