export const QTY_MIN = 1;
export const QTY_STEP = 1;
export const NOTIFICATION_AUTO_HIDE_MS = 3_000;

export const ORDER_CREATE_SUCCESS_STATUS = {
  ok: 200,
  created: 201,
} as const;

export type SubmitNotification = {
  tone: 'success' | 'error';
  message: string;
};

export type AppliedCoupon = {
  code: string;
  discountPercent: number;
};
