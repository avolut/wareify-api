import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { GetReceivesDraftByWarehouseIdUseCaseFactory, IGetReceivesDraftByWarehouseIdUseCase } from "../../../service/receive/use-case/get-receives-draft-by-warehouse-id-use-case";
export const _ = {
  url: "/api/receives/draft/list/:warehouseId",
  async api(warehouseId: string) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (typeof loggedIn === "string") {
      return ResponseFormatter.error(null, loggedIn, 401);
    }
    try {
      const getReceivesDraftByWarehouseIdUseCase: IGetReceivesDraftByWarehouseIdUseCase =
        GetReceivesDraftByWarehouseIdUseCaseFactory.create();
      const response = await getReceivesDraftByWarehouseIdUseCase.execute({
        warehouseId: parseInt(warehouseId),
      });
      return ResponseFormatter.success(response, "Success", 200);
    } catch (error: any) {
      console.error(`[GetReceiveDraftByWarehouseIdHandler][Error] ${error}`);
      return ResponseFormatter.error(error.message, "[GetReceiveDraftByWarehouseIdHandler][Error]", 500);
    }
  },
};
