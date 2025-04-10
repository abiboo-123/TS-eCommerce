import { z } from 'zod';

export const getOrderValidation = z.object({
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/, { message: 'Page must be numeric' }).optional(),
  limit: z.string().regex(/^\d+$/, { message: 'Limit must be numeric' }).optional()
});

export const orderIdValidation = z.object({
  orderId: z.string({
    required_error: 'Order ID is required'
  })
});
