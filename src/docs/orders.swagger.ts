export const ordersDocs = {
  '/orders': {
    get: {
      tags: ['Orders'],
      summary: 'Get all orders for authenticated user',
      description: 'Returns a paginated list of all orders placed by the user.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: { type: 'integer', example: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of orders per page',
          required: false,
          schema: { type: 'integer', example: 10 }
        }
      ],
      responses: {
        200: {
          description: 'Orders fetched successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Orders found successfully' },
                  orders: { type: 'array', items: { type: 'object' } },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: { type: 'number' },
                      page: { type: 'number' },
                      limit: { type: 'number' },
                      pages: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        },
        404: { description: 'No orders found' },
        401: { description: 'Unauthorized' }
      }
    }
  },

  '/orders/{orderId}': {
    get: {
      tags: ['Orders'],
      summary: 'Get a specific order by ID',
      description: 'Fetches details for a specific order that belongs to the authenticated user.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Order found successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'order found successfully' },
                  order: { type: 'object' }
                }
              }
            }
          }
        },
        404: { description: 'Order not found' }
      }
    }
  },

  '/orders/{orderId}/cancel': {
    post: {
      tags: ['Orders'],
      summary: 'Cancel an order',
      description: 'Allows a user to cancel an order. Stock will be restocked. Only works for orders that are not shipped or delivered.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Order cancelled successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Order cancelled successfully' },
                  order: { type: 'object' }
                }
              }
            }
          }
        },
        400: { description: 'Order is already cancelled or returned' },
        404: { description: 'Order not found' }
      }
    }
  },

  '/orders/{orderId}/return': {
    post: {
      tags: ['Orders'],
      summary: 'Return an order',
      description: 'Allows a user to mark an order as returned. Restocks product quantity. Assumes return process is manual for now.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Order returned successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Order returned successfully' },
                  order: { type: 'object' }
                }
              }
            }
          }
        },
        400: { description: 'Order is already returned' },
        404: { description: 'Order not found' }
      }
    }
  }
};
