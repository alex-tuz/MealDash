import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES, HTTP_STATUS } from "../../common/constants/app.constants";

export class ShopsRepository {}

export class ShopsService {
  constructor(private readonly shopsRepository: ShopsRepository) {}

  public async listShops(): Promise<unknown[]> {
    void this.shopsRepository;
    throw new AppError(
      HTTP_STATUS.notImplemented,
      "Shops module is not implemented yet",
      ERROR_CODES.notImplemented,
    );
  }
}
