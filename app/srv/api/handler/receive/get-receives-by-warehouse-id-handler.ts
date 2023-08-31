import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import {
  GetReceiveByWarehouseIdUseCaseFactory,
  IGetReceiveByWarehouseIdUseCase,
} from "../../../service/receive/use-case/get-receives-by-warehouse-id-use-case";
import { CountDraftReceiveByWarehouseIdUseCaseFactory, ICountDraftReceiveByWarehouseIdUseCase } from '../../../service/receive/use-case/count-draft-receive-by-warehouse-id-use-case';
export const _ = {
  url: "/api/receives/list/:warehouseId",
  async api(warehouseId: string) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (typeof loggedIn === "string") {
      return ResponseFormatter.error(null, loggedIn, 401);
    }
    try {
      const getReceivesByWarehouseIdUseCase: IGetReceiveByWarehouseIdUseCase =
        GetReceiveByWarehouseIdUseCaseFactory.create();
      const response = await getReceivesByWarehouseIdUseCase.execute({
        warehouseId: parseInt(warehouseId),
      });
      const countDraftReceiveByWarehouseIdUseCase: ICountDraftReceiveByWarehouseIdUseCase = CountDraftReceiveByWarehouseIdUseCaseFactory.create();
      const count = await countDraftReceiveByWarehouseIdUseCase.execute({
        warehouseId: parseInt(warehouseId),
      });
      return ResponseFormatter.success({
        countDraft: count.count,
        receives: response,
      }, "Success", 200);
    } catch (error: any) {
      console.error(`[GetReceiveByWarehouseIdHandler][Error] ${error}`);
      return ResponseFormatter.error(null, "Internal Server Error", 500);
    }
  },
};
