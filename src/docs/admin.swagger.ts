export const adminDocs = {
  '/admin/users': {
    get: {
      tags: ['Admin'],
      summary: 'Get all users',
      description: 'Fetch all users with optional search, role filter, and pagination',
      parameters: [
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'consumer'] } },
        { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['name', 'email', 'createdAt'] } },
        { name: 'page', in: 'query', schema: { type: 'string' } },
        { name: 'limit', in: 'query', schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Users fetched successfully' },
        500: { description: 'Server error' }
      }
    }
  },
  '/admin/users/{userId}': {
    get: {
      tags: ['Admin'],
      summary: 'Get single user by ID',
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'User found' },
        404: { description: 'User not found' }
      }
    },
    put: {
      tags: ['Admin'],
      summary: 'Update user role',
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['role'],
              properties: {
                role: { type: 'string', enum: ['admin', 'consumer'], example: 'admin' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'User role updated successfully' },
        404: { description: 'User not found' }
      }
    }
  },
  '/admin/products': {
    post: {
      tags: ['Admin'],
      summary: 'Create new product',
      description: 'Admin can create a product with images',
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' },
                quantity: { type: 'number' },
                images: {
                  type: 'array',
                  items: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Product created successfully' }
      }
    }
  },
  '/admin/products/{productId}': {
    put: {
      tags: ['Admin'],
      summary: 'Update product details',
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Product updated successfully' },
        404: { description: 'Product not found' }
      }
    },
    delete: {
      tags: ['Admin'],
      summary: 'Delete product',
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Product deleted' },
        404: { description: 'Product not found' }
      }
    }
  },
  '/admin/products/{productId}/images': {
    post: {
      tags: ['Admin'],
      summary: 'Add images to product',
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                images: {
                  type: 'array',
                  items: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Images added to product' }
      }
    }
  },
  '/admin/products/{productId}/images/delete': {
    patch: {
      tags: ['Admin'],
      summary: 'Delete specific image from product',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                imageId: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Image deleted' }
      }
    }
  },
  '/admin/products/{productId}/images/default': {
    patch: {
      tags: ['Admin'],
      summary: 'Set default product image',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                imageId: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Default image set' }
      }
    }
  },
  '/admin/orders': {
    get: {
      tags: ['Admin'],
      summary: 'Get all orders with filters',
      parameters: [
        { name: 'status', in: 'query', schema: { type: 'string' } },
        { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
        { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        { name: 'userId', in: 'query', schema: { type: 'string' } },
        { name: 'sortBy', in: 'query', schema: { type: 'string' } },
        { name: 'page', in: 'query', schema: { type: 'string' } },
        { name: 'limit', in: 'query', schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Orders retrieved' }
      }
    }
  },
  '/admin/orders/{orderId}': {
    get: {
      tags: ['Admin'],
      summary: 'Get order by ID',
      parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Order found' },
        404: { description: 'Order not found' }
      }
    },
    put: {
      tags: ['Admin'],
      summary: 'Update order status',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'shipped', 'delivered', 'cancelled']
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Order status updated' }
      }
    }
  },
  '/admin/coupons': {
    get: {
      tags: ['Admin'],
      summary: 'Get all coupons with filters',
      responses: {
        200: { description: 'Coupons retrieved' }
      }
    },
    post: {
      tags: ['Admin'],
      summary: 'Create new coupon',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code', 'discountType', 'discountValue'],
              properties: {
                code: { type: 'string', example: 'SAVE20' },
                discountType: { type: 'string', enum: ['percentage', 'fixed'] },
                discountValue: { type: 'number' },
                usageLimit: { type: 'number' },
                expiresAt: { type: 'string', format: 'date-time' },
                isActive: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Coupon created' }
      }
    }
  },
  '/admin/coupons/{couponIdOrCode}': {
    get: {
      tags: ['Admin'],
      summary: 'Get coupon by ID or code',
      parameters: [{ name: 'couponIdOrCode', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Coupon found' }
      }
    },
    put: {
      tags: ['Admin'],
      summary: 'Update coupon',
      parameters: [{ name: 'couponIdOrCode', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Coupon updated' }
      }
    },
    delete: {
      tags: ['Admin'],
      summary: 'Delete coupon',
      parameters: [{ name: 'couponIdOrCode', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Coupon deleted' }
      }
    }
  },
  '/admin/statistics': {
    get: {
      tags: ['Admin'],
      summary: 'Get dashboard statistics',
      description: 'Return total counts for users, products, orders, and coupons',
      responses: {
        200: { description: 'Statistics retrieved' }
      }
    }
  }
};
