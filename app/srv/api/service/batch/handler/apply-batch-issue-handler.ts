import { apiContext } from "service-srv";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { ApplyBatchIssueRequest } from "../../../core/request/apply-batch-issue-request";
import { ApplyBatchIssueUseCaseFactory, IApplyBatchIssueUseCase } from "../use-case/apply-batch-issue-use-case";
export const _ = {
  url: "/api/batches/:id/apply-issue/",
  async api(id: number) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const payload: ApplyBatchIssueRequest = await req.json();
      const applyBatchIssueUseCase: IApplyBatchIssueUseCase = ApplyBatchIssueUseCaseFactory.create();
      const batches = await applyBatchIssueUseCase.execute({
        batchIds: payload.batchIds,
        issueId: id,
        status: payload.status,
      });

      return ResponseFormatter.success(batches, "Success apply batch issue", 201);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};