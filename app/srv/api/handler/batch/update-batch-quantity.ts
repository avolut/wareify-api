import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { UpdateBatchQuantity } from "../../../core/request/update-batch-quantity";
import { IUpdateBatchQuantityUseCase, UpdateBatchQuantityUseCaseFactory } from "../../../service/batch/use-case/update-batch-quantity-use-case";
export const _ = {
  url: "/api/batches/update-quantity/:code/",
  async api(code: string) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    // return code;
    try {
      const payload: UpdateBatchQuantity = await req.json();
      const updateBatchQuantityUseCase: IUpdateBatchQuantityUseCase =
        UpdateBatchQuantityUseCaseFactory.create();
      const batch = await updateBatchQuantityUseCase.execute({
        code: code,
        quantity: +payload.quantity,
      });

      return ResponseFormatter.success(batch, 'Success update batch quantity', 200);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};
