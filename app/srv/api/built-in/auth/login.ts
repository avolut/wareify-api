import argon from "@node-rs/argon2";
import { apiContext, session } from "service-srv";

export const _ = {
  url: "/_login",
  async api(data: any) {
    const { res } = apiContext(this);

    const sdata = await session.new(data);
    res.header(
      "set-cookie",
      `${session.cookieKey}=${sdata.id};SameSite=None;Secure`
    );

    return {
      status: "ok",
      session: sdata,
    };
  },
};
