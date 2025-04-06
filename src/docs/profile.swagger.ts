export const profileDocs = {
  '/profiles': {
    post: {
      tags: ['Profile'],
      summary: 'Create user profile',
      description: 'Creates a profile for the authenticated user (consumer only).',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['phoneNumber'],
              properties: {
                phoneNumber: { type: 'string', example: '+201234567890' },
                photo: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Profile created successfully'
        },
        400: {
          description: 'Profile already exists'
        },
        401: {
          description: 'Unauthorized or token missing'
        }
      }
    },
    get: {
      tags: ['Profile'],
      summary: 'Get user profile',
      description: "Retrieves the current authenticated user's profile.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Profile retrieved successfully'
        },
        401: {
          description: 'Unauthorized'
        }
      }
    },
    put: {
      tags: ['Profile'],
      summary: 'Update user profile',
      description: "Updates the authenticated user's profile.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Updated Name' },
                phoneNumber: { type: 'string', example: '+201111111111' },
                removeProfileImage: { type: 'boolean', example: true },
                photo: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Profile updated successfully' },
        401: { description: 'Unauthorized' }
      }
    }
  },

  '/profiles/addresses': {
    post: {
      tags: ['Addresses'],
      summary: 'Add a new address',
      description: 'Adds a new address to the user profile.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['street', 'postalCode', 'isDefault'],
              properties: {
                street: { type: 'string', example: '12 El Tahrir St.' },
                houseNumber: { type: 'number', example: 10 },
                postalCode: { type: 'number', example: 11311 },
                isDefault: { type: 'boolean', example: true }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Address added successfully' },
        400: { description: 'Validation error' }
      }
    },
    get: {
      tags: ['Addresses'],
      summary: 'Get all addresses',
      description: 'Retrieves all saved addresses of the authenticated user.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of addresses'
        },
        401: { description: 'Unauthorized' }
      }
    }
  },

  '/profiles/addresses/{addressId}': {
    put: {
      tags: ['Addresses'],
      summary: 'Update address',
      description: 'Updates a specific address by ID.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'addressId',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Updated Street' },
                houseNumber: { type: 'number', example: 5 },
                postalCode: { type: 'number', example: 44500 },
                isDefault: { type: 'boolean', example: false }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Address updated successfully' },
        404: { description: 'Address or user not found' }
      }
    },
    delete: {
      tags: ['Addresses'],
      summary: 'Delete address',
      description: 'Deletes an address by ID.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'addressId',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        200: { description: 'Address deleted successfully' },
        404: { description: 'Address or user not found' }
      }
    }
  }
};
