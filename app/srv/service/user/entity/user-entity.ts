export class UserEntity {
  constructor(
    readonly id: number,
    readonly username: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly emailVerifiedAt: Date,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}
}
