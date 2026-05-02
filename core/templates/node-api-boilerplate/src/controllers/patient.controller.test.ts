import request from "supertest";
import app from "../app";

describe("Patient integration flow", () => {
  let accessToken = "";
  let createdPatientId: string | number | undefined;

  const testUser = {
    name: "Integration Test User",
    email: `integration_${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect([200, 201]).toContain(registerResponse.status);

    const loginResponse = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect([200, 201]).toContain(loginResponse.status);
    expect(loginResponse.body?.data?.token).toBeTruthy();

    accessToken = loginResponse.body.data.token;
  });

  it("creates, updates and deletes a patient", async () => {
    const createdPatient = {
      name: `Paciente Test ${Date.now()}`,
      birth_date: "1998-12-08T00:00:00.000Z",
      gender: "male",
      address: "calle test 123",
    };

    const createResponse = await request(app)
      .post("/patients")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(createdPatient);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body?.error).toBe(false);
    expect(createResponse.body?.data?.id).toBeDefined();
    expect(createResponse.body?.data?.name).toBe(createdPatient.name);

    createdPatientId = createResponse.body.data.id;

    const updatedPatient = {
      ...createdPatient,
      name: `${createdPatient.name} editado`,
      address: "calle editada 456",
    };

    const updateResponse = await request(app)
      .put(`/patients/${createdPatientId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPatient);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body?.error).toBe(false);
    expect(updateResponse.body?.data?.id).toBe(createdPatientId);
    expect(updateResponse.body?.data?.name).toBe(updatedPatient.name);
    expect(updateResponse.body?.data?.address).toBe(updatedPatient.address);

    const deleteResponse = await request(app)
      .delete(`/patients/${createdPatientId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body?.error).toBe(false);
    expect(deleteResponse.body?.data).toBe(true);

    createdPatientId = undefined;
  });

  afterAll(async () => {
    if (!createdPatientId) return;

    await request(app)
      .delete(`/patients/${createdPatientId}`)
      .set("Authorization", `Bearer ${accessToken}`);
  });
});
