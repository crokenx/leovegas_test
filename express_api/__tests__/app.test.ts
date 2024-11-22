import request from "supertest";
import app from "../app"; // Adjust the path if needed

import { sequelize } from "../utils/database.conn";

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (err) {
    console.error("Error closing the database connection:", err);
  }
});

describe("Test app.ts (Main application routes)", () => {
  test("GET /api/v1/users should return a 401 without token", async () => {
    const res = await request(app).get("/api/v1/users");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("msg", "There is not token on petition");
  });

  test("POST /api/v1/users should return a 400 without required fields", async () => {
    const res = await request(app).post("/api/v1/users");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body.errors).toHaveProperty("email");
    expect(res.body.errors).toHaveProperty("name");
    expect(res.body.errors).toHaveProperty("password");
    expect(res.body.errors).toHaveProperty("role");
  });

  test("GET /api/v1/users route is available", async () => {
    const res = await request(app).get("/api/v1/users");

    expect(res.status).not.toBe(404);
  });

  test("POST /api/v1/users route is available", async () => {
    const res = await request(app).post("/api/v1/users");

    expect(res.status).not.toBe(404);
  });
});