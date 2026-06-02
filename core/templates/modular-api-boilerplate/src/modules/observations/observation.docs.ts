const bearerSecurity = [{ bearerAuth: [] }];

export const observationPaths = {
  '/patients/{id}/observations': {
    get: {
      tags: ['Observations'],
      summary: 'Listado de observaciones de un paciente',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/PatientId' }],
      responses: {
        200: {
          description: 'Observaciones encontradas',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientObservationsCompatResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    post: {
      tags: ['Observations'],
      summary: 'Creacion de observacion para un paciente',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/PatientId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ObservationRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Observacion creada correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ObservationCompatResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/observations/categories': {
    get: {
      tags: ['Observations'],
      summary: 'Categorias de observacion',
      security: bearerSecurity,
      responses: {
        200: {
          description: 'Categorias disponibles',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ObservationCategoriesCompatResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/observations/loinc': {
    get: {
      tags: ['Observations'],
      summary: 'Sugerencias LOINC',
      security: bearerSecurity,
      parameters: [
        {
          in: 'query',
          name: 'query',
          required: false,
          schema: { type: 'string' },
          example: 'blood',
        },
        {
          in: 'query',
          name: 'limit',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
          example: 2,
        },
      ],
      responses: {
        200: {
          description: 'Sugerencias disponibles',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoincSuggestionsCompatResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/observations/{id}/fhir': {
    get: {
      tags: ['Observations'],
      summary: 'Observacion en formato FHIR',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/ObservationId' }],
      responses: {
        200: {
          description: 'Observacion FHIR',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FhirObservationCompatResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/observations/{id}': {
    put: {
      tags: ['Observations'],
      summary: 'Edicion de observacion',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/ObservationId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ObservationRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Observacion actualizada correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ObservationCompatResponse' },
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
      tags: ['Observations'],
      summary: 'Eliminacion de observacion',
      security: bearerSecurity,
      parameters: [{ $ref: '#/components/parameters/ObservationId' }],
      responses: {
        200: {
          description: 'Observacion eliminada correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ObservationCompatResponse' },
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

export const observationParameters = {
  ObservationId: {
    in: 'path',
    name: 'id',
    required: true,
    schema: { type: 'string' },
    example: 'a5d3d562-64ef-4688-8c9e-418266f5fc0c',
  },
};

export const observationSchemas = {
  ObservationComponent: {
    type: 'object',
    required: ['code', 'value', 'unit'],
    properties: {
      code: { type: 'string', example: '8480-6' },
      value: { type: 'number', example: 120 },
      unit: { type: 'string', example: 'mmHg' },
    },
  },
  ObservationRequest: {
    type: 'object',
    required: ['code', 'value', 'date', 'category'],
    properties: {
      code: { type: 'string', example: '8480-6' },
      value: { oneOf: [{ type: 'string' }, { type: 'number' }], example: '120' },
      date: { type: 'string', format: 'date-time', example: '2026-06-01T12:00:00.000Z' },
      status: { type: 'string', enum: ['final', 'preliminary', ''], default: 'final' },
      category: {
        type: 'string',
        enum: ['social-history', 'vital-signs', 'imaging', 'laboratory', 'procedure', 'survey', 'exam', 'therapy', 'activity'],
        example: 'vital-signs',
      },
      components: {
        type: 'array',
        items: { $ref: '#/components/schemas/ObservationComponent' },
      },
    },
  },
  Observation: {
    allOf: [
      { $ref: '#/components/schemas/ObservationRequest' },
      {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a5d3d562-64ef-4688-8c9e-418266f5fc0c' },
          patient_id: { type: 'string', format: 'uuid', example: 'f7a8a962-2e6d-42a1-bafb-90ea470ce675' },
          user_id: { type: 'string', format: 'uuid', example: '8f03db67-0e0e-41cb-9566-a6257f318e6a' },
        },
      },
    ],
  },
  ObservationCompatResponse: {
    type: 'object',
    properties: {
      data: { $ref: '#/components/schemas/Observation' },
      error: { type: 'boolean', example: false },
    },
  },
  PatientObservationsCompatResponse: {
    type: 'object',
    properties: {
      data: {
        allOf: [
          { $ref: '#/components/schemas/Patient' },
          {
            type: 'object',
            properties: {
              observations: {
                type: 'array',
                items: { $ref: '#/components/schemas/Observation' },
              },
            },
          },
        ],
      },
      error: { type: 'boolean', example: false },
    },
  },
  ObservationCategory: {
    type: 'object',
    properties: {
      code: { type: 'string', example: 'vital-signs' },
      display: { type: 'string', example: 'vital-signs' },
      definition: { type: 'string', example: 'vital-signs' },
    },
  },
  ObservationCategoriesCompatResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/ObservationCategory' },
      },
      error: { type: 'boolean', example: false },
    },
  },
  LoincSuggestion: {
    type: 'object',
    properties: {
      code: { type: 'string', example: '8480-6' },
      display: { type: 'string', example: 'Systolic blood pressure' },
    },
  },
  LoincSuggestionsCompatResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/LoincSuggestion' },
      },
      error: { type: 'boolean', example: false },
    },
  },
  FhirObservationCompatResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          resourceType: { type: 'string', example: 'Observation' },
          id: { type: 'string', example: 'a5d3d562-64ef-4688-8c9e-418266f5fc0c' },
          status: { type: 'string', example: 'final' },
        },
      },
      error: { type: 'boolean', example: false },
    },
  },
};
