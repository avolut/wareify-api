import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { CreateMovementRequest } from "../../../core/request/create-movement-request";
import { CreateMovementUseCaseFactory, ICreateMovementUseCase } from "../../../service/movement/use-case/create-movement-use-case";
export const _ = {
  url: "/api/movements/",
  async api() {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const payload: CreateMovementRequest = await req.json();
      const createMovementUseCase: ICreateMovementUseCase =
        CreateMovementUseCaseFactory.create();
      const issue = await createMovementUseCase.execute(payload);
      return ResponseFormatter.success(issue, "Success create movement", 201);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};