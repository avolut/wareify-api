import { IUserRepository, UserRepositoryFactory } from "../repository/user-repository";

export interface IFindUserByUsernameRequest {
  username: string;
}

export interface IFindUserByUsernameResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindUserByUsernameUseCase {
  execute(
    request: IFindUserByUsernameRequest
  ): Promise<IFindUserByUsernameResponse>;
}

export class FindUserByUsernameUseCase implements IFindUserByUsernameUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    request: IFindUserByUsernameRequest
  ): Promise<IFindUserByUsernameResponse> {
    const user = await this.userRepository.findUserByUsername(request.username);

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export class FindUserByUsernameUseCaseFactory {
  static create(): IFindUserByUsernameUseCase {
    return new FindUserByUsernameUseCase(UserRepositoryFactory.create());
  }
}