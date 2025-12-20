import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Tools Rental API',
    version: '1.0.0',
    description: 'API documentation for Fullstack Project',
    contact: {
      name: 'API Support',
      email: 'support@toolsbackend.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://toolsbackend-zzml.onrender.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description:
          'Authentication using HTTP-only cookies. Token is set automatically after login.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          _id: {
            type: 'string',
            description: 'User unique identifier',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'User full name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address (must be unique)',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password (hashed in database)',
            example: 'SecurePass123',
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL to user avatar image',
            example: 'https://example.com/avatars/user123.jpg',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      Tool: {
        type: 'object',
        required: [
          'owner',
          'category',
          'name',
          'description',
          'pricePerDay',
          'images',
        ],
        properties: {
          _id: {
            type: 'string',
            description: 'Tool unique identifier',
            example: '507f1f77bcf86cd799439012',
          },
          owner: {
            type: 'string',
            description: 'User ID of tool owner',
            example: '507f1f77bcf86cd799439011',
          },

          category: {
            type: 'string',
            description: 'Category ID',
            example: '507f1f77bcf86cd799439013',
          },
          name: {
            type: 'string',
            description: 'Tool name',
            example: 'Electric Drill XYZ-2000',
          },
          description: {
            type: 'string',
            description: 'Detailed tool description',
            example:
              'Professional electric drill with 800W motor, suitable for various materials',
          },
          pricePerDay: {
            type: 'number',
            minimum: 0,
            description: 'Rental price per day (in currency units)',
            example: 150,
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uri',
            },
            minItems: 1,
            maxItems: 5,
            description:
              'Array of tool image URLs from Cloudinary (1-5 images)',
            example: [
              'https://res.cloudinary.com/demo/image/upload/v1640000000/tools-rental/drill-1.jpg',
              'https://res.cloudinary.com/demo/image/upload/v1640000001/tools-rental/drill-2.jpg',
            ],
          },
          rating: {
            type: 'number',
            minimum: 0,
            maximum: 5,
            default: 0,
            description: 'Tool rating from 0 to 5',
            example: 4.5,
          },
          specifications: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            description: 'Key-value pairs of tool specifications',
            example: {
              power: '800W',
              weight: '2.5kg',
              maxDrillDiameter: '13mm',
            },
          },
          rentalTerms: {
            type: 'string',
            description: 'Rental terms and conditions',
            example: 'Minimum rental period: 1 day. Deposit required: 500 UAH',
          },
          bookedDates: {
            type: 'array',
            description: 'Array of booked date ranges',
            items: {
              type: 'object',
              properties: {
                from: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Start date of booking',
                },
                to: {
                  type: 'string',
                  format: 'date-time',
                  description: 'End date of booking',
                },
              },
            },
          },
          feedbacks: {
            type: 'array',
            description: 'Array of feedback IDs',
            items: {
              type: 'string',
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Tool creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      Booking: {
        type: 'object',
        required: [
          'toolId',
          'userId',
          'firstName',
          'lastName',
          'phone',
          'startDate',
          'endDate',
          'totalPrice',
          'deliveryCity',
          'deliveryBranch',
        ],
        properties: {
          _id: {
            type: 'string',
            description: 'Booking unique identifier',
            example: '507f1f77bcf86cd799439014',
          },
          toolId: {
            type: 'string',
            description: 'ID of booked tool',
            example: '507f1f77bcf86cd799439012',
          },
          userId: {
            type: 'string',
            description: 'ID of user who made the booking',
            example: '507f1f77bcf86cd799439011',
          },
          firstName: {
            type: 'string',
            minLength: 2,
            description: 'Customer first name',
            example: 'John',
          },
          lastName: {
            type: 'string',
            minLength: 2,
            description: 'Customer last name',
            example: 'Doe',
          },
          phone: {
            type: 'string',
            description: 'Customer phone number',
            example: '+380501234567',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Booking start date',
            example: '2025-12-20T00:00:00.000Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Booking end date',
            example: '2025-12-25T00:00:00.000Z',
          },
          totalPrice: {
            type: 'number',
            minimum: 0,
            description:
              'Total rental price (calculated as days * pricePerDay)',
            example: 750,
          },
          deliveryCity: {
            type: 'string',
            description: 'Delivery city',
            example: 'Kyiv',
          },
          deliveryBranch: {
            type: 'string',
            description: 'Delivery branch or address',
            example: 'Main branch, Khreshchatyk St. 1',
          },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
            description: 'Booking status',
            example: 'pending',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Booking creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      Session: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Session unique identifier',
          },
          userId: {
            type: 'string',
            description: 'User ID associated with session',
          },
          accessToken: {
            type: 'string',
            description: 'JWT access token',
          },
          refreshToken: {
            type: 'string',
            description: 'JWT refresh token',
          },
          accessTokenValidUntil: {
            type: 'string',
            format: 'date-time',
            description: 'Access token expiration time',
          },
          refreshTokenValidUntil: {
            type: 'string',
            format: 'date-time',
            description: 'Refresh token expiration time',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Error description',
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          validation: {
            type: 'object',
            properties: {
              body: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                  keys: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
      Category: {
        type: 'object',
        required: ['title', 'description', 'keywords'],
        properties: {
          _id: {
            type: 'string',
            description: 'Category unique identifier',
            example: '507f1f77bcf86cd799439013',
          },
          title: {
            type: 'string',
            description: 'Category title',
            example: 'Power Tools',
          },
          description: {
            type: 'string',
            description: 'Category description',
            example:
              'Electric and battery-powered tools for various construction and repair tasks',
          },
          keywords: {
            type: 'string',
            description: 'Comma-separated keywords for search',
            example: 'drill, saw, grinder, sander',
          },
        },
      },
      Feedback: {
        type: 'object',
        required: ['toolId', 'owner', 'name', 'description', 'rate'],
        properties: {
          _id: {
            type: 'string',
            description: 'Feedback unique identifier',
            example: '507f1f77bcf86cd799439015',
          },
          toolId: {
            type: 'string',
            description: 'ID of the tool being reviewed',
            example: '507f1f77bcf86cd799439012',
          },
          owner: {
            type: 'string',
            description: 'ID of the user who created the feedback',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            description:
              'Name of the feedback author (copied from user for performance)',
            example: 'John Doe',
          },
          description: {
            type: 'string',
            minLength: 2,
            maxLength: 2000,
            description: 'Feedback text/review',
            example:
              'Great tool! Very reliable and easy to use. Highly recommend for professional work.',
          },
          rate: {
            type: 'number',
            minimum: 1,
            maximum: 5,
            description: 'Rating from 1 to 5',
            example: 5,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Feedback creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints (Public)',
    },
    {
      name: 'Tools',
      description:
        'Tool management endpoints (Mixed: public GET, protected POST/PATCH/DELETE)',
    },
    {
      name: 'Users',
      description:
        'User profile endpoints (Mixed: public profiles, protected current user)',
    },
    {
      name: 'Bookings',
      description: 'Booking management endpoints (Protected)',
    },
    {
      name: 'Categories',
      description: 'Tool categories endpoints (Public)',
    },
    {
      name: 'Feedbacks',
      description:
        'Tool feedback and rating endpoints (Mixed: public GET, protected POST)',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
