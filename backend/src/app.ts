import express from "express";

import { API_ROUTES } from "./common/constants/app.constants";
import { errorHandler } from "./common/middleware/error-handler";
import { notFoundHandler } from "./common/middleware/not-found";
import { createHealthModuleRouter } from "./modules/health/health.module";

export const app = express();

app.use(express.json());

app.use(API_ROUTES.health, createHealthModuleRouter());

app.use(notFoundHandler);
app.use(errorHandler);
