import { PrismaClient } from "../../../../../app/db/node_modules/.gen";
import { UserEntity } from "../entity/user-entity";
import { EmailVerifyTokenEntity } from "../entity/email-verify-token-entity";
import { PasswordResetTokenEntity } from "../entity/password-reset-token-entity";
import dayjs from "dayjs";
import { global } from '../../../global';
import { Buffer } from "buffer";

export interface IUserDataSource {
  registerUser(
    name: string,
    email: string,
    password: string,
    username: string
  ): Promise<UserEntity>;

  generateEmailVerifyToken(email: string): Promise<EmailVerifyTokenEntity>;
  getEmailVerifyToken(
    email: string,
    token: string
  ): Promise<EmailVerifyTokenEntity>;
  deleteEmailVerifyToken(email: string): Promise<void>;
  verifyUser(email: string): Promise<UserEntity>;
  findUserByEmail(email: string): Promise<UserEntity>;
  generatePasswordResetToken(email: string): Promise<PasswordResetTokenEntity>;
  getPasswordResetToken(
    email: string,
    token: string
  ): Promise<PasswordResetTokenEntity>;
  deletePasswordResetToken(email: string): Promise<void>;
  changePassword(email: string, password: string): Promise<UserEntity>;
  findUserPasswordByEmail(email: string): Promise<UserEntity>;
}

export class UserDataSourceFactory {
  static create(): IUserDataSource {
    return new UserDataSource(new PrismaClient(), dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), 'hour').toDate());
  }
}

export class UserDataSource implements IUserDataSource {
  private timestamps: object;
  constructor(private prisma: PrismaClient, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  async registerUser(
    name: string,
    email: string,
    password: string,
    username: string
  ): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        username,
        name,
        email,
        password,
        ...this.timestamps,
      },
    });
    return this.mapToUserEntity(user);
  }

  public async generateEmailVerifyToken(
    email: string
  ): Promise<EmailVerifyTokenEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const token = Buffer.from('TokenForEmailVerify').toString("hex");
    const emailVerifyToken = await this.prisma.emailVerifyToken.upsert({
      where: {
        email,
      },
      update: {
        token,
        expiresAt: dayjs().add(8, 'hour').toDate(),
        updatedAt: this.now,
      },
      create: {
        email,
        token,
        expiresAt: dayjs().add(8, 'hour').toDate(),
        ...this.timestamps,
      },
    });
    return this.mapToEmailVerifyTokenEntity(emailVerifyToken);
  }

  public async getEmailVerifyToken(
    email: string,
    token: string
  ): Promise<EmailVerifyTokenEntity> {
    const emailVerifyToken = await this.prisma.emailVerifyToken.findFirst({
      where: {
        email,
        token,
        expiresAt: {
          gte: this.now,
        },
      },
    });
    if (!emailVerifyToken) {
      throw new Error("Email verify token not found");
    }
    return this.mapToEmailVerifyTokenEntity(emailVerifyToken);
  }

  public async deleteEmailVerifyToken(email: string): Promise<void> {
    await this.prisma.emailVerifyToken.delete({
      where: {
        email,
      },
    });
  }

  public async verifyUser(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerifiedAt: this.now,
      },
    });
    return this.mapToUserEntity(user);
  }

  public async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return this.mapToUserEntity(user);
  }

  public async generatePasswordResetToken(
    email: string
  ): Promise<PasswordResetTokenEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const token = Buffer.from('TokenForPasswordReset').toString("hex");
    const passwordResetToken = await this.prisma.passwordResetToken.upsert({
      where: {
        email,
      },
      update: {
        token,
        expiresAt: dayjs().add(8, 'hour').toDate(),
        updatedAt: this.now,
      },
      create: {
        email,
        token,
        expiresAt: dayjs().add(8, 'hour').toDate(),
        ...this.timestamps,
      },
    });
    return this.mapToPasswordResetTokenEntity(passwordResetToken);
  }

  public async getPasswordResetToken(
    email: string,
    token: string
  ): Promise<PasswordResetTokenEntity> {
    const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        email,
        token,
        expiresAt: {
          gte: this.now,
        },
      },
    });
    if (!passwordResetToken) {
      throw new Error("Password reset token not found");
    }
    return this.mapToPasswordResetTokenEntity(passwordResetToken);
  }

  public async deletePasswordResetToken(email: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: {
        email,
      },
    });
  }

  public async changePassword(
    email: string,
    password: string
  ): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password,
        updatedAt: this.now,
      },
    });
    return this.mapToUserEntity(user);
  }

  public async findUserPasswordByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        password: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return this.mapToUserEntity(user);
  }

  private mapToUserEntity(user: any): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.name,
      user.email,
      user.password,
      user.emailVerifiedAt,
      user.createdAt,
      user.updatedAt
    );
  }

  private mapToEmailVerifyTokenEntity(
    emailVerifyToken: any
  ): EmailVerifyTokenEntity {
    return new EmailVerifyTokenEntity(
      emailVerifyToken.email,
      emailVerifyToken.token,
      emailVerifyToken.expiresAt,
      emailVerifyToken.createdAt,
      emailVerifyToken.updatedAt
    );
  }

  private mapToPasswordResetTokenEntity(
    passwordResetToken: any
  ): PasswordResetTokenEntity {
    return new PasswordResetTokenEntity(
      passwordResetToken.email,
      passwordResetToken.token,
      passwordResetToken.expiresAt,
      passwordResetToken.createdAt,
      passwordResetToken.updatedAt
    );
  }
}
