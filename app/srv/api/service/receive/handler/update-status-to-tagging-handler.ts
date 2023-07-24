import { apiContext } from "service-srv";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import {
  IUpdateStatusToTaggingUseCase,
  UpdateStatusToTaggingUseCaseFactory,
} from "../use-case/update-status-to-tagging-use-case";
export const _ = {
  url: "/api/receives/:id/update-tagging",
  async api(id: number) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const updateStatusToTaggingUseCase: IUpdateStatusToTaggingUseCase =
        UpdateStatusToTaggingUseCaseFactory.create();
      const receive = await updateStatusToTaggingUseCase.execute({ id: +id });
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
