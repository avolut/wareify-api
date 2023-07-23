import { Response } from "service-srv/node_modules/hyper-express";

class ResponseFormatter {
  public format(
    res: Response,
    data: unknown,
    code: number,
    message: string,
    status: string
  ) {
    const responseBody = JSON.stringify({
      meta: {
        code: code,
        message,
        status,
      },
      data,
    });
    return res.send(responseBody)
      .status(code)
      .set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
  }

  public success(
    res: Response,
    data: unknown,
    message: string = "Success",
    code = 200
  ) {
    return this.format(res, data, code, message, "success");
  }

  public error(res: Response, data: unknown, message = "Error", code = 500) {
    return this.format(res, data, code, message, "error");
  }

  public notFound(
    res: Response,
    data: unknown,
    message = "Not Found",
    code = 404
  ) {
    return this.format(res, data, code, message, "not found");
  }

  public badRequest(
    res: Response,
    data: unknown,
    message = "Bad Request",
    code = 400
  ) {
    return this.format(res, data, code, message, "bad request");
  }

  public unauthorized(
    res: Response,
    data: unknown,
    message = "Unauthorized",
    code = 401
  ) {
    return this.format(res, data, code, message, "unauthorized");
  }

  public forbidden(
    res: Response,
    data: unknown,
    message = "Forbidden",
    code = 403
  ) {
    return this.format(res, data, code, message, "forbidden");
  }

  public conflict(
    res: Response,
    data: unknown,
    message = "Conflict",
    code = 409
  ) {
    return this.format(res, data, code, message, "conflict");
  }
}

export default new ResponseFormatter();
