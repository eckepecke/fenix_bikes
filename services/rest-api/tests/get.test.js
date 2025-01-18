import request from 'supertest';
import app from '../src/app.js';



describe("GET /", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/")
            .expect(200);

        expect(res.text).toBe("Greetings, friend of Fenix!");
    });
});

describe("GET /api/v1/get/", () => {
    it("should print greeting", async () => {
        const res = await request(app)
            .get("/api/v1/get")
            .expect(200);

        expect(res.text).toMatch('These are all the get routes');
    });
});

describe("GET /api/v1/get/all/bikes", () => {
    it("should return all bikes in database", async () => {
        const res = await request(app)
            .get("/api/v1/get/all/bikes")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(10);
    });
});

describe("GET /api/v1/get/all/cities", () => {
    it("should return all cities in database", async () => {
        const res = await request(app)
            .get("/api/v1/get/all/cities")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(3);
    });
});

describe("GET /api/v1/get/all/users", () => {
    it("should return all users in database", async () => {
        const res = await request(app)
            .get("/api/v1/get/all/users")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(3);
    });
});

// describe("GET /api/v1/get/all/trips", () => {
//     it("should return all trips in database", async () => {
//         const res = await request(app)
//             .get("/api/v1/get/all/trips")
//             .expect('Content-Type', /json/)
//             .expect(200);

//         expect(res.body).toHaveLength(4);
//     });
// });

describe("GET /api/v1/get/all/parking-zones", () => {
    it("should return all parkingzones in database", async () => {
        const res = await request(app)
            .get("/api/v1/get/all/parking-zones")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(23);
    });
});

describe("GET /api/v1/get/all/charging-stations", () => {
    it("should return all charging stations in database", async () => {
        const res = await request(app)
            .get("/api/v1/get/all/charging-stations")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(20);
    });
});

describe("GET /api/v1/get/all/bikes/in/city/lund", () => {
    it("should return all bikes in lund", async () => {
        const res = await request(app)
            .get("/api/v1/get/all/bikes/in/city/lund")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(4);
    });
});

describe("GET /api/v1/get/user/email/:email", () => {
    it("should return a user identified by email", async () => {
        const res = await request(app)
            .get("/api/v1/get/user/email/test@test.se")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch("Second TestUser");
    });
});


describe("GET /api/v1/get/certain/bike/:id", () => {
    it("should return a bike identified by ID", async () => {
        const res = await request(app)
            .get("/api/v1/get/certain/bike/B0013")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch("B0013");
    });
});

describe("GET /api/v1/city/:city/parking-zones", () => {
    it("should return all parkingzones in lund", async () => {
        const res = await request(app)
            .get("/api/v1/get/city/lund/parking-zones")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(12);
    });
});

describe("GET /api/v1/city/:city/charging-stations", () => {
    it("should return all charging stations in Lund", async () => {
        const res = await request(app)
            .get("/api/v1/get//city/lund/charging-stations")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(9);
    });
});

describe("GET /api/v1/get/trip/:id", () => {
    it("should return a trip identified by ID", async () => {
        const res = await request(app)
            .get("/api/v1/get/trip/T0016")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.text).toMatch("T0016");
    });
});

describe("GET /api/v1/get/all/bikes/pagination", () => {
    it("should return 5 bikes", async () => {
        const res = await request(app)
            .get("/api/v1/get/all/bikes/pagination")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.bikes).toHaveLength(5);
    });
});

describe("GET /api/v1/get/bikes/with/warning", () => {
    it("should return 0 bikes", async () => {
        const res = await request(app)
            .get("/api/v1/get/bikes/with/warning")
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveLength(0);
    });
});
