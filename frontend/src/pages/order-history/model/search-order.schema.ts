import { z } from 'zod';

export const searchOrderSchema = z
  .object({
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    phone: z.string().min(5, 'Phone must be at least 5 characters').optional().or(z.literal('')),
    orderId: z
      .string()
      .regex(/^(\d+|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, 'Order ID must be a numeric order number or UUID')
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.email || data.phone || data.orderId, {
    message: 'Please enter at least one search criteria',
    path: ['email'],
  });

export type SearchOrderForm = z.infer<typeof searchOrderSchema>;
