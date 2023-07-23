import { apiContext } from "service-srv";
export const _ = {
  url: "/test",
  async api() {
    const { req, res } = apiContext(this);

    return "hello world";
  },
};