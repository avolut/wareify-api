import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { GenerateBatchIssueRequest } from "../../../core/request/generate-batch-issue-request";
import { GenerateBatchIssueUseCaseFactory, IGenerateBatchIssueUseCase } from "../../../service/batch/use-case/generate-batch-issue-use-case";
export const _ = {
  url: "/api/batches/generate-issue/",
  async api() {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const payload: GenerateBatchIssueRequest = await req.json();
      const generateBatchIssueUseCase: IGenerateBatchIssueUseCase = GenerateBatchIssueUseCaseFactory.create();
      const batch = await generateBatchIssueUseCase.execute({
        batchId: payload.batchId,
        issueId: payload.issueId,
        quantity: payload.quantity,
      });

      return ResponseFormatter.success(batch, 'Success generate batch issue', 201);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};