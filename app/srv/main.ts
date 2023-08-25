import { createAPIServer } from "service-srv";
import "../../pkgs/service/pkgs/service-web/pkgs/web-init/src/types";

let port = 4500;
try {
  port = require("./port").port;
} catch (E) {}

export const main = createAPIServer({
  name: "srv",
  port,
  // make sure cookieKey is different for each app
  // changing cookie key, will force all user to log out
  cookieKey: `ryl-sid-JgvCz3F4K6pfPNwM`,
});
