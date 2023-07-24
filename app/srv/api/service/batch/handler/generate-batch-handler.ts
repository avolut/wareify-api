import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { GenerateBatchRequest } from "../../../core/request/generate-batch-request";
import { GenerateBatchUseCaseFactory, IGenerateBatchUseCase } from "../use-case/generate-batch-use-case";
import { authMiddleware } from "../../../core/utils/auth-middleware";
export const _ = {
  url: "/api/batches/generate/",
  async api() {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const payload: GenerateBatchRequest = await req.json();
      const generateBatchUseCase: IGenerateBatchUseCase =
        GenerateBatchUseCaseFactory.create();

      let generatedBatch = 0;
      let quantity = 0;
      if (payload.quantity % payload.batch === 0) {
        quantity = payload.quantity / payload.batch;
        generatedBatch = payload.batch;
      } else {
        quantity = Math.floor(payload.quantity / payload.batch);
        generatedBatch = payload.batch + (payload.quantity % payload.batch);
      }
      let batches: any[] = [];
      for (let i = 0; i < generatedBatch; i++) {
        batches[i] = await generateBatchUseCase.execute({
          receiveId: payload.receiveId,
          productId: payload.productId,
          warehouseId: payload.warehouseId,
          quantity: quantity,
        });
      }
      return ResponseFormatter.success(batches, "Success", 200);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};