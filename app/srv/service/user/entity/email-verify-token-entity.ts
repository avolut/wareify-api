export class EmailVerifyTokenEntity {
  constructor(
    readonly email: string,
    readonly token: string,
    readonly expiresAt: Date,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}
}