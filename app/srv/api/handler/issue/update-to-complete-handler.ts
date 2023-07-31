import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import {
  IUpdateToCompleteUseCase,
  UpdateToCompleteUseCaseFactory,
} from "../../../service/issue/use-case/update-to-complete-use-case";
export const _ = {
  url: "/api/issues/:id/update-complete",
  async api(id: number) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const updateToCompleteUseCase: IUpdateToCompleteUseCase =
        UpdateToCompleteUseCaseFactory.create();
      const issue = await updateToCompleteUseCase.execute({ issueId: +id });
      return ResponseFormatter.success(
        issue,
        "Issue updated to complete successfully",
        200
      );
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};
