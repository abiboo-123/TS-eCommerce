import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const createProfileValidator = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(9, { message: 'Phone number is required and must be at least 9 digits' })
    .refine((val) => isValidPhoneNumber(val), {
      message: 'Invalid phone number format'
    })
});

export const updateProfileValidator = z.object({
  name: z.string().trim().min(1, { message: 'Name must not be empty' }).max(100, { message: 'Name is too long' }).optional(),

  phoneNumber: z
    .string()
    .trim()
    .min(9, { message: 'Phone number is required' })
    .refine((val) => isValidPhoneNumber(val), {
      message: 'Invalid phone number format'
    })
    .optional(),

  removeProfileImage: z.boolean().optional()
});

export const addAddressValidator = z.object({
  street: z.string().trim().min(5, { message: 'Street is required and must be at least 5 characters' }),

  houseNumber: z
    .number({ invalid_type_error: 'House number must be a number' })
    .min(1, { message: 'House number is required and must be at least 1' })
    .optional(),

  postalCode: z
    .string({ required_error: 'Postal code is required' })
    .min(6, { message: 'Postal code must be at least 6 digits' })
    .max(10, { message: 'Postal code must not exceed 10 digits' })
    .regex(/^\d+$/, { message: 'Postal code must be numeric' }),

  isDefault: z.boolean()
});

export const updateAddressValidator = z.object({
  street: z.string().trim().min(5, { message: 'Street must be longer than 5 characters' }).optional(),

  houseNumber: z.number({ invalid_type_error: 'House number must be a number' }).min(1, { message: 'House number must not be null' }).optional(),

  postalCode: z
    .string({ required_error: 'Postal code is required' })
    .min(6, { message: 'Postal code must be at least 6 digits' })
    .max(10, { message: 'Postal code must not exceed 10 digits' })
    .regex(/^\d+$/, { message: 'Postal code must be numeric' })
    .optional(),

  isDefault: z.boolean().optional()
});

export const addressIdValidator = z.object({
  addressId: z.string().min(1, { message: 'Address id is required' })
});
