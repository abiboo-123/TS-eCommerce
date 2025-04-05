import { authDocs } from '../docs/auth.swagger';

export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'eCommerce API',
    version: '1.0.0',
    description: 'API documentation for the eCommerce backend project'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [],
  paths: {
    ...authDocs
  }
};
