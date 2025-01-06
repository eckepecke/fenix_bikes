import request from 'supertest';
import app from '../src/app.js';

describe("GET /auth/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/auth")
            .expect(200);

        expect(res.text).toBe('\"hej authRoutes\"');
    });
});
