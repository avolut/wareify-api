import { apiContext, session } from "service-srv";

export const _ = {
  url: "/_session",
  async api() {
    const { req } = apiContext(this);
    let data: any;

    // const _session: any = session.get(req);

    // if (_session) {
    //   let user = await db.users.findFirst({
    //     include: {
    //       koperasi: true,
    //       m_anggota: true,
    //     },
    //     where: {
    //       id: _session.data.id,
    //     },
    //   });

    //   if (user) {
    //     data = {
    //       ..._session,
    //       ...{
    //         data: {
    //           id: user.id,
    //           koperasi: user.koperasi.length > 0 && user.koperasi[0],
    //           m_anggota: user.m_anggota.length > 0 && user.m_anggota[0],
    //         },
    //       },
    //     };
    //   } else {
    //     data = {};
    //   }
    // } else {
    //   data = {};
    // }

    return data;
  },
};
