export const cartDocs = {
  '/cart/add': {
    post: {
      tags: ['Cart'],
      summary: 'Add item to cart',
      description: 'Adds a product to the authenticated customer’s cart or updates the quantity if it already exists.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'string', example: '605c39f8709eab0015c3e5df' },
                quantity: { type: 'number', example: 2 }
              }
            }
          }
        }
      },
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Item added to cart successfully'
        },
        404: { description: 'Product not found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/cart': {
    get: {
      tags: ['Cart'],
      summary: 'Get cart',
      description: 'Retrieves the current authenticated customer’s cart with full product details.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Cart retrieved successfully'
        },
        404: { description: 'Cart not found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/cart/remove/{productId}': {
    delete: {
      tags: ['Cart'],
      summary: 'Remove item from cart',
      description: 'Removes a specific product from the customer’s cart.',
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Item removed from cart successfully'
        },
        404: { description: 'Cart or item not found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/cart/update/{productId}': {
    put: {
      tags: ['Cart'],
      summary: 'Update item quantity',
      description: 'Updates the quantity of a product already in the cart.',
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
              required: ['quantity'],
              properties: {
                quantity: { type: 'number', example: 3 }
              }
            }
          }
        }
      },
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Cart item quantity updated successfully' },
        404: { description: 'Cart or item not found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/cart/clear': {
    delete: {
      tags: ['Cart'],
      summary: 'Clear cart',
      description: 'Removes all items from the customer’s cart.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Cart cleared successfully' },
        404: { description: 'Cart not found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/cart/checkout': {
    post: {
      tags: ['Cart'],
      summary: 'Checkout the current cart',
      description: 'Creates a new order using the cart contents. Applies a coupon (if valid) and uses the selected shipping address.',
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['addressId'],
              properties: {
                addressId: {
                  type: 'string',
                  example: '660d8b7a8c1f2c2a5e9f442a'
                },
                coupon: {
                  type: 'string',
                  example: 'WELCOME10',
                  description: 'Optional coupon code to apply discount'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Checkout completed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Checkout successful'
                  },
                  order: {
                    type: 'object',
                    description: 'The newly created order object'
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Cart is empty or coupon invalid'
        },
        401: {
          description: 'Unauthorized'
        },
        404: {
          description: 'Cart not found or Address not found'
        },
        500: {
          description: 'Internal server error'
        }
      }
    }
  }
};
