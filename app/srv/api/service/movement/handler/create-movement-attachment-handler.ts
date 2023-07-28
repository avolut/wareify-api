import { dirname, join } from "path";
import { apiContext, generateUploadPath } from "service-srv";
import { dirAsync } from "fs-jetpack";
import mime from "mime-types";
import { ResponseFormatter } from "../../../core/network-result/response-formatter";
import { authMiddleware } from "../../../core/utils/auth-middleware";
import { CreateMovementAttachmentUseCaseFactory, ICreateMovementAttachmentUseCase } from "../use-case/create-movement-attachment-use-case";
import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
export const _ = {
  url: "/api/movements/:id/attachment/",
  async api(id: number) {
    const { req, res } = apiContext(this);
    const loggedIn = await authMiddleware(req, res);
    if (!loggedIn) {
      return ResponseFormatter.error(null, "Unauthenticated", 401);
    }
    try {
      let result: any = null;
      await req.multipart(async (field) => {
        if (field.file) {
          const path = join(process.cwd(), "..", "content", "upload");
          const file = {
            name: field.file.name || "",
            filename: field.file.name || "",
            type: mime.lookup(field.file.name || "") || "",
          };

          const upath = generateUploadPath(file, path, "receive");
          await dirAsync(dirname(upath.path));
          await field.write(upath.path);

          const createMovementAttachmentUseCase: ICreateMovementAttachmentUseCase =
            CreateMovementAttachmentUseCaseFactory.create();
          let mimeType = "";
          if (file.type.includes("image")) {
            mimeType = ReceiveAttachmentType.PHOTO;
          } else {
            mimeType = ReceiveAttachmentType.DOCUMENT;
          }

          const receiveAttachment =
            await createMovementAttachmentUseCase.execute({
              movementId: +id,
              name: file.filename,
              path: upath.url,
              type: mimeType as ReceiveAttachmentType,
            });
          result = receiveAttachment;
        }
      });
      return ResponseFormatter.success(
        result,
        "Movement attachment created",
        201
      );
    } catch (error: any) {
      return ResponseFormatter.error(null, error.message, 500);
    }
  },
};