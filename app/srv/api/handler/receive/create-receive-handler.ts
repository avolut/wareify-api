import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { CreateReceiveRequest } from "../../../core/request/create-receive-request";
import {
  CreateReceiveUseCaseFactory,
  ICreateReceiveUseCase,
} from "../../../service/receive/use-case/create-receive-use-case";
import { ReceiveType } from "../../../service/receive/entity/receive-entity";
import dayjs from "dayjs";
export const _ = {
  url: "/api/receives/",
  async api(createReceive:{
    documentDate: String;
    warehouseId: number;
    receiveType: String;
    userIds: number[];
    productIds: number[];
  }) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (typeof loggedIn === "string") {
      return ResponseFormatter.error(null, loggedIn, 401);
    }
    try {
      const payload: CreateReceiveRequest = createReceive;
      const createReceiveUseCase: ICreateReceiveUseCase =
        CreateReceiveUseCaseFactory.create();
      const receive = await createReceiveUseCase.execute({
        documentDate: dayjs(payload.documentDate.toString()).toDate(),
        warehouseId: payload.warehouseId,
        receiveType: ReceiveType[payload.receiveType as keyof typeof ReceiveType],
        userIds: payload.userIds,
        productIds: payload.productIds,
      });
      return ResponseFormatter.success(receive, "Receive created", 201);
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};
