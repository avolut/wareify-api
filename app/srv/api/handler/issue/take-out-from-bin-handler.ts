import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { ITakeOutFromBinUseCase, TakeOutFromBinUseCaseFactory } from "../../../service/issue/use-case/take-out-from-bin-use-case";
import { TakeOutFromBinRequest } from "../../../core/request/take-out-from-bin-request";
export const _ = {
  url: "/api/issues/:id/take-out",
  async api(id: number) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const payload: TakeOutFromBinRequest = await req.json();
      const takeOutFromBinUseCase: ITakeOutFromBinUseCase =
        TakeOutFromBinUseCaseFactory.create();
      const message = await takeOutFromBinUseCase.execute({
        issueId: +id,
        binId: payload.binId,
        batchId: payload.batchId,
      });
      return ResponseFormatter.success(message, "Success take out from bin", 200);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};