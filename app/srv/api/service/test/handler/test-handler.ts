import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
export const _ = {
  url: "/api/test",
  async api() {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    return loggedIn;
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    return "hello world";
  },
};