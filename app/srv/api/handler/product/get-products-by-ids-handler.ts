import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { GetProductsByIdsUseCaseFactory, IGetProductsByIdsUseCase } from "../../../service/product/use-case/get-products-by-ids-use-case";
export const _ = {
  url: "/api/products/by/ids",
  async api(ids: string[]) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (typeof loggedIn === "string") {
      return ResponseFormatter.error(null, loggedIn, 401);
    }
    try {
      const getProductsByIdsUseCase: IGetProductsByIdsUseCase = GetProductsByIdsUseCaseFactory.create();
      const products = await getProductsByIdsUseCase.execute({
        ids: ids.map((id) => parseInt(id)),
      });
      return ResponseFormatter.success(products, "Get products success");
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};