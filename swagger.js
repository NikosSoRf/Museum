const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Museum Catalog API',
      version: '1.0.0',
      description: 'API for managing museum exhibits catalog',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      schemas: {
        Exhibit: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Mona Lisa'
            },
            description: {
              type: 'string',
              example: 'Famous portrait painting by Leonardo da Vinci'
            },
            creationDate: {
              type: 'string',
              format: 'date',
              example: '1503-01-01'
            },
            author: {
              type: 'string',
              example: 'Leonardo da Vinci'
            },
            collectionType: {
              type: 'string',
              enum: ['painting', 'sculpture', 'artifact', 'document', 'other'],
              example: 'painting'
            },
            location: {
              type: 'string',
              example: 'Room 1, Section A'
            },
            isOnDisplay: {
              type: 'boolean',
              example: true
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;