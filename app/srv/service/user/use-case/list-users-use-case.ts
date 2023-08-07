import { IUserRepository, UserRepositoryFactory } from "../repository/user-repository";

export interface IListUsersUseCaseResponse {
  id: number;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListUsersUseCase {
  execute(): Promise<IListUsersUseCaseResponse[]>;
}

export class ListUsersUseCase implements IListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<IListUsersUseCaseResponse[]> {
    try {
      const users = await this.userRepository.listUsers();
      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error(`[ListUsersUseCase][execute][Error] ${error}`);
      throw error;
    }
  }
}

export class ListUsersUseCaseFactory {
  static create(): IListUsersUseCase {
    return new ListUsersUseCase(UserRepositoryFactory.create());
  }
}