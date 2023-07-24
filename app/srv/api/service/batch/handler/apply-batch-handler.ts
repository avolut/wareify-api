import { apiContext } from "service-srv";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { ApplyBatchesUseCaseFactory, IApplyBatchesUseCase } from "../use-case/apply-batch-use-case";
export const _ = {
  url: "/api/batches/:code/apply/",
  async api(code: string) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const applyBatchesUseCase: IApplyBatchesUseCase =
        ApplyBatchesUseCaseFactory.create();
      const batches = await applyBatchesUseCase.execute({
        receiveId: parseInt(code),
      });
      return ResponseFormatter.success(batches, "Success apply batch", 200);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};