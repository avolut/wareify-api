import { Request, Response } from "service-srv/node_modules/hyper-express";
import { ResponseFormatter } from "../network-result/response-formatter";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "../../../../db/node_modules/.gen";

export async function authMiddleware(req: Request, res: Response) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("Authorization header is required");
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      throw new Error("Token is required");
    }
    const decoded = jwt.verify(token, "secretKeyForJWT") as JwtPayload;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        organizations: {
          include: {
            organization: true,
          },
        },
        warehouses: {
          include: {
            warehouse: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("Unauthenticated");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    globalThis.currentUser = {
      ...userWithoutPassword,
      roles: user.roles.map((role) => role.role),
      organizations: user.organizations.map(
        (organization) => organization.organization
      ),
      warehouses: user.warehouses.map((warehouse) => warehouse.warehouse),
    };
    return globalThis.currentUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
