import { app } from "./app";
import { env } from "./common/config/env";
import { connectDatabase } from "./common/db/postgres";
import { logger } from "./common/logger/logger";

const bootstrap = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info("Server started", {
        port: env.PORT,
        nodeEnv: env.NODE_ENV,
      });
    });
  } catch (error) {
    logger.error("Failed to bootstrap application", { error });
    process.exit(1);
  }
};

void bootstrap();
