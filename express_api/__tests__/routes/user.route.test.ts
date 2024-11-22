import request from "supertest";
import app from "../../app";
import { sequelize } from "../../utils/database.conn";

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

describe("User routes", () => {
  test("Get all users without token", async () => {
    const res = await request(app).get("/api/v1/users");

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("msg", "There is not token on petition");
  });
});