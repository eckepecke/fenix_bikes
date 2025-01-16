import request from 'supertest';
import app from '../src/app.js';

describe("GET /edit/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/edit")
            .expect(200);

        expect(res.text).toMatch('\"These are all the update routes for the user\"');
    });
});

describe('PUT /edit/ban/user/:id', function () {
    it('responds with json', function (done) {
        request(app)
            .put('/edit/user/ban/6769519278b74397b202f371')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                return done();
            });
    });
});

describe('PUT /edit/unban/user/:id', function () {
    it('responds with json', function (done) {
        request(app)
            .put('/edit/user/unban/6769519278b74397b202f371')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                return done();
            });
    });
});

// describe('PUT edit/user/ban/change/:id', function () {
//     it('responds with json', function (done) {
//         request(app)
//             .put('edit/user/ban/change/6765617d4cd3ac975e5ca6fd')
//             .set('Accept', 'application/json')
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) { return done(err); }
//                 return done();
//             });
//     });
// });

