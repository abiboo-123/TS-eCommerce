import { authDocs } from '../docs/auth.swagger';
import { profileDocs } from '../docs/profile.swagger';
import { productDocs } from '../docs/product.swagger';
import { cartDocs } from '../docs/cart.swagger';
import { ordersDocs } from '../docs/orders.swagger';
import { adminDocs } from '../docs/admin.swagger';

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
    ...authDocs,
    ...profileDocs,
    ...productDocs,
    ...cartDocs,
    ...ordersDocs,
    ...adminDocs
  }
};
