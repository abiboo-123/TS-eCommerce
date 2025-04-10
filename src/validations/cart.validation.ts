import { z } from 'zod';

export const productIdValidation = z.object({
  productId: z.string({
    required_error: 'Product ID is required'
  })
});

export const quantityValidation = z.object({
  quantity: z
    .number({
      required_error: 'Quantity is required'
    })
    .min(1, { message: 'Quantity must be at least 1' })
    .max(100, { message: 'Quantity must be at most 100' })
});
