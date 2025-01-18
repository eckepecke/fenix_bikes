import request from 'supertest';
import app from '../src/app.js';

describe("GET /api/v1/stripe/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/api/v1/stripe")
            .expect(200);

        expect(res.text).toMatch('"These are all the stripe routes"');
    });
});

// describe('POST /api/v1/stripe/payment-intent', function () {
//     it('responds with json', function (done) {
//         request(app)
//             .post('/api/v1/stripe/payment-intent')
//             .send({ amount: 10 })
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) { return done(err); }
//                 return done();
//             });
//     });
// });

// describe('POST /stripe/create-checkout-session', function () {
//     it('responds with json', function (done) {
//         request(app)
//             .post('/stripe/create-checkout-session')
//             .send({ amount: 10, tripId: "T0013" })
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) { return done(err); }
//                 return done();
//             });
//     });
// });