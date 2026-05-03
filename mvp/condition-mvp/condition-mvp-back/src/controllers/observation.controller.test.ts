import request from "supertest";
import app from "../app";
import { loadLoincCodes, loadLoincCsvToArray } from "../utils/loincLoader";

describe("Observation integration flow", () => {
  let accessToken = "";
  let patientId: string | number | undefined;
  let observationId: string | undefined;
  let loincCode = "";

  const testUser = {
    name: "Observation Integration User",
    email: `obs_integration_${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    await loadLoincCodes("src/db/csv/Loinc.csv");
    const loincRows = await loadLoincCsvToArray("src/db/csv/Loinc.csv");
    loincCode = loincRows[0]?.LOINC_NUM ?? "8480-6";

    const registerResponse = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect([200, 201]).toContain(registerResponse.status);

    const loginResponse = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect([200, 201]).toContain(loginResponse.status);
    accessToken = loginResponse.body.data.token;

    const createPatientResponse = await request(app)
      .post("/patients")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: `Paciente Obs Test ${Date.now()}`,
        birth_date: "1998-12-08T00:00:00.000Z",
        gender: "male",
        address: "calle observacion 123",
      });

    expect(createPatientResponse.status).toBe(201);
    patientId = createPatientResponse.body.data.id;
  });

  it("creates, updates and deletes an observation", async () => {
    const createPayload = {
      code: loincCode,
      value: "120",
      date: new Date().toISOString(),
      status: "final",
      category: "vital-signs",
      components: [
        {
          code: loincCode,
          value: 120,
          unit: "mmHg",
        },
      ],
    };

    const createResponse = await request(app)
      .post(`/patients/${patientId}/observations`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body?.error).toBe(false);
    expect(createResponse.body?.data?.id).toBeDefined();

    observationId = createResponse.body.data.id;

    const updatePayload = {
      ...createPayload,
      value: "130",
      components: [
        {
          code: loincCode,
          value: 130,
          unit: "mmHg",
        },
      ],
    };

    const updateResponse = await request(app)
      .put(`/observations/${observationId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatePayload);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body?.error).toBe(false);
    expect(updateResponse.body?.data?.id).toBe(observationId);
    expect(updateResponse.body?.data?.value).toBe(updatePayload.value);

    const deleteResponse = await request(app)
      .delete(`/observations/${observationId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body?.error).toBe(false);
    expect(deleteResponse.body?.data?.id).toBe(observationId);

    observationId = undefined;
  });

  afterAll(async () => {
    if (observationId) {
      await request(app)
        .delete(`/observations/${observationId}`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    if (patientId) {
      await request(app)
        .delete(`/patients/${patientId}`)
        .set("Authorization", `Bearer ${accessToken}`);
    }
  });
});
