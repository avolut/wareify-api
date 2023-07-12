import { apiContext } from "service-srv";
import argon from "@node-rs/argon2";

export const _ = {
  url: "/register",
  async api(datas: any) {
    // console.log("params register : ", datas);
    const { res, req } = apiContext(this);
    const { no_telp, pin, id_anggota, type } = datas;

    let response = {
      status: false,
      message: "failed",
    };

    const users = await db.users.create({
      data: {
        username: no_telp,
        password: await argon.hash(pin),
      },
    });

    // console.log("users : ", users);

    if (users.id) {
      try {
        if (type === "anggota") {
          const update = await db.m_anggota.update({
            data: {
              id_users: users.id,
            },
            where: {
              id: id_anggota,
            },
          });
        } else {
          const update = await db.koperasi.update({
            data: {
              id_users: users.id,
            },
            where: {
              id: id_anggota,
            },
          });
        }

        // console.log("update : ", update);

        response = {
          status: true,
          message: "Berhasil",
        };
      } catch (error: any) {
        console.log("errror register user : ", error);
      }
    }

    return response;
  },
};
