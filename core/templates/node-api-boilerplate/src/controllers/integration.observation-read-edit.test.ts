import request from "supertest";
import app from "../app";
import { closeDb, resetDbSchema } from "../test-utils/db-setup";
import { loadLoincCodes, loadLoincCsvToArray } from "../utils/loincLoader";

describe("Integration - observation read/edit", () => {
  let accessToken = "";
  let patientId = "";
  let observationId = "";
  let loincCode = "8480-6";

  const user = {
    name: "Integration Observation User",
    email: `observation_${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    await resetDbSchema();
    await loadLoincCodes("src/db/csv/Loinc.csv");
    const loincRows = await loadLoincCsvToArray("src/db/csv/Loinc.csv");
    loincCode = loincRows[0]?.LOINC_NUM ?? "8480-6";

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
        name: `Paciente Obs ${Date.now()}`,
        birth_date: "1998-12-08T00:00:00.000Z",
        gender: "male",
        address: "calle obs 123",
      });

    patientId = createPatientResponse.body.data.id;
  });

  it("reads and edits an observation", async () => {
    const createResponse = await request(app)
      .post(`/patients/${patientId}/observations`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
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
      });

    expect(createResponse.status).toBe(201);
    observationId = createResponse.body.data.id;

    const readResponse = await request(app)
      .get(`/patients/${patientId}/observations`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(readResponse.status).toBe(200);
    expect(readResponse.body?.error).toBe(false);
    expect(Array.isArray(readResponse.body?.data?.observations)).toBe(true);
    expect(
      readResponse.body.data.observations.some(
        (o: { id: string }) => o.id === observationId
      )
    ).toBe(true);

    const updateResponse = await request(app)
      .put(`/observations/${observationId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        code: loincCode,
        value: "130",
        date: new Date().toISOString(),
        status: "final",
        category: "vital-signs",
        components: [
          {
            code: loincCode,
            value: 130,
            unit: "mmHg",
          },
        ],
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body?.data?.id).toBe(observationId);
    expect(updateResponse.body?.data?.value).toBe("130");
  });

  afterAll(async () => {
    await closeDb();
  });
});
