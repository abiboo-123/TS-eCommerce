import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from '../config/swagger';
import { Express } from 'express';

export const setupSwaggerDocs = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
  console.log('Swagger docs available at http://localhost:5000/api-docs');
};
