export enum OrganizationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export class OrganizationEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly email: string,
    readonly phone: string,
    readonly address: string,
    readonly website: string,
    readonly logo: string,
    readonly status: OrganizationStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}