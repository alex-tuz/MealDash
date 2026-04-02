import express from 'express';

import { corsMiddleware } from './common/middleware/cors';
import { errorHandler } from './common/middleware/error-handler';
import { notFoundHandler } from './common/middleware/not-found';
import { createApiModuleRouter } from './modules/api.router';

export const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use(createApiModuleRouter());

app.use(notFoundHandler);
app.use(errorHandler);
