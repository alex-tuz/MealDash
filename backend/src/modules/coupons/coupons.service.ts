import { CouponsRepository } from "./coupons.repository";

export class CouponsService {
  constructor(private readonly couponsRepository: CouponsRepository) {
    void this.couponsRepository;
  }
}
