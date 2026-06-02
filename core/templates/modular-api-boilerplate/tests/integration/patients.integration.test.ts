import request from 'supertest';

import { app } from '../../src/app';

describe('Integracion patients compatible', () => {
  let accessToken = '';
  let patientId = '';

  beforeAll(async () => {
    const user = {
      name: 'Integration Patient User',
      email: `patient_${Date.now()}@example.com`,
      password: '12345678',
    };

    await request(app).post('/auth/register').send(user);
    const loginResponse = await request(app).post('/auth/login').send({
      email: user.email,
      password: user.password,
    });
    accessToken = loginResponse.body.data.token;
  });

  it('crea, lista, lee, actualiza y elimina pacientes', async () => {
    const createResponse = await request(app)
      .post('/patients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: `Paciente Test ${Date.now()}`,
        birth_date: '1998-12-08T00:00:00.000Z',
        gender: 'male',
        address: 'calle test 123',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body?.error).toBe(false);
    patientId = createResponse.body.data.id;

    const listResponse = await request(app)
      .get('/patients')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.some((patient: { id: string }) => patient.id === patientId)).toBe(
      true,
    );

    const detailResponse = await request(app)
      .get(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.data.id).toBe(patientId);

    const updateResponse = await request(app)
      .put(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Paciente editado',
        birth_date: '1998-12-08T00:00:00.000Z',
        gender: 'male',
        address: 'calle editada 456',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.id).toBe(patientId);
    expect(updateResponse.body.data.name).toBe('Paciente editado');

    const deleteResponse = await request(app)
      .delete(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data).toBe(true);
    patientId = '';
  });

  it('rechaza requests sin token', async () => {
    const response = await request(app).get('/patients');

    expect(response.status).toBe(401);
    expect(response.body?.error).toBe('UnauthorizedError');
  });

  afterAll(async () => {
    if (!patientId) return;

    await request(app).delete(`/patients/${patientId}`).set('Authorization', `Bearer ${accessToken}`);
  });
});
