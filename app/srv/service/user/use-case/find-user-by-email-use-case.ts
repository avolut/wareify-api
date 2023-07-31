import { IUserRepository, UserRepositoryFactory } from "../repository/user-repository";

export interface IFindUserByEmailRequest {
    email: string;
}

export interface IFindUserByEmailResponse {
    id: number;
    username: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindUserByEmailUseCase {
    execute(request: IFindUserByEmailRequest): Promise<IFindUserByEmailResponse>;
}

export class FindUserByEmailUseCase implements IFindUserByEmailUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(request: IFindUserByEmailRequest): Promise<IFindUserByEmailResponse> {
        const user = await this.userRepository.findUserByEmail(request.email);

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

export class FindUserByEmailUseCaseFactory {
    static create(): IFindUserByEmailUseCase {
        return new FindUserByEmailUseCase(UserRepositoryFactory.create());
    }
}