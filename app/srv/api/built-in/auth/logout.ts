import { apiContext, session } from "service-srv";
export const _ = {
  url: "/_logout",
  async api() {
    const { res, req } = apiContext(this);

    const current = session.get(req);
    if (current) {
      console.log("check session : ", current);
      // clear session
      await session.del(current.id);
      res.header("set-cookie", `${session.cookieKey}=;`);
    } else {
      console.log("check session here else ");
    }
    return { status: "logged-out" };
  },
};
