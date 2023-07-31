export class ResponseFormatter {

  protected static response = {
      meta: {
          code: 200,
          status: '',
          message: ''
      },
      data: {}
  }

  public static success(data: any, message: string, code: number = 200, status: string = 'success') {
      this.response.meta.message = message;
      this.response.data = data;
      this.response.meta.code = code;
      this.response.meta.status = status;
      return this.response;
  }

  public static error(data: any, message: string, code: number, status: string = 'error') {
      this.response.meta.message = message;
      this.response.meta.code = code;
      this.response.data = data;
      this.response.meta.status = status;
      return this.response;
  }
}