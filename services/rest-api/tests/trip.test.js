import request from 'supertest';
import app from '../src/app.js';

describe("GET /trip/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/trip")
            .expect(200);

        expect(res.text).toBe('\"hej tripRoutes\"');
    });
});

// describe('POST /trip/start', function () {
//     it('responds with json', function (done) {
//         request(app)
//             .post('/trip/start')
//             .send({ bike_id: 'B0017', user_id: 'U0012' })
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) return done(err);
//                 return done();
//             });
//     });
// });


// describe('POST /trip/stop', function () {
//     it('responds with json', function (done) {
//         request(app)
//             .post('/trip/stop')
//             .send({ bike_id: 'B0017', user_id: 'U0012' })
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) return done(err);
//                 return done();
//             });
//     });
// });

describe("GET /get/certain/bike/:id", () => {
    it("should return a bike with service false", async () => {
        const res = await request(app)
            .get("/get/certain/bike/B0017")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch('"available\":true');
    });
});