import request from "supertest";
import app from "../app";
import { closeDb, resetDbSchema } from "../test-utils/db-setup";

describe("Integration - patient read", () => {
  let accessToken = "";
  let patientId = "";

  const user = {
    name: "Integration Patient User",
    email: `patient_${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    await resetDbSchema();

    await request(app).post("/auth/register").send(user);
    const loginResponse = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });
    accessToken = loginResponse.body.data.token;

    const createPatientResponse = await request(app)
      .post("/patients")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: `Paciente Read ${Date.now()}`,
        birth_date: "1998-12-08T00:00:00.000Z",
        gender: "male",
        address: "calle read 123",
      });

    patientId = createPatientResponse.body.data.id;
  });

  it("reads patient list and specific patient", async () => {
    const listResponse = await request(app)
      .get("/patients")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body?.error).toBe(false);
    expect(Array.isArray(listResponse.body?.data)).toBe(true);
    expect(listResponse.body.data.some((p: { id: string }) => p.id === patientId)).toBe(
      true
    );

    const detailResponse = await request(app)
      .get(`/patients/${patientId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body?.error).toBe(false);
    expect(detailResponse.body?.data?.id).toBe(patientId);
  });

  afterAll(async () => {
    await closeDb();
  });
});
