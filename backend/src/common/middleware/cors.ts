import { NextFunction, Request, Response } from 'express';

const ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization';

export const corsMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS);
  res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);

  if (_req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
};