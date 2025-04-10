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
  },

  '/admin/products': {
    post: {
      tags: ['Admin Products'],
      summary: 'Create product',
      description: 'Admin-only route to create a product.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['name', 'description', 'price', 'category', 'quantity'],
              properties: {
                name: { type: 'string', example: 'Product 1' },
                description: { type: 'string', example: 'Some product' },
                price: { type: 'number', example: 49.99 },
                category: { type: 'string', example: 'electronics' },
                quantity: { type: 'number', example: 50 },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Product created successfully' },
        401: { description: 'Unauthorized' }
      }
    }
  },

  '/admin/products/{productId}': {
    put: {
      tags: ['Admin Products'],
      summary: 'Update product',
      description: 'Admin-only route to update a product.',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' },
                quantity: { type: 'number' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Product updated successfully' }
      }
    },
    delete: {
      tags: ['Admin Products'],
      summary: 'Delete product',
      description: 'Admin-only route to delete a product.',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Product deleted successfully' }
      }
    }
  },

  '/admin/products/{productId}/images': {
    post: {
      tags: ['Admin Products'],
      summary: 'Add product images',
      description: 'Admin-only route to add images to an existing product.',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Images added successfully' }
      }
    },
    delete: {
      tags: ['Admin Products'],
      summary: 'Delete product image',
      description: 'Deletes a product image by its ID.',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                imageId: { type: 'string', example: '654ab8...' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Image deleted successfully' }
      }
    },
    put: {
      tags: ['Admin Products'],
      summary: 'Set default product image',
      description: 'Sets a default image for the product.',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                imageId: { type: 'string', example: '654ab8...' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Default image updated successfully' }
      }
    }
  }
};
