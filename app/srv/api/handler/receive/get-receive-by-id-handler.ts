import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { GetReceiveByIdUseCaseFactory, IGetReceiveByIdUseCase } from "../../../service/receive/use-case/get-receive-by-id-use-case";
export const _ = {
  url: "/api/receives/by/id/:receiveId",
  async api(receiveId: string) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (typeof loggedIn === "string") {
      return ResponseFormatter.error(null, loggedIn, 401);
    }
    try {
      const getReceiveByIdUseCase: IGetReceiveByIdUseCase =
        GetReceiveByIdUseCaseFactory.create();
      const response = await getReceiveByIdUseCase.execute({
        receiveId: parseInt(receiveId),
      });
      return ResponseFormatter.success(response, "Success", 200);
    } catch (error: any) {
      console.error(`[GetReceiveByIdHandler][Error] ${error}`);
      return ResponseFormatter.error(error.message, "[GetReceiveByIdHandler][Error]", 500);
    }
  },
};
