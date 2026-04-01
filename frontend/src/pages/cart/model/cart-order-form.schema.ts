import { z } from 'zod';

const ORDER_FIELD_LIMITS = {
  nameMinLength: 2,
  addressMinLength: 8,
} as const;

const PHONE_PATTERN = /^\+?[0-9\s().-]{7,20}$/;

export const cartOrderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(ORDER_FIELD_LIMITS.nameMinLength, 'Name must contain at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, 'Enter a valid phone number.'),
  address: z
    .string()
    .trim()
    .min(ORDER_FIELD_LIMITS.addressMinLength, 'Address must contain at least 8 characters.'),
});

export type CartOrderFormValues = z.infer<typeof cartOrderFormSchema>;
