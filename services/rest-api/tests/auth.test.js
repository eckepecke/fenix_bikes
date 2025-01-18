import request from 'supertest';
import app from '../src/app.js';

describe("GET /api/v1/auth/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/api/v1/auth")
            .expect(200);

        expect(res.text).toMatch('These are all the auth routes');
    });
});
