import { apiContext } from "service-srv";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { PutAwayToBinRequest } from "../../../core/request/put-away-to-bin-request";
import { IPutAwayToBinUseCase, PutAwayToBinUseCaseFactory } from "../use-case/put-away-to-bin-use-case";
export const _ = {
  url: "/api/batches/put-away/",
  async api() {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const payload: PutAwayToBinRequest = await req.json();
      const putAwayToBinUseCase: IPutAwayToBinUseCase =
        PutAwayToBinUseCaseFactory.create();
      const batches = await putAwayToBinUseCase.execute({
        batchIds: payload.batchIds,
        binId: payload.binId,
      });
      return ResponseFormatter.success(batches, "Successfully put away to bin", 200);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};