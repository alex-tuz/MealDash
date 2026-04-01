import { z } from 'zod';

import { ERROR_CODES, HTTP_STATUS } from '../../common/constants/app.constants';
import { AppError } from '../../common/errors/app-error';
import { CouponsRepository } from './coupons.repository';
import { CouponResponseDto } from './dto/coupon-response.dto';

const applyCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/),
});

export class CouponsService {
  constructor(private readonly couponsRepository: CouponsRepository) {}

  public async listCoupons(): Promise<CouponResponseDto[]> {
    return this.couponsRepository.findAll();
  }

  public async applyCoupon(payload: unknown): Promise<CouponResponseDto> {
    const parsed = applyCouponSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(
        HTTP_STATUS.badRequest,
        'Invalid coupon code',
        ERROR_CODES.appError,
        parsed.error.flatten(),
      );
    }

    const coupon = await this.couponsRepository.findByCode(parsed.data.code);

    if (!coupon) {
      throw new AppError(HTTP_STATUS.notFound, 'Coupon not found', ERROR_CODES.notFound, {
        code: parsed.data.code,
      });
    }

    return coupon;
  }
}
