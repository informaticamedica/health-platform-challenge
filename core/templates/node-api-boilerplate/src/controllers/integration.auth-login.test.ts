import request from "supertest";
import app from "../app";
import { closeDb, resetDbSchema } from "../test-utils/db-setup";

describe("Integration - auth login", () => {
  const user = {
    name: "Integration Auth User",
    email: `auth_${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    await resetDbSchema();
  });

  it("registers and logs in", async () => {
    const registerResponse = await request(app).post("/auth/register").send(user);
    expect([200, 201]).toContain(registerResponse.status);

    const loginResponse = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect([200, 201]).toContain(loginResponse.status);
    expect(loginResponse.body?.error).toBe(false);
    expect(loginResponse.body?.data?.token).toBeTruthy();
  });

  afterAll(async () => {
    await closeDb();
  });
});
