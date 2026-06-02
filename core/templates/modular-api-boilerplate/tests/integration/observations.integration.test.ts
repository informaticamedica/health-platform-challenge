import request from 'supertest';

import { app } from '../../src/app';

describe('Integracion observations compatible', () => {
  let accessToken = '';
  let patientId = '';
  let observationId = '';

  beforeAll(async () => {
    const user = {
      name: 'Integration Observation User',
      email: `observation_${Date.now()}@example.com`,
      password: '12345678',
    };

    await request(app).post('/auth/register').send(user);
    const loginResponse = await request(app).post('/auth/login').send({
      email: user.email,
      password: user.password,
    });
    accessToken = loginResponse.body.data.token;

    const createPatientResponse = await request(app)
      .post('/patients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: `Paciente Obs ${Date.now()}`,
        birth_date: '1998-12-08T00:00:00.000Z',
        gender: 'male',
        address: 'calle obs 123',
      });
    patientId = createPatientResponse.body.data.id;
  });

  it('crea, lista, actualiza, expone FHIR y elimina observaciones', async () => {
    const createResponse = await request(app)
      .post(`/patients/${patientId}/observations`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        code: '8480-6',
        value: '120',
        date: new Date().toISOString(),
        status: 'final',
        category: 'vital-signs',
        components: [{ code: '8480-6', value: 120, unit: 'mmHg' }],
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body?.error).toBe(false);
    observationId = createResponse.body.data.id;

    const readResponse = await request(app)
      .get(`/patients/${patientId}/observations`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(readResponse.status).toBe(200);
    expect(Array.isArray(readResponse.body.data.observations)).toBe(true);
    expect(
      readResponse.body.data.observations.some(
        (observation: { id: string }) => observation.id === observationId,
      ),
    ).toBe(true);

    const updateResponse = await request(app)
      .put(`/observations/${observationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        code: '8480-6',
        value: '130',
        date: new Date().toISOString(),
        status: 'final',
        category: 'vital-signs',
        components: [{ code: '8480-6', value: 130, unit: 'mmHg' }],
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.id).toBe(observationId);
    expect(updateResponse.body.data.value).toBe('130');

    const fhirResponse = await request(app)
      .get(`/observations/${observationId}/fhir`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(fhirResponse.status).toBe(200);
    expect(fhirResponse.body.data.resourceType).toBe('Observation');

    const deleteResponse = await request(app)
      .delete(`/observations/${observationId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.id).toBe(observationId);
    observationId = '';
  });

  it('lista categorias y sugerencias LOINC', async () => {
    const categoriesResponse = await request(app)
      .get('/observations/categories')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(categoriesResponse.status).toBe(200);
    expect(Array.isArray(categoriesResponse.body.data)).toBe(true);

    const loincResponse = await request(app)
      .get('/observations/loinc?query=blood&limit=2')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(loincResponse.status).toBe(200);
    expect(loincResponse.body.data.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    if (observationId) {
      await request(app)
        .delete(`/observations/${observationId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }

    if (patientId) {
      await request(app).delete(`/patients/${patientId}`).set('Authorization', `Bearer ${accessToken}`);
    }
  });
});
