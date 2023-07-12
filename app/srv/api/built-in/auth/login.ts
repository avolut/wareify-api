import argon from "@node-rs/argon2";
import { apiContext, session } from "service-srv";

export const _ = {
  url: "/_login",
  async api(username: string, password: string) {
    const { res, req } = apiContext(this);

    const current = session.get(req);
    if (!current) {
      const user = await db.users.findFirst({
        where: {
          username,
        },
      });

      if (user !== null && (await argon.verify(user.password, password))) {
        //@ts-ignore
        delete user.password;
        const sdata = await session.new({ id: user.id });
        res.header(
          "set-cookie",
          `${session.cookieKey}=${sdata.id};SameSite=None;Secure`
        );
        return { status: "ok", session: { id: user.id } };
      }
    } else {
      res.header(
        "set-cookie",
        `${session.cookieKey}=${current.id};SameSite=None;Secure`
      );
      return { status: "ok", session: current };
    }

    return {
      status: "failed",
      reason: "Username / password salah",
    };
  },
};
