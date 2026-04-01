import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../../common/constants/app.constants';
import { toResponseEnvelope } from '../../common/interceptors/response.interceptor';
import { CouponsService } from './coupons.service';

export class CouponsController {
	constructor(private readonly couponsService: CouponsService) {}

	public getCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			void req;
			const coupons = await this.couponsService.listCoupons();
			res.status(HTTP_STATUS.ok).json(toResponseEnvelope(coupons));
		} catch (error) {
			next(error);
		}
	};

	public applyCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const coupon = await this.couponsService.applyCoupon(req.body);
			res.status(HTTP_STATUS.ok).json(toResponseEnvelope(coupon));
		} catch (error) {
			next(error);
		}
	};
}
