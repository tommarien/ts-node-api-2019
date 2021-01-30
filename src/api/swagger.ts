import UserReqBodyV1 from './schemas/src/user.request.body.v1.json';

export default {
  openapi: '3.0.0',
  info: {
    title: 'TypeScript ',
    description: 'An example setup using express, mongoose, typescript',
    version: '1.0.0',
    contact: {
      name: 'Tom Marien',
      email: 'tommarien@gmail.com',
    },
  },
  tags: [
    {
      name: 'Users',
      description: 'User Management',
    },
  ],
  servers: [
    {
      url: '/api',
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  paths: {
    '/v1/users': {
      post: {
        operationId: 'postUserV1',
        tags: ['Users'],
        description: 'Create a new user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserReqBodyV1',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'OK',
            headers: {
              'x-request-id': {
                $ref: '#/components/headers/RequestId',
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResourceV1',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
        },
      },
    },
    '/v1/users/{id}': {
      get: {
        operationId: 'getUserV1',
        tags: ['Users'],
        description: 'Find a user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The id of the user to return',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            headers: {
              'x-request-id': {
                $ref: '#/components/headers/RequestId',
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResourceV1',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      put: {
        operationId: 'putUserV1',
        tags: ['Users'],
        description: 'Update a user',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The id of the user to update',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserReqBodyV1',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'OK',
            headers: {
              'x-request-id': {
                $ref: '#/components/headers/RequestId',
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResourceV1',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      delete: {
        operationId: 'deleteUserV1',
        tags: ['Users'],
        description: 'Remove a user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The id of the user to remove',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '204': {
            description: 'No Content',
            headers: {
              'x-request-id': {
                $ref: '#/components/headers/RequestId',
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
    },
  },
  components: {
    headers: {
      RequestId: {
        description: 'The requestId to correlate between servers / client.',
        schema: {
          type: 'string',
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Error: Bad Request',
        headers: {
          'x-request-id': {
            $ref: '#/components/headers/RequestId',
          },
        },
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/StatusError',
            },
            example: {
              statusCode: 400,
              error: 'Bad Request',
              message: "Request validation failed: body should have required property 'firstName'",
            },
          },
        },
      },
      Unauthorized: {
        description: 'Error: Unauthorized',
        headers: {
          'x-request-id': {
            $ref: '#/components/headers/RequestId',
          },
        },
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/StatusError',
            },
            example: {
              statusCode: 401,
              error: 'Unauthorized',
              message: 'Unauthorized',
            },
          },
        },
      },
      NotFound: {
        description: 'Error: NotFound',
        headers: {
          'x-request-id': {
            $ref: '#/components/headers/RequestId',
          },
        },
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/StatusError',
            },
            example: {
              statusCode: 404,
              error: 'NotFound',
              message: 'NotFound',
            },
          },
        },
      },
    },
    schemas: {
      StatusError: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        required: ['statusCode', 'error'],
      },
      UserReqBodyV1,
      UserResourceV1: {
        allOf: [
          {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
              },
            },
            required: ['id'],
          },
          {
            $ref: '#/components/schemas/UserReqBodyV1',
          },
        ],
      },
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
  },
};
