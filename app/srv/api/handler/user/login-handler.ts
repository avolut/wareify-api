import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import {
  FindUserPasswordUseCaseFactory,
  IFindUserPasswordUseCase,
} from "../../../service/user/use-case/find-user-password-use-case";
import argon from "@node-rs/argon2";
import jwt from "jsonwebtoken";
import { LoginRequest } from "../../../core/request/login-request";
import { global } from "../../../global";
import { FindUserByUsernameUseCaseFactory, IFindUserByUsernameUseCase } from "../../../service/user/use-case/find-user-by-username-use-case";

export const _ = {
  url: "/api/login",
  async api() {
    const { req, res } = apiContext(this);
    
    try {
      // return req.json();
      // const validation = LoginSchema.decode(req.json());

      // if (validation._tag === "Left") {
      //   const errorMessages = PathReporter.report(validation);
      //   return ResponseFormatter.error(errorMessages, "Bad Request", 400);
      // }
      // const credentials = validation.right;
      const credentials: LoginRequest = await req.json();
      const findUserPasswordUseCase: IFindUserPasswordUseCase =
        FindUserPasswordUseCaseFactory.create();
      const user = await findUserPasswordUseCase.execute({
        username: credentials.username,
      });
      if (!user) {
        return ResponseFormatter.error(null, "User not found", 400);
      }
      const isPasswordMatch = await argon.verify(
        user.password,
        credentials.password
      );
      if (!isPasswordMatch) {
        return ResponseFormatter.error(null, "Wrong password", 400);
      }
      const FindUserByUsernameUseCase: IFindUserByUsernameUseCase =
        FindUserByUsernameUseCaseFactory.create();
      const userByUsername = await FindUserByUsernameUseCase.execute({
        username: credentials.username,
      });
      const token = jwt.sign({ username: user.username }, global.JWT_SECRET_KEY, {
        expiresIn: global.JWT_EXPIRES_IN,
      });
      const data = {
        tokenType: "Bearer",
        token,
        user: userByUsername,
      };
      return ResponseFormatter.success(data, "Login success");
    } catch (error: any) {
      return ResponseFormatter.error(error.message, "Internal Server Error", 500);
    }
  },
};
