import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const createProfileValidator = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(9, { message: 'Phone number is required and must be at least 9 digits' })
    .refine((val) => isValidPhoneNumber(val), {
      message: 'Invalid phone number format'
    }),
  photo: z
    .any()
    .refine((file) => file && file.size > 0, {
      message: 'Profile image is required'
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'Profile image must be less than 2MB'
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
      message: 'Profile image must be a JPEG or PNG file'
    })
    .optional()
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
    .number({ invalid_type_error: 'Postal code must be a number' })
    .min(10000, { message: 'Postal code must be at least 5 digits' })
    .max(999999, { message: 'Postal code must not exceed 10 digits' })
    .refine((val) => /^\d+$/.test(val.toString()), { message: 'Postal code must be numeric' }),

  isDefault: z.boolean()
});

export const updateAddressValidator = z.object({
  street: z.string().trim().min(5, { message: 'Street must be longer than 5 characters' }).optional(),

  houseNumber: z.number({ invalid_type_error: 'House number must be a number' }).min(1, { message: 'House number must not be null' }).optional(),

  postalCode: z
    .number({ invalid_type_error: 'Postal code must be a number' })
    .min(10000, { message: 'Postal code must be at least 5 digits' })
    .max(999999, { message: 'Postal code must not exceed 10 digits' })
    .refine((val) => /^\d+$/.test(val.toString()), { message: 'Postal code must be numeric' })
    .optional(),

  isDefault: z.boolean().optional()
});

export const addressIdValidator = z.object({
  addressId: z.string().min(1, { message: 'Address id is required' })
});
