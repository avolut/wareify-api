import { IUserRepository, UserRepositoryFactory } from "../repository/user-repository";

export interface IFindUserPasswordUseCaseRequest {
  email: string;
}

export interface IFindUserPasswordUseCaseResponse {
  email: string;
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
    const user = await this.userRepository.findUserByEmail(request.email);

    return {
      email: user.email,
      password: user.password,
    };
  }
}

export class FindUserPasswordUseCaseFactory {
  static create(): IFindUserPasswordUseCase {
    return new FindUserPasswordUseCase(UserRepositoryFactory.create());
  }
}
