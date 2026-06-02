export const authPaths = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Registro de usuario',
      description: 'Registra un usuario y devuelve los datos creados con el contrato compatible.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Usuario registrado correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserCompatResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Inicio de sesion',
      description: 'Valida credenciales y devuelve un token Bearer compatible.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Sesion iniciada correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginCompatResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};

export const authSchemas = {
  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', example: 'Integration Auth User' },
      email: { type: 'string', format: 'email', example: 'auth@example.com' },
      password: { type: 'string', example: '12345678' },
    },
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'auth@example.com' },
      password: { type: 'string', example: '12345678' },
    },
  },
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', example: 'f7a8a962-2e6d-42a1-bafb-90ea470ce675' },
      name: { type: 'string', example: 'Integration Auth User' },
      email: { type: 'string', format: 'email', example: 'auth@example.com' },
      password: { type: 'string', example: '12345678' },
    },
  },
  UserCompatResponse: {
    type: 'object',
    properties: {
      data: { $ref: '#/components/schemas/User' },
      error: { type: 'boolean', example: false },
    },
  },
  LoginCompatResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          token: { type: 'string', format: 'uuid', example: '6ffc4fc3-a93f-408b-9a39-7aeef9629b4a' },
        },
      },
      error: { type: 'boolean', example: false },
    },
  },
};
