import { CouponsRepository } from './coupons.repository';
import { CouponResponseDto } from './dto/coupon-response.dto';

export class CouponsService {
  constructor(private readonly couponsRepository: CouponsRepository) {}

  public async listCoupons(): Promise<CouponResponseDto[]> {
    return this.couponsRepository.findAll();
  }
}
