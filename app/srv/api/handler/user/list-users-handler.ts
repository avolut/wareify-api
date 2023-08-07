import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { IListUsersByRoleUseCase, ListUsersByRoleUseCaseFactory } from "../../../service/user/use-case/list-users-by-role-use-case";
import { IListUsersUseCase, ListUsersUseCaseFactory } from "../../../service/user/use-case/list-users-use-case";
export const _ = {
  url: "/api/users/",
  async api() {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      const role = req.query.role;
      if(role) {
        const listUsersByRoleUseCase: IListUsersByRoleUseCase =
        ListUsersByRoleUseCaseFactory.create();
        const users = await listUsersByRoleUseCase.execute({
          role: role as string,
        });
        return ResponseFormatter.success(users, "List users success");
      } else {
        const listUsersUseCase: IListUsersUseCase = 
        ListUsersUseCaseFactory.create();
        const users = await listUsersUseCase.execute();
        return ResponseFormatter.success(users, "List users success");
      }
    } catch (error: any) {
      return ResponseFormatter.error(
        error.message,
        "Internal Server Error",
        500
      );
    }
  },
};
