import { apiContext } from "service-srv";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { PathReporter } from "io-ts/PathReporter";
import {
  FindUserPasswordUseCaseFactory,
  IFindUserPasswordUseCase,
} from "../../../service/user/use-case/find-user-password-use-case";
import argon from "@node-rs/argon2";
import {
  FindUserByEmailUseCaseFactory,
  IFindUserByEmailUseCase,
} from "../../../service/user/use-case/find-user-by-email-use-case";
import jwt from "jsonwebtoken";
import { LoginRequest } from "../../../core/request/login-request";
import { global } from "../../../global";

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
        email: credentials.email,
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
      const FindUserByEmailUseCase: IFindUserByEmailUseCase =
        FindUserByEmailUseCaseFactory.create();
      const userByEmail = await FindUserByEmailUseCase.execute({
        email: credentials.email,
      });
      const token = jwt.sign({ email: user.email }, global.JWT_SECRET_KEY, {
        expiresIn: global.JWT_EXPIRES_IN,
      });
      const data = {
        tokenType: "Bearer",
        token,
        user: userByEmail,
      };
      return ResponseFormatter.success(data, "Login success");
    } catch (error: any) {
      return ResponseFormatter.error(error.message, "Internal Server Error", 500);
    }
  },
};
