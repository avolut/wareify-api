import { subscribe } from "@parcel/watcher";
import { spawn } from "child_process";
import { existsAsync, writeAsync } from "fs-jetpack";
import { dir } from "../pkgs/base/pkgs/dir/export";

export const build = async (mode: any) => {
  let timeout: NodeJS.Timeout;
  const gen = (delay?: number) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(async () => {
      if (!(await existsAsync(dir.root("app/gen/web/entry.ts")))) {
        await writeAsync(
          dir.root("app/gen/web/entry.ts"),
          "export const _ = {}"
        );
      }
      if (!(await existsAsync(dir.root("app/gen/web/ssr/entry.ts")))) {
        await writeAsync(
          dir.root("app/gen/web/ssr/entry.ts"),
          "export const _ = {}"
        );
      }

      if (!(await existsAsync(dir.root("app/gen/web/layout/entry.ts")))) {
        await writeAsync(
          dir.root("app/gen/web/layout/entry.ts"),
          "export const _ = {}"
        );
      }

      if (!(await existsAsync(dir.root("app/gen/web/page/entry.ts")))) {
        await writeAsync(
          dir.root("app/gen/web/page/entry.ts"),
          "export const _ = {}"
        );
      }

      if (!(await existsAsync(dir.root("app/gen/web/page/entry-ssr.ts")))) {
        await writeAsync(
          dir.root("app/gen/web/page/entry-ssr.ts"),
          "export const _ = {}"
        );
      }

      spawn(
        "./tsc",
        [
          dir.root("app/gen/srv/api/srv.ts"),
          "--declaration",
          "--emitDeclarationOnly",
          "--esModuleInterop",
          "--noEmitOnError",
          "false",
          "--jsx",
          "preserve",
          "--target",
          "esnext",
          "--module",
          "esnext",
          "--moduleResolution",
          "node",
          "--skipLibCheck",
          "--outFile",
          dir.root(".output/app/srv/api.d.ts"),
        ],
        {
          stdio: mode !== "dev" ? "inherit" : undefined,
          cwd: dir.root("app/node_modules/.bin"),
        }
      );
    }, delay);
  };

  if (mode === "dev") {
    gen(2000);
    subscribe(dir.root("app/srv/api"), (err, events) => {
      gen(2000);
    });
  } else {
    const ready = async () => {
      if (await existsAsync(dir.root(".output/app/srv"))) {
        done.unsubscribe();
        gen();
      }
    };
    const done = await subscribe(dir.root(".output"), ready);
  }
};
