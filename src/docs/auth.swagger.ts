export const authDocs = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description: 'Creates a new user account and returns access and refresh tokens.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password', 'role'],
              properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', format: 'email', example: 'john@example.com' },
                password: { type: 'string', format: 'password', example: 'StrongPass123' },
                role: { type: 'string', enum: ['consumer', 'business'], example: 'consumer' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'User registered successfully' },
                  accessToken: { type: 'string', example: 'access_jwt_token_here' },
                  refreshToken: { type: 'string', example: 'refresh_jwt_token_here' }
                }
              }
            }
          }
        },
        400: { description: 'User already exists' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login a user',
      description: 'Authenticates a user and returns new access and refresh tokens.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email', example: 'john@example.com' },
                password: { type: 'string', format: 'password', example: 'StrongPass123' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Login successful' },
                  accessToken: { type: 'string', example: 'access_jwt_token_here' },
                  refreshToken: { type: 'string', example: 'refresh_jwt_token_here' }
                }
              }
            }
          }
        },
        401: { description: 'Invalid email or password' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/auth/refresh-token': {
    get: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      description: 'Uses a valid refresh token sent in the Authorization header to issue a new access token.',
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'Access token refreshed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Access token refreshed successfully' },
                  accessToken: { type: 'string', example: 'new_access_jwt_token_here' }
                }
              }
            }
          }
        },
        400: {
          description: 'Refresh token is required'
        },
        401: {
          description: 'Invalid or expired refresh token'
        },
        500: {
          description: 'Internal server error'
        }
      }
    }
  },
  '/auth/forget-password': {
    post: {
      tags: ['Auth'],
      summary: 'Request password reset',
      description: "Sends a 6-digit OTP to the user's email if the account exists. The OTP is valid for 1 hour.",
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'OTP sent successfully (or logged to console for development)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'OTP sent successfully' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid email'
        },
        500: {
          description: 'Internal server error'
        }
      }
    }
  },
  '/auth/reset-password': {
    post: {
      tags: ['Auth'],
      summary: 'Reset password using OTP',
      description: 'Allows a user to reset their password using a valid OTP sent to their email. The OTP must not be expired.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'otp', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com'
                },
                otp: {
                  type: 'string',
                  example: '492361'
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'NewStrongPassword123'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Password reset successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Password reset successfully' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid email, OTP, or expired OTP'
        },
        500: {
          description: 'Internal server error'
        }
      }
    }
  },
  '/auth/change-password': {
    put: {
      tags: ['Auth'],
      summary: 'Change password for authenticated user',
      description: 'Allows an authenticated user to change their password. Requires a valid access token and a new password.',
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
              required: ['password'],
              properties: {
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'NewSecurePassword123'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Password changed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Password changed successfully' }
                }
              }
            }
          }
        },
        401: { description: 'User not found or unauthorized' },
        500: { description: 'Internal server error' }
      }
    }
  }
};
