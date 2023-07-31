import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import {
  IUpdateToInProgressUseCase,
  UpdateToInProgressUseCaseFactory,
} from "../../../service/issue/use-case/update-to-in-progress-use-case";
export const _ = {
  url: "/api/issues/:id/update-in-progress",
  async api(id: number) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const updateToInProgressUseCase: IUpdateToInProgressUseCase =
        UpdateToInProgressUseCaseFactory.create();
      const issue = await updateToInProgressUseCase.execute({ issueId: +id });
      return ResponseFormatter.success(
        issue,
        "Issue updated to in progress successfully",
        200
      );
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};
