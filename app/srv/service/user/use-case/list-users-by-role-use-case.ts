import { IUserRepository, UserRepositoryFactory } from "../repository/user-repository";

export interface IListUsersByRoleUseCaseRequest {
  role: string;
}

export interface IListUsersByRoleUseCaseResponse {
  id: number;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListUsersByRoleUseCase {
  execute(
    request: IListUsersByRoleUseCaseRequest
  ): Promise<IListUsersByRoleUseCaseResponse[]>;
}

export class ListUsersByRoleUseCase implements IListUsersByRoleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    request: IListUsersByRoleUseCaseRequest
  ): Promise<IListUsersByRoleUseCaseResponse[]> {
    try {
      const users = await this.userRepository.listUsersByRole(request.role);
      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error(`[ListUsersByRoleUseCase][execute][Error] ${error}`);
      throw error;
    }
  }
}

export class ListUsersByRoleUseCaseFactory {
  static create(): IListUsersByRoleUseCase {
    return new ListUsersByRoleUseCase(UserRepositoryFactory.create());
  }
}