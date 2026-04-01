import { z } from 'zod';

import { ERROR_CODES, HTTP_STATUS } from '../../common/constants/app.constants';
import { AppError } from '../../common/errors/app-error';
import { CreateOrderDto } from './dto/create-order.dto';

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
});

const createOrderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().min(5).max(400),
  items: z.array(orderItemSchema).min(1),
});

export const parseCreateOrderPayload = (payload: unknown): CreateOrderDto => {
  const parsed = createOrderSchema.safeParse(payload);

  if (!parsed.success) {
    throw new AppError(
      HTTP_STATUS.badRequest,
      'Invalid order payload',
      ERROR_CODES.appError,
      parsed.error.flatten(),
    );
  }

  return parsed.data;
};
