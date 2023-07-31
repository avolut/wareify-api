import { apiContext } from "service-srv";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import {
  IUpdateStatusToCompletedUseCase,
  UpdateStatusToCompletedUseCaseFactory,
} from "../../../service/receive/use-case/update-status-to-completed-use-case";
export const _ = {
  url: "/api/receives/:id/update-completed/",
  async api(id: number) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const updateStatusToCompletedUseCase: IUpdateStatusToCompletedUseCase =
        UpdateStatusToCompletedUseCaseFactory.create();
      const receive = await updateStatusToCompletedUseCase.execute({
        receiveId: +id,
      });
      return ResponseFormatter.success(
        receive,
        "Receive status updated successfully",
        200
      );
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};
