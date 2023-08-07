import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { GetProductsByOrganizationIdUseCaseFactory, IGetProductsByOrganizationIdUseCase } from "../../../service/product/use-case/get-products-by-organization-id-use-case";
export const _ = {
  url: "/api/products/:organizationId",
  async api(organizationId: string) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const getProductsByOrganizationIdUseCase: IGetProductsByOrganizationIdUseCase = GetProductsByOrganizationIdUseCaseFactory.create();
      const products = await getProductsByOrganizationIdUseCase.execute({
        organizationId: parseInt(organizationId),
      });
      return ResponseFormatter.success(products, "Get products success");
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};