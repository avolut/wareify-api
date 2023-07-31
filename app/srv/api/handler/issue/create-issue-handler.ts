import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { CreateIssueRequest } from "../../../core/request/create-issue-request";
import { CreateIssueUseCaseFactory, ICreateIssueUseCase } from "../../../service/issue/use-case/create-issue-use-case";
export const _ = {
  url: "/api/issues/",
  async api() {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const payload: CreateIssueRequest = await req.json();
      const createIssueUseCase: ICreateIssueUseCase =
        CreateIssueUseCaseFactory.create();
      const issue = await createIssueUseCase.execute(payload);
      return ResponseFormatter.success(issue, "Success create issue", 201);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};