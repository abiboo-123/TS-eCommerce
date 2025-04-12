import { stat } from 'fs';
import { z } from 'zod';

export const userIdValidation = z.object({
  userId: z.string({
    required_error: 'User ID is required'
  })
});

export const getUserValidation = z.object({
  search: z.string().optional(),
  role: z
    .enum(['admin', 'consumer'], {
      invalid_type_error: 'Role must be either admin or consumer'
    })
    .optional(),
  sortBy: z
    .enum(['name', 'email', 'createdAt'], {
      invalid_type_error: 'SortBy must be either name, email, or createdAt'
    })
    .optional(),
  page: z.string().regex(/^\d+$/, { message: 'Page must be numeric' }).optional(),
  limit: z.string().regex(/^\d+$/, { message: 'Limit must be numeric' }).optional()
});

export const getOrdersValidation = z.object({
  status: z
    .enum(['pending', 'shipped', 'delivered', 'cancelled'], {
      invalid_type_error: 'Status must be either pending, shipped, delivered, or cancelled'
    })
    .optional(),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid startDate'
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  userId: z.string({}).optional(),
  sortBy: z
    .enum(['newest', 'totalPrice'], {
      invalid_type_error: 'SortBy must be either newest or totalPrice'
    })
    .optional(),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid endDate'
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  page: z.string().regex(/^\d+$/, { message: 'Page must be numeric' }).optional(),
  limit: z.string().regex(/^\d+$/, { message: 'Limit must be numeric' }).optional()
});

export const getCouponValidation = z.object({
  //code, isActive, discountType, valid, sortBy, page, limit
  code: z
    .string({
      required_error: 'Coupon code is required'
    })
    .optional(),
  isActive: z
    .boolean({
      invalid_type_error: 'isActive must be a boolean'
    })
    .optional(),
  discountType: z
    .enum(['percentage', 'fixed'], {
      invalid_type_error: 'Discount type must be either percentage or fixed'
    })
    .optional(),
  valid: z
    .boolean({
      invalid_type_error: 'valid must be a boolean'
    })
    .optional(),
  sortBy: z
    .enum(['newest', 'discountValue'], {
      invalid_type_error: 'SortBy must be either discountValue or newests'
    })
    .optional(),
  page: z.string().regex(/^\d+$/, { message: 'Page must be numeric' }).optional(),
  limit: z.string().regex(/^\d+$/, { message: 'Limit must be numeric' }).optional()
});

export const updateUserRoleValidation = z.object({
  role: z.enum(['admin', 'consumer'], {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be either admin or consumer'
  })
});

export const orderIdValidation = z.object({
  orderId: z.string({
    required_error: 'Order ID is required'
  })
});

export const updateOrderStatusValidation = z.object({
  status: z.enum(['pending', 'shipped', 'delivered', 'cancelled'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be one of pending, shipped, delivered, or cancelled'
  })
});

export const couponParamValidation = z.object({
  couponIdOrCode: z.string({
    required_error: 'Coupon ID or Code is required'
  })
});

export const createCouponValidation = z.object({
  code: z
    .string({
      required_error: 'Coupon code is required'
    })
    .min(3, { message: 'Coupon code must be at least 3 characters long' })
    .max(20, { message: 'Coupon code must be at most 20 characters long' })
    .regex(/^[A-Z0-9]+$/, { message: 'Coupon code must be alphanumeric and uppercase' })
    .transform((code) => code.toUpperCase()),
  expiresAt: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid expiry date'
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  discountType: z.enum(['percentage', 'fixed'], {
    required_error: 'Discount type is required',
    invalid_type_error: 'Discount type must be either percentage or fixed'
  }),
  discountValue: z
    .number({
      required_error: 'Discount value is required',
      invalid_type_error: 'Discount value must be a number'
    })
    .positive({ message: 'Discount value must be positive' }),
  usageLimit: z
    .number({
      required_error: 'Usage limit is required',
      invalid_type_error: 'Usage limit must be a number'
    })
    .int({ message: 'Usage limit must be an integer' })
    .positive({ message: 'Usage limit must be positive' }),
  isActive: z
    .boolean({
      required_error: 'isActive is required',
      invalid_type_error: 'isActive must be a boolean'
    })
    .default(true)
});

export const updateCouponValidation = z.object({
  code: z
    .string({
      required_error: 'Coupon code is required'
    })
    .min(3, { message: 'Coupon code must be at least 3 characters long' })
    .max(20, { message: 'Coupon code must be at most 20 characters long' })
    .regex(/^[A-Z0-9]+$/, { message: 'Coupon code must be alphanumeric and uppercase' })
    .transform((code) => code.toUpperCase())
    .optional(),
  expiresAt: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid expiry date'
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  discountType: z
    .enum(['percentage', 'fixed'], {
      required_error: 'Discount type is required',
      invalid_type_error: 'Discount type must be either percentage or fixed'
    })
    .optional(),
  discountValue: z
    .number({
      required_error: 'Discount value is required',
      invalid_type_error: 'Discount value must be a number'
    })
    .positive({ message: 'Discount value must be positive' })
    .optional(),
  usageLimit: z
    .number({
      required_error: 'Usage limit is required',
      invalid_type_error: 'Usage limit must be a number'
    })
    .int({ message: 'Usage limit must be an integer' })
    .positive({ message: 'Usage limit must be positive' })
    .optional(),
  isActive: z
    .boolean({
      required_error: 'isActive is required',
      invalid_type_error: 'isActive must be a boolean'
    })
    .default(true)
    .optional()
});
