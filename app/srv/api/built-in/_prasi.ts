import { dir } from "dir";
import { existsAsync, readAsync, writeAsync } from "fs-jetpack";
import { apiContext } from "service-srv";
const cache = {} as Record<string, string>;

export const _ = {
  url: "/_prasi/**",
  async api() {
    const { req, res, mode } = apiContext(this);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const action = {
      _: () => {
        res.json({ prasi: "v1" });
      },
      prisma: async () => {
        const path = req.params._.split("/").slice(1).join("/");
        const pdir = dir.path(`db/node_modules/.gen/${path}`);
        if (await existsAsync(pdir)) {
          res.type("text/x.typescript");
          res.send(await readAsync(pdir, "utf8"));
        }
      },
      "api-types": async () => {
        const pdir = dir.path("srv/api.d.ts");
        if (await existsAsync(pdir)) {
          res.type("text/x.typescript");

          let result = await readAsync(pdir, "utf8");
          if (result) {
            if (!result.startsWith("/* DB-CLEANED */")) {
              const parr = result.split("\n");
              for (const [k, v] of Object.entries(parr)) {
                if (v.trim().startsWith("const db: WebGlobal")) {
                  parr[k] = "";
                }
              }
              parr.unshift("/* DB-CLEANED */");
              result = parr.join("\n");
              await writeAsync(pdir, result);
            }
          }

          res.send(result);
        }
      },
      "api-entry": async () => {
        try {
          const apiEntry = await import("../../../../app/gen/srv/api/entry");
          res.type("application/json");
          res.send(JSON.stringify(apiEntry));
        } catch (e) {
          return "API entry not found";
        }
      },
    }[req.params._.split("/")[0]];

    if (action) await action();
  },
};
