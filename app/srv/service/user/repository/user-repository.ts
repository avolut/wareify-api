import {
  IUserDataSource,
  UserDataSourceFactory,
} from "../data-source/user-data-source";
import { EmailVerifyTokenEntity } from "../entity/email-verify-token-entity";
import { PasswordResetTokenEntity } from "../entity/password-reset-token-entity";
import { UserEntity } from "../entity/user-entity";

export interface IUserRepository {
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

export class UserRepositoryFactory {
  static create(): IUserRepository {
    return new UserRepository(UserDataSourceFactory.create());
  }
}

class UserRepository implements IUserRepository {
  constructor(private userDataSource: IUserDataSource) {}

  async registerUser(
    name: string,
    email: string,
    password: string,
    username: string
  ): Promise<UserEntity> {
    try {
      return this.userDataSource.registerUser(name, email, password, username);
    } catch (error) {
      console.error(`[UserRepository][registerUser][Error] ${error}`);
      throw error;
    }
  }

  async generateEmailVerifyToken(
    email: string
  ): Promise<EmailVerifyTokenEntity> {
    try {
      return this.userDataSource.generateEmailVerifyToken(email);
    } catch (error) {
      console.error(
        `[UserRepository][generateEmailVerifyToken][Error] ${error}`
      );
      throw error;
    }
  }

  async getEmailVerifyToken(
    email: string,
    token: string
  ): Promise<EmailVerifyTokenEntity> {
    try {
      return this.userDataSource.getEmailVerifyToken(email, token);
    } catch (error) {
      console.error(`[UserRepository][getEmailVerifyToken][Error] ${error}`);
      throw error;
    }
  }

  async deleteEmailVerifyToken(email: string): Promise<void> {
    try {
      return this.userDataSource.deleteEmailVerifyToken(email);
    } catch (error) {
      console.error(`[UserRepository][deleteEmailVerifyToken][Error] ${error}`);
      throw error;
    }
  }

  async verifyUser(email: string): Promise<UserEntity> {
    try {
      return this.userDataSource.verifyUser(email);
    } catch (error) {
      console.error(`[UserRepository][verifyUser][Error] ${error}`);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    try {
      return this.userDataSource.findUserByEmail(email);
    } catch (error) {
      console.error(`[UserRepository][findUserByEmail][Error] ${error}`);
      throw error;
    }
  }

  async generatePasswordResetToken(
    email: string
  ): Promise<PasswordResetTokenEntity> {
    try {
      return this.userDataSource.generatePasswordResetToken(email);
    } catch (error) {
      console.error(
        `[UserRepository][generatePasswordResetToken][Error] ${error}`
      );
      throw error;
    }
  }

  async getPasswordResetToken(
    email: string,
    token: string
  ): Promise<PasswordResetTokenEntity> {
    try {
      return this.userDataSource.getPasswordResetToken(email, token);
    } catch (error) {
      console.error(`[UserRepository][getPasswordResetToken][Error] ${error}`);
      throw error;
    }
  }

  async deletePasswordResetToken(email: string): Promise<void> {
    try {
      return this.userDataSource.deletePasswordResetToken(email);
    } catch (error) {
      console.error(
        `[UserRepository][deletePasswordResetToken][Error] ${error}`
      );
      throw error;
    }
  }

  async changePassword(email: string, password: string): Promise<UserEntity> {
    try {
      return this.userDataSource.changePassword(email, password);
    } catch (error) {
      console.error(`[UserRepository][changePassword][Error] ${error}`);
      throw error;
    }
  }

  async findUserPasswordByEmail(email: string): Promise<UserEntity> {
    try {
      return this.userDataSource.findUserPasswordByEmail(email);
    } catch (error) {
      console.error(
        `[UserRepository][findUserPasswordByEmail][Error] ${error}`
      );
      throw error;
    }
  }
}
