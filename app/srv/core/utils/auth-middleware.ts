import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "../../../db/node_modules/.gen";

export async function authMiddleware(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      // return new Error("Authorization header is required");
      return "Authorization header is required";
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return new Error("Token is required");
    }
    const decoded = jwt.verify(token, "secretKeyForJWT") as JwtPayload;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        username: decoded.username,
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
      // return new Error("Unauthenticated");
      return "Unauthenticated";
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
    // return new Error(error.message);
    return error.message;
  }
}
