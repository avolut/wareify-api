import { global } from '../../../global';
// import { PrismaClient } from "../../../../../app/db/node_modules/.gen";
import { IssueEntity, IssueStatus, IssueType } from "../entity/issue-entity";
import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
import { IssueAttachmentEntity } from "../entity/issue-attachment-entity";
import dayjs from "dayjs";

export interface IIssueDataSource {
  createIssue(
    documentDate: Date,
    warehouseId: number,
    issueType: IssueType,
    userIds: number[],
    productIds: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<IssueEntity>;
  createIssueAttachment(
    issueId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<IssueAttachmentEntity>;
  updateStatus(id: number, status: IssueStatus): Promise<IssueEntity>;
  findById(id: number): Promise<IssueEntity>;
  findAll(): Promise<IssueEntity[]>;
  countIssueAttachmentByType(issueId: number, type: ReceiveAttachmentType): Promise<number>;
}

export class IssueDataSource implements IIssueDataSource {
  private timestamps: object;
  constructor(private prisma: any, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  private async generateDocumentNumber(): Promise<string> {
    let code = "";
    let count = 1;
    while (code === "") {
      const nextCode = `ISS${count.toString().padStart(9, "0")}`;
      const existingIssue = await this.prisma.issue.findUnique({
        where: { documentNumber: nextCode },
      });

      if (!existingIssue) {
        code = nextCode;
      } else {
        count++;
      }
    }

    return code;
  }

  public async createIssue(
    documentDate: Date,
    warehouseId: number,
    issueType: IssueType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<IssueEntity> {
    const issue = await this.prisma.issue.create({
      data: {
        documentDate,
        warehouseId,
        issueType,
        description,
        documentNumber: await this.generateDocumentNumber(),
        referenceNumber,
        status: "DRAFT",
        ...this.timestamps,
      },
    });

    if (userIds) {
      await this.prisma.issueUser.createMany({
        data: userIds.map((userId) => ({
          userId,
          issueId: issue.id,
          ...this.timestamps,
        })),
      });
    }

    if (productIds) {
      await this.prisma.issueProduct.createMany({
        data: productIds.map((productId) => ({
          productId,
          issueId: issue.id,
          ...this.timestamps,
        })),
      });
    }

    return this.mapToIssueEntity(issue);
  }

  public async createIssueAttachment(
    issueId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<IssueAttachmentEntity> {
    const attachment = await this.prisma.issueAttachment.create({
      data: {
        name,
        path,
        type,
        issueId,
        ...this.timestamps,
      },
    });

    return this.mapToIssueAttachmentEntity(attachment);
  }

  public async updateStatus(id: number, status: IssueStatus): Promise<IssueEntity> {
    const issue = await this.prisma.issue.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        updatedAt: this.now,
      },
    });

    return this.mapToIssueEntity(issue);
  }

  public async findById(id: number): Promise<IssueEntity> {
    const issue = await this.prisma.issue.findUnique({
      where: {
        id: id,
      }
    });

    return this.mapToIssueEntity(issue);
  }

  public async findAll(): Promise<IssueEntity[]> {
    const issues = await this.prisma.issue.findMany({
      include: {
        products: {
          include: {
            product: true,
          }
        },
      },
    });
    const issuesWithProducts = {
      ...issues,
      products: issues.map((issue) => issue.products.map((product) => product.product)),
    }

    return Promise.all(issuesWithProducts.map((issue) => this.mapToIssueEntity(issue)));
  }

  public async countIssueAttachmentByType(issueId: number, type: ReceiveAttachmentType): Promise<number> {
    const count = await this.prisma.issueAttachment.count({
      where: {
        issueId: issueId,
        type: type,
      }
    });

    return count;
  }

  private async mapToIssueEntity(issue: any): Promise<IssueEntity> {
    return new IssueEntity(
      issue.id,
      issue.warehouseId,
      issue.issueType,
      issue.documentNumber,
      issue.documentDate,
      issue.referenceNumber,
      issue.description,
      issue.status,
      issue.createdAt,
      issue.updatedAt,
      issue.products,
      issue.users,
      issue.batches,
      issue.attachments
    );
  }

  private async mapToIssueAttachmentEntity(
    attachment: any
  ): Promise<IssueAttachmentEntity> {
    return new IssueAttachmentEntity(
      attachment.id,
      attachment.name,
      attachment.path,
      attachment.type,
      attachment.createdAt,
      attachment.updatedAt,
      attachment.issue
    );
  }
}

export class IssueDataSourceFactory {
  static create(): IIssueDataSource {
    return new IssueDataSource(
      db,
      dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), "hour").toDate()
    );
  }
}
