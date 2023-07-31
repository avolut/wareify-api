import { IUserRepository, UserRepositoryFactory } from "../repository/user-repository";

export interface IFindUserPasswordUseCaseRequest {
  username: string;
}

export interface IFindUserPasswordUseCaseResponse {
  username: string;
  password: string;
}

export interface IFindUserPasswordUseCase {
  execute(
    request: IFindUserPasswordUseCaseRequest
  ): Promise<IFindUserPasswordUseCaseResponse>;
}

export class FindUserPasswordUseCase implements IFindUserPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    request: IFindUserPasswordUseCaseRequest
  ): Promise<IFindUserPasswordUseCaseResponse> {
    const user = await this.userRepository.findUserByUsername(request.username);

    return {
      username: user.username,
      password: user.password,
    };
  }
}

export class FindUserPasswordUseCaseFactory {
  static create(): IFindUserPasswordUseCase {
    return new FindUserPasswordUseCase(UserRepositoryFactory.create());
  }
}
