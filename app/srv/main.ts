import { createAPIServer } from "service-srv";
import "../../pkgs/service/pkgs/service-web/pkgs/web-init/src/types";

export const main = createAPIServer({
  name: "srv",
  port: 4500,
  // make sure cookieKey is different for each app
  // changing cookie key, will force all user to log out
  cookieKey: `ryl-sid-JgvCz3F4K6pfPNwM`,
});
