import jwt from 'jsonwebtoken';
import request from 'supertest';

import { app } from '../../src/app';

describe('Integracion auth compatible', () => {
  const user = {
    name: 'Integration Auth User',
    email: `auth_${Date.now()}@example.com`,
    password: '12345678',
  };

  it('POST /auth/register y POST /auth/login registran e inician sesion', async () => {
    const registerResponse = await request(app).post('/auth/register').send(user);

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body?.error).toBe(false);
    expect(registerResponse.body?.data?.id).toBeTruthy();

    const loginResponse = await request(app).post('/auth/login').send({
      email: user.email,
      password: user.password,
    });

    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body?.error).toBe(false);
    expect(loginResponse.body?.data?.token).toBeTruthy();
    expect(jwt.verify(loginResponse.body.data.token, process.env.JWT_SECRET || 'secret')).toMatchObject({
      id: registerResponse.body.data.id,
    });
  });

  it('POST /auth/login rechaza credenciales invalidas', async () => {
    const response = await request(app).post('/auth/login').send({
      email: user.email,
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body?.error).toBe('UnauthorizedError');
  });
});
