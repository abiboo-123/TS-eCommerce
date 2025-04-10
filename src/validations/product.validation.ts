import { z } from 'zod';

export const createProductValidation = z.object({
  name: z.string({
    required_error: 'Product name is required'
  }),
  description: z.string({
    required_error: 'Product description is required'
  }),
  price: z.number({
    required_error: 'Product price is required'
  }),
  category: z.string({
    required_error: 'Product category is required'
  }),
  quantity: z.number({
    required_error: 'Product quantity is required'
  })
});

export const updateProductValidation = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  quantity: z.number().optional()
});

export const productSearchValidation = z.object({
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/, { message: 'Page must be numeric' }).optional(),
  limit: z.string().regex(/^\d+$/, { message: 'Limit must be numeric' }).optional()
});

export const productIdValidation = z.object({
  productId: z.string({
    required_error: 'Product ID is required'
  })
});

export const productImageIdValidation = z.object({
  productId: z.string({
    required_error: 'Product ID is required'
  }),
  imageId: z.string({
    required_error: 'Image ID is required'
  })
});

export const productReviewValidation = z.object({
  rating: z
    .number({
      required_error: 'Product rating is required'
    })
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must be at most 5' }),
  comment: z
    .string({
      required_error: 'Product comment is required'
    })
    .min(1, { message: 'Comment must be at least 1 character long' })
    .max(500, { message: 'Comment must be at most 500 characters long' })
    .optional()
});
