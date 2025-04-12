export const productDocs = {
  '/products': {
    get: {
      tags: ['Products'],
      summary: 'Get all products',
      description: 'Retrieve a paginated list of all products.',
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'string' }, required: false },
        { in: 'query', name: 'limit', schema: { type: 'string' }, required: false }
      ],
      responses: {
        200: { description: 'Products retrieved successfully' }
      }
    }
  },

  '/products/search': {
    get: {
      tags: ['Products'],
      summary: 'Search products',
      description: 'Search for products by name or description.',
      parameters: [
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'page', schema: { type: 'string' }, required: false },
        { in: 'query', name: 'limit', schema: { type: 'string' }, required: false }
      ],
      responses: {
        200: { description: 'Search results returned successfully' }
      }
    }
  },

  '/products/top-rated': {
    get: {
      tags: ['Products'],
      summary: 'Top rated products',
      description: 'Retrieve top-rated products based on user reviews.',
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'string' }, required: false },
        { in: 'query', name: 'limit', schema: { type: 'string' }, required: false }
      ],
      responses: {
        200: { description: 'Top-rated products retrieved successfully' }
      }
    }
  },

  '/products/{productId}': {
    get: {
      tags: ['Products'],
      summary: 'Get single product',
      description: 'Retrieve product by ID.',
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Product retrieved successfully' },
        404: { description: 'Product not found' }
      }
    }
  },

  '/products/{productId}/review': {
    post: {
      tags: ['Products'],
      summary: 'Submit or update product review',
      description: 'Authenticated users can submit or update a product review.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['rating'],
              properties: {
                rating: { type: 'number', example: 4 },
                comment: { type: 'string', example: 'Great product!' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Review submitted successfully' },
        401: { description: 'Unauthorized' }
      }
    }
  }
};
