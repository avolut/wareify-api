import { apiContext } from "service-srv";
import argon from "@node-rs/argon2";

export const _ = {
  url: "/change-password",
  async api(datas: any) {
    const { res, req } = apiContext(this);
    const { old_pass, new_pass, confirm_password, id_user } = datas;

    let response = {
      status: false,
      message: "failed",
    };

    const users = await db.users.findFirst({
      where: {
        id: id_user,
      },
    });

    if (users && users.id) {
      if (!(await argon.verify(users.password, old_pass))) {
        response = {
          status: false,
          message: "Password lama tidak sesuai",
        };
      } else {
        if (new_pass !== confirm_password) {
          response = {
            status: false,
            message: "Password konfirmasi tidak sesuai",
          };
        } else {
          try {
            const upd = await db.users.update({
              data: {
                password: await argon.hash(new_pass),
              },
              where: {
                id: id_user,
              },
            });

            response = {
              status: true,
              message: "Berhasil",
            };
          } catch (error: any) {
            console.log("errror register user : ", error);
          }
        }
      }
    }

    return response;
  },
};
