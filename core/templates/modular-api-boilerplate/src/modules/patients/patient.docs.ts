const bearerSecurity = [{ bearerAuth: [] }];

export const patientPaths = {
  '/patients': {
    get: {
      tags: ['Patients'],
      summary: 'Listado de pacientes',
      security: bearerSecurity,
      responses: {
        200: {
          description: 'Pacientes encontrados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientListCompatResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    post: {
      tags: ['Patients'],
      summary: 'Creacion de paciente',
      security: bearerSecurity,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PatientRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Paciente creado correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientCompatResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/patients/{id}': {
    get: {
      tags: ['Patients'],
      summary: 'Detalle de paciente',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/PatientId' }],
      responses: {
        200: {
          description: 'Paciente encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientCompatResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    put: {
      tags: ['Patients'],
      summary: 'Edicion de paciente',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/PatientId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PatientRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Paciente actualizado correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientCompatResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    delete: {
      tags: ['Patients'],
      summary: 'Eliminacion de paciente',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/PatientId' }],
      responses: {
        200: {
          description: 'Paciente eliminado correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DeletePatientCompatResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};

export const patientParameters = {
  PatientId: {
    in: 'path',
    name: 'id',
    required: true,
    schema: { type: 'string' },
    example: 'f7a8a962-2e6d-42a1-bafb-90ea470ce675',
  },
};

export const patientSchemas = {
  PatientRequest: {
    type: 'object',
    required: ['name', 'birth_date', 'gender'],
    properties: {
      name: { type: 'string', example: 'Paciente Test' },
      birth_date: { type: 'string', format: 'date-time', example: '1998-12-08T00:00:00.000Z' },
      gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
      address: { type: 'string', example: 'calle test 123' },
    },
  },
  Patient: {
    allOf: [
      { $ref: '#/components/schemas/PatientRequest' },
      {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'f7a8a962-2e6d-42a1-bafb-90ea470ce675' },
        },
      },
    ],
  },
  PatientCompatResponse: {
    type: 'object',
    properties: {
      data: { $ref: '#/components/schemas/Patient' },
      error: { type: 'boolean', example: false },
    },
  },
  PatientListCompatResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Patient' },
      },
      error: { type: 'boolean', example: false },
    },
  },
  DeletePatientCompatResponse: {
    type: 'object',
    properties: {
      data: { type: 'boolean', example: true },
      error: { type: 'boolean', example: false },
    },
  },
};
